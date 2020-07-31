function changeContent() {
    var mydiv = document.getElementById("mainContent");
    mydiv.innerHTML = "";
    var aTag = document.createElement('a');
    // TODO: change this to the correct html -- the one that's not local
    aTag.setAttribute('href',"https://icecreamlollipop.github.io/EarthTimeline.html");
    aTag.innerText = "Timeline of Earth";
    mydiv.appendChild(aTag);
}
