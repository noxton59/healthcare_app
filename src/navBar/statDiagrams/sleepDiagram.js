import SleepDiagramBar from "./sleepDiagramBar.js";
import { useState, useEffect } from "react";

function SleepDiagram({filteredStatsByMonth, userLogin, updateUserHealth, width}) {
  const [sleepLabel1, setSleepLabel1] = useState(null);
  const [sleepLabel2, setSleepLabel2] = useState(null);

  useEffect(()=>{
    if (width >=1100) {
      setSleepLabel1("Hours");
      setSleepLabel2("Days of month");
    } else if (width < 1100) {
      setSleepLabel1("Days of month");
      setSleepLabel2("Hours");
    }
  })
  

  const sortedDate = filteredStatsByMonth.sort((a,b)=> new Date(a.date).getDate() > new Date(b.date).getDate() ? 1 : -1);

  const sleepHours = filteredStatsByMonth.map((item)=>{
    return item.sleep;
  });
  const maxValue = Math.max(...sleepHours);
  let renderSleep;
  if (sortedDate.length === 0) {
    renderSleep = <div className="no-sleep-data-div">There is no data yet</div>
  } else {
    renderSleep = sortedDate.map((item)=>
      <SleepDiagramBar item={item} key={item.id} maxValue={maxValue} userLogin={userLogin} updateUserHealth={updateUserHealth} width={width}/>
    )
  } 
  
  return(
    <div className="sleep-stat-wrapper">
      <div className="sleep-diagram-label">Sleep statistics</div>
      <div className="sleep-diagram">
        <div className="sleep-hours-wrapper">
          <div className="sleep-hours-label">{sleepLabel1}</div>
        </div>
        <div className="sleep-hours-bars">
          {renderSleep}
        </div>
      </div>
      <div className="days-of-month-label">{sleepLabel2}</div>
    </div>
  )
}

export default SleepDiagram;