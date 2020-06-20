const canvas = document.getElementById('canvas');

const h = parseFloat(getComputedStyle(canvas).height);
const w = parseFloat(getComputedStyle(canvas).width);
const modal = document.getElementById("modal");
var agemax = 55;
var agemin = 18;
var current_sexe = 0;
var current_race = 1;
let x, y, zoomState;
let dataset = [];
const races = [
    "Black/African American",
	"European/Caucasian-American",
	"Latino/Hispanic American",
	"Asian/Pacific Islander/Asian-American",
	"Native American",
	"Other"
]

let svg = d3.select("#canvas")
            .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("viewBox", [0, 0, w,  h])
                .attr("class", "mainSvg")

var xAxis, yAxis, gX, gY;


d3.csv("data/SpeedDating.csv")
    .row( (d, i) => {
        d.income = d.income.replace(',', '');
        d.zipcode = d.zipcode.replace(',', '');

        return d;
    })
    .get( (err, rows) => {
        console.log("Loaded " + rows.length + " rows");
        if (rows.length > 0) {
            console.log("First row: ");
            console.log(rows[0]);
            console.log("Last row: ");
            console.log(rows[rows.length-1]);
        }
        dataset = rows;
        x = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.age))
            .range([0, w]);
        y = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.income))
            .range([0, h]);

        draw();
    });


function draw() {
    svg.selectAll("*").remove();
    var g = svg.append('g');
    g.selectAll("circle")
                .data(dataset)
            .enter().append("circle")
                .attr("r", 1)
                .attr("cx", (d) => x(d.age))
                .attr("cy", (d) => y(d.income))
                .attr("fill", "red")
                .attr("class", "data-entry")
                .on("click", (d) => showModal(d));

    zoomed(g)
    zoom = d3.zoom()
                .scaleExtent([1, 10])
                .on("zoom", () => zoomed(g));

    svg.call(zoom)

    xAxis = d3.axisBottom(x)
            .ticks(10)
            .tickSize(10)
            .tickPadding(5);
    yAxis = d3.axisRight(y)
            .ticks(10)
            .tickSize(10)
            .tickPadding(5);

    gX = svg.append('g')
    .attr("class", "x axis")
    .attr("transform" , "translate(0, " + (h) + ")")
    gX.call(xAxis)
        .insert("rect", ":first-child")
            .attr("class", "bg")
            .attr("height", "100%")
            .attr("width", "100%")
    gY = svg.append('g')
    .attr("class", "y axis")
    .attr("transform", "translate(" + (w) + ", 0)")
    gY.call(yAxis)
        .insert("rect", ":first-child")
            .attr("class", "bg")
            .attr("height", "100%")
            .attr("width", "100%")
}

function zoomed(g){
    if (d3.event){
        zoomState = d3.event.transform;
    }
    if (zoomState){
        g.attr("transform", zoomState);

        gX.call(xAxis.scale(zoomState.rescaleX(x)));
        gY.call(yAxis.scale(zoomState.rescaleY(y)));
    }
}


function drawCluster(){
  svg.selectAll("*").remove();
  var g = svg.append('g');
  g.selectAll("circle")
              .data(dataset)
              .enter().append("circle")
              .attr("r", 2)
              .attr("cx", (d) => w/23*d.wave + compute_cluster_x(2*Math.PI*d.idg/(d.round*2), (d.age-10)*3))
              .attr("cy", (d) => h/3*(1+(d.wave % 2)) + compute_cluster_y(2*Math.PI*d.idg/(d.round*2), (d.age-10)*3))
              .attr("fill", (d) => color(d.gender))
              .attr("class", "data-entry")
              .on("click", (d) => showModal(d));
}

function onMouseOver(d, i){

}

function compute_cluster_y(angle, module){
  return(module*Math.cos(angle));
}

function compute_cluster_x(angle, module){
  return(module*Math.sin(angle));
}

