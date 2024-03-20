import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegField ({width}) {
  const [data, setData] = useState({email: "", login: "", fname: "", lname: "", password: "", health: [], stats: []});
  const navigate = useNavigate();
  const [regFieldAlert, setRegFieldAlert] = useState(false);
  const [regFieldMsg, setRegFieldMSg] = useState(null);
  const [regFieldSucces, setRegFieldSucces] = useState(false);
  
  async function submitData() {
    const email = document.querySelector("#email-input").value;
    const login = document.querySelector("#login-input").value;
    const fname = document.querySelector("#fname-input").value;
    const lname= document.querySelector("#lname-input").value;
    const fpassword = document.querySelector("#fpassword").value;
    const spassword = document.querySelector("#spassword").value;

    const regEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email === "" || login === "" || fname === "" || lname === "" || fpassword === "") {
      setRegFieldAlert(true);
      setRegFieldMSg("Fill all fields!");
    } else {
      if (regEx.test(email)) {
        if (fpassword === spassword) {
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }, 
            body: JSON.stringify(data)
          }
          const request = await fetch("/addUser", options);
          const json = await request.json();

          if (json === "success") {
            setData({email: "", login: "", fname: "", lname: "", password: ""});
            document.querySelector("#spassword").value = "";
            if (width >= 700) {
              setRegFieldAlert(false);
              setRegFieldMSg(null);
              setRegFieldSucces(true);
              setTimeout(()=>{setRegFieldSucces(false); navigate("/login");}, 1400);
            } else if (width < 700) {
              setRegFieldAlert(true);
              setRegFieldMSg("Registration is successful");
              setTimeout(()=>{navigate("/login")}, 1400);
            }
          } else if (json === "user exists") {
            setRegFieldAlert(true);
            setRegFieldMSg("User already exists");
          } else if (json === "email exists") {
            setRegFieldAlert(true);
            setRegFieldMSg("Email already exists");
          } else {
            setRegFieldAlert(true);
            setRegFieldMSg(json);
          }
        } else {
          setRegFieldAlert(true);
          setRegFieldMSg("Passwords don't match!");
        } 
      } else {
        setRegFieldAlert(true);
        setRegFieldMSg("Enter valid email!");
      }
    }
  }

  return (
    <div className="reg-field-main">
      <div className="reg-label">Registration</div>
      <div className="reg-field-wrapper">
        <label htmlFor="email-input">Email</label>
        <input 
          type="email" 
          id="email-input" 
          required={true} 
          value={data.email}
          onChange={(e)=>{setData({...data, email: e.target.value})}}></input>
        <label htmlFor="login-input">Login</label>
        <input 
          type="text" 
          id="login-input" 
          required={true}
          value={data.login}
          onChange={(e)=>{setData({...data, login: e.target.value})}}></input>
        <label htmlFor="fname-input">First Name</label>
        <input 
          type="text" 
          id="fname-input" 
          required={true}
          value={data.fname}
          onChange={(e)=>{setData({...data, fname: e.target.value})}}></input>
        <label htmlFor="lname-input">Last Name</label>
        <input 
          type="text" 
          id="lname-input" 
          required={true}
          value={data.lname}
          onChange={(e)=>{setData({...data, lname: e.target.value})}}></input>
        <label htmlFor="fpassword">Password</label>
        <input 
          type="password" 
          id="fpassword" 
          required={true}
          value={data.password}
          onChange={(e)=>{setData({...data, password: (e.target.value)})}}
          ></input>
        <label htmlFor="spassword">Repeat password</label>
        <input type="password" id="spassword" required={true}></input>
      </div>
      <div className={`reg-success ${regFieldSucces === true ? "" : "hidden"}`}>Registration is successful</div>
      <div className="reg-field-btns-wrapper">
        <div className={`
          reg-field-alert ${regFieldAlert === true ? "" : "hidden"}
          ${regFieldMsg === "Registration is successful" ? "reg-success-msg" : ""}
          `}>{regFieldMsg}</div>
        <button className="reg-form-reg-btn" onClick={submitData}>Register</button>
        <Link to={"/login"} className="link-to-login">LogIn</Link>
      </div>
    </div>
  )
}

export default RegField;
