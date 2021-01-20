import React, { Component } from 'react';

import * as microsoftTeams from '@microsoft/teams-js';

class ClosePopup extends Component {
    componentDidMount() {
        microsoftTeams.initialize();

        let hashParams = this.getHashParameters();

        if(hashParams["accessToken"]) {
            microsoftTeams.authentication.notifySuccess(hashParams["accessToken"]);
        } else {
            microsoftTeams.authentication.notifyFailure("Consent failed");
        }
    }

    getHashParameters() {
        let hashParams = {};
        window.location.hash.substr(1).split("&").forEach(function(item) {
            let [key,value] = item.split('=');
            hashParams[key] = decodeURIComponent(value);
        });
        return hashParams;
    }

    render() {
        return (
            <div>
                <h1>Consent flow complete.</h1>
            </div>
        )
    }
}

export default ClosePopup;