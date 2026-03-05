import React from 'react';
import '../App.css';

const InternalAccess = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 80px)',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <div style={{
                fontSize: '4rem',
                marginBottom: '1.5rem'
            }}>🚧</div>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--text-main)',
                marginBottom: '0.75rem'
            }}>Internal Portal</h1>
            <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-muted)',
                maxWidth: '500px',
                lineHeight: '1.7'
            }}>
                This section is currently under development. Further improvements are on the way — check back soon!
            </p>
        </div>
    );
};

export default InternalAccess;
