import MealsDiagramBar from "./mealsDiagramBar.js";
import {useState, useEffect} from "react";

function MealsDiagram({filteredStatsByMonth, userLogin, updateUserHealth, width}) {
  const [mealsLabel1, setMealsLabel1] = useState(null);
  const [mealsLabel2, setMealsLabel2] = useState(null);
  
  useEffect(()=>{
    if (width >=1100) {
      setMealsLabel1("Meals");
      setMealsLabel2("Days of month");
    } else if (width < 1100) {
      setMealsLabel1("Days of month");
      setMealsLabel2("Meals")
    }
  })

  const sortedDate = filteredStatsByMonth.sort((a,b)=> new Date(a.date).getDate() > new Date(b.date).getDate() ? 1 : -1);
  const meals = filteredStatsByMonth.map((item)=>{
    return item.meals;
  });
  const maxValueMeals = Math.max(...meals);
  let renderMeals;
  if (sortedDate.length === 0) {
    renderMeals = <div className="no-sleep-data-div">There is no data yet</div>
  } else {
    renderMeals = sortedDate.map((item)=>
      <MealsDiagramBar item={item} key={item.id} maxValueMeals={maxValueMeals} userLogin={userLogin} updateUserHealth={updateUserHealth} width={width}/>
    )
  }

  return (
    <div className="meals-stat-wrapper">
      <div className="meals-diagram-label">Meals statistics</div>
      <div className="meals-diagram">
        <div className="meals-wrapper">
          <div className="meals-label">{mealsLabel1}</div>
        </div>
        <div className="meals-bars">
          {renderMeals}
        </div>
      </div>
      <div className="days-of-month-label">{mealsLabel2}</div>
    </div>
  )
}

export default MealsDiagram;