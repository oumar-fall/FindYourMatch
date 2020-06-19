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
        d.wave = d.wave.replace(',', '');
        d.age = d.age.replace(',', '');

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
            .domain(d3.extent(rows, (row) => row.age_o))
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
                .attr("cx", (d) => x(d.age_o))
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


function drawCluster(){}

function onMouseOver(d, i){

}

function noCluster(){
  draw();
}

function Cluster(){
  drawCluster();
}

function showModal(d, i){
    modal.style.display = "flex";
}
