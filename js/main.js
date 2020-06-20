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
let x, y, zoomState;
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
        user_dataset = dataset.filter(
            (d, i, arr) => arr.findIndex(t => t.iid === d.iid) === i
          );
        x = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.age))
            .range([10, w-10]);
        y = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.income))
            .range([10, h-10]);

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
    console.log(nom);
    svg.selectAll("*").remove();
    console.log(nom);

}
function draw() {
    svg.selectAll("*").remove();
    // var myNode = document.getElementById("textdiv");
    // while (myNode.firstChild) {
    //     myNode.removeChild(myNode.firstChild);
    // }

    console.log("coucou");
   
    var g = svg.append('g');

    var radiosA = document.getElementsByName('abs');
    console.log(radiosA)
    var valeurmodeA;

    for(var i = 0; i < radiosA.length; i++){
        if(radiosA[i].checked){
            valeurmodeA = radiosA[i].value;
        }
    }

    var radiosO = document.getElementsByName('od');
    console.log(radiosO)
    var valeurmodeO;

    for(var i = 0; i < radiosO.length; i++){
        if(radiosO[i].checked){
            valeurmodeO = radiosO[i].value;
        }
    }

    var xnom;
    var ynom;
    var xA;
    var yO;
    switch(valeurmodeO){
        case "income":
            yO = incomeO();
            yaxis = d3.axisRight()
            .scale(yO);
            ynom = "Income (€)";
            break;

        case "race":
            yO = raceO();
            yaxis = d3.axisRight()
            .scale(yO);
            ynom = "Race";
            break;
        case "field_cd": 
            yO = studyO();
            yaxis = d3.axisRight()
            .scale(yO);
            ynom = "Field of study";
            break;
        case "age": 
            yO = ageO();
            yaxis = d3.axisRight()
            .scale(yO);
            ynom = "Age";
            break;
}
    console.log(valeurmodeA);
    switch(valeurmodeA){
        
        case "income":
            xA = incomeA();
            xaxis = d3.axisBottom()
            .scale(xA);
            xnom = "Income (€)";
            break;
        case "field_cd":
            xA = studyA();
            xaxis = d3.axisBottom()
            .scale(xA);
            xnom = "Field of study";
            break;
        case "age": 
            xA = ageA();
            xaxis = d3.axisBottom()
            .scale(xA);
            xnom = "Age";
            break;
        case "race": 
            xA = raceA();
            xaxis = d3.axisBottom()
            .scale(xA);
            xnom = "Race";
            break;

    }

    g.selectAll("circle")
                .data(user_dataset)
            .enter().append("circle")
                .attr("r", 1)
                .attr("cx", (d) => xA(d[valeurmodeA]))
                .attr("cy", (d) => yO(d[valeurmodeO]))
                .attr("fill", "red")
                .attr("fill", (d) => color(d.gender))
                .attr("class", "data-entry")
                .on("click", (d) => showModal(d));
                svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + 0 + ", 0 )")
                .call(yaxis);
                svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + 0  + ")")
                .call(xaxis);
                svg.append("text")
                .attr("class", "ylabel")
                .attr("text-anchor", "end")
                .attr("y", 20)
                .attr("x", w - 50)
                .text(xnom);
        
                svg.append("text")
                .attr("class", "ylabel")
                .attr("text-anchor", "start")
                .attr("y", h -10  )
                .attr("x", 20 )
                .text(ynom);

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
              .data(user_dataset)
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
function drawFilter(){
    svg.selectAll("*").remove();
    var divtext  = document.getElementById("textdiv");
    var p = document.createElement("p");
    p.innerHTML = "Do you want to find the right type of person for you? Enter your (approximate) characteristics and we'll show you who people who look like you have matched up with. People who look like you are indicated with larger circles. Click on their profile to see who they have matched up with and therefore which profiles may match you.";
    divtext.appendChild(p);
    var div = document.createElement(div);
    div.innerHTML = "Describe yourself : <div> <input type='range' list='tickmarks'id='age' name='age' min='18' max='55' oninput = 'ageMax(age.value)'> <label for='volume'>Age Max </label> <br> <br> </div> <div><input type='range' id='agem' name='agem' list='tickmarks2' min='18' max='55'  oninput = 'ageMin(agem.value)'> <label for='cowbell'>Age Min </label> <br> <br> </div> Sexe : <div><input type='radio' id='F' name='sexe' value='F' onclick='sexe(F.value)' checked><label for='F'> F</label></div> <div><input type='radio' id='M' name='sexe' value='M' onclick='sexe(M.value)'> <label for='M'>M</label></div> <br> <br> Race :<div><input type='radio' id='race1' name='race' value='1' onclick='race(race1.value)'checked><label for='race1'> Black/African American </label></div> <div><input type='radio' id='race2' name='race' value='2' onclick='race(race2.value)'><label for='race2'> European/Caucasian-American </label></div> <div><input type='radio' id='race3' name='race' value='3' onclick='race(race3.value)'checked ><label for='race3'> Latino/Hispanic American </label></div> <div><input type='radio' id='race4' name='race' value='4' onclick='race(race4.value)'checked><label for='race4'> Asian/Pacific Islander/Asian-American </label></div>  <div><input type='radio' id='race5' name='race' value='5'checked onclick='race(race5.value)'><label for='race5'> Native American </label></div>  <div><input type='radio' id='race6' name='race' value='6' onclick='race(race6.value)'checked><label for='race6'> Other </label></div> <div><input type='radio' id='race7' name='race' value='7' onclick='race(race7.value)'checked><label for='race7'> All </label></div> <br> <br> Field of Study :<div><input type='radio' id='study1' name='study' value='1' onclick='study(study1.value)'checked><label for='study1'> Law </label></div> <div><input type='radio' id='study2' name='study' value='2' onclick='study(study2.value)'><label for='study'> Math </label></div> <div><input type='radio' id='study3' name='study' value='3' onclick=study(study3.value)'checked ><label for='study3'> Social Science, Psycologist </label></div> <div><input type='radio' id='study4' name='study' value='4' onclick='study(study.value)'checked><label for='study4'> Medical science, Pharmaceuticals, and Bio Tech </label></div>  <div><input type='radio' id='study5' name='study' value='5'checked onclick='study(study5.value)'><label for='study5'> Engineering </label></div>  <div><input type='radio' id='study6' name='study' value='6' onclick='study(study6.value)'checked><label for='study6'> English/Creative Writing/Philosophy </label></div><div><input type='radio' id='study7' name='study' value='7' onclick='study(study7.value)'checked><label for='study7'> History/Religion/Philosophy </label></div> <div><input type='radio' id='study8' name='study' value='8' onclick='study(study8.value)'checked><label for='study8'> Business/Econ/Finance </label></div> <div><input type='radio' id='study9' name='study' value='9' onclick='study(study9.value)'checked><label for='study9'> Education, Academia </label></div> <div><input type='radio' id='study10' name='study' value='10' onclick='study(study10.value)'checked><label for='study10'> Biological siences/Chemistry/Physics </label></div> <div><input type='radio' id='study11' name='study' value='11' onclick='study(study11.value)'checked><label for='study11'> Social work </label></div> <div><input type='radio' id='study12' name='study' value='12' onclick='study(study12.value)'checked><label for='study12'> Undergrad/undecided </label></div>  <div><input type='radio' id='study13' name='study' value='13' onclick='study(study13.value)'checked><label for='study13'> Political science/International affairs </label></div> <div><input type='radio' id='study14' name='study' value='14' onclick='study(study14.value)'checked><label for='study14'>Film </label></div> <div><input type='radio' id='study15' name='study' value='15' onclick='study(study15.value)'checked><label for='study15'> Fine Arts/ Arts Adiministration </label></div> <div><input type='radio' id='study16' name='study' value='16' onclick='study(study16.value)'checked><label for='study16'> Languages </label></div> <div><input type='radio' id='study17' name='study' value='17' onclick='study(study17.value)'checked><label for='study17'> Architecture </label></div> <div><input type='radio' id='study18' name='study' value='18' onclick='study(study18.value)'checked><label for='study18'> Other </label></div> <div><input type='radio' id='study19' name='study' value='19' onclick='study(study19.value)'checked><label for='study19'> Show all </label></div> ";
    divtext.appendChild(div);

}
function visible(age,race,genre,study){
    if(genre == current_sexe) {
        if (age<agemax && age>agemin && current_race==race && (parseInt(study) == parseInt(current_study) || all_study ==true)){
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
        if (age<agemax && age>agemin && current_race==race && (parseInt(study) == parseInt(current_study) || all_study ==true)){
            return(4);
        }
    }

    return(2);
}

function afficherFilter(){
    svg.selectAll("*").remove();
    var g = svg.append('g');
    var relationships = createRelationships();
    g.selectAll("circle")
                .data(dataset)
                .enter().append("circle")
                .attr("r", (d) => rayon(d.age,d.race,d.gender,d.field_cd))
                .attr("cx", (d) => compute_cluster_x(d))
                .attr("cy", (d) => compute_cluster_y(d))
                .attr("fill", (d) => color(d.gender))
                .attr("visibility",(d) => visible(d.age,d.race,d.gender,d.field_cd))
                .attr("class", "data-entry")
                .on("click", showModal);
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


function NoCluster(){
  var div = document.getElementById("textdiv");
  var myNode = document.getElementById("textdiv");
 while (myNode.firstChild) {
       myNode.removeChild(myNode.firstChild);
}

var divtext = document.getElementById("textdiv");
var divgrosse = document.createElement("grossediv");
var div1 = document.createElement("div");
var div2 = document.createElement("div");
div1.id = "left";
div2.id = "center";
div1.innerHTML="Select the abscissa : <div><input type='radio' id='income' name='abs' value='income' onclick='draw()' > <label for='income'>Income</label></div><div><input type='radio' id='age' name='abs' value='age' onclick='draw()' checked ><label for='age'> Age </label></div> <div><input type='radio' id='study' name='abs' value='field_cd' onclick='draw()'><label for='study'> <a href='#studyexpl'> Field of study </a> </label></div> <div><input type='radio' id='race' name='abs' value='race' onclick='draw()' ><label for='race'> <a href='#raceexpl'> Race </a> </label></div>";
div2.innerHTML="Select the ordinate : <div><input type='radio' id='income' name='od' value='income' onclick='draw()' checked> <label for='income'>Income</label></div><div><input type='radio' id='age' name='od' value='age' onclick='draw()'><label for='age'> Age </label></div> <div><input type='radio' id='study' name='od' value='field_cd' onclick='draw()'><label for='study'> <a href='#studyexpl'> Field of study </a></label></div> <div><input type='radio' id='race' name='od' value='race' onclick='draw()'><label for='race'> <a href='#raceexpl'> Race </a> </label></div>";
divgrosse.appendChild(div1);
divgrosse.appendChild(div2);
divtext.appendChild(divgrosse);
var studyexpl = document.getElementById("studyexpl");
studyexpl.innerHTML = "Here are the correspondences between the numbers and the fields of study <ul> <li> 1= Law</li>  <li>2= Math </li> <li>3= Social Science, Psychologist </li> <li> 4= Medical Science, Pharmaceuticals, and Bio Tech </li> <li> 5= Engineering </li> <li> 6= English/Creative Writing/ Journalism </li> <li> 7= History/Religion/Philosophy </li> <li> 8= Business/Econ/Finance </li> <li> 9= Education, Academia </li> <li>  10= Biological Sciences/Chemistry/Physics </li> <li> 11= Social Work </li> <li> 12= Undergrad/undecided </li> <li> 13=Political Science/International Affairs </li> <li> 14=Film </li> <li> 15=Fine Arts/Arts Administration </li> <li> 16=Languages </li> <li> 17=Architecture </li> <li> 18=Other </li> </ul>"
var raceexpl =  document.getElementById("raceexpl");
raceexpl.innerHTML = "Here are the correspondences between the numbers and the races <ul> <li> Black/African American=1 </li> <li> European/Caucasian-American=2 </li> <li> Latino/Hispanic American=3 </li> <li>Asian/Pacific Islander/Asian-American=4 </li> <li>Native American=5 </li> <li>Other=6 </li> </ul>"


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
 while (myNode.firstChild) {
       myNode.removeChild(myNode.firstChild);
}



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
 