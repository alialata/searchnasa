/*hide and unhide advanced search fields*/
function func1() {
  var x = document.getElementById("myDIV");
  /*showing to hidden*/
  if (x.style.display == "none") {
	$('#yearStart').val("");
	$('#yearEnd').val("");

	x.style.display = "block";
  }  else {
	$('#yearStart').val(1920);
	$('#yearEnd').val(2019);
	$('#location').val("");
	$('#center').val("");
	$('#photographer').val("");
	$('#nasa_id').val("");
	x.style.display = "none";
  }
}


/*Change advanced button text*/
function func2() {
  var x = document.getElementById("adv_button");
  if (x.innerHTML == "Advanced") {
	x.innerHTML = "Basic";
  } else {
	x.innerHTML = "Advanced";
  }
}

//changes history button text and shows/hides search history table
function histBtnToggle(){
  var x = document.getElementById("history_button");
  var hist_div = document.getElementById("history");
  if (x.innerHTML == "Show History") {
	hist_div.style.display = "block";
	x.innerHTML = "Hide History";
  } else {
	hist_div.style.display = "none";
	x.innerHTML = "Show History";
  }
}

//Makes a deque object
function Deque(){
	this.stac=new Array();
	this.popback=function(){
		return this.stac.pop();
	}
	this.pushback=function(item){
		this.stac.push(item);
	}
	this.popfront=function(){
		return this.stac.shift();
	}
	this.pushfront=function(item){
		this.stac.unshift(item);
	}
}

//Makes the history table if there isn't one or updates its values based on last 
//search query. Table will show last 5 search queries.
function updateHistory(search_field, location, center, nasa_id, photographer, start, end){
	var theDiv = document.getElementById('historyTable');
	if(theDiv == undefined){ //history table not found
		var histDiv = document.getElementById("history");
		histDiv.innerHTML = "";
		let tableObj = document.createElement('TABLE');
		tableObj.setAttribute("id","historyTable");
		tableObj.setAttribute("class", "histTable");
		var header = tableObj.createTHead();
		var row = header.insertRow(0);
		cell = row.insertCell(row.cells.length);
		cell.innerHTML = "Query";
		cell = row.insertCell(row.cells.length);
		cell.innerHTML = "Location";
		cell = row.insertCell(row.cells.length);
		cell.innerHTML = "Center";
		cell = row.insertCell(row.cells.length);
		cell.innerHTML = "NASA ID";
		cell = row.insertCell(row.cells.length);
		cell.innerHTML = "Photographer";
		cell = row.insertCell(row.cells.length);
		cell.innerHTML = "Start Year";
		cell = row.insertCell(row.cells.length);
		cell.innerHTML = "End Year";
		histDiv.append(tableObj);
		var body = tableObj.createTBody();
		body.setAttribute("id","tbody");
	}
	var tableObj = document.getElementById('historyTable');
	if(tableObj.rows.length == 6){
		tableObj.deleteRow(5);
	}
	var tableBody = document.getElementById('tbody');
	var row = tableBody.insertRow(0);
	var cell = row.insertCell(row.cells.length);
	cell.innerHTML = search_field;
	cell = row.insertCell(row.cells.length);
	cell.innerHTML = location;
	cell = row.insertCell(row.cells.length);
	cell.innerHTML = center;
	cell = row.insertCell(row.cells.length);
	cell.innerHTML = nasa_id;
	cell = row.insertCell(row.cells.length);
	cell.innerHTML = photographer;
	cell = row.insertCell(row.cells.length);
	cell.innerHTML = start;
	cell = row.insertCell(row.cells.length);
	cell.innerHTML = end;
}



/*IMAGE DATA AND CONTENT WHEN CLICKED*/
function imageData(theDiv3, fbResults, i){	
	theDiv3.innerHTML+="<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";
	var title = checkUndefined(fbResults.collection.items[i].data[0].title) + " ";
	var description = "<h4 style=\"font-weight:normal\"><i>" +checkUndefined(fbResults.collection.items[i].data[0].description) + "</i></h4>";
	var secondary_creator = checkUndefined(fbResults.collection.items[i].data[0].secondary_creator) + " ";
	var photographer = checkUndefined(fbResults.collection.items[i].data[0].photographer) + " ";
	var keywords = checkUndefined(fbResults.collection.items[i].data[0].keywords) + " ";
	var date_created = checkUndefined(fbResults.collection.items[i].data[0].date_created) + " ";
	var center = checkUndefined(fbResults.collection.items[i].data[0].center) + " ";
	var nasa_id = checkUndefined(fbResults.collection.items[i].data[0].nasa_id) + " ";
	var brk = "<br>";
	theDiv3.innerHTML+="<h2 id=\"contentTitle\">"+ title+"</h2>"+
	"<img id=\"image"+i+"\" class=\"center\" style=\"max-width=100%\" src=\"" + 
	fbResults.collection.items[i].links[0].href + "\" /><br>" + 
	description + brk + 
	"<strong>"+"Date Created: " + "</strong>"+ date_created + brk+ 
	"<strong>"+"Center: " +"</strong>" +center + brk + 
	"<strong>"+"NASA ID: "+ "</strong>"+nasa_id + brk+
	"<strong>"+"Keywords: " + "</strong>"+ keywords + brk +
	"<strong>"+"Photographer: " + "</strong>"+ photographer + brk +
	"<strong>"+"Secondary Creator: " + "</strong>"+ secondary_creator + brk + brk;
	theDiv3.innerHTML+="Download Links:" + brk;
	
	var imageJsonUrl = fbResults.collection.items[i].href + "";
	$.getJSON(imageJsonUrl, function(imageLinks) {
		for(t = 0; t < imageLinks.length-1; t++){
			//making link buttons for all sizes available of the image
			makeButton(imageLinks[t], t, theDiv3, i);
		} 
	});

	theDiv3.innerHTML+="</div>";	
}

