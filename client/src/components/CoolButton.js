import React, { useState } from 'react';


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
            alert("Success")
        } catch (error) {
            setState(STATES.ERROR);
            setTimeout(() => setState(STATES.IDLE), 1000);
            alert("Error sending request")
        }
    };


    return (
        <button disabled={state !== STATES.IDLE} onClick={handleClick}>
            {label}
        </button>
    );
}

export default CoolButton;
