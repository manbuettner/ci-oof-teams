import React from 'react';
// import classes from './UserInformation.module.css';

import Aux from '../../hoc/Auxillary/Auxillary';
import { Label } from '@fluentui/react';
import { ChoiceGroup } from '@fluentui/react';

const UserInformation = (props) => {    

    return (
        <Aux >
            <div >
                <Label>Current User</Label>
            </div>
            <div >
                <Label>Information about current user</Label>
            </div>
            <div >
                First name: <span><strong>{props.givenName}</strong></span>
                <br />
                Last name: <span><strong>{props.sn}</strong></span>
                <br />
                Email: <span><strong>{props.email}</strong></span>
            </div>
            <div>
                <ChoiceGroup options={props.oofStatus} onChange={props.onChangeStatus}/>
            </div>
        </Aux>
        

    );
}

export default UserInformation;