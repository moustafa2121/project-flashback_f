//handles phase2
//exports the tab body component of phase2

import React, { useState, useEffect, useRef } from "react";
import { throttle } from 'lodash';
import './styles/stylePhase2.css';
import Phase2Form from './phase2Input';


 //a stage in the story
 //contains a div that contains the stage title,
 //stage image and stage contents
function StoryStage(props){
  //img URL
  const [imgSrc, setImgSrc] = useState(null);
  //fetch the image
  const fetchInfo = async () => {
    const imgUrl = `http://localhost:53955/getImage/${props.storyId}/${props.stageNumber}`;
    try {
      console.log("rquesting: ", imgUrl);
      const response = await fetch(imgUrl, {
        method: 'GET',
        credentials: 'include', //cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      //check if the response is valid
      if (response.ok) {
          const blob = await response.blob();
          setImgSrc(URL.createObjectURL(blob));        
      } else {
          console.error('Failed to fetch image');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      props.updateStagesActive(props.stageNumber-1, 1)
    }
  }
  //fetch images on load
  useEffect(()=> {
    fetchInfo();
  }, [])

  const cl = props.slideIndex === props.stageNumber ? 'storyStageActive' : '';
  const c2 = imgSrc === null ? 'displayNone' : '';
  const imgSrcUrl = imgSrc !== null ? imgSrc : 'loadingImg.jpg'
  return(
    <div className={`storyStage ${cl}`}>
      <h4 className={`storyStageTitle ${c2}`}>
        {props.stageNumber} - {props.stageTitle}
      </h4>
      <img src={imgSrcUrl} alt="stage img"></img>
      <p className={`storyStageStory ${c2}`}>
        {props.stageStory}
      </p>
    </div>
  )
}

function Dot({stageNumber, slideIndex, storyStagesActive, setSlideIndex}){
  const cl = slideIndex === stageNumber ? 'dotActive' : '';
  const c2 = storyStagesActive[stageNumber-1] === 1 ? 'dotLoaded' : '';
  return (
    <span className={`dot ${cl} ${c2}`} onClick={() => setSlideIndex(stageNumber)}></span>
  )
}

//encompasses the title and the 5 stages of the each
function Story(props){
  const storyStages = Object.values(props).slice(0, 5);
  const story = props[Object.keys(props).length - 1];
  
  const [storyStagesActive, setStoryStagesActive] = useState(() => Array.from({ length: storyStages.length }, () => 0));

  const updateStagesActive = (index, newValue) => {
    setStoryStagesActive(prevArray => {
      const newArrayCopy = [...prevArray];
      newArrayCopy[index] = newValue;
      return newArrayCopy;
    });
  };

  //handle the sliding of the iamges
  const [slideIndex, setSlideIndex] = useState(1);
  //next/prev button, inc/dec the slide value
  function plusSlides(n) {
    if (slideIndex >= storyStages.length && n === 1)
      setSlideIndex(1);
    else if (slideIndex === 1 && n === -1)
      setSlideIndex(storyStages.length);
    else
      setSlideIndex(prevIndex => prevIndex += n);
  }

  return(
    <article className="storyArticle" id={story.storyId}>
      <h3 className="storyArticleTitle">
        {story.storyPrompt}
      </h3>
      <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
      <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>
      {storyStages.map(entry => <StoryStage {...entry} storyStagesActive={storyStagesActive} updateStagesActive={updateStagesActive} storyId={story.storyId} slideIndex={slideIndex} key={entry.stageNumber}/> )}
      <div className="dotCotnainer">
        {storyStages.map(dot => <Dot {...dot} storyStagesActive={storyStagesActive} slideIndex={slideIndex} setSlideIndex={setSlideIndex} key={dot.stageNumber}/>)}
      </div>
    </article>
  )
}

//it displays all the old stories (and their stages),
//fetches more data when the user scrolls
function OldStories(){
//list of entries to be retrieved
    const [data, setData] = useState([]);
    //throttles the scrolling, await fetching more data
    const [loading, setLoading] = useState(false);
    //batches, each scroll is one batch, begins with one (a batch is a story)
    const [storyNumber, setStoryNumber] = useState(0);
    //to display error message if any
    const [error, setError] = useState(false);
    //if the server does not return anymore stories, this variable will stop further requests
    const [noMoreStories, setNoMoreStories] = useState(false);

    //async fetch data from the api.
    //called on page load and everytime the user
    //reaches a certain point in scrolling
    //newBatch is true when resetting the previous data, usually
    //when new story is generated is updated and the old data are obsolete
    const fetchInfo = async () => {
      if (noMoreStories)
        return;
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
        //check if the response is valid
        if (response.ok) {
            //get the new data
            const newData = await response.json();
            //append them to the previous data
            setData((prevData) => [...prevData, ...newData]);
            //increment the story number
            setStoryNumber((prevNum) => prevNum + 1);
          } else if (response.status === 404) {//no more stories
            // console.error('Not Found:', response.statusText);
            setNoMoreStories(true);
          } else {
            setError(true);
          }
        } catch (errorReq) {
          console.error('Error fetching data:', errorReq);
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

    // set the scrolling event
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [storyNumber, loading]);

    //if the data are not loaded/being loaded
    if (error)
        return <h4>Failed to get data :(</h4>;
    else if (data.length === 0)
      return <h4>Loading...</h4>; //todo: loading icon
    
    return (
      <>
        {data.map(entry => <Story {...entry} key={entry.entryId}/>)}
      </>
    )
}

function CurrentStory({storyPrompt}){
  const isFirstRender = useRef(true)
  const [renderComponent, setRenderComponent] = useState(<p>olo</p>);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    console.log("Start");
    const fetchInfo = async () => {
      const fetchUrl = `http://localhost:53955/makeRequest/${storyPrompt}`;
      try {
        const response = await fetch(fetchUrl, {
          method: 'GET',
          credentials: 'include', //cookie
          headers: {
            'Content-Type': 'application/json',
          },
        });
        //check if the response is valid
        if (response.ok) {
            //get the new data
            const newData = await response.json();
            console.log("-----",newData[0]);
            setRenderComponent(<Story {...newData[0]} />);
            // //append them to the previous data
            // setData((prevData) => [...prevData, ...newData]);
          } else if (response.status === 404) {//no more stories
            console.error('Not Found:', response.statusText);
          } 
        } catch (errorReq) {
          console.error('Error fetching data:', errorReq);
        } finally {
        }
    }
    
    fetchInfo();    

  }, [storyPrompt]);

  return renderComponent;
}

//the component of phase2
//it displays all the stories (and their stages),
// handles user input, and fetches more data 
//when the user scrolls
function TabBodyPhase2(){
    //set the story prompt of the data to be retrieved
    const [storyPrompt, setStoryPrompt] = useState("Story");

    return(
      <>
        <Phase2Form setStoryPrompt={setStoryPrompt}/>
        <CurrentStory storyPrompt={storyPrompt}/>
        <h4>One upon a time.....</h4>
        <hr/>
        {/* <OldStories key={'stories'}/> */}
      </>
    )
}

  

export {TabBodyPhase2};


/*
const eventSource = new EventSource('http://localhost:53955/sse-endpoint');

    eventSource.onmessage = (event) => {
      console.log(event.data);
      // const stageData = JSON.parse(event.data);
      // console.log(stageData);
    };

    eventSource.onerror = (error) => {
      console.error('Error with SSE:', error);
      eventSource.close();
    };

    return () => {
      console.log('Cleanup: Closing EventSource');
      eventSource.close();
    };
*/