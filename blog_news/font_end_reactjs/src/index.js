import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react';
import store, {persistor} from './redux/store/store'

import { QueryParamProvider } from 'use-query-params';
import { StyledEngineProvider } from '@mui/material/styles';
ReactDOM.render(
  <Provider store={store}>
    <QueryParamProvider>
    <PersistGate loading={null} persistor={persistor}>
    <StyledEngineProvider injectFirst>
    <App />
    </StyledEngineProvider>
    </PersistGate>
    </QueryParamProvider>
  </Provider>,

  document.getElementById('root')
);


