const canvas = document.getElementById('canvas');

const h = parseFloat(getComputedStyle(canvas).height);
const w = parseFloat(getComputedStyle(canvas).width);
const modal = document.getElementById("modal");
var agemax = 55;
var agemin = 18;
var current_sexe = 0;
var current_race = 1;
var current_study = 1;
var all_study = true;
var all_race = true;
var personnesress = [];
let xA, yO, zoomState;
let dataset = [], user_dataset = [];
const races = [
    "Black/African American",
	"European/Caucasian-American",
	"Latino/Hispanic American",
	"Asian/Pacific Islander/Asian-American",
	"Native American",
	"Other"
]
const field = [
    "Law"  ,
    "Math",
    "Social Science, Psychologist" ,
    "Medical Science, Pharmaceuticals, and Bio Tech",
    "Engineering"  ,
    "English/Creative Writing/ Journalism" ,
    "History/Religion/Philosophy" ,
    "Business/Econ/Finance" ,
    "Education, Academia" ,
    "Biological Sciences/Chemistry/Physics",
    "Social Work" ,
    "Undergrad/undecided" ,
    "Political Science/International Affairs" ,
    "Film",
    "Fine Arts/Arts Administration",
    "Languages",
    "Architecture",
    "Other"
]

let svg = d3.select("#canvas")
            .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("viewBox", [0, 0, w,  h])
                .attr("class", "mainSvg")

var xAxis, yAxis, gX, gY, zoom;

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
        user_dataset = dataset.filter(
            (d, i, arr) => arr.findIndex(t => t.iid === d.iid) === i
          );

        NoCluster();
    });

    function incomeA(){
        return(d3.scaleLinear()
        .domain(d3.extent(dataset, (d) => d.income))
        .range([20, w-20]) );
    }

    function ageA(){
        return(d3.scaleLinear()
        .domain(d3.extent(dataset, (d) => d.age))
        .range([20, w-20]) );
    }

    function studyA(){
        return(d3.scaleLinear()
        .domain([1,18])
        .range([20, w-20]) );
    }

    function raceA(){
        return(d3.scaleLinear()
        .domain(d3.extent(dataset, (d) => d.race))
        .range([20, w-20]) );
    }

    function incomeO(){
        return(d3.scaleLinear()
        .domain(d3.extent(dataset, (d) => d.income))
        .range([20, h-20]) );
    }

    function ageO(){
        return(d3.scaleLinear()
        .domain(d3.extent(dataset, (d) => d.age))
        .range([20, h-20]) );
    }

    function studyO(){
        return(d3.scaleLinear()
        .domain([1,18])
        .range([20, h-20]) );
    }

    function raceO(){
        return(d3.scaleLinear()
        .domain(d3.extent(dataset, (d) => d.race))
        .range([20, h-20]) );
    }


