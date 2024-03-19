import { FaRotate, FaCheck, FaTrashCan, FaXmark } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";

function SleepDiagramBar({item, maxValue, userLogin, updateUserHealth, width}) {
  const [showInfo, setShowInfo] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [sleepHours, setSleepHours] = useState("");
  const [emptyField, setEmptyField] = useState(false);
  const infoDiv = useRef(null);
  
  let barFillHeight = "0";
  if (maxValue>0) {
    barFillHeight = Math.round(item.sleep/maxValue *100);
  }

  function showInfoDiv() {
    setShowInfo(!showInfo);
    setIsUpdate(false);
    setEmptyField(false);
    setSleepHours("");
    setIsDelete(false);
  }

  const clickOutside = (e) => {
    if (showInfo && infoDiv.current && !infoDiv.current.contains(e.target)) {
      setShowInfo(false);
      setIsUpdate(false);
      setEmptyField(false);
      setSleepHours("");
      setIsDelete(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [showInfo]);

  function editSleep() {
    setIsUpdate(true);
  }

  function confirmDelete() {
    setIsDelete(true);
  }

  function cancelDelete() {
    setIsDelete(false);
  }

  function limitSleepInput() {
    const sleepValue = document.querySelector(`.update-sleep-${item.id}`).value;
    const minValue = 0;
    const maxValue = 24;
    if (sleepValue < minValue) {
      setSleepHours(1);
    } else if (sleepValue > maxValue) {
      setSleepHours(24);
    } else {
      setSleepHours(sleepValue);
    }
  }

  async function acceptUpdateSleep() {
    if (sleepHours === "") {
      setEmptyField(true);
    } else {
      const option = {
        method: "POST"
      };
      const request = await fetch(`/updateSleep/${userLogin}/${item.id}&${sleepHours}`, option);
      const json = await request.json();
      if (json[0] === "updated") {
        updateUserHealth(json[1]);
        setShowInfo(false);
        setIsUpdate(false);
        setSleepHours("");
        setEmptyField(false);
      } else {
        alert(json);
      }
    }
  }

  async function deleteStat() {
    const option = {
      method: "DELETE"
    };
    const request = await fetch(`/deleteStat/${userLogin}/${item.id}`, option);
    const json = await request.json();
    if (json[0] === "stat deleted") {
      updateUserHealth(json[1]);
      setShowInfo(false);
      setIsDelete(false);
    } else {
      alert(json);
    }
  }

  let renderSleep;
  if (width >= 1100) {
    if (barFillHeight > 20) {
      renderSleep = 
      <div className="sleep-bar" style={{height: barFillHeight + "%"}} onClick={showInfoDiv}>
        {item.sleep}
      </div>
    } else if (barFillHeight <= 20) {
      renderSleep = 
      <div className="sleep-bar-wrapper">
        <div className="sleep-count-label" onClick={showInfoDiv}>{item.sleep}</div>
        <div className="sleep-bar" style={{height: barFillHeight + "%"}} onClick={showInfoDiv}></div>
      </div>
    }
  } else if (width <1100) {
    if (barFillHeight > 20) {
      renderSleep = 
      <div className="sleep-bar" style={{width: barFillHeight + "%"}} onClick={showInfoDiv}>
        {item.sleep}
      </div>
    } else if (barFillHeight <= 20) {
      renderSleep = 
      <div className="sleep-bar-wrapper">
        <div className="sleep-count-label" onClick={showInfoDiv}>{item.sleep}</div>
        <div className="sleep-bar" style={{width: barFillHeight + "%"}} onClick={showInfoDiv}></div>
      </div>
    }
  }
  

  return (
    <div className="bar-column">
      <div className="bar-fill-height" ref={infoDiv}>
        {renderSleep}
        <div className={`info-div ${showInfo ? "" : "hidden"}`}>
          <div>Date: {item.date}</div>
          <div>Sleep: {item.sleep} hours</div>
          <div className={`upd-del-wrapper ${isDelete === true ? "hidden" : ""}`}>
            <FaRotate className={`change-sleep-btn ${isUpdate ? "hidden" : ""}`} title="Change" onClick={editSleep}/>
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
            <input className={`update-sleep-input update-sleep-${item.id}`} type="number" value={sleepHours} onChange={limitSleepInput} min="1" max="24"></input>
            <FaCheck className="accept-update-sleep-btn" onClick={acceptUpdateSleep}/>
          </div>
          <div className={`empty-field ${emptyField ? "" : "hidden"}`}>Enter value!</div>    
        </div>
      </div>
      <div className="date-label">
        {new Date(item.date).getDate()}
      </div>
    </div>
  )
}

export default SleepDiagramBar;