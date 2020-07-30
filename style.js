function changeContent() {
    var mydiv = document.getElementById("mainContent");
    mydiv.innerHTML = "";
    var aTag = document.createElement('a');
    // TODO: change this to the correct html -- the one that's not local
    aTag.setAttribute('href',"C:/Users/ThinkPad/Documents/2_Icecream_Programs/icecreamlollipop.github.io/EarthTimeline/EarthTimeline.html");
    aTag.innerText = "Timeline of Earth";
    mydiv.appendChild(aTag);
}
