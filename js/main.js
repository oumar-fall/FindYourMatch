const canvas = document.getElementById('canvas');

const h = parseFloat(getComputedStyle(canvas).height);
const w = parseFloat(getComputedStyle(canvas).width);
const modal = document.getElementById("modal");
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

function noCluster(){
  draw();
}

function Cluster(){
  console.log("cluster !");
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
