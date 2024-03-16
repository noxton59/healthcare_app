import {useState, useEffect} from "react";
import SleepDiagram from "./statDiagrams/sleepDiagram.js";
import MealsDiagram from "./statDiagrams/mealsDiagram.js";
import StepDiagram from "./statDiagrams/stepDiagram.js";
import ExercisesDiagram from "./statDiagrams/exercisesDiagram.js";
import StressDiagram from "./statDiagrams/stressDiagram.js";

function OverallStatistics({data, logged, updateHealth, width}) {
  const [userHealth, setUserHealth] = useState(null);
  const [userLogin, setUserLogin] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  let renderOverAllStat;
  
  useEffect(()=>{
    if (data) {
      setUserHealth(data[4]);
      setUserLogin(data[1]);
    }
  }, [data]);

  if (!userHealth) {
    return (
      <div className="login-required">Login first to get access to this page.</div>
    )
  }

  const filteredStatsByYear = userHealth.filter((item)=>{
    return new Date(item.date).getFullYear().toString() === selectedYear;
  })
  
  const filteredStatsByMonth = filteredStatsByYear.filter((item)=>{
    return new Date(item.date).getMonth().toString() === selectedMonth;
  })
  

  function updateUserHealth(data) {
    setUserHealth(data);
    updateHealth(data);
  }
  
  renderStats();
  function renderStats() {
    
    if (logged === true) {
      renderOverAllStat = 
      <div className="overall-stat-wrapper">
        <div className="overall-stat-label">Overall Statistics</div>
        <div className="sort-by-year-wrapper">
          <label htmlFor="sort-by-year">Sort by year</label>
          <select id="sort-by-year" value={selectedYear} onChange={(e)=>{setSelectedYear(e.target.value)}}>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
        <div className="sort-by-month-wrapper">
          <label htmlFor="sort-by-month">Sort by month</label>
          <select id="sort-by-month" value={selectedMonth} onChange={(e)=>{setSelectedMonth(e.target.value)}}>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
          </select>
        </div>
        
        <SleepDiagram filteredStatsByMonth={filteredStatsByMonth} userLogin={userLogin} updateUserHealth={updateUserHealth} width={width}/>
        <MealsDiagram filteredStatsByMonth={filteredStatsByMonth} userLogin={userLogin} updateUserHealth={updateUserHealth} width={width}/>
        <StepDiagram filteredStatsByMonth={filteredStatsByMonth} userLogin={userLogin} updateUserHealth={updateUserHealth} width={width}/>
        <div className="exer-stress-wrapper">
          <ExercisesDiagram filteredStatsByMonth={filteredStatsByMonth} userLogin={userLogin} updateUserHealth={updateUserHealth} width={width}/>
          <StressDiagram filteredStatsByMonth={filteredStatsByMonth} userLogin={userLogin} updateUserHealth={updateUserHealth} width={width}/>
        </div>
      </div>
    } else if (logged === false) {
      renderOverAllStat = 
      <div className="login-required">Login first to get access to this page.</div>
    }
  }
  

  return (
    <div className="over-all-stat-wrapper-main">
      {renderOverAllStat}
    </div>
   
  )
}

export default OverallStatistics;