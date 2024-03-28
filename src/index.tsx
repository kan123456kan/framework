import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { setTheme, Theme } from 'utils/themeManager';
import 'fonts/CormorantSC/CormorantSC-Medium.ttf';
import 'fonts/Inter/Inter-VariableFont_slnt,wght.ttf'  

setTheme(Theme.Dark);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
