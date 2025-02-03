import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Helmet } from "react-helmet";
import App from './App';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Helmet>
      <meta name="description" content="Một tựa game multiplayer cổ điển - Caro." />
      <meta name="keywords" content="Caro, Caro online, multiplayer, Nhiều người chơi" />
      <meta name="robots" content="index, nofollow" />
      <meta name="author" content="h_ngoc" />
      <meta property="og:title" content="Caro Online" />
      <meta property="og:description" content="Một tựa game multiplayer cổ điển - Caro." />
      <meta property="og:image" content="/caro.png" />
      <meta property="og:type" content="game" />
    </Helmet>
    <App />
    <ToastContainer />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
