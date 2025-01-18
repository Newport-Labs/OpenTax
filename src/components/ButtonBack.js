import React from 'react';

const ButtonBack = ({ Label }) => {
    return (
        <button 
            onClick={() => window.history.back()}
            style={{
                padding: '10px 20px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
            }}
        >
          &lt; {Label}
        </button>
    );
}

export default ButtonBack;