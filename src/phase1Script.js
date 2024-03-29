//handles phase1: Throwback
//shows posts/movies/news/memes/shows/music from the given year
//currently only shows for the years 2000-2023
import './styles/stylePhase1.css';

import { formatDateFromEpoch, fetchData, BaseUrl } from "./helper";
import React, { useState, useEffect } from "react";
import { throttle } from 'lodash';
import Phase1Form from './phase1Input';

//returns the icon of each card depending on the entry type
function CardIcon({entryType}){
  //since the icon is within the card (and the card is clickable)
  //this lines prevents propgating the click to the parent
  //when the icon is clicked, thus we just get to the icon's link
  const handleButtonClick = event => event.stopPropagation();

  //get the link and img based on the entry type of the card
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
  return(
    <a href={link} target="_blank" onClick={handleButtonClick} rel="noopener noreferrer">
        {img}
    </a>
  )
}

//handles the card date (if available) and the card text contents
function CardTitle({date, title, summary, entryType}){
  const dateProper = formatDateFromEpoch(date, entryType);
  let titleClassName = '';
  //determine the how the title/text is displayed based on the entry type
  if (entryType === "WK" || entryType === "TV" || entryType === "MV" || entryType === "ME")
    titleClassName = "cardTitle1";
  else if (entryType === "GA")
    titleClassName = "cardTitle2";
  const additional = summary === undefined ? '' : ": "+ summary;
  return(
    <div className="cardLeft">
        <div className="cardDate">{dateProper}</div>
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
  //set the grid template if the card has an image or not
  //the initial 0% is for the floating (absolute) logo of the card on top-left
  const gridTemplate = props.img ? "0% 75% 25%" : "0% auto";

  //since spotify data are embeded, they are a big different than other cards
  if (props.entryType === "SO")
    return (<CardSpotify {...props}/>)
  else{
    return(
      <article className="card" style={{gridTemplateColumns: gridTemplate}} onClick={() => window.open(props.url, '_blank')}>
        <CardIcon {...props}/>
        <CardTitle {...props}/>
        {props.img ? 
          <div className="imgContainer">
              <img className="cardImg" src={props.img} alt="Card"/> 
          </div>
        : ''}
      </article>
    )
  }
}

//the component of phase1
//it displays all the cards, handles user input, and fetches more data 
//when the user scrolls
function TabBodyPhase1(){
  //list of entries to be retrieved
  const [data, setData] = useState([]);
  //throttles the scrolling, await fetching more data
  const [fetchingData, setFetchingData] = useState(false);
  //set the year of the data to be retrieved
  const [year, setYear] = useState(2008);
  //batches, each scroll is one batch, begins with one
  //the backend specifies the size of each batch
  const [batch, setbatch] = useState(1);
  //to display error message, if any
  const [error, setError] = useState(false);
  const [tooManyRequests, setTooManyRequests] = useState(false);
  //if the server does not return anymore stories, this variable will stop further requests
  const [noMoreEntries, setNoMoreEntries] = useState(false);

  //async fetch data from the api.
  //called on page load and everytime the user
  //reaches a certain point in scrolling
  //newBatch is true when resetting the previous data, usually
  //when the year is updated and the old data are set to null
  const fetchInfo = async (newBatch=false) => {
    if (noMoreEntries)
      return;
    const phase1Url = BaseUrl.phase1 + `${year}/${batch}`;
    setFetchingData(true);
    try {
      const response = await fetchData(phase1Url);

      //reset data if a new batch
      if (newBatch){ setData([]); }

      //check if the response is valid
      if (response.ok) {
        //get the new data
        const newData = await response.json();
        //append them to the previous data
        setData(prevData => [...prevData, ...newData]);
        //increment the batch number
        setbatch(prevBatch => prevBatch + 1);
      } else if (response.status === 404) {//no more entries
        setNoMoreEntries(true);
      } else if (response.status === 429) {//too many requests
        setTooManyRequests(true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetchingData(false);
    }
  }

  //fetch initial data and fetches data everytime the 
  //year is updated (usually by the user's input in Phase1Form)
  useEffect(() => {
    fetchInfo(true);
  }, [year])
  
  
  //set the scrolling event (for infinite scrolling effect)
  useEffect(() => {
    //event callback function used to fetch data 
    //when the user reaches a certain point in the page
    //it uses debounce to throttle calls to the api
    const handleScroll = throttle(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const scrollLimit = 1000;
      if (!fetchingData && scrollTop + windowHeight >= (scrollHeight-scrollLimit)){
        fetchInfo();
        if (setNoMoreEntries)//remove the scrolling if no more entries
          window.removeEventListener('scroll', handleScroll);
      }
    }, 200);

    window.addEventListener('scroll', handleScroll);
    return () => {//clean up
      window.removeEventListener('scroll', handleScroll);
    };
    //setting [batch, fetching] data prevents duplicating 
    //data that are fetched, not sure how
  }, [batch, fetchingData]);
  
  //if the data are not loaded/being loaded
  if (tooManyRequests)
      return <h4>Too many requests....</h4>;
  else if (error)
      return <h4>Failed to get data :(</h4>;
  else if (data.length === 0)
    return <h4>Loading...</h4>; //todo: loading icon
  
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