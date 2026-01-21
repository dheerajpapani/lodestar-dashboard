import React from 'react';
import '../App.css';

const InternalAccess = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 80px)' }}> {/* Ensure fill height */}
            <section className="hero-section-about" style={{ padding: '2rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div className="container">
                    <h1 className="hero-title-about" style={{ marginBottom: '0.5rem' }}>Internal Access Portal</h1>
                    <p className="hero-subtitle-about" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', color: '#666' }}>
                        <span style={{ color: '#856404', fontWeight: 'bold' }}>⚠️ Restricted Access:</span> IITG VPN connection is required to access this portal.
                        <a href="http://172.17.1.141:8080/web/client/login" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px', color: '#007bff', textDecoration: 'underline', fontSize: '0.9em' }}>
                            [Open in new tab]
                        </a>
                    </p>
                </div>
            </section>

            <div className="iframe-wrapper" style={{
                flex: 1,
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <iframe
                    src="http://172.17.1.141:8080/web/client/login"
                    title="Internal DB Portal"
                    style={{
                        flex: 1,
                        width: '100%',
                        border: 'none',
                        display: 'block'
                    }}
                    onError={(e) => {
                        e.target.parentElement.innerHTML = '<div style="padding:4rem; text-align:center;"><h2>Content failed to load</h2><p>Please ensure you are connected to the IITG VPN.</p><p><a href="http://172.17.1.141:8080/web/client/login" target="_blank" style="color: #007bff; text-decoration: underline;">Open in new tab</a></p></div>';
                    }}
                />
            </div>
        </div>
    );
};

export default InternalAccess;
