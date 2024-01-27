//helper functions script

import React from 'react';

//basic fetch of data from a url
async function fetchData(url){
    return fetch(url, {
        method: 'GET',
        credentials: 'include', //cookie
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

//submit button icon
function SubmitButton(){
    return(
    <button type="submit">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock-history" viewBox="0 0 16 16">
        <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483m.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535m-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
        <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
        <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
      </svg>
      </button>
    )
}

//button that handles the jump to top
(() => {
    const topButton = document.getElementById("jumpTopBtn");
    topButton.style.display = "none";
    const scrollPoint = 200;
    //shows the button at certain point when scrolling
    window.onscroll = () => {
        if (document.body.scrollTop > scrollPoint || document.documentElement.scrollTop > scrollPoint)
            topButton.style.display = "block";
        else
            topButton.style.display = "none";
    }
    topButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        topButton.style.display = "none";
    });
})();

//takes epoch and returns the date string based on the entry type
function formatDateFromEpoch(epoch, entryType) {
    if (epoch === 0)
        return ''
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const date = new Date(epoch * 1000);
    if (entryType === "RE")
      return `${months[date.getMonth()]}, ${date.getFullYear()}`;
    else if (entryType === "ME")
        return ''
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  export {formatDateFromEpoch, fetchData, SubmitButton};