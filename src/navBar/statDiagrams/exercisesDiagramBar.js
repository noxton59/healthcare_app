import {FaDumbbell, FaBan, FaCheck, FaTrashCan, FaXmark} from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";

function ExercisesDiagramBar({item, userLogin, updateUserHealth, width}) {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [warning, setWarning] = useState(false);
  const [position, setPosition] = useState({left: "-60px", right: 0});
  const infoDiv = useRef(null);
 
  useEffect(()=>{
    if (width >= 1100) {
      setPosition({left: "-60px", rigth: 0});
    } else if (width >= 600 && width < 1100) {
      if (new Date(item.date).getDate() == 1 || new Date(item.date).getDate() == 11 || new Date(item.date).getDate() == 21 || new Date(item.date).getDate() == 31) {
        setPosition({left: "0px", right: "100px"});
      } else if (new Date(item.date).getDate() == 10 || new Date(item.date).getDate() == 20 || new Date(item.date).getDate() == 30) {
        setPosition({left: "-120px", right: "0px"});
      }
    } else if (width < 600) {
      if (new Date(item.date).getDate() == 1 || new Date(item.date).getDate() == 6 || new Date(item.date).getDate() == 11 || new Date(item.date).getDate() == 16 || new Date(item.date).getDate() == 21 || new Date(item.date).getDate() == 26 || new Date(item.date).getDate() == 31) {
        setPosition({left: "0px", right: "100px"});
      } else if (
        new Date(item.date).getDate() == 5 || new Date(item.date).getDate() == 10 || new Date(item.date).getDate() == 15 || 
        new Date(item.date).getDate() == 20 || new Date(item.date).getDate() == 25 || new Date(item.date).getDate() == 30) {
        setPosition({left: "-120px", right: "0px"});
      }
    }
  }, [])

  function chooseIcon(icon) {
    setSelectedIcon(icon);
  }

  function confirmDelete() {
    setIsDelete(true);
  }

  function cancelDelete() {
    setIsDelete(false);
  }

  function showInfoDiv() {
    setShowInfo(!showInfo);
    setSelectedIcon(null);
    setWarning(false);
    setIsDelete(false);
  }

  const clickOutside = (e) => {
    if (showInfo && infoDiv.current && !infoDiv.current.contains(e.target)) {
      setShowInfo(false);
      setSelectedIcon(null);
      setWarning(false);
      setIsDelete(false);
    }
  };

  useEffect(()=>{
    document.addEventListener("click", clickOutside);

    return ()=>{
      document.removeEventListener("click", clickOutside);
    };
  }, [showInfo]);

  async function acceptUpdateExer() {
    if (selectedIcon === null) {
      setWarning(true);
    } else {
      const option = {
        method: "POST"
      };
      const request = await fetch(`https://healthcare-app-1.onrender.com/updateExer/${userLogin}/${item.id}&${selectedIcon}`, option);
      const json = await request.json();
      if (json[0] === "updated") {
        updateUserHealth(json[1]);
        setShowInfo(false);
        setSelectedIcon(null);
        setWarning(false);
      } else {
        alert(json);
      }
    }
  };

  async function deleteStat() {
    const option = {
      method: "DELETE"
    };
    const request = await fetch(`https://healthcare-app-1.onrender.com/deleteStat/${userLogin}/${item.id}`, option);
    const json = await request.json();
    if (json[0] === "stat deleted") {
      updateUserHealth(json[1]);
      setShowInfo(false);
      setIsDelete(false);
    } else {
      alert(json);
    }
  };

  let renderExercise;
  if (item.exercise === "yes") {
    renderExercise = 
      <div className="render-exercise" onClick={showInfoDiv}><FaDumbbell className="fa-dumbbell"/></div>
  } else {
    renderExercise = 
      <div className="render-no-exercise" onClick={showInfoDiv}><FaBan className="fa-ban"/></div>;
  }

  return (
    <div className="exercises-bar-fill-height">
      <div className="exercise-bar" ref={infoDiv}>
        {renderExercise}
        <div className={`info-div-circle ${showInfo ? "" : "hidden"}`} style={{left: position.left, right: position.right}}>
          <div>Date: {item.date}</div>
          <div className="icon-wrapper">
            <div onClick={()=>{chooseIcon("dumbbell")}} className={`exer ${selectedIcon === "dumbbell" ? "chosen" : ""}`} title="exercise"><FaDumbbell className="fa-dumbbell"/></div>
            <div onClick={()=>{chooseIcon("ban")}} className={`no-exer ${selectedIcon === "ban" ? "chosen-ban" : ""}`} title="no exercise"><FaBan className="fa-ban"/></div>
          </div>
          <div className={`warning-icon-field ${warning === true ? "" : "hidden"}`}>Choose icon</div>
          <div className={`upd-del-wrapper ${isDelete === true ? "hidden" : ""}`}>
            <FaCheck className="accept-update-exer-btn" onClick={acceptUpdateExer} ttile="Accept"/>
            <FaTrashCan className={`delete-stat-btn`} onClick={confirmDelete} title="Delete"/>
          </div>
          <div className={`confirm-delete-wrapper ${isDelete === true ? "" : "hidden"}`}>
            Confirm deletion? All information about this date will be deleted.
            <div className="confirm-delete-btns-wrapper">
              <FaCheck className="confirm-delete-stat-btn" onClick={deleteStat} title="Confirm"/>
              <FaXmark className="cancel-delete-stat-btn" onClick={cancelDelete} title="Cancel"/>
            </div>
          </div>
        </div>
      </div>
      <div>
        {new Date(item.date).getDate()}
      </div>
    </div>
  )
}

export default ExercisesDiagramBar;