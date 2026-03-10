require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Client = require('ssh2-sftp-client');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check for Render/Hosting
app.get('/', (req, res) => {
    res.send('LODESTAR SFTP Bridge Service is running.');
});

// Helper function to extract credentials dynamically from the request headers or query params
const getCredentials = (req) => {
    return {
        // Fallback to internal IP if not provided
        host: process.env.SFTP_HOST || '172.17.1.141',
        port: process.env.SFTP_PORT || 2022,
        username: req.headers['x-sftp-username'] || req.query.username,
        password: req.headers['x-sftp-password'] || req.query.password,
    };
};

// Configured directory path on the SFTP server
const sftpDirectory = process.env.SFTP_DIRECTORY || '/';

app.get('/api/files', async (req, res) => {
    const sftpConfig = getCredentials(req);

    if (!sftpConfig.username || !sftpConfig.password) {
        return res.status(401).json({ error: 'SFTP credentials required. Please provide x-sftp-username and x-sftp-password headers (or username and password query parameters).' });
    }

    const sftp = new Client();
    try {
        await sftp.connect({
            ...sftpConfig,
            readyTimeout: 30000, // Increase to 30s for slow VPN handshakes
            retries: 2,          // Attempt a couple of retries
            retry_delay: 1000
        });
        const fileList = await sftp.list(sftpDirectory);
        res.json(fileList);
    } catch (err) {
        console.error('SFTP List Error:', err);
        if (err.level === 'client-authentication') {
            res.status(401).json({ error: 'VPN connected but credentials wrong' });
        } else if (
            (err.code && ['ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'ENETUNREACH', 'EHOSTUNREACH'].includes(err.code)) ||
            (err.message && /timeout|timed out|time out|handshake|unreachable/i.test(err.message))
        ) {
            res.status(503).json({ error: 'VPN not connected' });
        } else {
            res.status(500).json({ error: 'Failed to connect/list files from SFTP server', details: err.message });
        }
    } finally {
        await sftp.end();
    }
});

app.get('/api/files/download', async (req, res) => {
    const { filename } = req.query;
    if (!filename) {
        return res.status(400).json({ error: 'Filename query parameter is required' });
    }

    const sftpConfig = getCredentials(req);
    if (!sftpConfig.username || !sftpConfig.password) {
        return res.status(401).json({ error: 'SFTP credentials required. Please provide x-sftp-username and x-sftp-password headers (or username and password query parameters).' });
    }

    const sftp = new Client();
    try {
        await sftp.connect({
            ...sftpConfig,
            readyTimeout: 30000, // Increase to 30s for slow VPN handshakes
        });
        const remoteFilePath = `${sftpDirectory}/${filename}`.replace(/\/\//g, '/'); // ensure no double slashes

        try {
            const stat = await sftp.stat(remoteFilePath);
            res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-type', 'application/octet-stream');
            res.setHeader('Content-Length', stat.size);

            await sftp.get(remoteFilePath, res);
        } catch (statErr) {
            return res.status(404).json({ error: 'File not found on SFTP server', details: statErr.message });
        }
    } catch (err) {
        console.error('SFTP Download Error:', err);
        if (!res.headersSent) {
            if (err.level === 'client-authentication') {
                res.status(401).json({ error: 'VPN connected but credentials wrong' });
            } else if (
                (err.code && ['ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'ENETUNREACH', 'EHOSTUNREACH'].includes(err.code)) ||
                (err.message && /timeout|timed out|time out|handshake|unreachable/i.test(err.message))
            ) {
                res.status(503).json({ error: 'VPN not connected' });
            } else {
                res.status(500).json({ error: 'Failed to download file from SFTP server', details: err.message });
            }
        }
    } finally {
        await sftp.end();
    }
});

app.listen(PORT, () => {
    console.log(`Bridge server running on port ${PORT}`);
});
