//handles phase1 
//exports the tab body component of phase1
import './styles/style_card.css';

import { formatDateFromEpoch } from "./helper";
import React, { useState, useEffect } from "react";
import { throttle } from 'lodash';
import Phase1Form from './phase1Input';

//returns the icon of each card depending on the entry type
function CardIcon({entryType}){
    //since the icon within the card (and the card is clickable)
    //this prevents the from propgating the click to the parent
    //when the icon is clicked, thus we got to the icon's link
    const handleButtonClick = event => event.stopPropagation();
    let link, img;
    if (entryType === "RE"){
        link = "https://www.reddit.com/";
        img = <img className="cardIcon" src="3.png" alt="Avatar"></img>
    }
    else if(entryType === "NW"){
        link = "https://twitter.com/";
        img = <img className="cardIcon" src="1.png" alt="Avatar"></img>
    }
    else if (entryType === "ME"){
        link = "https://knowyourmeme.com/";
        img = <img className="cardIcon" src="2.png" alt="Avatar" style={{borderRadius:"50%"}}></img>
    }
    else if (entryType === "WK"){
        link = "https://www.wikipedia.org/"
        img = <img className="cardIcon" src="4.png" alt="Avatar"></img>
    }
    else if (entryType === "GA"){
        link = "https://www.imdb.com/"
        img = <img className="cardIcon" src="7.png" alt="Avatar"></img>
    }
    else if (entryType === "MV"){
        link = "https://www.imdb.com/"
        img = <img className="cardIcon" src="5.png" alt="Avatar"></img>
    }
    else if (entryType === "TV"){
        link = "https://www.imdb.com/"
        img = <img className="cardIcon" src="6.png" alt="Avatar"></img>
    }
    // else if (entryType === "SO"){
    //     link = "https://open.spotify.com/"
    //     img = <img className="cardIcon" src="8.png" alt="Avatar"></img>
    // }
    return(
        <a href={link} target="_blank" onClick={handleButtonClick} rel="noopener noreferrer">
            {img}
        </a>
    )
}
function CardTitle({date, url, title, summary, entryType}){
    const dateC = formatDateFromEpoch(date, entryType);
    console.log(entryType);
    let titleClassName = '';
    if (entryType === "WK" || entryType === "TV" || entryType === "MV")
        titleClassName = "cardTitle1";
    else if (entryType === "GA")
        titleClassName = "cardTitle2";
    const additional = summary === undefined ? '' : ": "+ summary;
    return(
        <div className="cardLeft">
            <div className="cardDate">{dateC}</div>
            <div className={`cardTitle ${titleClassName}`}>
                <p>{title}{additional}</p>
            </div>
        </div>
    )
}
//specialized card for embeded spotify link
function CardSpotify({url}){
    const match = url.match(/https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/)[1];
    const embedLink = `https://open.spotify.com/embed/track/${match}`;
    return(
        <article className="spotifyCard">
            <iframe  src={embedLink} title="spotifyTitle"
            frameBorder="0" allowtransparency="true" 
            allow="encrypted-media"></iframe>
        </article>
    )
}
//the component for the card (i.e. the card-like that displays each entry)
function Card(props){
    //fetch data based on the entry type of the card
    const gridTemplate = props.img ? "0% 75% 25%":"0% auto";
    if (props.entryType === "SO")
        return (<CardSpotify {...props}/>)
    else{
        return(
            <article className="card" style={{gridTemplateColumns: gridTemplate}} onClick={() => window.open(props.url, '_blank')}>
                <CardIcon {...props}/>
                <CardTitle {...props}/>
                {props.img ? 
                <div className="cardContainer">
                    <img className="cardImg" src={props.img} alt="Card"/> 
                </div>
                : ''}
            </article>
        )
    }
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
    //set the year of the data to be retrieved
    const [year, setYear] = useState(2000);
    
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
      <>
        <Phase1Form year={year} setTheYear={setYear}/>
        <h4>What the internet looked like in the year ... {year}</h4>
        <hr/>
        {data.map(entry => <Card {...entry} key={entry.entryId}/>)}
      </>
    )
  }

  export {TabBodyPhase1};