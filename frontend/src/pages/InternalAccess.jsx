import React, { useState } from 'react';
import '../App.css';

const InternalAccess = () => {
    // Component State
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Dynamic backend URL (assumes running locally alongside proxy for now)
    // Dynamic backend URL - updated during deployment
    const API_BASE_URL = window.LODESTAR_BACKEND_URL || 'http://localhost:3000/api/files';

    // Handle input changes
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // Helper to sort files: Directories first, then alphabetical
    const sortFiles = (fileList) => {
        return [...fileList].sort((a, b) => {
            if (a.type === 'd' && b.type !== 'd') return -1;
            if (a.type !== 'd' && b.type === 'd') return 1;
            return a.name.localeCompare(b.name);
        });
    };

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: {
                    'x-sftp-username': credentials.username,
                    'x-sftp-password': credentials.password
                }
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                let errMsg = (data && data.error) ? data.error : 'Invalid credentials or unable to connect to SFTP server.';
                if (data && data.details) errMsg += ` (${data.details})`;
                throw new Error(errMsg);
            }

            setFiles(sortFiles(data));
            setIsAuthenticated(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle file downloading
    const handleDownload = async (filename) => {
        try {
            const url = `${API_BASE_URL}/download?filename=${encodeURIComponent(filename)}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-sftp-username': credentials.username,
                    'x-sftp-password': credentials.password
                }
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.error || 'Failed to download file.');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            alert(`Download failed: ${err.message}`);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCredentials({ username: '', password: '' });
        setFiles([]);
    };

    return (
        <div className="page-section" style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
            <div className="container">
                <h2 className="section-title">Internal Server Access</h2>

                {!isAuthenticated ? (
                    <div className="admin-login-form">
                        <h3>Secure Login</h3>
                        <p>Access the internal SFTP server safely.</p>

                        {error && <div className="login-error">{error}</div>}

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                name="username"
                                placeholder="SFTP Username"
                                value={credentials.username}
                                onChange={handleChange}
                                autoComplete="username"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="SFTP Password"
                                value={credentials.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '0.75rem',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}>
                                {loading ? 'Connecting...' : 'Connect to Server'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>Portal Explorer</h3>
                                <div style={{ display: 'flex', background: 'var(--bg-dark)', borderRadius: '8px', padding: '4px' }}>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        style={{
                                            padding: '4px 12px',
                                            background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                                            color: viewMode === 'grid' ? 'white' : 'var(--text-muted)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}>Grid</button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        style={{
                                            padding: '4px 12px',
                                            background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                                            color: viewMode === 'list' ? 'white' : 'var(--text-muted)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}>List</button>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="nav-links" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>Logout</button>
                        </div>

                        {files.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No files available.</p>
                        ) : viewMode === 'grid' ? (
                            <div className="admin-controls">
                                {files.map((file, index) => (
                                    <div key={index} className="admin-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{file.type === 'd' ? '📁' : '📄'}</div>
                                            <h4 style={{ wordBreak: 'break-word', fontSize: '1.1rem' }}>{file.name}</h4>
                                            <p style={{ fontSize: '0.85rem' }}>{file.type === 'd' ? 'Directory' : `${(file.size / 1024).toFixed(1)} KB`}</p>
                                        </div>
                                        {file.type !== 'd' && (
                                            <button
                                                onClick={() => handleDownload(file.name)}
                                                style={{
                                                    marginTop: '1.5rem',
                                                    padding: '0.5rem',
                                                    background: 'var(--primary)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }}>Download</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ background: 'var(--bg-light)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: 'var(--bg-dark)', color: 'var(--text-main)' }}>
                                        <tr>
                                            <th style={{ padding: '1rem' }}>Name</th>
                                            <th style={{ padding: '1rem' }}>Type</th>
                                            <th style={{ padding: '1rem' }}>Size</th>
                                            <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {files.map((file, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                                                <td style={{ padding: '1rem' }}>{file.type === 'd' ? '📁' : '📄'} {file.name}</td>
                                                <td style={{ padding: '1rem' }}>{file.type === 'd' ? 'Folder' : 'File'}</td>
                                                <td style={{ padding: '1rem' }}>{file.type === 'd' ? '-' : `${(file.size / 1024).toFixed(1)} KB`}</td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    {file.type !== 'd' && (
                                                        <button
                                                            onClick={() => handleDownload(file.name)}
                                                            style={{ color: 'var(--primary)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                                                            Download
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InternalAccess;
