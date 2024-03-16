import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import "./styles/regLogStyle.css";
import "./styles/bodyStat.css";
import "./styles/settings.css";
import "./styles/dailyStat.css";
import "./styles/overallStat.css";
import "./styles/recommend.css";
import App from './App.js';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="*" element={<App />}/>
      </Routes>
    </Router>
  </React.StrictMode>
);

