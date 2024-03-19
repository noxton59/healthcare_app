import { FaRotate, FaCheck, FaTrashCan, FaXmark } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";

function MealsDiagramBar({item, maxValueMeals, userLogin, updateUserHealth, width}) {
  const [showInfo, setShowInfo] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [meals, setMeals] = useState("");
  const [emptyField, setEmptyField] = useState(false);
  const infoDiv = useRef(null);
  
  let barFillHeight = "0";
  if (maxValueMeals>0) {
    barFillHeight = Math.round(item.meals/maxValueMeals *100);
  }

  function showInfoDiv() {
    setShowInfo(!showInfo);
    setIsUpdate(false);
    setEmptyField(false);
    setMeals("");
    setIsDelete(false);
  }

  const clickOutside = (e) => {
    if (showInfo && infoDiv.current && !infoDiv.current.contains(e.target)) {
      setShowInfo(false);
      setIsUpdate(false);
      setEmptyField(false);
      setMeals("");
      setIsDelete(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [showInfo]);

  function editMeals() {
    setIsUpdate(true);
  }

  function confirmDelete() {
    setIsDelete(true);
  }

  function cancelDelete() {
    setIsDelete(false);
  }

  function limitMealsInput() {
    const mealsValue = document.querySelector(`.update-meals-${item.id}`).value;
    const minValue = 0;
    const maxValue = 20;
    if (mealsValue < minValue) {
      setMeals(1);
    } else if (mealsValue > maxValue) {
      setMeals(20);
    } else {
      setMeals(mealsValue);
    }
  }

  async function acceptUpdateMeals() {
    if (meals === "") {
      setEmptyField(true);
    } else {
      const option = {
        method: "POST"
      };
      const request = await fetch(`/updateMeals/${userLogin}/${item.id}&${meals}`, option);
      const json = await request.json();
      if (json[0] === "updated") {
        updateUserHealth(json[1]);
        setShowInfo(false);
        setIsUpdate(false);
        setMeals("");
        setEmptyField(false);
      } else {
        alert(json);
      }
    }
  };

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
  };

  let renderMeals;
  if (width >= 1100) {
    if (barFillHeight > 20) {
      renderMeals = 
      <div className="meals-bar" style={{height: barFillHeight + "%"}} onClick={showInfoDiv}>
        {item.meals}
      </div>
    } else if (barFillHeight <= 20) {
      renderMeals = 
      <div className="meals-bar-wrapper">
        <div className="meals-count-label" onClick={showInfoDiv}>{item.meals}</div>
        <div className="meals-bar" style={{height: barFillHeight + "%"}} onClick={showInfoDiv}></div>
      </div>
    }
  } else if (width < 1100) {
    if (barFillHeight > 20) {
      renderMeals = 
      <div className="meals-bar" style={{width: barFillHeight + "%"}} onClick={showInfoDiv}>
        {item.meals}
      </div>
    } else if (barFillHeight <= 20) {
      renderMeals = 
      <div className="meals-bar-wrapper">
        <div className="meals-count-label" onClick={showInfoDiv}>{item.meals}</div>
        <div className="meals-bar" style={{width: barFillHeight + "%"}} onClick={showInfoDiv}></div>
      </div>
    }
  }
  

  return (
    <div className="bar-column">
      <div className="bar-fill-height" ref={infoDiv}>
        {renderMeals}
        <div className={`info-div ${showInfo ? "" : "hidden"}`}>
          <div>Date: {item.date}</div>
          <div>Meals: {item.meals}</div>
          <div className={`upd-del-wrapper ${isDelete === true ? "hidden" : ""}`}>
            <FaRotate className={`change-meals-btn ${isUpdate ? "hidden" : ""}`} title="Change" onClick={editMeals}/>
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
            <input className={`update-meals-input update-meals-${item.id}`} type="number" value={meals} onChange={limitMealsInput} min="1" max="20"></input>
            <FaCheck className="accept-update-meals-btn" onClick={acceptUpdateMeals}/>
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

export default MealsDiagramBar;

