const canvas = document.getElementById('canvas');

const h = parseFloat(getComputedStyle(canvas).height);
const w = parseFloat(getComputedStyle(canvas).width);
const modal = document.getElementById("modal");
let x, y, zoomState;
let dataset = [];

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
                .on("click", showModal);

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
              .on("click", showModal);
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
    var div = document.createElement(div);
    div.innerHTML = "<p>Audio settings:</p> <div> <input type='range' list='tickmarks'id='age' name='age' min='0' max='11' oninput = 'voir1(age.value)'> <label for='volume'>Age</label> <br> <br> </div> <div><input type='range' id='cowbell' name='cowbell' list='tickmarks2' min='0' max='100' value='90' step='10' oninput = 'voir1(volume.value)'> <label for='cowbell'>Cowbell</label></div>";
    divtext.appendChild(div);
}

function voir1(nom){
    console.log(nom);
}

function voir2(nom){
    console.log(nom);
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

function showModal(d, i){
    modal.style.display = "flex";
}

function Filter(){
    console.log("filter");
    drawFilter();
}
