
//handles phase2
//exports the tab body component of phase2

import React, { useState, useEffect } from "react";
import { throttle } from 'lodash';
// import Phase2Form from './phase2Input';

 //a stage in the story
function StoryStage(props){
  return(
    <p>
      {props.stageTitle}
    </p>
  )
}

//encompasses the title and the 5 stages of the each
function Story(props){
  const storyStages = Object.values(props).slice(0, 5);
  const story = props[Object.keys(props).length - 1];

  return(
    <>    
      <h1>
        {story.storyPrompt}
      </h1>
      {storyStages.map(entry => <StoryStage {...entry} /> )}
    </>

  )
}

//the component of phase2
//it displays all the stories (and their stages),
// handles user input, and fetches more data 
//when the user scrolls
function TabBodyPhase2(){
    //list of entries to be retrieved
    const [data, setData] = useState([]);
    //throttles the scrolling, await fetching more data
    const [loading, setLoading] = useState(false);
    //set the story prompt of the data to be retrieved
    const [storyPrompt, setStoryPrompt] = useState("Story");
    //batches, each scroll is one batch, begins with one (a batch is a story)
    const [storyNumber, setStoryNumber] = useState(0);
    //to display error message if any
    const [error, setError] = useState(false);
    
    //async fetch data from the api.
    //called on page load and everytime the user
    //reaches a certain point in scrolling
    //newBatch is true when resetting the previous data, usually
    //when new story is generated is updated and the old data are obsolete
    const fetchInfo = async (newBatch=false) => {
      const phase2Url = `http://localhost:53955/${storyNumber}`;
      setLoading(true);
      try {
        const response = await fetch(phase2Url, {
          method: 'GET',
          credentials: 'include', //cookie
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        //reset data
        // if (newBatch){ setData([]); }
        
        //check if the response is valid
        if (response.ok) {
            //get the new data
            const newData = await response.json();
            //append them to the previous data
            setData((prevData) => [...prevData, ...newData]);
            //increment the story number
            setStoryNumber(prevNum => prevNum + 1);
          } else {
            setError(true);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
    }

    //fetch initial data and fetches data everytime the 
    useEffect(() => {
        fetchInfo(true);
    }, [])
    
    //event callback function used to fetch data 
    //when the user reaches a certain point in the page
    //it uses debounce to throttle calls to the api
    // const handleScroll = throttle(() => {
    //   const scrollHeight = document.documentElement.scrollHeight;
    //   const scrollTop = document.documentElement.scrollTop;
    //   const windowHeight = window.innerHeight;
    //   const scrollLimit = 1000;
    
    //   if (!loading && scrollTop + windowHeight >= (scrollHeight-scrollLimit)) {
    //     // console.log('At the bottom');
    //     fetchInfo();
    //   }
    // }, 200);

    //set the scrolling event
    // useEffect(() => {
    //   window.addEventListener('scroll', handleScroll);
    //   return () => {
    //     window.removeEventListener('scroll', handleScroll);
    //   };
    // }, [batch, loading]);
    
    //if the data are not loaded/being loaded
    if (error)
        return <h4>Failed to get data :(</h4>;
    else if (data.length === 0)
      return <h4>Loading...</h4>; //todo: loading icon
    
    return (
      <>
        {/* <Phase2Form storyPrompt={storyPrompt} setStoryPrompt={setStoryPrompt}/> */}
        <h4>One upon a time.....</h4>
        <hr/>
        {data.map(entry => <Story {...entry} key={entry.entryId}/>)}
      </>
    )
  }

  export {TabBodyPhase2};