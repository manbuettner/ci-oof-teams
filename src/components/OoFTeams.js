// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
// import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup';
// import axios from 'axios';
import * as microsoftTeams from "@microsoft/teams-js";


// import DatePane from './DatePane/DatePane';
// import Aux from '../hoc/Auxillary/Auxillary';
// import classes from './Tab.module.css';
// import { Checkbox, Stack, themeRulesStandardCreator } from '@fluentui/react';
import UserInformation from './UserInformation/UserInformation';
import { Loader } from '@fluentui/react-northstar'
import CIUser from '../classes/CIUser';
import DeputyInformation from './DeputyInformation/DeputyInformation';
import AbsencePeriod from './AbsencePeriod/AbsencePeriod';
import Aux from '../hoc/Auxillary/Auxillary';
import { PrimaryButton } from '@fluentui/react';
import AbsenceReason from './AbsenceReason/AbsenceReason';
import moment from 'moment';




/**
 * The 'PersonalTab' component renders the main tab content
 * of your app.
 */
class OoFTeams extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: {},
      ssoToken: "",
      name: "",
      givenName: "",
      family_name: "",
      aadObjectId: "",
      upn: "",
      graphAccessToken: "",
      error: false,
      loggedInUser: null,
      deputy: null,
      isOutofOffice: "",
      fromDate: null,
      fromTime: null,
      toDate: null,
      toTime: null,
      submitButtonDisabled: true,
      consentRequired: false,
      consentProvided: false


    }

    this.unhandledFetchError = this.unhandledFetchError.bind(this);
    this.ssoLoginSuccess = this.ssoLoginSuccess.bind(this);
    this.ssoLoginFailure = this.ssoLoginFailure.bind(this);
    this.consentSuccess = this.consentSuccess.bind(this);
    this.consentFailure = this.consentFailure.bind(this);
    this.unhandledFetchError = this.unhandledFetchError.bind(this);
    this.callGraphFromClient = this.callGraphFromClient.bind(this);
    this.showConsentDialog = this.showConsentDialog.bind(this);
    this.exchangeClientTokenForServerToken = this.exchangeClientTokenForServerToken.bind(this);
    this.requestUserInformations = this.requestUserInformations.bind(this);
  }

  //React lifecycle method that gets called once a component has finished mounting
  //Learn more: https://reactjs.org/docs/react-component.html#componentdidmount
  componentDidMount() {
    microsoftTeams.initialize();

    // Get the user context from Teams and set it in the state
    microsoftTeams.getContext((context, error) => {
      this.setState({ context: context });


      // if (this.state.customerBookings === null) {
      //   const requestData = {
      //     "webcode": "ciazure",
      //     "sEmail": username,
      //     "language": "en"
      //   }
      //   axios.post("https://cloud.ci-solution.com/api/GetCustomerBookings", requestData)
      //     .then(response => {
      //       this.setState({ customerBookings: response.data })
      //     })
      // }

    });

    let authenTokenRequestsOptions = {
      successCallback: (result) => this.ssoLoginSuccess(result),
      failureCallBack: (error) => this.ssoLoginFailure(error)
    };

    microsoftTeams.authentication.getAuthToken(authenTokenRequestsOptions);

  }

  ssoLoginSuccess = async (token) => {
    this.setState({ ssoToken: token });

    this.exchangeClientTokenForServerToken(token);
  }



  ssoLoginFailure(error) {
    console.error("SSO failed: ", error);
    this.setState({ error: true });
  }

  exchangeClientTokenForServerToken = async (token) => {
    const ApiData = {
      "webcode": "ciazure",
      "sEmail": this.state.context["upn"],
      "language": "en"
    }

    ///https://cloud.ci-solution.com/api/GetMSGraphAccessToken
    let response = await fetch('https://localhost:44381/api/GetMSGraphAccessToken', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ApiData)
    })
      .catch(this.unhandledFetchError); //This calls getGraphAccessToken route in /api-server/app.js
    let data = await response.json().catch(this.unhandledFetchError);

    //TODO: response.ok wieder einfügen
    if (!response.ok) {
      console.log(data);
      this.setState({ error: true });
    } else {
      this.setState({ graphAccessToken: data['access_token'] });
      this.requestUserInformations(data["access_token"])
    }
  }

  requestUserInformations = async (accessToken) => {
    let upn = this.state.context["upn"];
    let userContent = `https://graph.microsoft.com/v1.0/users/${upn}`

    let graphRequestParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "authorization": "bearer " + this.state.graphAccessToken
      }
    }

    let responseUser = await fetch(userContent, graphRequestParams).catch(this.unhandledFetchError);
    let dataUser = await responseUser.json().catch(this.unhandledFetchError);



    if (!responseUser.ok) {
      console.log(dataUser);
      this.setState({ error: true });
    } else {
      const cCIUser = new CIUser(dataUser);
      this.setState({
        loggedInUser: cCIUser
      })
    }
  }


  showConsentDialog() {
    microsoftTeams.authentication.authenticate({
      url: window.location.origin + "/auth-start",
      width: 600,
      height: 535,
      successCallback: (result) => { this.consentSuccess(result) },
      failureCallback: (reason) => { this.consentFailure(reason) }
    });
  }

  consentSuccess(result) {
    this.setState({
      graphAccessToken: result,
      consentProvided: true
    });
  }

  consentFailure(reason) {
    console.error("Consent failed: ", reason);
    this.setState({ error: true });
  }


  callGraphFromClient = async () => {
    let upn = this.state.context["upn"];
    if (upn === "r.lawo@dokmgm.de") {
      upn = "m.buettner@dokmgm.de";
    }
    let graphPhotoEndpoint = `https://graph.microsoft.com/v1.0/users/${upn}/photo/$value`;
    let graphRequestParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'image/jpg',
        "authorization": "bearer " + this.state.graphAccessToken
      }
    }

    let response = await fetch(graphPhotoEndpoint, graphRequestParams).catch(this.unhandledFetchError);
    if (!response.ok) {
      console.error("ERROR: ", response);
      this.setState({ error: true });
    }

    let imageBlog = await response.blob().catch(this.unhandledFetchError);

    this.setState({
      photo: URL.createObjectURL(imageBlog)
    })
  }

  unhandledFetchError(error) {
    console.error("Unhandled fetch error: ", error);
    this.setState({ error: true });
  }



  onChangeStatusHandler = (ev, checked) => {
    this.setState({ isOutofOffice: checked.key });
  }

  fromDateHandler = (fromDate) => {
    this.setState({
      fromDate: fromDate
    })
  }

  toDateHandler = (toDate) => {
    this.setState({
      toDate: toDate
    })
  }

  fromTimeHandler = (fromTime) => {
    this.setState({
      fromTime: moment(fromTime._d, 'HH:mm')
    });
  }

  toTimeHandler = (toTime) => {
    this.setState({
      toTime: moment(toTime, 'HH:mm')
    });
  }

  submitOOF = () => {
    console.log("From date: ", this.state.fromDate);
    console.log("To date: ", this.state.toDate);
  }

  deputyFoundHandler = (deputyFound) => {
    this.setState({
      deputy: deputyFound
    })


  }

  render() {
    const oofStatus = [
      { key: 'A', text: 'In Office', checked: true },
      { key: 'B', text: 'Out of Office' }
    ];

    let title = Object.keys(this.state.context).length > 0 ?
      'Congratulations ' + this.state.context["upn"] + '! This is your tab!!!' : <Loader />


    let serverExchangeMessage = (this.state.ssoToken === "") ?
      <Loader label='Exchanging SSO access token for Graph access token...' /> : null;

    // let constentButton = (this.state.consentRequired && !this.state.consentProvided) ?
    //   <Loader label="Constent required" onClick={this.showConsentDialog} /> : null;


    let userInformations = (this.state.loggedInUser !== null) ?
      <Aux>
        <UserInformation
          givenName={this.state.loggedInUser.givenName}
          sn={this.state.loggedInUser.sn}
          email={this.state.loggedInUser.email}
          onChangeStatus={(ev, checked) => this.onChangeStatusHandler(ev, checked)}
          oofStatus={oofStatus}
        />
        <AbsencePeriod
          fromDateHandler={(fromDate) => this.fromDateHandler(fromDate)}
          toDateHandler={(toDate) => this.toDateHandler(toDate)} 
          fromTimeHandler={(fromTime) => this.fromTimeHandler(fromTime)}
          toTimeHandler={(toTime) => this.toTimeHandler(toTime)}/>
      </Aux> : null;

    let delegateInformations = (this.state.loggedInUser !== null && this.state.fromDate !== null && this.state.toDate !== null) ?
      <DeputyInformation
        graphAccessToken={this.state.graphAccessToken}
        deputyHandler={(deputyFound) => this.deputyFoundHandler(deputyFound)}
        showDeputyButton={!(this.state.fromDate !== null && this.state.toDate !== null)}
      /> : null;

    let absenceReason = (this.state.fromDate !== null && this.state.toDate !== null) ?
      <AbsenceReason /> : null;

    let error = (this.state.error) ? <h1>ERROR</h1> : null;

    let submitButton = (this.state.loggedInUser !== null) ? 
    <PrimaryButton
            text="Submit"
            disabled={!(this.state.fromDate !== null && this.state.toDate !== null && this.state.deputy !== null)}
            onClick={this.submitOOF} /> : null;


    // let content;
    // if (this.state.error) {
    //   content = <h1>ERROR</h1>
    // } else {
    //   content =
    //     <div >
    //       <h1>{title}</h1>
    //       <h3>{ssoMessage}</h3>
    //       <h3>{ssoOutput}</h3>
    //       {/* <h3>{serverExchangeMessage}</h3> */}
    //       {delegateInformations}
    //     </div>
    // }  





    return (
      <Aux>
        { error}
        <div>
          {title}
          {serverExchangeMessage}
          {userInformations}
          {absenceReason}
          {delegateInformations}
          {submitButton}

        </div>
      </Aux>
    );




    // let username = Object.keys(this.state.context).length > 0 ? this.state.context["upn"] : "";

    // const registerdOptions = [
    //   {key: 'A', text: 'In Office', checked: true },
    //   {key: 'B', text: 'Out of Office' }
    // ];

    // if (this.state.customerBookings) {
    //   registerdOptions[0].checked = this.state.customerBookings.hasCIOof;
    // }

    // const onChange = (event, checked) => {
    //   this.setState({ scheduledOOF: !!checked });
    // }


    //return (


    // <div>
    //   <h3>Hello World!</h3>
    //   <h1>Congratulations {userName}!</h1> <h3>This is the tab you made :-)</h3>
    //   <ChoiceGroup options={registerdOptions} label="Registered State" />

    // </div>
    //   <Aux>
    //     <Stack >
    //       <Stack.Item align="center">
    //         <h1 style={{ textAlign: "center" }}>Welcome {username}</h1>
    //       </Stack.Item>
    //     </Stack>
    //     <Stack horizontal disableShrink tokens={aligmentsStackTokensTop}>
    //       <Stack.Item align="start">
    //         <DatePane />
    //       </Stack.Item>
    //       <Stack.Item align="start">
    //         <ChoiceGroup options={registerdOptions} label="Registered State" />
    //         <Checkbox className={classes.CheckboxOOF} label="Scheduled out of office" checked={this.state.scheduledOOF} onChange={onChange} />
    //       </Stack.Item>
    //     </Stack>
    //     <Stack>
    //       <Stack.Item align="center" tokens={aligmentsStackTokens}>
    //         <AppointmentList />
    //       </Stack.Item>
    //     </Stack>
    //   </Aux>
    // );
  }
}

// const aligmentsStackTokens = {
//   childrenGap: 5,
//   padding: 10,
// };

// const aligmentsStackTokensTop = {
//   childrenGap: 40,
//   padding: 25
// }
export default OoFTeams;