function drawbis(nom){
    svg.selectAll("*").remove();

}
function draw() {
    svg.selectAll("*").remove();
    // var myNode = document.getElementById("textdiv");
    // while (myNode.firstChild) {
    //     myNode.removeChild(myNode.firstChild);
    // }

    var g = svg.append('g');

    var radiosA = document.getElementsByName('abs');
    var valeurmodeA;

    for(var i = 0; i < radiosA.length; i++){
        if(radiosA[i].checked){
            valeurmodeA = radiosA[i].value;
        }
    }

    var radiosO = document.getElementsByName('od');
    var valeurmodeO;

    for(var i = 0; i < radiosO.length; i++){
        if(radiosO[i].checked){
            valeurmodeO = radiosO[i].value;
        }
    }

    var xnom;
    var ynom;
    switch(valeurmodeO){
        case "income":
            yO = incomeO();
            yAxis = d3.axisRight(yO);
            ynom = "Income (€)";
            break;

        case "race":
            yO = raceO();
            yAxis = d3.axisRight(yO)
                    .tickFormat((r) => races[r-1]);
            ynom = "Race";
            break;
        case "field_cd":
            yO = studyO();
            yAxis = d3.axisRight(yO)
              .tickFormat((f) => field[f-1]);
            ynom = "Field of study";
            break;
        case "age":
            yO = ageO();
            yAxis = d3.axisRight(yO);
            ynom = "Age";
            break;
}
    switch(valeurmodeA){

        case "income":
            xA = incomeA();
            xAxis = d3.axisBottom(xA);
            xnom = "Income (€)";
            break;
        case "field_cd":
            xA = studyA();
            xAxis = d3.axisBottom(xA)
             .tickFormat((f) => field[f-1]);
            xnom = "Field of study";
            break;
        case "age":
            xA = ageA();
            xAxis = d3.axisBottom(xA);
            xnom = "Age";
            break;
        case "race":
            xA = raceA();
            xAxis = d3.axisBottom(xA)
                .tickFormat((r) => races[r-1]);
            xnom = "Race";
            break;

    }

    g.selectAll("circle")
                .data(user_dataset)
            .enter().append("circle")
                .attr("r", 3)
                .attr("cx", (d) => xA(d[valeurmodeA]))
                .attr("cy", (d) => yO(d[valeurmodeO]))
                .attr("fill", (d) => color(d.gender))
                .attr("class", "data-entry")
                .on("click", (d) => showModal(d))
                .on("mouseover", showTooltip)
                .on("mouseout", hideTooltip);

    zoomed(g)
    zoom = d3.zoom()
                .scaleExtent([1, 10])
                .on("zoom", () => zoomed(g));

    svg.call(zoom)

    gX = svg.append('g')
                .attr("class", "x axis")
                .call(xAxis);
    gX.selectAll("text")
        .attr("transform", "rotate(15)")
        .style("text-anchor", "start");

    gY = svg.append('g')
                .attr("class", "y axis")
                .call(yAxis);
    gY.selectAll("text")
        .attr("transform", "rotate(15)")
        .style("text-anchor", "start");

    svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "end")
        .attr("y", 50)
        .attr("x", w - 10)
        .text(xnom);

    svg.append("text")
        .attr("class", "ylabel")
        .attr("text-anchor", "start")
        .attr("y", h - 10)
        .attr("x", 50 )
        .text(ynom);
}

function zoomed(g){
    if (d3.event){
        zoomState = d3.event.transform;
    }
    if (zoomState){
        g.attr("transform", zoomState);

        gX.call(xAxis.scale(zoomState.rescaleX(xA)));
        gY.call(yAxis.scale(zoomState.rescaleY(yO)));

        gX.selectAll("text")
            .attr("transform", "rotate(15)")
            .style("text-anchor", "start");
        gY.selectAll("text")
            .attr("transform", "rotate(15)")
            .style("text-anchor", "start");
    }
}


