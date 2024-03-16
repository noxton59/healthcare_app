import StressDiagramBar from "./stressDiagramBar.js";

function StressDiagram({filteredStatsByMonth, userLogin, updateUserHealth, width}) {
  const sortedDate = filteredStatsByMonth.sort((a,b)=> new Date(a.date).getDate() > new Date(b.date).getDate() ? 1 : -1);

  let renderStress;
  if (sortedDate.length === 0) {
    renderStress = <div className="no-sleep-data-div">There is no data yet</div>
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
      }
      currentRow.push(<StressDiagramBar key={item.id} item={item} userLogin={userLogin} updateUserHealth={updateUserHealth} width={width}/>);
      if ((index + 1) % maxItemsPerRow === 0) {
        rows.push(
          <div className="row">
            {currentRow}
          </div>
        );
        currentRow = [];
      }
    });
    if (currentRow.length > 0) {
      rows.push(
        <div className="row">
          {currentRow}
        </div>
      );
    }
  
    renderStress = rows.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className="stress-bars-wrapper">
        {row}
      </div>
    ));
  }

  return (
    <div className="stress-stat-wrapper">
      <div className="stress-diagram-label">Stress statistics</div>
      <div className="stress-diagram">
        <div className="stress-bars">
          {renderStress}
        </div>
      </div>
    </div>
  )
}

export default StressDiagram;