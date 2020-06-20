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
  var relationships = createRelationships();
  g.selectAll("circle")
              .data(dataset)
              .enter().append("circle")
              .attr("r", 2)
              .attr("cx", (d) => compute_cluster_x(d))
              .attr("cy", (d) => compute_cluster_y(d))
              .attr("fill", (d) => color(d.gender))
              .attr("class", "data-entry")
              .on("click", showModal)
              .on("mouseover",function(d){textarea.innerHTML =d.age + ", " + d.field + ", " + d.income + " position " + compute_cluster_x(d) + " " + compute_cluster_y(d)});
  var line = d3.line()
  .x(function (d) { return d.x; })
  .y(function (d) { return d.y; });

  for (var i=0; i < relationships.length; i++) {
    svg.append("path")
      .attr("class", "plot")
      .datum(relationships[i])
      .attr("d", line);
    }
  }

function onMouseOver(d, i){

}

function match(d){
  if (d.match == "1"){
    return(d.pid);
  }
}

function createRelationships(){
  console.log(dataset.length);
  var r = [];
  for (let i = 0; i < dataset.length; i++){
    var d = dataset[i];
    var id = match(d);
    if (id){
      var rel_i = i;
      while ((rel_i < dataset.length-1) && (d.wave == dataset[rel_i].wave) && (id != dataset[rel_i].iid)){
        rel_i = rel_i + 1;
      }
      if(id == dataset[rel_i].iid){
        var rel = dataset[rel_i];
        console.log(rel.wave + "/" + d.wave);
        var relation = [{"x":compute_cluster_x(d), "y":compute_cluster_y(d)}, {"x":compute_cluster_x(rel), "y":compute_cluster_y(rel)}];
        r.push(relation);
      }
    }
  }
  return(r);
}

function compute_cluster_y(d){
  var angle = 2*Math.PI*d.idg/(d.round*2);
  var mod = (d.age-10)*3;
  return( h/3*(1+(d.wave % 2)) + mod*Math.sin(angle));
}

function compute_cluster_x(d){
  var angle = 2*Math.PI*d.idg/(d.round*2);
  var mod = (d.age-10)*3;
  return(w/23*d.wave + mod*Math.cos(angle));
}

function color(int){
  switch(int){
		case "0":
			return("rgb(245,166,241)");
		case "1":
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

function showModal(d, i){
    modal.style.display = "flex";
}
