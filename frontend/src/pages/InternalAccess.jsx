import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../App.css';

// SVG Lock Icon component matching the user's requested style
const LockIcon = ({ size = 20, color = "currentColor", style = {} }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const InternalAccess = () => {
    // Component State
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // Default to 'list' as requested
    const [loginAttempts, setLoginAttempts] = useState(0);

    // Connection Status State (Ghost Popup)
    const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting', 'connected', 'failed'
    const [showStatus, setShowStatus] = useState(true);

    // Final Production URL
    const API_BASE_URL = import.meta.env.VITE_LODESTAR_BACKEND_URL || 'https://halley-unbarbered-miesha.ngrok-free.dev/api/files';
    const HEALTH_CHECK_URL = API_BASE_URL.replace('/api/files', '/');
    const WAKE_LAMBDA_URL = import.meta.env.VITE_WAKE_LAMBDA_URL || '';

    // Connection Health Check on Mount
    useEffect(() => {
        let isMounted = true;
        const checkConnection = async (isRetry = false) => {
            try {
                const response = await fetch(HEALTH_CHECK_URL, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                });
                if (response.ok) {
                    if (isMounted) {
                        setConnectionStatus('connected');
                        setShowStatus(true);
                        // Hide successful connection message after 3 seconds
                        setTimeout(() => { if (isMounted) setShowStatus(false); }, 3000);
                    }
                } else {
                    if (isMounted) setConnectionStatus('failed');
                }
            } catch (err) {
                if (isMounted) setConnectionStatus('failed');
            }
        };

        checkConnection();

        // If it fails initially, we might be starting up, so poll occasionally
        const pollInterval = setInterval(() => {
            if (connectionStatus === 'failed' || connectionStatus === 'waking') {
                checkConnection(true);
            }
        }, 10000);

        return () => {
            isMounted = false;
            clearInterval(pollInterval);
        };
    }, [HEALTH_CHECK_URL, connectionStatus]);

    // Handle Wake Server request
    const handleWake = async () => {
        if (!WAKE_LAMBDA_URL) {
            alert('AWS Lambda Wake URL is not configured. Please add window.WAKE_LAMBDA_URL.');
            return;
        }

        setConnectionStatus('waking');
        setShowStatus(true);

        try {
            const response = await fetch(WAKE_LAMBDA_URL, { method: 'POST' });
            if (response.ok) {
                console.log('Wake signal sent successfully');
                // The polling in useEffect will eventually catch the server coming up
            } else {
                throw new Error('Failed to send wake signal');
            }
        } catch (err) {
            console.error('Wake Error:', err);
            setConnectionStatus('failed');
            alert('Could not reach the Wake Server. Please ensure the Lambda function is operational.');
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // Helper to sort files: Directories first, then alphabetical
    const sortFiles = (fileList) => {
        if (!fileList || !Array.isArray(fileList)) return [];
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
                    'x-sftp-password': credentials.password,
                    'ngrok-skip-browser-warning': 'true' // Bypass the Ngrok splash page
                }
            });

            // Read the text first to handle potential HTML error pages from Ngrok
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Failed to parse backend response as JSON:', text);
                throw new Error('Backend returned an invalid response (likely an Ngrok or Proxy error). Check the console.');
            }

            if (!response.ok) {
                setLoginAttempts(prev => prev + 1);
                let errMsg = (data && data.error) ? data.error : 'Invalid credentials or unable to connect to SFTP server.';
                if (data && data.details) errMsg += ` (${data.details})`;
                throw new Error(errMsg);
            }

            // Strictly check if we actually got the data structure we expect
            if (!data || (!data.files && !Array.isArray(data))) {
                throw new Error('Authentication appeared to succeed but no valid file data was returned. Check the console.');
            }

            // Handle diagnostic info if present
            if (data && data.diag) {
                console.group('--- SFTP Backend Diagnostic ---');
                console.log('Remote CWD:', data.diag.cwd);
                console.log('Requested Path:', data.diag.requestedDir);
                if (data.diag.rootListing?.length > 0) {
                    console.log('Available in Root /:', data.diag.rootListing);
                }
                console.groupEnd();
            }

            // Extract files (handle both the old flat array and new wrapped object)
            const fileList = Array.isArray(data) ? data : (data?.files || []);
            setFiles(sortFiles(fileList));
            setIsAuthenticated(true);
            setLoginAttempts(0);
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
                const errMsg = data?.error || 'Failed to download file.';
                throw new Error(errMsg);
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
        setLoginAttempts(0);
    };

    return (
        <div className="page-section" style={{ minHeight: 'calc(100vh - 80px)', position: 'relative', padding: 0 }}>

            {/* Ghost Popup - Connection Status */}
            {showStatus && (
                <div style={{
                    position: 'fixed',
                    top: '90px',
                    right: '20px',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
                    background: (connectionStatus === 'connecting' || connectionStatus === 'waking') ? '#facc15' :
                        connectionStatus === 'connected' ? '#22c55e' : '#ef4444',
                    color: (connectionStatus === 'connecting' || connectionStatus === 'waking') ? '#854d0e' : 'white'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'currentColor',
                            animation: (connectionStatus === 'connecting' || connectionStatus === 'waking') ? 'pulse 1.5s infinite' : 'none'
                        }}></div>
                        <span>
                            {connectionStatus === 'connecting' ? 'Checking backend...' :
                                connectionStatus === 'waking' ? 'Waking up AWS server... (~60s)' :
                                    connectionStatus === 'connected' ? 'Backend working' : 'Backend not working'}
                        </span>
                    </div>

                    {connectionStatus === 'failed' && (
                        <button
                            onClick={handleWake}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: '1px solid rgba(255,255,255,0.4)',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                marginTop: '4px',
                                fontWeight: 'bold'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                        >
                            Wake Server
                        </button>
                    )}
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.5; transform: scale(0.9); }
                    50% { opacity: 1; transform: scale(1.1); }
                    100% { opacity: 0.5; transform: scale(0.9); }
                }
                @keyframes hero-continuous-slide {
                    from { background-position: 0% 0%; }
                    to { background-position: 200% 0%; }
                }
                .hero-section-internal {
                    position: relative;
                    padding: 3.5rem 1.5rem;
                    text-align: center;
                    background-color: #2563eb;
                    background-image:
                        radial-gradient(
                            circle at 50% 50%,
                            rgba(255, 255, 255, 0.15),
                            transparent 40%
                        ),
                        linear-gradient(90deg, #2563eb, #60a5fa, #1e40af, #2563eb);
                    background-size: 100% 100%, 200% 100%;
                    animation: hero-continuous-slide 10s linear infinite;
                    color: white;
                    margin-bottom: 2rem;
                    overflow: hidden;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 4px 25px rgba(37, 99, 235, 0.4);
                    z-index: 1;
                }
                :root[data-theme="dark"] .hero-section-internal {
                    background-color: #0f172a;
                    background-image:
                        radial-gradient(
                            circle at 50% 50%,
                            rgba(255, 255, 255, 0.05),
                            transparent 40%
                        ),
                        linear-gradient(90deg, #0f172a, #1e40af, #020617, #0f172a);
                }
            `}</style>

            {/* Conditionally show Hero and Login UI vs Full-screen Explorer */}
            {!isAuthenticated ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="hero-section-internal">
                        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                            <h1 className="hero-title-about" style={{ color: 'white', marginBottom: '0.5rem' }}>Consortium Drive</h1>
                            <p className="hero-subtitle-about" style={{ color: 'rgba(255,255,255,0.9)', margin: '0 auto' }}>
                                Secure administrative gateway to LODESTAR's modeling data and SFTP services.
                            </p>
                        </div>
                    </div>

                    <div className="container" style={{ paddingBottom: '12rem' }}> {/* Even more space under login box */}
                        <motion.div
                            className="admin-login-form"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    border: '1px solid rgba(59, 130, 246, 0.2)'
                                }}>
                                    <LockIcon size={28} color="var(--primary)" />
                                </div>
                                <h3 style={{ margin: 0 }}>Secure Login</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Enter your internal credentials to proceed.</p>
                            </div>

                            <div style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                borderLeft: '3px solid var(--primary)',
                                padding: '0.75rem',
                                marginBottom: '1.5rem',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                textAlign: 'left',
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'center'
                            }}>
                                <LockIcon size={14} color="var(--primary)" />
                                <span><strong>Note:</strong> This portal is intended for authorized internal personnel only. You must be connected to the <strong>FortiClient VPN</strong> to access modeling data and internal SFTP services.</span>
                            </div>

                            {error && <div className="login-error" style={{ marginBottom: '1rem' }}>{error}</div>}

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
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        transition: 'background 0.3s ease'
                                    }}>
                                    {loading ? 'Connecting...' : 'Connect to Server'}
                                </button>
                            </form>

                            {/* Login Help Link */}
                            {loginAttempts >= 3 && (
                                <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                    Facing issues logging in? <br />
                                    <a href="http://172.17.1.141:8080/web/client/login" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}>
                                        Try Direct Login Service
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    className="container"
                    style={{ padding: '2rem 1.5rem', paddingBottom: '10rem' }}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>Portal Explorer</h3>
                            <div style={{ display: 'flex', background: 'var(--bg-dark)', borderRadius: '8px', padding: '4px' }}>
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
                            </div>
                        </div>
                        <button onClick={handleLogout} className="nav-links" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>Logout</button>
                    </div>

                    {files.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No files available.</p>
                    ) : viewMode === 'grid' ? (
                        <div className="admin-controls">
                            {files.map((file, index) => (
                                <motion.div
                                    key={index}
                                    className="admin-card"
                                    style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
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
                                </motion.div>
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
                </motion.div>
            )}
        </div>
    );
};

export default InternalAccess;
