import React, { Component } from 'react';

import crypto from 'crypto';
import * as microsoftTeams from '@microsoft/teams-js';

import msGraphConfig from '../../MSGraphConfig';

class ConsentPopup extends Component {
    componentDidMount() {
        microsoftTeams.initialize();

        microsoftTeams.getContext((context, error) => {
            let tenant = context['tid'];
            let client_id = msGraphConfig.appId;

            let queryParams = {
                tenant: '${teant}',
                client_id: '${client_id}',
                response_type: "token",
                scope: "https://graph.microsoft.com/.default",
                redirect_uri: window.location.origin + "/auth-end",
                nonce: crypto.randomBytes(16).toString('base64')
            }

            let url = 'https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?';
            queryParams = new URLSearchParams(queryParams).toString();
            let authorizeEndpoint = url + queryParams;

            window.location.assign(authorizeEndpoint);
        });
    }

    render () {
        return (
            <div>
                <h1>Redirecting to consent page...</h1>
            </div>
        )
    }
}

export default ConsentPopup;