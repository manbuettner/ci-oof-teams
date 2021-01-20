import React, { Component } from 'react';
import { Checkbox, DetailsList, DetailsListLayoutMode } from '@fluentui/react';
import * as microsoftTeams from "@microsoft/teams-js";


//import classes from './AppointmentList.module.css';
class AppointmentList extends Component {
    constructor(props) {
        super(props);
        this.allItems = [];

        this.state = {
            items: this.allItems,
            azureTenantID: ""
        }

        const today = new Date();


        for (let i = 0; i < 20; i++) {
            this.allItems.push({
                key: i,
                name: "Abwesend",
                startdate: today.toUTCString(),
                from: '',
                enddate: today.toUTCString(),
                to: '',
                info: <Checkbox checked={true} />,
                forwarding: "R.Lawo@dokmgm.de"
            })
        }


        this.columns = [
            {
                key: 'regarding',
                name: 'Regarding',
                className: '',
                iconClassName: '',
                minWidth: 143,
                maxWidth: 143,
            },
            {
                key: 'startdate',
                name: 'Startdate',
                fieldName: 'startdate',
                minWidth: 107,
                maxWidth: 107,
                isResizable: true,
                data: 'string'
            },
            {
                key: 'from',
                name: 'From',
                fieldName: 'from',
                minWidth: 40,
                maxWidth: 40,
                isResizable: true,
            },
            {
                key: 'enddate',
                name: 'Enddate',
                fieldName: 'enddate',
                minWidth: 82,
                maxWidth: 82,
                isResizable: true,
            },
            {
                key: 'to',
                name: 'To',
                fieldName: 'to',
                minWidth: 28,
                maxWidth: 28,
                isResizable: true
            },
            {
                key: 'info',
                name: 'Info',
                fieldName: 'info',
                minWidth: 28,
                maxWidth: 28,
                isResizable: true,
            },
            {
                key: 'forwarding',
                name: 'Forwarding',
                fieldName: 'forwarding',
                minWidth: 309,
                maxWidth: 309,
                isResizable: true,
            }
        ]
    }

    componentDidMount() {  
        let username = "";
        microsoftTeams.getContext((context, error) => {
            username = context["upn"];
            
            
          });

        
    }

    render() {
        const { items } = this.state;

        return (
            <DetailsList
                items={items}
                columns={this.columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
            />
        );
    };

};

export default AppointmentList;