import React from 'react';
import '../App.css';

const InternalAccess = () => {
    const internalUrl = "http://172.17.1.141:8080/web/client/login";

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 80px)' }}> {/* Ensure fill height */}
            <section className="hero-section-about" style={{ padding: '2rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div className="container">
                    <h1 className="hero-title-about" style={{ marginBottom: '0.5rem' }}>Internal Access Portal</h1>
                    <p className="hero-subtitle-about" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', color: '#666' }}>
                        <span style={{ color: '#856404', fontWeight: 'bold' }}>⚠️ Restricted Access:</span> IITG VPN connection is required to access this portal.
                    </p>
                </div>
            </section>

            <div className="iframe-wrapper" style={{
                flex: 1, // Takes available space, but allows content below to exist
                minHeight: '600px', // Ensure iframe has reasonable height even if content pushes it
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <iframe
                    src={internalUrl}
                    title="Internal DB Portal"
                    style={{
                        flex: 1,
                        width: '100%',
                        border: 'none',
                        display: 'block'
                    }}
                />
            </div>

            {/* Bottom Fallback Section */}
            <section className="page-section" style={{ backgroundColor: 'var(--bg-light)', padding: '2rem 0', borderTop: '1px solid var(--border-color)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-dark)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Having trouble connecting?</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            If the portal above is not loading (e.g., showing 'Refused to connect'), please ensure you are connected to the VPN and try opening it directly in a new tab.
                        </p>
                        <a
                            href={internalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-button"
                            style={{ display: 'inline-block' }}
                        >
                            Open Internal Portal in New Tab
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InternalAccess;
