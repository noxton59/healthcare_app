import ExercisesDiagramBar from "./exercisesDiagramBar.js";

function ExercisesDiagram({filteredStatsByMonth, userLogin, updateUserHealth, width}) {
  const sortedDate = filteredStatsByMonth.sort((a,b)=> new Date(a.date).getDate() > new Date(b.date).getDate() ? 1 : -1);

  let renderExercises;
  if (sortedDate.length === 0) {
    renderExercises = <div className="no-sleep-data-div">There is no data yet</div>
  } else {
    let maxItemsPerRow;
    if (width >= 1100) {
      maxItemsPerRow = 15;
    } else if (width >= 600 && width < 1100) {
      maxItemsPerRow = 10;
    } else if (width < 600) {
      maxItemsPerRow = 5;
    }
    const rows = [];
    let currentRow = [];
  
    sortedDate.forEach((item, index) => {
      if (index % maxItemsPerRow === 0) {
        currentRow = [];
      };
      currentRow.push(<ExercisesDiagramBar key={item.id} item={item} userLogin={userLogin} updateUserHealth={updateUserHealth} width={width}/>);
      if ((index + 1) % maxItemsPerRow === 0) {
        rows.push(
          <div className="row">
            {currentRow}
          </div>
        );
        currentRow = [];
      };
    });
    if (currentRow.length > 0) {
      rows.push(
        <div className="row">
          {currentRow}
        </div>
      );
    }
  
    renderExercises = rows.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className="exercises-bars-wrapper">
        {row}
      </div>
    ));
  }

  return (
    <div className="exercises-stat-wrapper">
      <div className="exercises-diagram-label">Physical activity</div>
      <div className="exercises-diagram">
        <div className="exercises-bars">
          {renderExercises}
        </div>
      </div>
    </div>
  )
}

export default ExercisesDiagram;