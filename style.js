function changeToPortfolio() {
    var mydiv = document.getElementById("mainContent");
    mydiv.innerHTML = "";
    var myList1 = document.getElementById("list1");
    var myList2 = document.getElementById("list2");
    myList1.innerHTML = "";
    myList2.innerHTML = "";
    var par2 = document.getElementById("para2");
    par2.innerHTML="";

    var aTag = document.createElement('a');
    // TODO: change this to the correct html -- the one that's not local
    aTag.setAttribute('href',"https://icecreamlollipop.github.io/EarthTimeline.html");
    aTag.innerText = "Timeline of Earth";
    mydiv.appendChild(aTag);
}
