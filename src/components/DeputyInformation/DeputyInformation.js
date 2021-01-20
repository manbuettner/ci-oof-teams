import { DefaultButton, Label, Panel, PanelType, PrimaryButton, Stack, TextField } from '@fluentui/react';
import React, { Component } from 'react';

import Aux from '../../hoc/Auxillary/Auxillary';
import DelegatesInformationList from './DeputysInformationList/DeputysInformationList';
// import classes from './DelegateInformation.module.css';

class DeputyInformation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDeputyPanelOpen: false,
            deputyName: "",
            deputyUser: null,
            deputyFound: "",
            finishedLoadingDeputy: false
        }
        this.deputySearchHandler = this.deputySearchHandler.bind(this);
    }


    deputyPanelHandler = () => {
        this.setState((prevState) => {
            return { isDeputyPanelOpen: !prevState.isDeputyPanelOpen }
        })
    }

    searchFieldOnChangeHandler = (event) => {
        let deputyName = { ...this.state.deputyName };

        deputyName = event.target.value;

        this.setState({ deputyName: deputyName });
    }

    deputySearchHandler = async (searchParameter) => {

        let updatedDeputy = [];

        ///https://graph.microsoft.com/v1.0/users?$filter=startswith(givenName,'Raphael') or startswith(mail,'r.') or startswith(surname,'lawo') or startswith(displayName,'Raphael') 
        let deputyContent = `https://graph.microsoft.com/v1.0/users?$filter=startswith(givenName,'${searchParameter}') or startswith(mail,'${searchParameter}') or startswith(surname,'${searchParameter}') or startswith(displayName,'${searchParameter}')`;
        let graphRequestParams = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": "bearer " + this.props.graphAccessToken
            }
        }

        let responseDeputy = await fetch(deputyContent, graphRequestParams).catch(this.unhandledFetchError);
        let dataDeputy = await responseDeputy.json().catch(this.unhandledFetchError);



        if (!responseDeputy.ok) {
            console.log(dataDeputy);
            this.setState({ error: true });
        } else {
            for (let i = 0; i < dataDeputy.value.length; i++) {
                updatedDeputy.push(dataDeputy.value[i])
            }
            this.setState({
                deputyUser: updatedDeputy,
                finishedLoadingDeputy: true
            })
        }
    }

    deputyTextfieldReadOnlyHandler = (deputy) => {
        this.setState({ deputyFound: deputy, isDeputyPanelOpen: false })
        this.props.deputyHandler(deputy);
    }


    render() {
        const selectDeputyDescription = (this.state.finishedLoadingDeputy) ?
            <div>
                For selecting a Deputy, double or select and press Enter!
    </div> : null;

        return (
            <Aux>
                <div>
                    <Label >Deputy</Label>
                </div>
                <div>
                    <Label>Please select the name of your deputy</Label>
                </div>
                <div>
                    <div>
                        <TextField readyOnly value={this.state.deputyFound} disabled/>
                        <DefaultButton text="Deputy" disabled={this.props.showDeputyButton} onClick={this.deputyPanelHandler} />
                    </div>
                </div>
                <Panel
                    isOpen={this.state.isDeputyPanelOpen}
                    onDismiss={() => this.setState({ isDeputyPanelOpen: false })}
                    type={PanelType.medium}
                    closeButtonAriaLabel="Close"
                >
                    <div>
                        For a search enter givenName, sn, mail or displayName.
                </div>
                    <Stack horizontal tokens={aligmentsStackTokenSearch}>
                        <Label><strong>Search:</strong></Label>
                        <TextField onChange={this.searchFieldOnChangeHandler} />
                        <PrimaryButton text="Start search..." disabled={this.state.deputyName === ""} onClick={() => this.deputySearchHandler(this.state.deputyName)} />
                    </Stack>
                    <Stack tokens={aligmentsStackTokenSearch}>
                        <DelegatesInformationList
                            delegateUser={this.state.deputyUser}
                            deputyFound={(deputy) => this.deputyTextfieldReadOnlyHandler(deputy)}
                        />
                        {selectDeputyDescription}
                    </Stack>


                </Panel>

            </Aux>
        )
    }

}
const aligmentsStackTokenSearch = {
    childrenGap: 40,
    padding: 25
}

export default DeputyInformation;