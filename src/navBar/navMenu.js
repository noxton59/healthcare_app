import {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import { IoMenu } from "react-icons/io5";

function NavMenu () {
  let navMenuHtml = "";
  const [width, setWidth] = useState(undefined)
  const [menuShown, setMenuShown] = useState(false);
  const navMenu = useRef(null);

  useEffect(()=>{
    const handleResize = (()=>{
      setWidth(window.innerWidth)
    })

    handleResize();

    window.addEventListener("resize", handleResize);

    const cleanUp = () => {
      window.removeEventListener("resize", handleResize);
    }

    return cleanUp;
  }, [])
  
  function showToggledMenu() {
    setMenuShown(!menuShown);
  }

  function hideMenu(e) {
    if (menuShown && navMenu.current && !navMenu.current.contains(e.target)) {
      document.querySelector(".nav-menu-shown").classList.add("hide-menu");
      setTimeout(()=>{
        document.querySelector(".nav-menu-shown").classList.remove("hide-menu");
        setMenuShown(false);
      }, 250)
    }
  }
  useEffect(()=>{
    document.addEventListener("click", hideMenu);
    return ()=>{
      document.removeEventListener("click", hideMenu)
    }
  }, [menuShown]);

  if (width >= 700) {
    navMenuHtml = 
    <div className="nav-menu">
      <Link to={"/bodyInfo"} className="nav-link">Body Info</Link>
      <Link to={"/dailyStat"} className="nav-link">Daily statistics</Link>
      <Link to={"/overallStat"} className="nav-link">Overall statistics</Link>
      <Link to={"/recomendation"} className="nav-link">Recommendations</Link>
    </div>
  } else if (width < 700) {
    navMenuHtml = 
    <div className="nav-menu-toggle" onClick={showToggledMenu} ref={navMenu}>
      <IoMenu/>
      <div className={`nav-menu-shown ${menuShown === false ? "hidden" : ""}`}>
        <Link to={"/bodyInfo"} className="nav-link">Body Info</Link>
        <Link to={"/dailyStat"} className="nav-link">Daily statistics</Link>
        <Link to={"/overallStat"} className="nav-link">Overall statistics</Link>
        <Link to={"/recomendation"} className="nav-link">Recommendations</Link>
      </div>
    </div>;
  }

  return (
    <div className={`nav-menu-wrapper`}>
      {navMenuHtml}
    </div>
    
  )
}

export default NavMenu;