function color(int){
  switch(int){
		case "1":
			return("rgb(245,166,241)");
		case "0":
			return("rgb(83,80,242)");
    }
}
function drawFilter(){
    svg.selectAll("*").remove();
    var divtext  = document.getElementById("textdiv");
    var p = document.createElement("p");
    p.innerHTML = "Vous souhaitez trouver le type de personne qui vous convient ? Rentrez vos caractéristiques (approximatives) et nous vous montrerons avec qui les personnes qui vous ressemblent ont matché.";
    divtext.appendChild(p);
    var div = document.createElement(div);
    div.innerHTML = "Décrivez vous : <div> <input type='range' list='tickmarks'id='age' name='age' min='18' max='55' oninput = 'ageMax(age.value)'> <label for='volume'>Age Max </label> <br> <br> </div> <div><input type='range' id='agem' name='agem' list='tickmarks2' min='18' max='55'  oninput = 'ageMin(agem.value)'> <label for='cowbell'>Age Min </label> <br> <br> </div> Sexe : <div><input type='radio' id='F' name='sexe' value='F' onclick='sexe(F.value)' checked><label for='F'> F</label></div> <div><input type='radio' id='M' name='sexe' value='M' onclick='sexe(M.value)'> <label for='M'>M</label></div> <br> <br> Race :<div><input type='radio' id='race1' name='race' value='1' onclick='race(race1.value)'checked><label for='race1'> Black/African American </label></div> <div><input type='radio' id='race2' name='race' value='2' onclick='race(race2.value)'><label for='race2'> European/Caucasian-American </label></div> <div><input type='radio' id='race3' name='race' value='3' onclick='race(race3.value)'checked ><label for='race3'> Latino/Hispanic American </label></div> <div><input type='radio' id='race4' name='race' value='4' onclick='race(race4.value)'checked><label for='race4'> Asian/Pacific Islander/Asian-American </label></div>  <div><input type='radio' id='race5' name='race' value='5'checked onclick='race(race5.value)'><label for='race5'> Native American </label></div>  <div><input type='radio' id='race6' name='race' value='6' onclick='race(race6.value)'checked><label for='race6'> Other </label></div>  ";
    divtext.appendChild(div);

}
function visible(age,race,genre){
    if(genre == current_sexe) {
        if (age<agemax && age>agemin && current_race==race){
            return("visible");
        }
        else {
            return("hidden");
        }
    }
    if(genre!= current_sexe){
        return("visible");
    }
   
    
}

function afficherFilter(){
    svg.selectAll("*").remove();
    var g = svg.append('g');
    g.selectAll("circle")
                .data(dataset)
                .enter().append("circle")
                .attr("r", 2)
                .attr("cx", (d) => w/23*d.wave + compute_cluster_x(2*Math.PI*d.idg/(d.round*2), (d.age-10)*3))
                .attr("cy", (d) => h/3*(1+(d.wave % 2)) + compute_cluster_y(2*Math.PI*d.idg/(d.round*2), (d.age-10)*3))
                .attr("fill", (d) => color(d.gender))
                .attr("visibility",(d) => visible(d.age,d.race,d.gender))
                .attr("class", "data-entry")
                .on("click", showModal);
}
function ageMax(nom){
    agemax = parseInt(nom);
    console.log(nom);
    afficherFilter();  
  }

function ageMin(nom){
    agemin = parseInt(nom);
    console.log(agemin);
    afficherFilter();
}


function noCluster(){
  var div = document.getElementById("textdiv");
  var myNode = document.getElementById("textdiv");
 while (myNode.firstChild) {
       myNode.removeChild(myNode.firstChild);
}

  draw();
}

function Cluster(){
  console.log("cluster !");
  var div = document.getElementById("textdiv");
  var myNode = document.getElementById("textdiv");
 while (myNode.firstChild) {
       myNode.removeChild(myNode.firstChild);
}
  drawCluster();
}

function getGender(id) {
    return dataset.find(function(x) {
        return x.iid == id;
    }).gender;

}

