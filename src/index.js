import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

function formatDateFromEpoch(epoch, entryType) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const date = new Date(epoch * 1000);
  if (entryType === "RE")
    return `${months[date.getMonth()]}, ${date.getFullYear()}`;
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
function getCardDesign(entryType, epoch) {
  if (entryType === "RE")
    return {icon:"3.png", bg:'repeating-linear-gradient(-30deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.1) 3px, rgba(40,44,52,0.5) 2px, rgba(40,44,52,0.5) 10px)', link:"https://www.reddit.com/", date:formatDateFromEpoch(epoch, entryType)}
  else if(entryType === "NW")
    return {icon:"1.png", bg:'repeating-linear-gradient(-30deg, rgba(29, 161, 242, 0.2), rgba(29, 161, 242, 0.2) 3px, rgba(40,44,52,0.5) 2px, rgba(40,44,52,0.5) 10px)', link:"https://twitter.com/", date:formatDateFromEpoch(epoch, entryType)}
  else if (entryType === "ME")
    return {icon:"2.png", bg:'repeating-linear-gradient(-30deg, rgba(100, 100, 100, 0.2), rgba(100, 100, 100, 0.2) 3px, rgba(40,44,52,0.5) 2px, rgba(40,44,52,0.5) 10px)', link:"https://knowyourmeme.com/", date:formatDateFromEpoch(epoch, entryType)}
}

function Card(props){
  const cardDesign = getCardDesign(props.entryType, props.date)
  return(
    <article className="card" style={{ background: cardDesign.bg }}>
      <a href={cardDesign.link} target="_blank">
        <img className="cardIcon" src={cardDesign.icon} alt="Avatar"></img>
      </a>
      <div className="cardTitle">
        <a target="_blank" href={props.url}><p>{props.title}</p></a>
      </div>
      <div className="cardRight">
        <div className="cardDate">{cardDesign.date}</div>
        {props.img ? <img className="cardImg" src={props.img} alt="Card Image" /> : ''}
      </div>
    </article>
  )
}
function TabBodyPhase1(){
  const [data, setData] = useState([]);
  const fetchInfo = () => {
    const testUrl = 'http://localhost:55351/2012';
    return fetch(testUrl,
      { method: 'GET',
        credentials: 'include',//cookie
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };
  
  useEffect(() => {
    fetchInfo();
  }, [])
  //todo: return to clean up?
  
  if (data.length === 0) {
    return <div>Loading...</div>; // or another loading indicator
  }

  return (
    <>    
      {data.map(d => <Card {...d}/>)}
    </>

  )
}

//todo: the tab body need to be mroe modular (not just for phase1)
function TabBody(props){
  return(
    <section className={`tabBody 
      ${props.active ? "tabBodyActive" : "tabBodyInActive"}`}>
      {props.id_ === 1 ? <TabBodyPhase1 />  : ''}
    </section>
  )
}

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

root.render(<Tabs />);