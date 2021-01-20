// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import 'react-app-polyfill/ie9';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider, themes } from '@fluentui/react-northstar' //https://fluentsite.z22.web.core.windows.net/quick-start

ReactDOM.render(
    <Provider theme={themes.teams}>
        <App />
    </Provider>, document.getElementById('root')
);
