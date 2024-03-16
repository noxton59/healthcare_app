import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function LogField ({getData}) {
  const [logFieldAlert, setLogFieldAlert] = useState(false);
  const [logFieldMsg, setLogFieldMsg] = useState(null);

  const navigate = useNavigate();
  const regSuccessWrapper = document.createElement("div");
  regSuccessWrapper.classList.add("log-success-wrapper");
  const regSuccess = document.createElement("div");
  regSuccess.classList.add("log-success");
  regSuccessWrapper.append(regSuccess);


  async function logIn() {
    const login = document.querySelector("#login").value;
    const password = document.querySelector("#password").value;
    const rememberMe = document.querySelector("#remember-me").checked;
    if (login === "" || password === "") {
      setLogFieldAlert(true);
      setLogFieldMsg("Enter login and password!");
    } else {
      const option = {
        method: "GET"
      }
      const request = await fetch(`/login/${login}&${password}`, option);
      const json = await request.json();
  
      function navigateTo() {
        if (json[5].length === 0) {
          navigate("/bodyInfo")
        } else {
          navigate("/dailyStat")
        }
      }
  
      if (json[0] === "match") {
        getData(json);
        setLogFieldAlert(false);
        setLogFieldMsg(false);
        document.querySelector("#login").value = "";
        document.querySelector("#password").value = "";
        regSuccess.textContent = `Welcome ${json[2]} ${json[3]}`;
        document.body.append(regSuccessWrapper);
        setTimeout(()=>{document.body.removeChild(regSuccessWrapper)}, 1400);
        navigateTo();
        if (rememberMe) {
          localStorage.setItem("logged-user", JSON.stringify([login, password]));
        } 
      } else if (json === "no user") {
        setLogFieldAlert(true);
        setLogFieldMsg("User doesn't exist");
      } else if (json === "wrong password") {
        setLogFieldAlert(true);
        setLogFieldMsg("Wrong password!");
      }
    }
  }

  return (
    <div className="login-field-main">
      <div className="login-label">Log In</div>
      <div className="log-field-wrapper">
        <label htmlFor="login">Login</label>
        <input type="text" id="login"></input>
        <label htmlFor="password">Password</label>
        <input type="password" id="password"></input>
      </div>
      <div className="remember-me-field">
        <label htmlFor="remember-me" className="remember-me-label">Remember Me</label>
        <input type="checkbox" id="remember-me"></input>
      </div>
      <div className="log-field-btns-wrapper">
        <div className={`log-field-alert ${logFieldAlert === true ? "" : "hidden"}`}>{logFieldMsg}</div>
        <button className="log-form-login-button" onClick={logIn}>Log In</button>
        <Link to={"/register"} className="link-to-register">Register</Link>
      </div>
      
    </div>
  )
}

export default LogField;