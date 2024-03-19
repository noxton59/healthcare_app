import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogMenu({ data, logOut }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmMenu, setConfirmMenu] = useState(false);
  const menu = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setConfirmMenu(false);
  };

  const clickOutside = (e) => {
    if (isOpen && menu.current && !menu.current.contains(e.target)) {
      setIsOpen(false);
      setConfirmMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [isOpen]);

  function openConfirm() {
    setConfirmMenu(!confirmMenu);
  }

  function goToSettings() {
    navigate("/settings");
    setIsOpen(false)
  }

  function logOutHandler() {
    logOut(false);
    localStorage.setItem("logged-user", JSON.stringify(null));
    navigate("/");
  }

  async function deleteAcc() {
    const option = {
      method: "DELETE"
    };
    const request = await fetch(`https://healthcare-app-1.onrender.com/deleteAcc/${data[1]}`, option);
    const json = await request.json();
    if (json === "user deleted") {
      logOutHandler();
    }
  }

  function cancelConfirm() {
    setConfirmMenu(false);
  }

  return (
    <div className="reg-log-wrapper" ref={menu}>
      <div className="logged-success" onClick={toggleMenu}>{data[2]} {data[3]}</div>
      {isOpen && (
        <div className="log-menu">
          <div onClick={goToSettings} className="settings-btn">Settings</div>
          <div className="delete-acc-btn">
            <div onClick={openConfirm}>Delete account</div>
            <div className={`confirm-wrapper ${confirmMenu === true ? "" : "hidden"}`}>
              <div>Confirm? It will be impossible to restore your account.</div>
              <button className="delete-acc-confirm-btn" onClick={deleteAcc}>Confirm</button>
              <button className="delete-acc-cancel-btn" onClick={cancelConfirm}>Cancel</button>
            </div>
          </div>
          <div onClick={logOutHandler} className="log-out-btn">Log Out</div>
        </div>)}
    </div>
  );
}

export default LogMenu;