//Checks for undefined, if undefined, returns Unknown
function checkUndefined(passedString){
	if(passedString == undefined){
		return "Unknown";
	}
	else 
		return passedString;
}



//Makes the download link/button for each picture
function makeButton(imgLink, num, targetID, itemNumber){
	num +=1;
	var targetDiv = document.getElementById(targetID.id);
	let imageObj = document.createElement('a');
	var btnText = imgLink.substring(imgLink.lastIndexOf("~") + 1, imgLink.lastIndexOf("."));
	if(btnText == "orig"){
		btnText = "original";
	}
	imageObj.innerText = btnText;
	imageObj.setAttribute("href", imgLink);
	imageObj.setAttribute("target", "_blank");
	imageObj.setAttribute("class", "button1");
	imageObj.setAttribute("type", "button");
	imageObj.setAttribute("style","filter: invert(100%);");
	targetDiv.append(imageObj);
}

/*finds the url from the fields filled out*/
function findURL(passedLink){
	var urlPath;
	if(passedLink){ //User presses previous or next button
		urlPath = passedLink;
	}
	else{ //User searches with provided fields
		var search_field = $('#search_submit').val();
		var center = $('#center').val();
		var nasa_id = $('#nasa_id').val();
		var photographer = $('#photographer').val();
		var location = $('#location').val();
		var start = $('#yearStart').val();
		if(!start){
			start = 1920;
		}
		var end = $('#yearEnd').val();
		if(!end){
			end = 2019;
		}
		urlPath = "https://images-api.nasa.gov/search?q=" + search_field;
		urlPath = urlPath + "&location="+ location + "&year_start="+ start + "&year_end="+ end
				+"&center=" + center +"&nasa_id=" + nasa_id +"&photographer=" + photographer;
		updateHistory(search_field, location, center, nasa_id, photographer, start, end);
	}
	return urlPath+"&media_type=image"; //return entire url
}

//Returns/finds the images 
function findImages(passedLink) {
	gridCorrection(0);
	document.getElementById('images').innerHTML = "";
	$('#loader').show();
	var urlPath = findURL(passedLink); //construct to url to query api
	console.log(urlPath);

	$.getJSON(urlPath, function(fbResults) {
		var theDiv = document.getElementById('images');
		var infoDiv = document.getElementById('resultInfo');
		infoDiv.innerHTML="<div style=\"color:white;\"><h5>"+fbResults.collection.metadata.total_hits+" Images found. Click on an image to view more information.</h5></div>";
		/*LOOP THROUGH ITEMS*/
		for( i = 0; i < fbResults.collection.items.length; i++){
			var model_num = "#openModal" + i;
			var content_num = "#content" + i;
			if(fbResults.collection.items[i].links){
				theDiv.innerHTML += "<a href=\""+model_num+"\">" + "<div class=\"grid-item\"><img src=\"" + 
				fbResults.collection.items[i].links[0].href + "\" /></div></a>";
				theDiv.innerHTML+= "<div id=\""+"openModal"+i+"\" class=modalDialog>";
				var theDiv2 = $(model_num)[0];
				theDiv2.innerHTML+="<div id=\""+"content"+i+"\">";
				var theDiv3 = $(content_num)[0];
				imageData(theDiv3, fbResults, i);
				theDiv2.innerHTML+="</div>";
			}
		}
		$('#loader').hide();//Hide loading icon
		navigateBtns(fbResults);//load the prev/next buttons
		noImageFound(fbResults.collection.items.length);//No image found text
		gridCorrection(1);//Correct grid
	});
}

//Returns "No Images Found" if no images found
function noImageFound(numOfImages){
	if(numOfImages == 0){
		var theDiv = document.getElementById('images');
		theDiv.innerHTML += "<h2 style=\"text-align:center; color: red;\">No Images Found!</h2>";
	}
}

//Corrects masonry grid
function gridCorrection(x){
	if(x==1){
		var $grid = $('.grid').imagesLoaded( function() {
			var $container = $('.grid');
			$container.masonry({
			  itemSelector: '.grid-item',
			  gutter: 10
			});
		});	

	}
	else if(x == 0){
		$('.grid').masonry({
		  itemSelector: '.grid-item',
		  gutter: 10
		});
		$('.grid').masonry('destroy');

	}	
}

//Makes the the previous and next buttons
function navigateBtns(fbResults){
	var naDivDiv = document.getElementById('navDiv');
	navDiv.innerHTML="";
	if(fbResults.collection.links){
		for(p = 0; p < fbResults.collection.links.length; p++){
			//PREVIOUS BUTTON
			if(fbResults.collection.links[p].prompt == "Previous"){	
				var linkBack = "" + fbResults.collection.links[p].href;	
				let backA = document.createElement('a');
				backA.innerText = "Previous";
				backA.setAttribute("id", "btn1");
				backA.setAttribute("class", "button1");
				backA.setAttribute("type", "button");
				navDiv.append(backA);
				document.getElementById("btn1").onclick = function (){findImages(linkBack);};
			}
			//NEXT BUTTON
			if(fbResults.collection.links[p].prompt == "Next"){
				var linkForward = "" + fbResults.collection.links[p].href;				
				let ForwardA = document.createElement('a');
				ForwardA.innerText = "Next";
				ForwardA.setAttribute("id", "btn2");
				ForwardA.setAttribute("class", "button1");
				ForwardA.setAttribute("type", "button");
				navDiv.append(ForwardA);			
				document.getElementById("btn2").onclick = function (){findImages(linkForward);};
			}

		}
	}
}

