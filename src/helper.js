//helper functions script

//handles the jump to top button
const _ = (()=>{
    const topButton = document.getElementById("jumpTopBtn");
    topButton.style.display = "none";
    const scrollPoint = 200;
    //shows the button at certain point
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
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  export {formatDateFromEpoch};