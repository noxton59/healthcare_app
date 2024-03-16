import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function BodyInfo({data, updateBodyInfo, logged}) {
  const [stats, setStats] = useState({gender: "", height: "", weight: "", age: ""});
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState(null);
  const [styleWarning, setStyleWarning] = useState(null);
  
  useEffect(()=>{
    if (data) {
      setUserData(data[5]);
      setUserName([data[2], data[3]]);
    }
  }, [data]);

  if (!userData) {
    return (
      <div className="login-required">Login first to get access to this page.</div>
    )
  }
  
  async function submitStats() {
    if (stats.gender === "" || stats.height === "" || stats.height === "" || stats.age === "") {
      setShowWarning(true);
      setStyleWarning("red");
      setWarningMsg("Fill all fields!");
    } else {
      const option = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(stats)
      };
      const request = await fetch(`/addStats/${data[1]}`, option);
      const json = await request.json();
      if (json === "there are stats") {
        setShowWarning(true);
        setStyleWarning("red");
        setWarningMsg("Stats already there!");
      } else {
        setShowWarning(true);
        setStyleWarning("blue");
        setWarningMsg("Characteristics added");
        setTimeout(()=>{
          setUserData(json);
          updateBodyInfo(json);
        }, 2000);
      }
    }
  }

  function clearStats() {
    setStats({gender: "", height: "", weight: "", age: ""});
    setShowWarning(false);
  }

  let bodyInfo = "";
  renderPage();
  function renderPage() {
    if (logged === false) {
      bodyInfo = 
        <div className="login-required">Login first to get access to this page.</div>
    } else if (logged === true) {
      if (userData.length === 0) {
        bodyInfo =  
          <div className="body-info-field">
            <div className="body-info-label">Body Information</div>
            <div className="body-info-wrapper">
              <label className="stat-description" htmlFor="gender">Gender</label>
              <select className="select-gender stat-input" id="gender" value={stats.gender} onChange={(e)=>{setStats({...stats, gender: e.target.value})}}>
                <option value="">Choose</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label className="stat-description" htmlFor="height">Height, cm</label>
              <input className="stat-input" type="number" id="height" value={stats.height} onChange={(e)=>{setStats({...stats, height: e.target.value})}}></input>
              <label className="stat-description" htmlFor="weight">Weight, kg</label>
              <input className="stat-input" type="number" id="weight" value={stats.weight} onChange={(e)=>{setStats({...stats, weight: e.target.value})}}></input>
              <label className="stat-description" htmlFor="age">Age, year</label>
              <input className="stat-input" type="humber" id="age" value={stats.age} onChange={(e)=>{setStats({...stats, age: e.target.value})}}></input>
            </div>
            <div className="body-info-btns">
              <div className={`body-info-msg 
                ${showWarning === true ? "" : "hidden"}
                ${styleWarning === "red" ? "body-info-warning" : ""}
                ${styleWarning === "blue" ? "stats-added" : ""}
                `}
              >{warningMsg}</div>
              <button onClick={submitStats} className="body-info-submit-btn">Submit</button>
              <button onClick={clearStats} className="body-info-clear-btn">Clear fields</button>
            </div>
          </div>
      } else {
        bodyInfo = 
        <div className="body-info-field">
          <div className="body-info-label">Body information</div>
          <div className="body-info-wrapper">
            <div className="stat-description">First Name:</div>
            <div className="stat-info">{userName[0]}</div>
            <div className="stat-description">Last Name:</div>
            <div className="stat-info">{userName[1]}</div>
            <div className="stat-description">Gender:</div>
            <div className="stat-info">{userData[0].gender}</div>
            <div className="stat-description">Height:</div>
            <div className="stat-info">{userData[0].height} cm</div>
            <div className="stat-description">Weight:</div>
            <div className="stat-info">{userData[0].weight} kg</div>
            <div className="stat-description">Age:</div>
            <div className="stat-info">{userData[0].age} years</div>
          </div>
          <Link to={"/settings"} className="link-to-settings">Change characteristics</Link>
          <div className="go-to-daily-stat">Go to  daily statistics to add your daily data.</div>
        </div>
      }
    }
  }
  
  return(
    <div>
      {bodyInfo}
    </div>
  )
}

export default BodyInfo;