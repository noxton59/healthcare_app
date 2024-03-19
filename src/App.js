import React, {useEffect, useState} from "react";
import {Route, Routes, Link} from "react-router-dom";
import NavMenu from "./navBar/navMenu.js";
import RegField from "./regLog/regField.js";
import LogField from "./regLog/logField.js";
import LogMenu from "./regLog/logMenu.js";
import Settings from "./regLog/settings.js";
import StartPage from "./startPage.js";
import BodyInfo from "./navBar/bodyInfo.js";
import DailyStatistics from "./navBar/dailyStatistics.js";
import OverallStatistics from "./navBar/overallStatistics.js";
import Recommendation from "./navBar/recommendation.js";
//find a way to deploy site to the server
function App() {
  const [logged, setLogged] = useState(false);
  const [data, setData] = useState([]);
  const [width, setWidth] = useState(null);

  useEffect(()=>{
    function handleResize() {
      setWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    const cleanUp = () => {
      window.removeEventListener("resize", handleResize);
    }
    return cleanUp;
  }, []);

  useEffect(()=>{
    async function checkLogged() {
      const loggedUser = JSON.parse(localStorage.getItem("logged-user"));
      if (loggedUser === null) {
        return;
      } else {
        setLogged(true);
        const login = loggedUser[0];
        const password = loggedUser[1];
        const option = {
          method: "GET"
        };
        const request = await fetch(`https://healthcare-app-1.onrender.com/login/${login}&${password}`, option);
        const json = await request.json();
        setData(json);
      }
    };
    checkLogged();
  }, []);

  let regLog = "";
  if (logged === true) {
    regLog = <LogMenu data={data} logOut={logOut}/>
  } else {
    regLog = 
    <div className="reg-log-wrapper">
      <Link to={"/register"} className="register-button">Register</Link>
      <Link to={"/login"} className="login-button">Login</Link>
    </div>
  }
  

  function logOut(arg) {
    setLogged(arg);
  }

  function getData(data) {
    setLogged(true);
    setData(data);
  }
  function updateBodyInfo(info) {
    data.splice(5, 1, info);
    setData(data);
  }
  function updateName(names) {
    data.splice(2,1,names[0]);
    data.splice(3,1,names[1]);
    setData(data);
  }
  function clearHealth(health) {
    data.splice(4,1,health);
    setData(data);
  }
  function updateBodyStat(stat) {
    data.splice(4,1,stat);
    setData(data);
  }
  function updateHealth(health) {
    data.splice(4,1,health)
    setData(data);
  }


  return (
    <div className="App">
      <div className="background"></div>
      <header>
        <Link to={"/"} className="header1">HealthCare</Link>
        {regLog}
      </header>
      <NavMenu/>
      <div className="main-wrapper">
        <div className="data-wrapper">
          <Routes>
            <Route path='/' element={<StartPage logged={logged} data={data}/>}/>
            <Route path="/login" element={<LogField getData={getData}/>}/>
            <Route path="/register" element={<RegField width={width}/>}/>
            <Route path="/bodyInfo" element={<BodyInfo data={data} updateBodyInfo={updateBodyInfo} logged={logged}/>}/>
            <Route path="/dailyStat" element={<DailyStatistics data={data} updateBodyStat={updateBodyStat} logged={logged}/>}/>
            <Route path="/overallStat" element={<OverallStatistics data={data} logged={logged} updateHealth={updateHealth} width={width}/>}/>
            <Route path="/recomendation" element={<Recommendation data={data} logged={logged}/>}/>
            <Route path="/settings" element={<Settings data={data} updateBodyInfo={updateBodyInfo} updateName={updateName} clearHealth={clearHealth} logged={logged}/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
/* "start": "react-scripts start", */