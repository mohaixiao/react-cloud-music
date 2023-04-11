import React from 'react';
import { renderRoutes } from "react-router-config";
import { Provider } from 'react-redux'

import routes from './routes/index.js'
import { store } from './app/store'

import { GlobalStyle } from "./style";
import { IconStyle } from './assets/iconfont/iconfont';
import { HashRouter } from "react-router-dom";


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