function showModal(d){
    var id = d.iid;
    modal.style.display = "flex";

    addModalInfos(d);

    var meetings = dataset.filter(function(x) {return x.iid == id});
    for (var i in meetings){
        var item = {};
        item.gender = (getGender(meetings[i].pid)==1)? "man" : "woman";
        item.id = meetings[i].pid;
        if (meetings[i].match == 1) {
            addModalMatchItem(item);
        }
        else {
            addModalNoMatchItem(item);
        }
    }
}
function closeModal() {
    modal.innerHTML = '<div class="modal-container"><div id="modal-close" onclick="closeModal()">X</div><div class="modal-content" id="modal-infos"><span class="modal-title" id="modal-infos-id"></span><div class="modal-content" id="modal-infos-details"><img id="modal-infos-img" src="media/man.svg" alt=""><div class="modal-content modal-content-2" id="modal-infos-details-text"><span class="modal-infos-details-span" id="modal-infos-age"></span><span class="modal-infos-details-span" id="modal-infos-from"></span><span class="modal-infos-details-span" id="modal-infos-race"></span><span class="modal-infos-details-span" id="modal-infos-field"></span><span class="modal-infos-details-span" id="modal-infos-income"></span><span class="modal-infos-details-span" id="modal-infos-undergraduate"></span></div></div></div><div class="modal-content" id="modal-matchs"><div class="modal-content modal-content-2" id="modal-match"><span class="modal-title" id="modal-match-title">Match</span> </div><div class="modal-content modal-content-2" id="modal-nomatch"><span class="modal-title" id="modal-nomatch-title">No Match</span></div></div><div class="modal-content" id="modal-graphic"></div></div>'
    modal.style.display = "none";
}

function addModalMatchItem(item) {
    var itemDiv = document.createElement('div');
    itemDiv.classList.add("modal-match-item");
    itemDiv.onclick = () => {
        closeModal();
        showModal(item.id);
    }

    var itemImg = document.createElement('img');
    itemImg.src = "media/" + item.gender + ".svg";
    itemImg.alt = item.gender;
    itemImg.classList.add("modal-match-item-img");

    var itemSpan = document.createElement('span');
    itemSpan.classList.add("modal-match-item-span");
    itemSpan.innerText = item.id;

    itemDiv.appendChild(itemImg);
    itemDiv.appendChild(itemSpan);
    document.getElementById("modal-match").appendChild(itemDiv);
}
function addModalNoMatchItem(item) {
    var itemDiv = document.createElement('div');
    itemDiv.classList.add("modal-match-item");
    itemDiv.onclick = () => {
        closeModal();
        showModal(item.id);
    }

    var itemImg = document.createElement('img');
    itemImg.src = "media/" + item.gender + ".svg";
    itemImg.alt = item.gender;
    itemImg.classList.add("modal-match-item-img");

    var itemSpan = document.createElement('span');
    itemSpan.classList.add("modal-match-item-span");
    itemSpan.innerText = item.id;

    itemDiv.appendChild(itemImg);
    itemDiv.appendChild(itemSpan);
    document.getElementById("modal-nomatch").appendChild(itemDiv);
}

function addModalInfos(d) {
    document.getElementById("modal-infos-id").innerHTML = "<strong>ID : </strong><em>" + d.iid + "</em>";
    document.getElementById("modal-infos-age").innerHTML = "<strong>Age : </strong><em>" + d.age + "</em>";
    document.getElementById("modal-infos-from").innerHTML = "<strong>From : </strong><em>" + d.from + "</em>";
    document.getElementById("modal-infos-race").innerHTML = "<strong>Race : </strong><em>" + races[d.race-1] + "</em>";
    document.getElementById("modal-infos-field").innerHTML = "<strong>Field of studies : </strong><em>" + d.field + "</em>";
    document.getElementById("modal-infos-undergraduate").innerHTML = "<strong>Undergraduate School : </strong><em>" + d.undergra + "</em>";
    document.getElementById("modal-infos-income").innerHTML = "<strong>Income : </strong><em>" + d.income + "</em>";
    document.getElementById("modal-infos-img").src = "media/" + ((d.gender==1)? "man" : "woman") + ".svg";
}

function Filter(){
    console.log("filter");

    

    drawFilter();
    
}

function sexe(nom){
    if (nom=='F'){
        current_sexe = 0;
    }
    else {
        current_sexe = 1;
    }
    console.log(current_sexe);
    afficherFilter();
}

function race(nom){
    current_race = nom;
    console.log(current_race);
    afficherFilter();
}
