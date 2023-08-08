import React, {useEffect, useState} from 'react';
function ChildComponent({users}){
//todo create the list successfully, do not forget to include projectId ain the url.
    users.map((user, index) => (
        <li key={index}>{users}</li>
    ))
}

export default ChildComponent;