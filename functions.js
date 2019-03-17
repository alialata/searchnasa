/*hide and unhide advanced search fields*/
function func1() {
  var x = document.getElementById("myDIV");
  /*showing to hidden*/
  if (x.style.display == "none") {
	$('#yearStart').val("");
	$('#yearEnd').val("");
	$('#location').val("");
	$('#center').val("");
	$('#photographer').val("");
	$('#nasa_id').val("");
	x.style.display = "block";
  }  else {
	$('#yearStart').val(1920);
	$('#yearEnd').val(2019);
	$('#location').val("");
	x.style.display = "none";
  }
}


/*Change advanced button text*/
function func2() {
  var x = document.getElementById("adv_button");
  if (x.innerHTML === "Advanced") {
	x.innerHTML = "Basic";
  } else {
	x.innerHTML = "Advanced";
  }
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
			makeButton(imageLinks[t], t, theDiv3, i);
		} 
	});

	theDiv3.innerHTML+="</div>";	
}

function checkUndefined(passedString){
	if(passedString == undefined){
		return "Unknown";
	}
	else 
		return passedString;
}

// makes the download links/buttons for each picture
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
	if(passedLink){
		urlPath = passedLink;
	}
	else{
		urlPath = "https://images-api.nasa.gov/search?q=" + $('#search_submit').val();
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
		urlPath = urlPath + "&location="+ location + "&year_start="+ start + "&year_end="+ end
				+"&center=" + center +"&nasa_id=" + nasa_id +"&photographer=" + photographer;
	}
	return urlPath+"&media_type=image";
}

//Returns/finds the images 
function findImages(passedLink) {
	gridCorrection(0);
	document.getElementById('images').innerHTML = "";
	$('#loader').show();
	var urlPath = findURL(passedLink);
	console.log(urlPath);

	$.getJSON(urlPath, function(fbResults) {
		var theDiv = document.getElementById('images');
		var infoDiv = document.getElementById('resultInfo');
		infoDiv.innerHTML="<div style=\"color:white;\"><h5>"+fbResults.collection.metadata.total_hits+" Images Found. Click on an image to view more information.</h5></div>";
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
		$('#loader').hide();
		navigateBtns(fbResults);
		noImageFound(fbResults.collection.items.length);
		gridCorrection(1);
	});
}

//Returns "No Images Found" if no images found
function noImageFound(numOfImages){
	if(numOfImages == 0){
		var theDiv = document.getElementById('images');
		theDiv.innerHTML += "<h2 style=\"text-align:center; color: white;\">No Images Found!</h2>";
	}
}

//Corrects masonry
function gridCorrection(x){
	if(x==1){
		var $grid = $('.grid').imagesLoaded( function() {
			var $container = $('.grid');
			$container.masonry({
			  itemSelector: '.grid-item',
			  fitWidth: true,
			  gutter: 20
			});
		});
	}
	else if(x == 0){
		$('.grid').masonry({
		  itemSelector: '.grid-item',
		  fitWidth: true,
		  gutter: 20
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

