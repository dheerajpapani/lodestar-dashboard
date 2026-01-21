import React from 'react';
import '../App.css';

const InternalAccess = () => {
    return (
        <div className="internal-access-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1>Internal Access Portal</h1>

            <div className="warning-box" style={{
                backgroundColor: 'rgba(255, 193, 7, 0.15)',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                padding: '1.5rem',
                margin: '2rem 0',
                maxWidth: '600px'
            }}>
                <h3 style={{ color: '#ffc107', marginTop: 0 }}>⚠️ Restricted Access</h3>
                <p>
                    <strong>IITG VPN connection is required to access this portal.</strong>
                </p>
                <p style={{ marginBottom: 0 }}>
                    This link leads to an internal database application that is not accessible from the public internet.
                </p>
            </div>

            <a
                href="http://172.17.1.141:8080/web/client/login"
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button"
                style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    transition: 'background-color 0.2s',
                    marginTop: '1rem',
                    marginBottom: '2rem',
                    display: 'inline-block'
                }}
            >
                Open Internal DB Portal in New Tab
            </a>

            <div className="iframe-container" style={{
                width: '100%',
                height: '800px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <iframe
                    src="http://172.17.1.141:8080/web/client/login"
                    title="Internal DB Portal"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none'
                    }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<p style="padding:1rem">Unable to load internal portal in frame. Please use the button above.</p>';
                    }}
                />
            </div>
        </div>
    );
};

export default InternalAccess;
