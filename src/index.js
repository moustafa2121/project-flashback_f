import React, { useState } from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Card(){
  return(
    <article className="card">
      <span>text</span>
    </article>
  )
}

function TabBody(props){
  return(
    <section className={`tabBody 
      ${props.active ? "tabBodyActive" : "tabBodyInActive"}`}>
      <Card />
      <Card />
    </section>
  )
}

function Tab(props){
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
function Tabs(props){
  const [active, setActive] = useState(1);

  const tabs = [
    {id_:1, title:"Throwback", 
      active: active === 1,
      onClick: () => { setActive(1);}},
    {id_:2, title:"Lens Into The Past", 
      active: active === 2,
      onClick: () => { setActive(2);}},
    {id_:3, title:"Phase3", 
    active: active === 3, disabled: true,
    onClick: () => { setActive(3);}},
  ]

  return (
    <>
      <nav>
        <ul className="nav" id="tabLst">
          {tabs.map(tab => <Tab {...tab} key={tab.id_}/>)}
        </ul>
      </nav>
      {tabs.map(tab => <TabBody {...tab} key={tab.id_}/>)}
    </>
    )
}

root.render(<Tabs />);