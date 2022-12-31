import React from 'react';
import { renderRoutes } from "react-router-config";
import { Provider } from 'react-redux'

import { fetchBannerList } from './application/Recommend/recommendSlice';

import routes from './routes/index.js'
import { store } from './app/store'

import { GlobalStyle } from "./style";
import { IconStyle } from './assets/iconfont/iconfont';
import { HashRouter } from "react-router-dom";

// store.dispatch(fetchBannerList());

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle />
        <IconStyle />
        {renderRoutes(routes)}
      </HashRouter>
    </Provider>
  )
}

export default App;


