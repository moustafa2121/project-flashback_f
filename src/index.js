//the main script, calls on different phases of the webapp
import React, { useState } from "react";
import ReactDOM from 'react-dom/client';
import './styles/style.css';
import { TabBodyPhase1 } from "./phase1Script";
import { TabBodyPhase2 } from "./phase2Script";

//displays tabs' bodies (each body is a phase, stand-alone app)
//as if currently, each phase is loaded when the tab is clicked on
//meaning each time the user switches between a phase it 'resets'
//the only reason for this is stop users from overloading the backend
function TabBody(props){
  return (
    <section className={`tabBody ${props.active ? "tabBodyActive" : "tabBodyInActive"}`}>
      {props.id_ === 1 && props.active ? <TabBodyPhase1 key={1} /> : ''}
      {props.id_ === 2 && props.active ? <TabBodyPhase2 key={2} /> : ''}
    </section>
  );
}

//displays a tab head, clicking on a tab head will
//switch between different phases
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
//each tab (head + body) is called a phase: a stand-alone app
//that provides unique features different from other tabs/phases
function Tabs(){
  //which tab is active
  const [activeTab, setActiveTab] = useState(2);

  //data specifying each tab
  const tabsInfo = [
    {id_:1, title:"Throwback", 
      active: activeTab === 1,
      onClick: () => setActiveTab(1)},
    {id_:2, title:"Lens Into The Past", 
      active: activeTab === 2,
      onClick: () => setActiveTab(2)},
    {id_:3, title:"Newspaper Clippings", 
    active: activeTab === 3, disabled: true,
    onClick: () => setActiveTab(3)},
  ]

  //get the tab heads and tab bodies
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