function drawCluster(){
  svg.selectAll("*").remove();

  var g = svg.append('g')
  var relationships = createRelationships(dataset, user_dataset);
  g.selectAll("circle")
              .data(user_dataset)
              .enter().append("circle")
              .attr("r", 3)
              .attr("cx", (d) => compute_cluster_x(d))
              .attr("cy", (d) => compute_cluster_y(d))
              .attr("fill", (d) => color(d.gender))
              .attr("class", "data-entry")
              .on("click", showModal)
              .on("mouseover", showTooltip)
              .on("mouseout", hideTooltip);
  var line = d3.line()
                .x(function (d) { return d.x; })
                .y(function (d) { return d.y; });

  for (var i=0; i < relationships.length; i++) {
    g.append("path")
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

function createRelationships(data_from, data_to){
  // data_from : data from where we are looking
  //data_to : data where we look for the matches
  var r = [];
  for (let i = 0; i < data_from.length; i++){


    var d = data_from[i];

    var match_iid = match(d);
    //console.log(match_iid);
    if (match_iid){ //if there is a match

      var match_id = 0; //let's find the match in data_to

      while ((match_id < data_to.length-1) && (match_iid != data_to[match_id].iid)){
        match_id = match_id + 1;
      }
      if(match_iid == data_to[match_id].iid && (d.wave == data_to[match_id].wave)){
        var _match = data_to[match_id];
        var relation = [{"x":compute_cluster_x(d), "y":compute_cluster_y(d)}, {"x":compute_cluster_x(_match), "y":compute_cluster_y(_match)}];
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
			return("rgb(232, 67, 147)");
		case "1":
			return("rgb(83,80,242)");
    }
}
function drawFilter(){
    svg.selectAll("*").remove();
    var divtext  = document.getElementById("textdiv");
    var p = document.createElement("p");
    p.innerHTML = "Do you want to find the right type of person for you? Enter your (approximate) characteristics and we'll show you who people who look like you have matched up with. People who look like you are indicated with larger circles. Click on their profile to see who they have matched up with and therefore which profiles may match you.";
    divtext.appendChild(p);
    var div = document.createElement(div);

    div.innerHTML = "Décrivez vous : <div> <input type='range' value=55 list='tickmarks'id='age' name='age' min='18' max='55' oninput = 'ageMax(age.value);document.getElementById(\"agem\").max = age.value;'> <label for='volume'>Max age: <span id='age-max-value'>55</span></label> <br> <br> </div> <div><input type='range' id='agem' name='agem' value=18 list='tickmarks2' min='18' max='55'  oninput = 'ageMin(agem.value);document.getElementById(\"age\").min = agem.value;'> <label for='cowbell'>Min age : <span id='age-min-value'>18</span></label> <br> <br> </div> Sexe : <div><input type='radio' id='F' name='sexe' value='F' onclick='sexe(F.value)' checked><label for='F'> F</label></div> <div><input type='radio' id='M' name='sexe' value='M' onclick='sexe(M.value)'> <label for='M'>M</label></div> <br> <br> Race :<div><input type='radio' id='race1' name='race' value='1' onclick='race(race1.value)'checked><label for='race1'> Black/African American </label></div> <div><input type='radio' id='race2' name='race' value='2' onclick='race(race2.value)'><label for='race2'> European/Caucasian-American </label></div> <div><input type='radio' id='race3' name='race' value='3' onclick='race(race3.value)'checked ><label for='race3'> Latino/Hispanic American </label></div> <div><input type='radio' id='race4' name='race' value='4' onclick='race(race4.value)'checked><label for='race4'> Asian/Pacific Islander/Asian-American </label></div>  <div><input type='radio' id='race5' name='race' value='5'checked onclick='race(race5.value)'><label for='race5'> Native American </label></div>  <div><input type='radio' id='race6' name='race' value='6' onclick='race(race6.value)'checked><label for='race6'> Other </label></div> <div><input type='radio' id='race7' name='race' value='7' onclick='race(race7.value)'checked><label for='race7'> All </label></div> <br> <br> Field of Study :<div><input type='radio' id='study1' name='study' value='1' onclick='study(study1.value)'checked><label for='study1'> Law </label></div> <div><input type='radio' id='study2' name='study' value='2' onclick='study(study2.value)'><label for='study'> Math </label></div> <div><input type='radio' id='study3' name='study' value='3' onclick=study(study3.value)'checked ><label for='study3'> Social Science, Psycologist </label></div> <div><input type='radio' id='study4' name='study' value='4' onclick='study(study.value)'checked><label for='study4'> Medical science, Pharmaceuticals, and Bio Tech </label></div>  <div><input type='radio' id='study5' name='study' value='5'checked onclick='study(study5.value)'><label for='study5'> Engineering </label></div>  <div><input type='radio' id='study6' name='study' value='6' onclick='study(study6.value)'checked><label for='study6'> English/Creative Writing/Philosophy </label></div><div><input type='radio' id='study7' name='study' value='7' onclick='study(study7.value)'checked><label for='study7'> History/Religion/Philosophy </label></div> <div><input type='radio' id='study8' name='study' value='8' onclick='study(study8.value)'checked><label for='study8'> Business/Econ/Finance </label></div> <div><input type='radio' id='study9' name='study' value='9' onclick='study(study9.value)'checked><label for='study9'> Education, Academia </label></div> <div><input type='radio' id='study10' name='study' value='10' onclick='study(study10.value)'checked><label for='study10'> Biological siences/Chemistry/Physics </label></div> <div><input type='radio' id='study11' name='study' value='11' onclick='study(study11.value)'checked><label for='study11'> Social work </label></div> <div><input type='radio' id='study12' name='study' value='12' onclick='study(study12.value)'checked><label for='study12'> Undergrad/undecided </label></div>  <div><input type='radio' id='study13' name='study' value='13' onclick='study(study13.value)'checked><label for='study13'> Political science/International affairs </label></div> <div><input type='radio' id='study14' name='study' value='14' onclick='study(study14.value)'checked><label for='study14'>Film </label></div> <div><input type='radio' id='study15' name='study' value='15' onclick='study(study15.value)'checked><label for='study15'> Fine Arts/ Arts Adiministration </label></div> <div><input type='radio' id='study16' name='study' value='16' onclick='study(study16.value)'checked><label for='study16'> Languages </label></div> <div><input type='radio' id='study17' name='study' value='17' onclick='study(study17.value)'checked><label for='study17'> Architecture </label></div> <div><input type='radio' id='study18' name='study' value='18' onclick='study(study18.value)'checked><label for='study18'> Other </label></div> <div><input type='radio' id='study19' name='study' value='19' onclick='study(study19.value)'checked><label for='study19'> Show all </label></div> ";

    divtext.appendChild(div);

    afficherFilter();

}
function visible(age,race,genre,study,d){
    if(genre == current_sexe) {
        if (age<agemax && age>agemin && (current_race==race || all_race) && (parseInt(study) == parseInt(current_study) || all_study ==true)){
            personnesress.push(d);
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

function rayon(age,race, genre, study){
    if(genre == current_sexe) {
        if (age<agemax && age>agemin && (current_race==race || all_race) && (parseInt(study) == parseInt(current_study) || all_study ==true)){
            return(5);
        }
    }

    return(3);
}

function afficherFilter(){
    svg.selectAll("*").remove();
    var g = svg.append('g');
    personnesress = [];

    g.selectAll("circle")
                .data(dataset)
                .enter().append("circle")
                .attr("r", (d) => rayon(d.age,d.race,d.gender,d.field_cd))
                .attr("cx", (d) => compute_cluster_x(d))
                .attr("cy", (d) => compute_cluster_y(d))
                .attr("fill", (d) => color(d.gender))
                .attr("visibility",(d) => visible(d.age,d.race,d.gender,d.field_cd,d))
                .attr("class", "data-entry")
                .on("click", showModal)
                .on("mouseover", showTooltip)
                .on("mouseout", hideTooltip);

    var line = d3.line()
    .x(function (d) { return d.x; })
    .y(function (d) { return d.y; });
    var relationships = createRelationships(personnesress, dataset);
    for (var i=0; i < relationships.length; i++) {
        g.append("path")
        .attr("class", "plot")
        .datum(relationships[i])
        .attr("d", line);
        }

}
function ageMax(nom){
    agemax = parseInt(nom);
    document.getElementById('age-max-value').innerText = agemax;
    afficherFilter();
  }

function ageMin(nom){
    agemin = parseInt(nom);
    document.getElementById('age-min-value').innerText = agemin;
    afficherFilter();
}


function NoCluster(){
  var myNode = document.getElementById("textdiv");
 while (myNode.firstChild) {
       myNode.removeChild(myNode.firstChild);
}


var divtext = document.getElementById("textdiv");
var divgrosse = document.createElement("div");
divgrosse.id = "main-inputs"
var div1 = document.createElement("div");
var div2 = document.createElement("div");
div1.id = "left";
div2.id = "center";
div1.innerHTML="Select the abscissa : <div><input type='radio' id='income' name='abs' value='income' onclick='draw()' > <label for='income'>Income</label></div><div><input type='radio' id='age' name='abs' value='age' onclick='draw()' checked ><label for='age'> Age </label></div> <div><input type='radio' id='study' name='abs' value='field_cd' onclick='draw()'><label for='study'>Field of study</label></div> <div><input type='radio' id='race' name='abs' value='race' onclick='draw()' ><label for='race'>Race</label></div>";
div2.innerHTML="Select the ordinate : <div><input type='radio' id='income' name='od' value='income' onclick='draw()' checked> <label for='income'>Income</label></div><div><input type='radio' id='age' name='od' value='age' onclick='draw()'><label for='age'> Age </label></div> <div><input type='radio' id='study' name='od' value='field_cd' onclick='draw()'><label for='study'>Field of study</label></div> <div><input type='radio' id='race' name='od' value='race' onclick='draw()'><label for='race'>Race</label></div>";
divgrosse.appendChild(div1);
divgrosse.appendChild(div2);
divtext.appendChild(divgrosse);


  draw();
}

function Cluster(){
  console.log("cluster !");
  var div = document.getElementById("textdiv");
  var myNode = document.getElementById("textdiv");
  myNode.innerHTML = '';
  drawCluster();
}

function getGender(id) {
    var user = user_dataset.find(function(x) {
        return x.iid == id;
    });
    console.log(user);
    if (user) {return user.gender}
    else {return 3}
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

    addModalGraph(d);
}
function closeModal() {
    modal.innerHTML = '<div class="modal-container"><div id="modal-close" onclick="closeModal()">X</div><div class="modal-content" id="modal-infos"><span class="modal-title" id="modal-infos-id"></span><div class="modal-content" id="modal-infos-details"><img id="modal-infos-img" src="media/man.svg" alt=""><div class="modal-content modal-content-2" id="modal-infos-details-text"><span class="modal-infos-details-span" id="modal-infos-age"></span><span class="modal-infos-details-span" id="modal-infos-from"></span><span class="modal-infos-details-span" id="modal-infos-race"></span><span class="modal-infos-details-span" id="modal-infos-field"></span><span class="modal-infos-details-span" id="modal-infos-income"></span><span class="modal-infos-details-span" id="modal-infos-undergraduate"></span></div></div></div><div class="modal-content" id="modal-matchs"><div class="modal-content modal-content-2" id="modal-match"><span class="modal-title" id="modal-match-title">Match</span></div><div class="modal-content modal-content-2" id="modal-nomatch"><span class="modal-title" id="modal-nomatch-title">No Match</span></div></div><div class="modal-content" id="modal-graphic"><div id="modal-graphic-legend"><span><em>Move over to see details</em></span><div class="modal-graphic-legend-item" onmouseover="highlightLine(\'attr\', true);" onmouseout="highlightLine(\'attr\', false)"><span class="modal-graphic-legend-line" style="border-color: orange;"></span><span class="modal-graphic-legend-text">Attractive</span></div><div class="modal-graphic-legend-item" onmouseover="highlightLine(\'sinc\', true);" onmouseout="highlightLine(\'sinc\', false)"><span class="modal-graphic-legend-line" style="border-color: red;"></span><span class="modal-graphic-legend-text">Sincere</span></div><div class="modal-graphic-legend-item" onmouseover="highlightLine(\'intel\', true);" onmouseout="highlightLine(\'intel\', false)"><span class="modal-graphic-legend-line" style="border-color: green;"></span><span class="modal-graphic-legend-text">Intelligent</span></div><div class="modal-graphic-legend-item" onmouseover="highlightLine(\'fun\', true);" onmouseout="highlightLine(\'fun\', false)"><span class="modal-graphic-legend-line" style="border-color: blue;"></span><span class="modal-graphic-legend-text">Fun</span></div><div class="modal-graphic-legend-item" onmouseover="highlightLine(\'amb\', true);" onmouseout="highlightLine(\'amb\', false)"><span class="modal-graphic-legend-line" style="border-color: pink;"></span><span class="modal-graphic-legend-text">Ambitious</span></div><div class="modal-graphic-legend-item" onmouseover="highlightLine(\'shar\', true);" onmouseout="highlightLine(\'shar\', false)"><span class="modal-graphic-legend-line" style="border-color: purple;"></span><span class="modal-graphic-legend-text">Shared Interests</span></div></div></div></div>'
    modal.style.display = "none";
}

function addModalMatchItem(item) {
    var itemDiv = document.createElement('div');
    itemDiv.classList.add("modal-match-item");
    itemDiv.onclick = () => {
        closeModal();
        showModal(dataset.find(function(x) {return x.iid == item.id}));
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
        showModal(dataset.find(function(x) {return x.iid == item.id}));
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
    document.getElementById("modal-infos-field").innerHTML = "<strong>Field of studies : </strong><em>" + field[d.field_cd-1] + "</em>";
    document.getElementById("modal-infos-undergraduate").innerHTML = "<strong>Undergraduate School : </strong><em>" + d.undergra + "</em>";
    document.getElementById("modal-infos-income").innerHTML = "<strong>Income : </strong><em>" + d.income + "</em>";
    document.getElementById("modal-infos-img").src = "media/" + ((d.gender==1)? "man" : "woman") + ".svg";
}

function Filter(){
    console.log("filter");
    var div = document.getElementById("textdiv");
    var myNode = document.getElementById("textdiv");
    myNode.innerHTML = '';
    drawFilter();
}

function sexe(nom){
    if (nom=='F'){
        current_sexe = 0;
    }
    else {
        current_sexe = 1;
    }
    afficherFilter();
}

function race(nom){
    if (nom=='7'){
        all_race = true;

    }
    else{
        current_race = nom;
        all_race= false;
    }

    afficherFilter();
}

function study(nom){
    if(nom!= '19'){
        all_study = false;
        current_study = nom;
    }
    else {
        all_study =true;
    }

   afficherFilter();
}


function addModalGraph(l){
    var modalGraphic = document.getElementById("modal-graphic");
    var modalGraphicTitle = document.createElement("span");
    modalGraphicTitle.innerHTML = "What " + ((l.gender == 0)? "s" : '') + "he's looking for";
    modalGraphicTitle.classList.add("modal-graphic-title");
    modalGraphic.appendChild(modalGraphicTitle);
 
    var modalSvg = d3.select('#modal-graphic')
                        .append("svg")
                        .attr("id", "modal-graphic-svg");

    var modal_w = parseFloat(window.getComputedStyle(document.getElementById("modal-graphic-svg")).width);
    var modal_h = parseFloat(window.getComputedStyle(document.getElementById("modal-graphic-svg")).height);


    modalSvg.attr("width", modal_w)
            .attr("height", modal_h)
            .attr("viewBox", [-10, -20, modal_w+30, modal_h+40]);

    var attr_before = {
        time:1,
        mark:l.attr1_1,
        cat:"attr"
    };

    var attr_during = {
        time:2,
        mark:l.attr1_s,
        cat:"attr"
    };

    var attr_oneday_after = {
        time:3,
        mark:l.attr1_2,
        cat:"attr"
    };

    var attr_threeweeks_after = {
        time:4,
        mark:l.attr1_3,
        cat:"attr"
    };

    attr = [attr_before, attr_during, attr_oneday_after, attr_threeweeks_after];



    var sinc_before = {
        time:1,
        mark:l.sinc1_1,
        cat:"sinc"
    };

    var sinc_during = {
        time:2,
        mark:l.sinc1_s,
        cat:"sinc"
    };

    var sinc_oneday_after = {
        time:3,
        mark:l.sinc1_2,
        cat:"sinc"
    };

    var sinc_threeweeks_after = {
        time:4,
        mark:l.sinc1_3,
        cat:"sinc"
    };

    sinc = [sinc_before, sinc_during, sinc_oneday_after, sinc_threeweeks_after];



    var intel_before = {
        time:1,
        mark:l.intel1_1,
        cat:"intel"
    };

    var intel_during = {
        time:2,
        mark:l.intel1_s,
        cat:"intel"
    };

    var intel_oneday_after = {
        time:3,
        mark:l.intel1_2,
        cat:"intel"
    };

    var intel_threeweeks_after = {
        time:4,
        mark:l.intel1_3,
        cat:"intel"
    };

    intel = [intel_before, intel_during, intel_oneday_after, intel_threeweeks_after];



    var fun_before = {
        time:1,
        mark:l.fun1_1,
        cat:"fun"
    };

    var fun_during = {
        time:2,
        mark:l.fun1_s,
        cat:"fun"
    };

    var fun_oneday_after = {
        time:3,
        mark:l.fun1_2,
        cat:"fun"
    };

    var fun_threeweeks_after = {
        time:4,
        mark:l.fun1_3,
        cat:"fun"
    };

    fun = [fun_before, fun_during, fun_oneday_after, fun_threeweeks_after];

    var amb_before = {
        time:1,
        mark:l.amb1_1,
        cat:"amb"
    };

    var amb_during = {
        time:2,
        mark:l.amb1_s,
        cat:"amb"
    };

    var amb_oneday_after = {
        time:3,
        mark:l.amb1_2,
        cat:"amb"
    };

    var amb_threeweeks_after = {
        time:4,
        mark:l.amb1_3,
        cat:"amb"
    };

    amb = [amb_before, amb_during, amb_oneday_after, amb_threeweeks_after];


    var shar_before = {
        time:1,
        mark:l.shar1_1,
        cat:"shar"
    };

    var shar_during = {
        time:2,
        mark:l.shar1_s,
        cat:"shar"
    };

    var shar_oneday_after = {
        time:3,
        mark:l.shar1_2,
        cat:"shar"
    };

    var shar_threeweeks_after = {
        time:4,
        mark:l.shar1_3,
        cat:"shar"
    };

    shar = [shar_before, shar_during, shar_oneday_after, shar_threeweeks_after];

    var tickLabels = ['','Before','During','One day after','Three weeks after', '']

    data = shar.concat(amb.concat(fun.concat(intel.concat(attr.concat(sinc)))))

    var step = modal_w/8;

    var modal_y = d3.scaleLinear()
        .domain(d3.extent(data, (d)=>+d.mark))
        .range([0, modal_h-20]);
    var modal_x = d3.scaleOrdinal()
        .domain([0,1,2,3,4,5])
        .range([0,step, 3*step, 5*step, 7*step, 8*step]);
    
    var modal_graphic_g = modalSvg.selectAll("g")
        .data(data)
        .enter()
        .append("g")
            .attr("class", (d) => "modal-graphic-g-" + d.cat);

    modal_graphic_g.append("circle")
                        .attr("class","modal-graphic-dots")
                        .attr("cx", (d)=>modal_x(d.time))
                        .attr("cy", (d)=>modal_y(d.mark))
                        .attr("r", 2)
                        .attr("transform", "translate(10,10)");
    modal_graphic_g.append("text")
                        .attr("class","modal-graphic-values")
                        .attr("x", (d)=>modal_x(d.time))
                        .attr("y", (d)=>modal_y(+d.mark))
                        .attr("text-anchor", "middle")
                        .text((d)=>(d.mark==="")? "no value" : d.mark)
                        .attr("display", "none")
                        .attr("font-size", "15")
                        .attr("transform", "translate(10,25)");
    
    var modal_xAxis = d3.axisTop(modal_x)
        .tickSize(10)
        .tickPadding(5)
        .tickFormat(function(d,i){ return tickLabels[i] });;

    var modal_yAxis = d3.axisLeft(modal_y)
            .ticks(10)
            .tickSize(-modal_w)
            .tickPadding(5);

    modalSvg.append("g")
        .attr("class", "modal_x_axis")
        .attr("transform", "translate(10,10)")
        .call(modal_xAxis);

    modalSvg.append("g")
        .attr("class", "modal-y-axis")
        .attr("transform", "translate(10,10)")
        .call(modal_yAxis);

    const line = d3.line()
        .x(function(d) { return modal_x(d.time); })
        .y(function(d) { return modal_y(d.mark); });

    modalSvg.append("path")
        .datum(attr) // 10. Binds data to the line
        .attr("class", "modal-graphic-line")
        .attr("id", "modal-graphic-line-attr") // Assign a class for styling
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "orange")
        .style("stroke-width", 3)
        .attr("transform", "translate(10,10)");

    modalSvg.append("path")
        .datum(sinc) // 10. Binds data to the line
        .attr("class", "modal-graphic-line") // Assign a class for styling
        .attr("id", "modal-graphic-line-sinc")
        .attr("d", line)
        .style("stroke", "red")
        .style("fill", "none")
        .style("stroke-width", 3)
        .attr("transform", "translate(10,10)");

    modalSvg.append("path")
        .datum(intel) // 10. Binds data to the line
        .attr("class", "modal-graphic-line") // Assign a class for styling
        .attr("id", "modal-graphic-line-intel")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "green")
        .style("stroke-width", 3)
        .attr("transform", "translate(10,10)");

    modalSvg.append("path")
        .datum(fun) // 10. Binds data to the line
        .attr("class", "modal-graphic-line") // Assign a class for styling
        .attr("id", "modal-graphic-line-fun")
        .attr("d", line)
        .style("fill", "none")
        .style ("stroke", "blue")
        .style("stroke-width", 3)
        .attr("transform", "translate(10,10)");

    modalSvg.append("path")
        .datum(amb) // 10. Binds data to the line
        .attr("class", "modal-graphic-line") // Assign a class for styling
        .attr("id", "modal-graphic-line-amb")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "pink")
        .style("stroke-width", 3)
        .attr("transform", "translate(10,10)");

    modalSvg.append("path")
        .datum(shar) // 10. Binds data to the line
        .attr("class", "modal-graphic-line") // Assign a class for styling
        .attr("id", "modal-graphic-line-shar")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "purple")
        .style("stroke-width", 3)
        .attr("transform", "translate(10,10)");
    
}

function highlightLine(lineName, active) {
    var modalSvg = d3.select("#modal-graphic-svg");
    if (active) {
        modalSvg.selectAll(".modal-graphic-line")
                .attr("stroke-opacity", 0.1);
        modalSvg.selectAll(".modal-graphic-dots")
                    .attr("fill-opacity", 0.1)
        modalSvg.select("#modal-graphic-line-" + lineName)
                .attr("stroke-opacity", 1);
        modalSvg.selectAll(".modal-graphic-g-" + lineName)
                    .selectAll(".modal-graphic-dots")
                        .attr("fill-opacity", 1)
        modalSvg.selectAll(".modal-graphic-g-" + lineName)
                    .selectAll(".modal-graphic-values")
                        .attr("display", "auto")
    }
    else {
        modalSvg.selectAll(".modal-graphic-line")
                .attr("stroke-opacity", 1);
        modalSvg.selectAll(".modal-graphic-dots")
                .attr("fill-opacity", 1)
        modalSvg.selectAll(".modal-graphic-values")
                .attr("display", "none")
    }
}

function showTooltip(d) {
    var tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'block';
    tooltip.style.width = "100px"
    document.getElementById("tooltip-content").innerHTML = d.iid;

    /* Execute a function when someone moves the cursor over the image, or the tooltip: */
    tooltip.addEventListener("mousemove", movetooltip);
    canvas.addEventListener("mousemove", movetooltip);

    /* And also for touch screens: */
    tooltip.addEventListener("touchmove", movetooltip);
    canvas.addEventListener("touchmove", movetooltip);

    function movetooltip(e) {
      var pos, x, y;

      /* Prevent any other actions that may occur when moving over the image */
      e.preventDefault();

      /* Get the cursor's x and y positions: */
      pos = getCursorPos(e);

      /* Calculate the position of the tooltip: */
      x = pos.x - (tooltip.offsetWidth / 2);
      y = pos.y - (tooltip.offsetHeight / 2);

    /* Set the position of the tooltip: */
      /* Prevent the tooltip from being positioned outside the canvas: */
      if (x > w - tooltip.offsetWidth) {
          tooltip.style.left = x - parseFloat(tooltip.style.width)/2 - 20 + "px";
        }
      else {
          tooltip.style.left = x + parseFloat(tooltip.style.width)/2 + 20 + "px";
        }

      tooltip.style.top = y + "px";
    }
    function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;
    
        /* Get the x and y positions of the image: */
        a = canvas.getBoundingClientRect();
    
        /* Calculate the cursor's x and y coordinates, relative to the image: */
        x = e.pageX - a.left;
        y = e.pageY - a.top;
    
        /* Consider any page scrolling: */
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x : x, y : y};
      }
}
function hideTooltip(){
    var tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}