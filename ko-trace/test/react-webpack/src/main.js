import React from 'react';
import { render } from 'react-dom';
import App from './App.js';
import Kotrace from '../ko-trace';
Kotrace.init({
  serverUrl: 'http://localhost:2000',
  getUserId:function(){
    return 'userId123' 
  },
  debug:true
});


render(
  <App></App>,
  document.getElementById("root")
); 
  