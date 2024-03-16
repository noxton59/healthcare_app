import StepDiagramBar from "./stepDiagramBar.js";
import { useState, useEffect } from "react";

function StepDiagram({filteredStatsByMonth, userLogin, updateUserHealth, width}) {
  const [stepLabel1, setStepLabel1] = useState(null);
  const [stepLabel2, setStepLabel2] = useState(null);

  useEffect(()=>{
    if (width >= 1100) {
      setStepLabel1("Steps");
      setStepLabel2("Days of month");
    } else if (width < 1100) {
      setStepLabel1("Days of month");
      setStepLabel2("Steps");
    }
  })

  const sortedDate = filteredStatsByMonth.sort((a,b)=> new Date(a.date).getDate() > new Date(b.date).getDate() ? 1 : -1);
  const steps = filteredStatsByMonth.map((item)=>{
    return item.steps;
  });
  
  const maxValueSteps = Math.max(...steps);
  let renderSteps;
  if (sortedDate.length === 0) {
    renderSteps = <div className="no-sleep-data-div">There is no data yet</div>
  } else {
    renderSteps = sortedDate.map((item)=>
      <StepDiagramBar item={item} key={item.id} maxValueSteps={maxValueSteps} userLogin={userLogin} updateUserHealth={updateUserHealth} width={width}/>
    )
  }

  return (
    <div className="steps-stat-wrapper">
      <div className="steps-diagram-label">Steps statistics</div>
      <div className="steps-diagram">
        <div className="steps-wrapper">
          <div className="steps-label">{stepLabel1}</div>
        </div>
        <div className="steps-bars">
          {renderSteps}
        </div>
      </div>
      <div className="days-of-month-label">{stepLabel2}</div>
    </div>
  )
}

export default StepDiagram;