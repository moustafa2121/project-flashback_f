//handles phase1 
//exports the tab body component of phase1

import { formatDateFromEpoch } from "./helper";
import React, { useState, useEffect } from "react";
import { throttle } from 'lodash';

//given an entry type (i.e. RE for reddit), it returns specific
//format to display data for each entry (e.g. icon, color, others)
function getCardDesign(entryType, epoch, img) {
    const base = { gridTemplate: img ? "0% 70% auto":"0% auto auto",
                date:formatDateFromEpoch(epoch, entryType)}
    //todo: remove the bg values, we are not using them
    if (entryType === "RE")
      return {...base, icon:"3.png", bg:'repeating-linear-gradient(-30deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.1) 3px, rgba(40,44,52,0.5) 2px, rgba(40,44,52,0.5) 10px)', link:"https://www.reddit.com/",}
    else if(entryType === "NW")
      return {...base, icon:"1.png", bg:'repeating-linear-gradient(-30deg, rgba(29, 161, 242, 0.2), rgba(29, 161, 242, 0.2) 3px, rgba(40,44,52,0.5) 2px, rgba(40,44,52,0.5) 10px)', link:"https://twitter.com/",}
    else if (entryType === "ME")
      return {...base, icon:"2.png", bg:'repeating-linear-gradient(-30deg, rgba(100, 100, 100, 0.2), rgba(100, 100, 100, 0.2) 3px, rgba(40,44,52,0.5) 2px, rgba(40,44,52,0.5) 10px)', link:"https://knowyourmeme.com/", borderRadius:"50%"}
}

//the component for the card (i.e. the card-like that displays each entry)
function Card(props){
    //fetch data based on the entry type of the card
    const cardDesign = getCardDesign(props.entryType, props.date, props.img)
    return(
    <article className="card" style={{ background: "#222224", gridTemplateColumns: `${cardDesign.gridTemplate}`}}>
        <a href={cardDesign.link} target="_blank">
            <img className="cardIcon" src={cardDesign.icon} alt="Avatar" style={{borderRadius:`${cardDesign.borderRadius}`}}></img>
        </a>
        <div className="cardLeft">
            <div className="cardDate">{cardDesign.date}</div>
            <div className="cardTitle">
                <a target="_blank" href={props.url}><p>{props.title}</p></a>
            </div>
        </div>
        {props.img ? <img className="cardImg" src={props.img} alt="Card Image"/> : ''}
    </article>
    )
}

//the component of phase1
//it displays all the cards, handles user input, and fetches more data 
//when the iser scrolls
function TabBodyPhase1(){
    //list of entries to be retrieved
    const [data, setData] = useState([]);
    //batches, each scroll is one batch, begins with one
    const [batch, setbatch] = useState(1);
    //throttles the scrolling, await fetching more data
    const [loading, setLoading] = useState(false);
    
    //async fetch data from the api.
    //called on page load and everytime the user
    //reaches a certain point in scrolling
    const fetchInfo = async () => {
      console.log(batch);
      const phase1Url = `http://localhost:55351/2012/${batch}`;
      setLoading(true);
      try {
        const response = await fetch(phase1Url, {
          method: 'GET',
          credentials: 'include', //cookie
          headers: {
            'Content-Type': 'application/json',
          },
        });
        //get the new data
        const newData = await response.json();
        //append them to the previous data
        setData(prevData => [...prevData, ...newData]);
        //increment the batch
        setbatch(prevBatch => prevBatch + 1);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    //fetch initial data
    useEffect(() => {
      fetchInfo();
    }, [])
    
    //event callback function used to fetch data 
    //when the user reaches a certain point in the page
    //it uses debounce to throttle calls to the api
    const handleScroll = throttle(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const scrollLimit = 1000;
    
      if (!loading && scrollTop + windowHeight >= (scrollHeight-scrollLimit)) {
        console.log('At the bottom');
        fetchInfo();
      }
    }, 200);

    //set the scrolling event
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [batch, loading]);
    
    //if the data are not loaded/being loaded
    if (data.length === 0)
      return <div>Loading...</div>; //todo: loading icon
  
    return (
      <>{data.map(entry => <Card {...entry} key={entry.entryId}/>)}</>
    )
  }

  export {TabBodyPhase1};