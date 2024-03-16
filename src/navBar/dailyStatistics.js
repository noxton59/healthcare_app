import { useState } from "react";

function DailyStatistics({data, updateBodyStat, logged}) {
  const [stats, setStats] = useState({sleep: "", meals: "", steps: "", exercise: "", stressful: "", date: "", id: ""});
  const [alertMsg, setAlertMsg] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  async function getDailyStat() {
    if (stats.sleep === "" || stats.meals === "" || stats.exercise === "" || stats.stressful === "" || stats.date === "") {      
      setShowAlert(true);
      setAlertMsg("Fill all required fields!");
    } else {
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(stats)
      }
      const request = await fetch(`/addStats/${data[1]}`, option);
      const json = await request.json();
      if (json === "date exists") {
        setShowAlert(true);
        setAlertMsg("The date already exists, select another date or if you want to change some data, go to overall statistics and select the desired date.")
      }
      else if (json[0] === "updated") {
        updateBodyStat(json[1]);
        setStats({sleep: "", meals: "", steps: "", exercise: "", stressful: "", date: "", id: ""});
        setShowAlert(false);
      }
    }
  }

  function clearStats() {
    setShowAlert(false);
    setStats({sleep: "", meals: "", steps: "", exercise: "", stressful: "", date: "", id: ""});
  }

  function limitSleepInput() {
    const sleepValue = document.querySelector("#sleep-hour").value;
    const minValue = 0;
    const maxValue = 24;
    if (sleepValue < minValue) {
      setStats({...stats, sleep: 1});
    } else if (sleepValue > maxValue) {
      setStats({...stats, sleep: 24});
    } else {
      setStats({...stats, sleep: sleepValue});
    }
  }
  function limitStepInput() {
    const stepValue = document.querySelector("#steps").value;
    const minValue = 0;
    const maxValue = 50000;
    if (stepValue < minValue) {
      setStats({...stats, steps: 1});
    } else if (stepValue > maxValue) {
      setStats({...stats, steps: 50000});
    } else {
      setStats({...stats, steps: stepValue});
    }
  }

  let renderDailyStat;
  if (logged === false) {
    renderDailyStat = 
      <div className="login-required">Login first to get access to this page.</div>
  } else if (logged === true) {
    renderDailyStat = 
      <div>
        <div className="daily-stat-label">Daily statistics</div>
        <div className="daily-stat-wrapper">
          <label htmlFor="sleep-hour">How much have You slept today?</label>
          <div className="sleep-wrapper">
            <input 
              type="number" 
              id="sleep-hour" 
              min="1" max="24" 
              value={stats.sleep} 
              onChange={limitSleepInput}
            ></input>
            <div>hours</div>
          </div>
          <label htmlFor="meals-per-day">How many times have You eaten today?</label>
          <div className="meals-wrapper-daily">
            <select id="meals-per-day" value={stats.meals} onChange={(e)=>{setStats({...stats, meals: e.target.value})}}>
              <option value="">-----</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option vlaue="7">7</option>
              <option vlaue="8">8</option>
            </select>
            <div>meals</div>
          </div>
          <label htmlFor="steps">How many steps have You walked today? (optional)</label>
          <div className="steps-wrapper-daily">
            <input 
              type="number" 
              id="steps" 
              min="1" 
              max="50000"
              value={stats.steps}
              onChange={limitStepInput}
            ></input>
            <div>steps</div>
          </div>
          <label htmlFor="exercised">Have You exercised today?</label>
          <div className="exercise-wrapper">
            <select id="exercised" value={stats.exercise} onChange={(e)=>{setStats({...stats, exercise: e.target.value})}}>
              <option value="">-----</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <label htmlFor="stressful">Was your day stressful?</label>
          <div className="stressful-wrapper">
            <select id="stressful" value={stats.stressful} onChange={(e)=>{setStats({...stats, stressful: e.target.value})}}>
              <option value="">-----</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <label htmlFor="date">Date</label>
          <div className="date-wrapper">
            <input 
              type="date" 
              id="date"
              value={stats.date}
              onChange={(e)=>{setStats({...stats, date: e.target.value, id: Math.round(Math.random()*Date.now())})}}
            ></input>
          </div>
        </div>
        <div className="button-wrapper">
          <button onClick={getDailyStat} className="daily-stat-submit-btn">Submit</button>
          <button onClick={clearStats} className="daily-stat-clear-btn">Clear stats</button>
          <div className={`daily-stat-alert-msg ${showAlert === true ? "" : "hidden"}`}>{alertMsg}</div>
        </div>
      </div>
  }

  return(
    <div className="daily-stat-wrapper-main">
      {renderDailyStat}
    </div>   
  )
}

export default DailyStatistics;