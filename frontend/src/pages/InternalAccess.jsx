import React from 'react';
import '../App.css';

const InternalAccess = () => {
    return (
        <div className="internal-access-container" style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 100px)', // Adjust based on Navbar height
            width: '100%',
            overflow: 'hidden'
        }}>

            <div className="warning-banner" style={{
                backgroundColor: '#fff3cd',
                color: '#856404',
                padding: '0.75rem',
                textAlign: 'center',
                borderBottom: '1px solid #ffeeba',
                fontSize: '0.9rem'
            }}>
                <strong>⚠️ Restricted Access:</strong> IITG VPN connection is required to view this portal.
            </div>

            <div className="iframe-wrapper" style={{
                flex: 1,
                width: '100%',
                position: 'relative'
            }}>
                <iframe
                    src="http://172.17.1.141:8080/web/client/login"
                    title="Internal DB Portal"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        display: 'block'
                    }}
                    onError={(e) => {
                        // Fallback only if iframe fails hard, though cross-origin errors might not trigger this easily
                        e.target.parentElement.innerHTML = '<div style="padding:2rem; text-align:center;">Unable to load portal. <a href="http://172.17.1.141:8080/web/client/login" target="_blank">Open in new tab</a></div>';
                    }}
                />
            </div>
        </div>
    );
};

export default InternalAccess;
