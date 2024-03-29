import React, { useState } from 'react';
import "./CoolButton.css"

function CoolButton({ label, handleRequest }) {
    const STATES = {
        IDLE: 'IDLE',
        DISABLED: 'DISABLED',
        ERROR: 'ERROR',
        SUCCESS: 'SUCCESS',
    };

    const [state, setState] = useState(STATES.IDLE);

    const handleClick = async () => {
        setState(STATES.DISABLED);

        try {
            await handleRequest();
            setState(STATES.SUCCESS);
            setTimeout(() => setState(STATES.IDLE), 1000);
        } catch (error) {
            setState(STATES.ERROR);
            setTimeout(() => setState(STATES.IDLE), 1000);
            console.error("Cool Button error: ", error)
            alert("Error sending request")
        }
    };


    return (
        <button
            disabled={state !== STATES.IDLE}
            onClick={handleClick}
            className="right-align-button"
        >
            {label}
        </button>
    );
}

export default CoolButton;
