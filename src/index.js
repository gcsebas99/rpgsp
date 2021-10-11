import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

//currently we can load two different apps (different themes as well)
const App = React.lazy(() => import('./App'));
const PlayTestApp = React.lazy(() => import('./PlayTestApp'));


const params = new URLSearchParams(window.location.search);
let CurrentApp;
if(params && params.get('play') && params.get('play') === 'true') {
  CurrentApp = PlayTestApp;
} else {
  CurrentApp = App;
}

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<></>}>
      <CurrentApp />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
