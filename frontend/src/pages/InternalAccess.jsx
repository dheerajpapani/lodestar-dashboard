import React, { useState, useEffect } from 'react';
import '../App.css';

const InternalAccess = () => {
    const [showFallback, setShowFallback] = useState(false);
    const internalUrl = "http://172.17.1.141:8080/web/client/login";

    // Safety timeout: If the user waits too long, show the option anyway
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowFallback(true);
        }, 5000); // Show after 5 seconds of "loading" / waiting
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 80px)' }}> {/* Ensure fill height */}
            <section className="hero-section-about" style={{ padding: '2rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div className="container">
                    <h1 className="hero-title-about" style={{ marginBottom: '0.5rem' }}>Internal Access Portal</h1>
                    <p className="hero-subtitle-about" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', color: '#666' }}>
                        <span style={{ color: '#856404', fontWeight: 'bold' }}>⚠️ Restricted Access:</span> IITG VPN connection is required to access this portal.

                        {showFallback && (
                            <span style={{ marginLeft: '10px', animation: 'fadeIn 0.5s' }}>
                                <a href={internalUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline', fontSize: '0.9em', cursor: 'pointer' }}>
                                    (Issue connecting? Open in new tab)
                                </a>
                            </span>
                        )}
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
                    src={internalUrl}
                    title="Internal DB Portal"
                    style={{
                        flex: 1,
                        width: '100%',
                        border: 'none',
                        display: 'block'
                    }}
                    onError={() => setShowFallback(true)}
                />
            </div>
        </div>
    );
};

export default InternalAccess;
