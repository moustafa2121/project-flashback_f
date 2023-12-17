import React, { useState } from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import './style.css';
import { TabBodyPhase1 } from "./phase1Script";

//displays tabs' bodies
function TabBody(props){
  return(
    <section className={`tabBody 
      ${props.active ? "tabBodyActive" : "tabBodyInActive"}`}>
      {props.id_ === 1 ? <TabBodyPhase1 key={1}/>  : ''}
    </section>
  )
}

//displays all tabs' heads
function TabHead(props){
  return (
  <li className="nav-item">
    <a className={`nav-link 
      ${props.active ? "activeTab" : "inActiveTab"} 
      ${props.disabled ? "disabled" : ""}`}
        onClick={props.onClick}>
      {props.title}  
    </a>
  </li>)
}
//main componenet that returns the tabs' head and bodies
function Tabs(props){
  const [active, setActive] = useState(1);

  const tabsInfo = [
    {id_:1, title:"Throwback", 
      active: active === 1,
      onClick: () => setActive(1)},
    {id_:2, title:"Lens Into The Past", 
      active: active === 2,
      onClick: () => setActive(2)},
    {id_:3, title:"Phase3", 
    active: active === 3, disabled: true,
    onClick: () => setActive(3)},
  ]

  return (
    <>
      <nav>
        <ul className="nav" id="tabLst">
          {tabsInfo.map(tab => <TabHead {...tab} key={tab.id_}/>)}
        </ul>
      </nav>
      {tabsInfo.map(tab => <TabBody {...tab} key={tab.id_}/>)}
    </>
    )
}

//render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Tabs />);