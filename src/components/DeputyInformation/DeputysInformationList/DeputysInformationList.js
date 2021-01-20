import { DetailsList, DetailsListLayoutMode, PrimaryButton, SelectionMode } from '@fluentui/react';
import React from 'react';
import Aux from '../../../hoc/Auxillary/Auxillary';



const DelegatesInformationList = (props) => {

    let allDeputys = [];

    if (props.delegateUser !== null) {
        
        for (let i = 0; i < props.delegateUser.length; i++) {
            allDeputys.push({
                key: i,
                name: props.delegateUser[i].surname + ", " + props.delegateUser[i].givenName,
                mail: props.delegateUser[i].mail,
                businessTele: props.delegateUser[i].businessPhones[0],

            })
        }
        
        
    }

    const columns = [{
        key: 'name',
        name: 'Name',
        className: '',
        fieldName: 'name',
        minWidth: 85,
        maxWidth: 85,
        onColumnClick: null,
        isResizable: true,
        isSorted: true,
        data: 'string'
    },
    {
        key: 'mail',
        name: 'E-Mail Addresse',
        className: '',
        fieldName: 'mail',
        minWidth: 145,
        maxWidth: 145,
        onColumnClick: null,
        isResizable: true,
        isSorted: true,
        data: 'string'
    },
    {
        key: 'businessTele',
        name: 'Business Telephonnumber',
        className: '',
        fieldName: 'businessTele',
        minWidth: 140,
        maxWidth: 140,
        onColumnClick: null,
        isResizable: true,
        isSorted: true,
        data: 'string'
    }]

    const onItemInvoked = (item) => {
        //TODO: ourDisplayName
        props.deputyFound(item.name + " " + "["+ item.mail + "]");
   }
    
    let deputyList = (props.delegateUser !== null) ?

        <DetailsList
            items={allDeputys}
            columns={columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selectionPreservedOnEmptyClick={true}
            onItemInvoked={onItemInvoked}
            selectionMode={SelectionMode.single}
            
        /> : null;   
    
    return (

        <Aux>
            {deputyList}
        </Aux>
    );


}

export default DelegatesInformationList;