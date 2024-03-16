function StartPage({logged, data}) {

  let startContent;
  if (logged === false) {
    startContent = 
      <div className="greeting-msg">
        <p>The site is meant to be your health care application, to track your daily activities and show you recommendation depending on your lifestyle.</p>
        <p>To get started please login first, if you don't have an account register.</p>
      </div>
  } else {
    startContent = 
      <div>
        <div className="greeting-msg">Hello {data[2]} {data[3]}, how was your day? Go to daily statistics to enter your data.</div>
      </div>
  }

  return(
    <div>
      {startContent}
    </div>
  )
}

export default StartPage;