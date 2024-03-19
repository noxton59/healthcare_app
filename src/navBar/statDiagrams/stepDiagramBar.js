import { FaRotate, FaCheck, FaTrashCan, FaXmark } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";

function StepDiagramBar({item, maxValueSteps, userLogin, updateUserHealth, width}) {
  const [showInfo, setShowInfo] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [steps, setSteps] = useState("");
  const infoDiv = useRef(null);
  
  let barFillHeight = "0";
  if (maxValueSteps>0) {
    barFillHeight = Math.round(item.steps/maxValueSteps *100);
  }

  function showInfoDiv() {
    setShowInfo(!showInfo);
    setIsUpdate(false);
    setSteps("");
    setIsDelete(false);
  }

  const clickOutside = (e) => {
    if (showInfo && infoDiv.current && !infoDiv.current.contains(e.target)) {
      setShowInfo(false);
      setIsUpdate(false);
      setSteps("");
      setIsDelete(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [showInfo]);

  function editSteps() {
    setIsUpdate(true);
  }

  function confirmDelete() {
    setIsDelete(true);
  }

  function cancelDelete() {
    setIsDelete(false);
  }

  function limitStepsInput() {
    const stepsValue = document.querySelector(`.update-steps-${item.id}`).value;
    const minValue = 0;
    const maxValue = 50000;
    if (stepsValue < minValue) {
      setSteps(1);
    } else if (stepsValue > maxValue) {
      setSteps(50000);
    } else {
      setSteps(stepsValue);
    }
  }

  async function acceptUpdateSteps() {
    const option = {
      method: "POST"
    };
    const request = await fetch(`https://healthcare-app-1.onrender.com/updateSteps/${userLogin}/${item.id}&${steps}`, option);
    const json = await request.json();
    if (json[0] === "updated") {
      updateUserHealth(json[1]);
      setShowInfo(false);
      setIsUpdate(false);
      setSteps("");
    } else {
      alert(json);
    }
  }

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
  }

  let renderMeals;
  let stepsValue = "";
  if (item.steps === "") {
    stepsValue = 0;
  } else {
    stepsValue = item.steps;
  }

  if (width >= 1100) {
    if (barFillHeight > 20) {
      renderMeals = 
      <div className="steps-bar" style={{height: barFillHeight + "%"}} onClick={showInfoDiv}>
        {item.steps}
      </div>
    } else if (barFillHeight <= 20) {
      if (stepsValue > 0 && barFillHeight == 0 ) {
        renderMeals = 
          <div className="steps-bar-wrapper">
            <div className="steps-count-label" onClick={showInfoDiv}>{stepsValue}</div>
            <div className="steps-bar" style={{height: "1%"}} onClick={showInfoDiv}></div>
          </div>
      } else {
        renderMeals = 
          <div className="steps-bar-wrapper">
            <div className="steps-count-label" onClick={showInfoDiv}>{stepsValue}</div>
            <div className="steps-bar" style={{height: barFillHeight + "%"}} onClick={showInfoDiv}></div>
          </div>
      } 
    }
  } else if (width < 1100) {
    if (barFillHeight > 20) {
      renderMeals = 
      <div className="steps-bar" style={{width: barFillHeight + "%"}} onClick={showInfoDiv}>
        {item.steps}
      </div>
    } else if (barFillHeight <= 20) {
      if (stepsValue > 0 && barFillHeight == 0 ) {
        renderMeals = 
          <div className="steps-bar-wrapper">
            <div className="steps-count-label" onClick={showInfoDiv}>{stepsValue}</div>
            <div className="steps-bar" style={{width: "1%"}} onClick={showInfoDiv}></div>
          </div>
      } else {
        renderMeals = 
          <div className="steps-bar-wrapper">
            <div className="steps-count-label" onClick={showInfoDiv}>{stepsValue}</div>
            <div className="steps-bar" style={{width: barFillHeight + "%"}} onClick={showInfoDiv}></div>
          </div>
      }
    }
  }
  

  return (
    <div className="bar-column">
      <div className="bar-fill-height" ref={infoDiv}>
        {renderMeals}
        <div className={`info-div ${showInfo ? "" : "hidden"}`}>
          <div>Date: {item.date}</div>
          <div>Steps: {stepsValue}</div>
          <div className={`upd-del-wrapper ${isDelete === true ? "hidden" : ""}`}>
            <FaRotate className={`change-steps-btn ${isUpdate ? "hidden" : ""}`} title="Change" onClick={editSteps}/>
            <FaTrashCan className={`delete-stat-btn ${isUpdate === true ? "hidden" : ""}`} onClick={confirmDelete} title="Delete"/>
          </div>
          <div className={`confirm-delete-wrapper ${isDelete === true ? "" : "hidden"}`}>
            Confirm deletion? All information about this date will be deleted.
            <div className="confirm-delete-btns-wrapper">
              <FaCheck className="confirm-delete-stat-btn" onClick={deleteStat} title="Confirm"/>
              <FaXmark className="cancel-delete-stat-btn" onClick={cancelDelete} title="Cancel"/>
            </div>
          </div>
          <div className={`update-div ${isUpdate ? "" : "hidden"}`}>
            <input className={`update-steps-input update-steps-${item.id}`} type="number" value={steps} onChange={limitStepsInput} min="1" max="20"></input>
            <FaCheck className="accept-update-steps-btn" onClick={acceptUpdateSteps}/>
          </div>   
        </div>
      </div>
      <div className="date-label">
        {new Date(item.date).getDate()}
      </div>
    </div>
    
  )
}

export default StepDiagramBar;