import { useState } from "react";

function Settings({data, updateBodyInfo, updateName, clearHealth, logged}) {
  const [changePassAlert, setChangePassAlert] = useState(false);
  const [changePassMsg, setChangePassMsg] = useState(null);
  const [passChanged, setPassChanged] = useState(false);
  const [changeStatAlert, setchangeStatAlert] = useState(false);
  const [changeStatMsg, setChangeStatMsg] = useState(null);
  const [changeStatSuccess, setChangeStatSuccess] = useState(false);
  const [changeNameAlert, setChangeNameAlert] = useState(false);
  const [changeNameSuccess, setChangeNameSuccess] = useState(false);
  const [clearHistoryConf, setClearHistoryConf] = useState(false);
  const [clearHistorySuccess, setClearHistorySuccess] = useState(false);


  async function changePass() {
    const oldPass = document.querySelector("#old-pass").value;
    const newPass = document.querySelector("#new-pass").value;
    const newPassRep = document.querySelector("#new-pass-rep").value;

    if (oldPass === "" || newPass === "") {
      setChangePassAlert(true);
      setChangePassMsg("Fill all fields");
    } else {
      if (newPass === newPassRep) {
        const option = {
          method: "PUT"
        }
        const request = await fetch(`/changePass/${data[1]}&${oldPass}/${newPass}`, option);
        const json = await request.json();
        if (json === "password changed") {
          document.querySelector("#old-pass").value = "";
          document.querySelector("#new-pass").value = "";
          document.querySelector("#new-pass-rep").value = "";
          setChangePassAlert(false);
          setChangePassMsg(null);
          setPassChanged(true);
          localStorage.setItem("logged-user", JSON.stringify([data[1], newPass]));
          setTimeout(()=>{setPassChanged(false)}, 1400);
        } else if (json === "prevPass doesn't match") {
          setChangePassMsg("Previous password doesn't match!");
        } else {
          console.log(json);
        }
      } else {
        setChangePassMsg("New passwords don't match");
      }
    }
  }

  async function changeStats() {
    const age = document.querySelector("#change-age").value;
    const height = document.querySelector("#change-height").value;
    const weight = document.querySelector("#change-weight").value;

    if (age === "" || height === "" || weight === "") {
      setchangeStatAlert(true);
      setChangeStatMsg("Fill all fields!");
    } else if (age == 0 || height == 0 || weight == 0) {
      setchangeStatAlert(true);
      setChangeStatMsg("0 is not valid value!");
    } else {
      const ageRound = parseInt(age);
      const heightDec = parseFloat(height);
      const weightDec = parseFloat(weight);
      const option = {
        method: "PUT"
      };
      const request = await fetch(`/changeStats/${data[1]}/${ageRound}&${heightDec}&${weightDec}`, option);
      const json = await request.json();
      updateBodyInfo(json);
      setchangeStatAlert(false);
      setChangeStatMsg(null);
      setChangeStatSuccess(true);
      document.querySelector("#change-age").value = "";
      document.querySelector("#change-height").value = "";
      document.querySelector("#change-weight").value = "";
      setTimeout(()=>{setChangeStatSuccess(false)}, 1400);
    }
  }

  async function changeName() {
    const fname = document.querySelector("#change-fname").value;
    const lname = document.querySelector("#change-lname").value;
    
    if (fname === "" || lname === "") {
      setChangeNameAlert(true);
    } else {
      const option = {
        method: "PUT"
      };
      const request = await fetch(`/changeName/${data[1]}/${fname}&${lname}`, option);
      const json = await request.json();
      updateName(json);
      setChangeNameAlert(false);
      setChangeNameSuccess(true);
      document.querySelector("#change-fname").value = "";
      document.querySelector("#change-lname").value = "";
      setTimeout(()=>{setChangeNameSuccess(false)}, 1400);
    }
  }

  async function clearHistory() {
    const option = {
      method: "DELETE"
    }
    const request = await fetch(`/deleteHS/${data[1]}`, option);
    const json = await request.json();
    clearHealth(json);
    setClearHistoryConf(false);
    setClearHistorySuccess(true);
    setTimeout(()=>{setClearHistorySuccess(false)}, 1400);
  }

  function cancelClear() {
    setClearHistoryConf(false);
  }

  function clearHealthHistory() {
    setClearHistoryConf(true);
  }

  let renderSettings;
  if (logged === true) {
    renderSettings = 
    <div className="settings-field">
      <div className="settings-label">Settings</div>
      <div className="settings-wrapper">
        <div className="pass-change-field">
          <div className="change-pass-label">Change Password</div>
          <div className="pass-change-wrapper">
            <label htmlFor="old-pass">Old password</label>
            <input type="password" id="old-pass"></input>
            <label htmlFor="new-pass">New password</label>
            <input type="password" id="new-pass"></input>
            <label htmlFor="new-pass-rep">Repeat new password</label>
            <input type="password" id="new-pass-rep"></input>
            <div className={`pass-changed ${passChanged === true ? "" : "hidden"}`}>Password changed</div>
          </div>
          <div className="change-pass-btns">
            <button onClick={changePass} className="change-pass-btn">Change password</button>
            <div className={`pass-alert-msg ${changePassAlert === true ? "" : "hidden"}`}>{changePassMsg}</div>
          </div>
        </div>
        <div className="change-stat-field">
          <div className="change-stat-label">Change body characteristics</div>
          <div className="change-stat-wrapper">
            <label htmlFor="change-age">Age, year</label>
            <input type="number" id="change-age"></input>
            <label htmlFor="change-height">Height, cm</label>
            <input type="number" id="change-height"></input>
            <label htmlFor="change-weight">Weight, kg</label>
            <input type="number" id="change-weight"></input>
            <div className={`change-stat-success ${changeStatSuccess === true ? "" : "hidden"}`}>Characteristics changed</div>
          </div>
          <div className="change-stat-btns">
            <button onClick={changeStats} className="change-stat-btn">Change characteristics</button>
            <div className={`stat-alert-msg ${changeStatAlert === true ? "" : "hidden"}`}>{changeStatMsg}</div>
          </div>
        </div>
        <div className="change-name-field">
          <div className="change-name-label">Change name</div>
          <div className="change-name-wrapper">
            <label htmlFor="change-fname">First name</label>
            <input type="text" id="change-fname"></input>
            <label htmlFor="change-lname">Last name</label>
            <input type="text" id="change-lname"></input>
            <div className={`change-name-success ${changeNameSuccess === true ? "" : "hidden"}`}>Name changed</div>
          </div>
          <div className="change-name-btns">
            <button onClick={changeName} className="change-name-btn">Change name</button>
            <div className={`change-name-alert-msg ${changeNameAlert === true ? "" : "hidden"}`}>Enter first name and last name</div>
          </div>
        </div>
        <div className="clear-history-field">
          <div className="clear-history-label">Clear health history</div>
          <button onClick={clearHealthHistory} className="clear-history-btn">Clear history</button>
          <div className={`clear-health-conf ${clearHistoryConf === true ? "" : "hidden"}`}>
            <div>Confirm? It will be impossible to restore your health history.</div>
            <div className="clear-history-btns-wrapper">
              <button className="clear-health-confirm-btn" onClick={clearHistory}>Clear</button>
              <button className="clear-health-cancel-btn" onClick={cancelClear}>Cancel</button>
            </div>
          </div>
          <div className={`clear-history-success ${clearHistorySuccess === true ? "" : "hidden"}`}>Health history cleared</div>
        </div>
      </div>
    </div>
  } else if (logged === false) {
    renderSettings = 
    <div className="login-required">Login first to get access to this page.</div>
  }

  return (
    <div className="settings-wrapper-main">
      {renderSettings}
    </div>
  )
}

export default Settings;