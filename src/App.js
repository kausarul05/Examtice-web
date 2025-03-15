import React from 'react';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';
import Routes from './Routes';
import DarkAndLightMode from './DarkAndLightMode/DarkAndLightMode';
import { useEffect } from 'react';

function App(props) {

  // const disableContextMenu = (e) => {
  //   e.preventDefault();
  // };

  // const disableCopyShortcut = (e) => {
  //   if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
  //     e.preventDefault();
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('contextmenu', disableContextMenu);
  //   document.addEventListener('keydown', disableCopyShortcut);

  //   return () => {
  //     document.removeEventListener('contextmenu', disableContextMenu);
  //     document.removeEventListener('keydown', disableCopyShortcut);
  //   };
  // }, []);

  return <>
    {/* <DarkAndLightMode></DarkAndLightMode> */}
    <Routes />
  </>
}

export default withRouter(App);
