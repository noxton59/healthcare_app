import {useState, useEffect} from "react";

function Recommendation({data, logged}) {
  const [userStats, setUserStats] = useState(null);
  const [userHealth, setUserHealth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  
  useEffect(()=>{
    if (data) {
      setUserStats(data[5]);
      setUserHealth(data[4]);
    }
  }, [data]);

  if (!userStats) {
    return (
      <div className="login-required">Login first to get access to this page.</div>
    )
  }
  let BMI = "";
  let userWeightRecom;
  let thin;
  let normal;
  let overweight;
  let obese;

  let sleepActivity;

  let mealsNumber;
  let mealsRecommendation;
  let mealsColorFirst = {r: 255, g: 255, b: 255};
  let mealsColorSecond = {r: 255, g: 255, b: 255};

  let sleepRecommendation;
  let goodSleep;
  let badSleep;

  let stepsActivity;
  let stepsRecommendation;
  let stepsColorFirst = {r: 255, g: 255, b: 255};
  let stepsColorSecond = {r: 255, g: 255, b: 255};

  let physicalActivity;
  let physicalColorFirst = {r: 255, g: 255, b: 255};
  let physicalColorSecond = {r: 255, g: 255, b: 255};

  let stressActivity;
  let stressColorFirst = {r: 255, g: 255, b: 255};
  let stressColorSecond = {r: 255, g: 255, b: 255};

  let renderPage;

  if (userStats.length !== 0 && logged === true) {
    countBMI();
    function countBMI() {
      const height = userStats[0].height;
      const weight = userStats[0].weight;
      BMI = Number((Math.round(weight/(height*height)*1000000))/100);

      if (BMI < 18.5) {
        userWeightRecom = "You seem to be underweight and should consult your doctor based on your health status.";
        thin = true;
      } else if (18.5 < BMI && BMI < 25) {
        userWeightRecom = "Your weihgt is in good condition, keep your healthy lifestyle";
        normal = true;
      } else if (25 < BMI && BMI < 29.9) {
        userWeightRecom = "You are overweight, review your physical activity and diet, consult your doctor if needed.";
        overweight = true;
      } else if (BMI > 30) {
        userWeightRecom = "It looks like you are obese, it is highly recommended to start physical activity if you have not already started, review your diet and consult your doctor depending on your health condition.";
        obese = true;
      }
    }

    const filteredByDate = userHealth.filter((item)=>{
      return new Date(item.date).getMonth().toString() === selectedMonth && new Date(item.date).getFullYear().toString() === selectedYear;
    });
    
    countSleepActivity();
    function countSleepActivity() {
      const filteredSleep = filteredByDate.map((item)=>{
        return item.sleep;
      });
      let totalSleepHours = 0;
      filteredSleep.forEach((item)=>{
        totalSleepHours += Number(item);
      })
      const averageSleepHours = (totalSleepHours/filteredSleep.length).toFixed(2);

      if (isNaN(averageSleepHours)) {
        sleepActivity = "No data."
      } else {
        sleepActivity = averageSleepHours;
      }
      if (sleepActivity < 7) {
        sleepRecommendation = "Your average number of hours of sleep is less than 7 hours. You should get more sleep because it leads to poor health, including weight gain, body mass index of 30 or higher, diabetes, high blood pressure, heart disease, stroke, and depression";
        badSleep = true;
      } else if (sleepActivity >= 7) {
        sleepRecommendation = "Your average number of hours of sleep is more than 7 hours, if you feel tired, try to sleep more, otherwise if you feel good, keep calm and enjoy life."
        goodSleep = true;
      }
    }
    
    countMeals();
    function countMeals() {
      const filteredMeals = filteredByDate.map((item)=>{
        return item.meals
      });
      let totalMeals = 0;
      filteredMeals.forEach((item)=>{
        totalMeals += Number(item);
      });
      const averageMeals = (totalMeals/filteredMeals.length).toFixed(2);
      if (isNaN(averageMeals)) {
        mealsNumber = "No data."
      } else {
        mealsNumber = averageMeals;
      }
      if (mealsNumber < 3 && BMI < 18.5) {
        mealsRecommendation = "Your average number of meals per day is less than 3 and body mass index is less than 18.5, you should eat more meals per day and consult your doctor about your health condition!";
        mealsColorFirst = {r: 255, g: 252, b: 252};
        mealsColorSecond = {r: 255, g: 49, b: 49};
      } else if (mealsNumber >= 3 && BMI < 18.5) {
        mealsRecommendation = "Your average number of meals per day is 3 or more than 3 but body mass index is less than 18.5, consult your doctor about your weight and diet.";
        mealsColorFirst = {r: 255, g: 252, b: 252};
        mealsColorSecond = {r: 255, g: 179, b: 27};
      } else if (mealsNumber < 3 && BMI >= 18.5 && BMI <= 25) {
        mealsRecommendation = "It seems that your average number of meals per day is less than 3, if you are feeling well and not losing weight, maintain your lifestyle, but nutrition experts recommend eating at least 3 balanced meals a day, otherwise consult your doctor about your weight and diet.";
        mealsColorFirst = {r: 255, g: 252, b: 252};
        mealsColorSecond = {r: 27, g: 255, b: 145};
      } else if (mealsNumber >= 3 && BMI >= 18.5 && BMI <= 25) {
        mealsRecommendation = "Your average number of meals per day is 3 or more than 3 if you feel well and maintain your weight it is good, but if you have problems with nutrition or weight, consult your doctor.";
        mealsColorFirst = {r: 255, g: 252, b: 252};
        mealsColorSecond = {r: 51, g: 255, b: 27};
      } else if (mealsNumber >= 3 && BMI > 25) {
        mealsRecommendation = "Your average number of meals per day is 3 or more than 3 and body mass index is more than 25, if you an athlete don't pay attention to it, otherwise consult your doctor about your weight and diet.";
        mealsColorFirst = {r: 255, g: 252, b: 252};
        mealsColorSecond = {r: 196, g: 215, b: 0};
      } else if (mealsNumber < 3 && BMI > 25) {
        mealsRecommendation = "Your average number of meals per day is less than 3 and body mass index is more than 25, consult your doctor about your weight and diet.";
        mealsColorFirst = {r: 255, g: 252, b: 252};
        mealsColorSecond = {r: 255, g: 179, b: 27};
      }
    }
    
    countStepsActivity();
    function countStepsActivity() {
      const filteredSteps = filteredByDate.map((item)=>{
        return item.steps;
      });
      let totalSteps = 0;
      filteredSteps.forEach((item)=>{
        totalSteps += Number(item)
      });
      const averageSteps = Math.round(totalSteps/filteredSteps.length);
      if (isNaN(averageSteps)) {
        stepsActivity = "No data."
      } else {
        stepsActivity = averageSteps;
      }
      if (stepsActivity < 10000) {
        stepsRecommendation = "Your average number of steps per day is less than 10000, you should increase amount of steps per day it helps to reduce weight and maintain healthy lifestyle.";
        stepsColorFirst = {r: 255, g: 252, b: 252};
        stepsColorSecond = {r: 255, g: 107, b: 27};
      } else if (stepsActivity >= 10000) {
        stepsRecommendation = "You walked more than 10000 steps per day, keep walking as it helps to stay fit and healthy."
        stepsColorFirst = {r: 255, g: 252, b: 252};
        stepsColorSecond = {r: 22, g: 255, b: 41};
      }
    }

    countPhysicalActivity();
    function countPhysicalActivity() {
      const filteredExer = filteredByDate.filter((item)=>{
        return item.exercise === "yes"
      });

      const ratio = Math.round((filteredExer.length/filteredByDate.length)*100);

      let month;
      if (selectedMonth === "0") {
        month = "January";
      } else if (selectedMonth === "1") {
        month = "February";
      } else if (selectedMonth === "2") {
        month = "March"
      } else if (selectedMonth === "3") {
        month = "April"
      } else if (selectedMonth === "4") {
        month = "May"
      } else if (selectedMonth === "5") {
        month = "June"
      } else if (selectedMonth === "6") {
        month = "July"
      } else if (selectedMonth === "7") {
        month = "August"
      } else if (selectedMonth === "8") {
        month = "September"
      } else if (selectedMonth === "9") {
        month = "October"
      } else if (selectedMonth === "10") {
        month = "November"
      } else if (selectedMonth === "11") {
        month = "December"
      }

      if (ratio < 35) {
        physicalActivity = `You have poor physical activity in ${month}, increase the number of workouts to at least 3 times a week.`;
        physicalColorFirst = {r: 255, g: 252, b: 252};
        physicalColorSecond = {r: 255, g: 104, b: 22};
      } else if (ratio >= 35 && ratio < 50) {
        physicalActivity = `Your physical activity is good in ${month}, don't stop, keep doing your exercises.`;
        physicalColorFirst = {r: 255, g: 252, b: 252};
        physicalColorSecond = {r: 179, g: 250, b: 30};
      } else if (ratio >= 50 && ratio < 70) {
        physicalActivity = `You have very good physical activity in ${month}, keep up the good work.`;
        physicalColorFirst = {r: 255, g: 252, b: 252};
        physicalColorSecond = {r: 30, g: 250, b: 170};
      } else if (ratio >=70) {
        physicalActivity = `Your physical activity is excellent in ${month}, you must be a dedicated athlete but don't forget about rest, it is as important as exercise.`;
        physicalColorFirst = {r: 255, g: 252, b: 252};
        physicalColorSecond = {r: 0, g: 255, b: 16};
      } else {
        physicalActivity = "There is no data yet."
      }
    }

    countStress();
    function countStress() {
      let countStressNumber = 0;
      filteredByDate.forEach((item)=>{
        if (item.stressful === "yes") {
          countStressNumber += 1;
        }
      });
      if (filteredByDate.length === 0) {
        stressActivity = "No data."
      } else {
        if (countStressNumber > 5) {
          stressActivity = "You have experienced stress more than 5 times this month, it is recommended to consult your doctor about your mental health, stress can have a negative impact on your body.";
          stressColorFirst = {r: 255, g: 252, b: 252};
          stressColorSecond = {r: 255, g: 98, b: 0};
        } else if (countStressNumber <= 5) {
          stressActivity = "You have experienced stress 5 or fewer times this month. Try not to overexert yourself, as stress can have a negative impact on your body.";
          stressColorFirst = {r: 255, g: 252, b: 252};
          stressColorSecond = {r: 0, g: 151, b: 255};
        }
      }
    }

    renderPage = 
    <div>
      <div className="body-mass-index-wrapper">
        <div className="body-mass-index">Your body mass index is {BMI}</div>
        <div className={`user-weight-recom 
        ${thin === true ? "thin" : ""} 
        ${normal === true ? "normal" : ""} 
        ${overweight === true ? "overweight" : ""}
        ${obese === true ? "obese" : ""}`}>
          {userWeightRecom}
        </div>
        <div className="important-note"><span className="important">!IMPORTANT NOTE</span>: If you are an athlete, do not pay attention to the body mass index, as it does not take into account muscle mass and some other factors.</div>
      </div>
      <div className="statistics-recommendation">
        <div className="sort-wrapper">
          <div className="recommend-sort-by-year-wrapper">
            <label htmlFor="recommend-sort-by-year" className="label-selected-year">Selected year</label>
            <select id="recommend-sort-by-year" value={selectedYear} onChange={(e)=>{setSelectedYear(e.target.value)}}>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          <div className="recommend-sort-by-month-wrapper">
            <label htmlFor="recommend-sort-by-month" className="label-selected-month">Selected month</label>
            <select id="recommend-sort-by-month" value={selectedMonth} onChange={(e)=>{setSelectedMonth(e.target.value)}}>
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
        </div>
        <div className={`sleep-activity ${badSleep === true ? "bad-sleep" : ""} ${goodSleep === true ? "good-sleep" : ""}`}>
          <div className="sleep-recommendation-label">Sleep recommendation</div>
          <div>
            Average number of hours of sleep per day {sleepActivity}
          </div>
          <div>{sleepRecommendation}</div>
        </div>
        <div className="meals-activity" style={{background: `linear-gradient(141deg, rgba(${mealsColorFirst.r}, ${mealsColorFirst.g}, ${mealsColorFirst.b}, 1) 0%, rgba(${mealsColorSecond.r}, ${mealsColorSecond.g}, ${mealsColorSecond.b}, 1)`}}>
          <div className="meals-recommendation-label">Meals recommendation</div>
          <div>Average number of meals per day {mealsNumber}</div>
          <div>{mealsRecommendation}</div>
        </div>
        <div className="steps-activity" style={{background: `linear-gradient(141deg, rgba(${stepsColorFirst.r}, ${stepsColorFirst.g}, ${stepsColorFirst.b}, 1) 0%, rgba(${stepsColorSecond.r}, ${stepsColorSecond.g}, ${stepsColorSecond.b}, 1)`}}>
          <div className="steps-activity-label">Steps statistics</div>
          <div>Average number of steps per day {stepsActivity}</div>
          <div>{stepsRecommendation}</div>
        </div>
        <div className="physical-activity" style={{background: `linear-gradient(141deg, rgba(${physicalColorFirst.r}, ${physicalColorFirst.g}, ${physicalColorFirst.b}, 1) 0%, rgba(${physicalColorSecond.r}, ${physicalColorSecond.g}, ${physicalColorSecond.b}, 1)`}}>
          <div className="physical-activity-label">Physical activity</div>
          <div>
            {physicalActivity}
          </div>
        </div>
        <div className="stress-activity" style={{background: `linear-gradient(141deg, rgba(${stressColorFirst.r}, ${stressColorFirst.g}, ${stressColorFirst.b}, 1) 0%, rgba(${stressColorSecond.r}, ${stressColorSecond.g}, ${stressColorSecond.b}, 1)`}}>
          <div className="stress-activity-label">Stress statistics</div>
          <div>{stressActivity}</div>
        </div>
      </div>
    </div>
  } else if (userHealth.length === 0 && logged === true) {
    renderPage = <div className="login-required">Enter your body stats first.</div>;
  } else if (logged === false) {
    renderPage = <div className="login-required">Login first to get access to this page.</div>;
  }

  return(
    <div>
      {renderPage}
    </div>
  )
}

export default Recommendation;