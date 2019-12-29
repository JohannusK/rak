 var step = 0;
function ready()
{

step = step+1;
 if(step==1)
 {
    loadScript('js/Components/map.js', function(){ready();})
 }
 else if(step==2)
 {
   initApp();
 }
 else
 {
   alert('done');
 }
  
}
function loadScript(path, callback) {

    var done = false;
    var scr = document.createElement('script');

    scr.onload = handleLoad;
    scr.onreadystatechange = handleReadyStateChange;
    scr.onerror = handleError;
    scr.src = path;
    document.body.appendChild(scr);

    function handleLoad() {
        if (!done) {
            done = true;
            callback(path, "ok");
        }
    }

    function handleReadyStateChange() {
        var state;

        if (!done) {
            state = scr.readyState;
            if (state === "complete") {
                handleLoad();
            }
        }
    }
    function handleError() {
        if (!done) {
            done = true;
            callback(path, "error");
        }
    }
}


function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                if (callback && typeof callback === "function") {
                    callback();
                }
            }
        };
    } else {
        script.onload = function () {
            if (callback && typeof callback === "function") {
                callback();
            }
        };
    }
    script.src = url;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
}



function async2(u, c) {

 var d = document, t = 'script',
      o = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
  o.src =  u;
  if (c) { o.addEventListener('load', function (e) { c(null, e); }, false); }
  s.parentNode.insertBefore(o, s);

}

function doSomething(func,callback, params, params2) {
	if(params)
	{
		if(params.length==8)
		{
			func(params[0],params[1],params[2],params[3],params[4],params[5],params[6],params[7]);
		}
		else if(params && params2)
		{
				func(params, params2);
		}
		else if(params)
		{
			func(params);
		}
	}
	else
	{
		func();
	}

    callback();
}

var scripts = ['map', 'M2Inc','M2Maj','M2Min','M2Pha','N2Inc','N2Maj','N2Min','N2Pha','S2Inc','S2Maj','S2Min','S2Pha','uMean','vMean'];
var scriptIndex=0;
var functionIndex = -1;
var loadingDone = false;

var array_of_functions = 
[
  function() { doSomething(initVisualization,initApp);},
  function() { doSomething(scrollInit,initApp);},
  function() { doSomething(initGPS,initApp);},
  function() { doSomething(initTimePage,initApp);},
  function() { doSomething(MenuInit,initApp);},
  function() { doSomething(initSim,initApp);},  
  function() { doSomething(simulateArea,initApp,[vizObj.m0[0],vizObj.m1[0],vizObj.m0[1],vizObj.m1[1], 3,currentDate().getFullYear(),vizObj.times.Day, vizObj.times.t[vizObj.times.index][0]]);},
  function() { doSomething(zoomEnd,initApp,vizObj.zoomFactor,vizObj);},  
  function() { doSomething(paintArrows,initApp,vizObj);},  
  function() { doSomething(slideDiv,initApp,'Map');},  
  //function() { doSomething(OverviewUpdate,initApp);},  
  function() { doSomething(paintScale,initApp,vizObj);},  
];

function progress()
{
	var totalLength = scripts.length + array_of_functions.length;
	var step = scriptIndex + functionIndex+1;
	var status = (step / totalLength)*100;
	return status.toFixed(0) + ' %';
}

function initApp()
{ 
	initVisualization();
	scrollInit();
	initGPS();
	initTimePage();
	MenuInit(vizObj);
	initSim();
	simulateArea(vizObj.m0[0],vizObj.m1[0],vizObj.m0[1],vizObj.m1[1], 3,vizObj.selectedTime);
	zoomEnd(vizObj.zoomFactor,vizObj);
	paintArrows(vizObj);
	slideDiv('Map');
	OverviewUpdate();
	paintScale(vizObj);
	/*
	if(scriptIndex < scripts.length)
	{	
		loadScript('js/components/'+ scripts[scriptIndex] +'.js', function () {
		scriptIndex = scriptIndex + 1;
			$( '#LoadingDiv' ).text( 'loading ' +progress()  );
		//$( '#LoadingDiv' ).text( 'loading ' + progress() );
		initApp();
		});
	}
	else if(scriptIndex == scripts.length && functionIndex < array_of_functions.length-1)
	{ 
		functionIndex = functionIndex + 1;
		array_of_functions[functionIndex]();		
		
		initApp();
	}*/
}

function initPage()
{
	
	//vizObj.times = MakeTimes(new Date())
	var mapStart = $('#Map').first().position();
    var mapSize = [$('#Map').first().outerWidth() , $('#Map').first().outerHeight()] ;
	var visualStartX = 0;
	var visualStartY  = 0;
	var visualStopY  = mapSize[1];
	var visualStopX = mapSize[0];
	var visualHeight = visualStopY-visualStartY;
	var visualWidth = mapSize[0];
	vizObj.viewPortSize = [visualWidth,visualHeight];
	//Start by calculating the size of the canvas (subtract size of header and footer)

	//Init scale canvas
    //Get the scale canvas and adjust its size
	var canvas    = document.getElementById('Scale');
	if(canvas)
	{
		//Get the width of the scalecontainer
		var scaleContainerWidth = $('#ScaleContainer').outerWidth();
		var scaleContainerHeight = $('#ScaleContainer').outerHeight();

		canvas.width  = Math.round(scaleContainerWidth);
		canvas.height = Math.round(scaleContainerHeight);
		$('#Scale').width(canvas.width+'px');	
		$('#Scale').height(canvas.height+'px');
	}
	if(canvas)
	{
		vizObj.contextScale = canvas.getContext("2d");
	}

	$('#Content').width(visualWidth+'px');	
	$('#Content').height(visualHeight+'px');	


	//Init gradient canvas
    //Get the gradient canvas and adjust its size
    if(canvas)
    {
    var canvas    = document.getElementById('Gradient');
	canvas.width  = $('#Gradient').width();	
	canvas.height = Math.round(visualHeight*0.4);
	$('#Gradient').width(canvas.width+'px');	
	$('#Gradient').height(canvas.height+'px');
	vizObj.contextGradient = canvas.getContext("2d");

	//Get the height of the time container
	var timeHeight = $('#TimeContainer').height();
 	$('#Gradient').first().css({"bottom": Math.round(timeHeight)+'px'});
	
	paintScale(vizObj);
	paintGradient(vizObj);
    }

}

function waitingState(state)
{
	if(state == true)
	{
		//Show the element
		$('#Waiting').css({"display": 'block'});
	}
	else
	{
		//Hide the element
		$('#Waiting').css({"display": 'none'});
	}
}

var gradientState = true;
function gradientStateToggle()
{
	if(gradientState == false)
	{
		//Show the element
		$('#GradientContainer').css({"display": 'initial'});
		gradientState = true;
	}
	else
	{
		//Hide the element
		$('#GradientContainer').css({"display": 'none'});
		gradientState = false;
	}
}
var scaleState = true;
function ScaleStateToggle()
{
	if(scaleState == false)
	{
		//Show the element
		$('#ScaleContainer').css({"display": 'initial'});
		scaleState = true;
	}
	else
	{
		//Hide the element
		$('#ScaleContainer').css({"display": 'none'});
		scaleState = false;
	}
}




function initTimePage()
{
	$('#DatePicker').datepicker(
	{
		 monthNames: ['Januar', 'Februar', 'Mars', 'Apríl', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
        dayNamesMin: ["Su", "Má", "Tý", "Mi", "Hó", "Fr", "Le"],
firstDay: 1,
  		onSelect: function(dateText) {
  		var d = $( "#DatePicker" ).datepicker('getDate');	
    	$('#SelectedDate').val(dateText);
		//vizObj.times = MakeTimes(d);
		updateSelectedTime();
  	},
  	dateFormat: 'dd/mm/yy'
	});
	$("#DatePicker").datepicker("setDate",currentDate());
	$("#HourSlider").attr("step", vizObj.timeIncrement);
	$("#HourSlider").attr("max", ((24*60/vizObj.timeIncrement)-1)*vizObj.timeIncrement);
	$("#HourSlider").attr("value", currentDate().getHours()*60 + currentDate().getMinutes());

	var i = document.querySelector('#HourSlider');

	i .addEventListener('input',function(){
		/*var timeSliderVal = $( "#HourSlider" ).val();
		var hours = Math.floor(timeSliderVal / 60);
		var minutes = timeSliderVal % 60;
		var d = $( "#DatePicker" ).datepicker('getDate');	
		d.setHours(hours);
		d.setMinutes(minutes);
		vizObj.times = MakeTimes(d);*/
		
		updateSelectedTime();

	},false)

	i .addEventListener('change',function(){
		//var timeSliderVal = $( "#HourSlider" ).val();
		//var hours = Math.floor(timeSliderVal / 60);
		//var minutes = timeSliderVal % 60;
		//vizObj.selectedTime = $( "#DatePicker" ).datepicker('getDate');	
		//vizObj.selectedTime.setHours(hours);
		//vizObj.selectedTime.setMinutes(minutes);
		//vizObj.times = MakeTimes(d);
		updateSelectedTime();
	},false)

	updateSelectedTime();
}


function updateSelectedTime()
{
	vizObj.selectedTime = $( "#DatePicker" ).datepicker('getDate');	
	var timeSliderVal = $( "#HourSlider" ).val();
	var hours = Math.floor(timeSliderVal / 60);
	var minutes = timeSliderVal % 60;
	vizObj.selectedTime = $( "#DatePicker" ).datepicker('getDate');	
	vizObj.selectedTime.setHours(hours);
	vizObj.selectedTime.setMinutes(minutes);
	$("#HourSlider").attr("value", currentDate().getHours()*60 + currentDate().getMinutes());
	$( "#SelectedDateTime" ).text(dateToString(vizObj.selectedTime));
	$( "#MapSelectedDate" ).text(dateToString(vizObj.selectedTime));	
}

function timeButtonClick()
{

	waitingState(true);
setTimeout(function() {
// Insert code...
	simulateArea(vizObj.m0[0],vizObj.m1[0],vizObj.m0[1],vizObj.m1[1], 3,vizObj.selectedTime);	
	zoomEnd(vizObj.zoomFactor,vizObj);  
	paintArrows(vizObj);	
	slideDiv('Map');
	//GetArea();
	OverviewUpdate();
waitingState(false);
}, vizObj.waitingTimeout);





}

function dayOfYear(date)
{
	var Year = date.getFullYear();
	var onejan = new Date(date.getFullYear(),0,1);
	
	var totalSeconds = date.getTime()/1000;
	var totalMinutes = totalSeconds / 60 - date.getTimezoneOffset();
	var totalHours = totalMinutes/60;
	var totalDays = totalHours /24;

	var onetotalSeconds = onejan.getTime()/1000;
	var onetotalMinutes = onetotalSeconds / 60;
	var onetotalHours = onetotalMinutes/60 
	var onetotalDays = onetotalHours /24;

	var dDays = totalDays - onetotalDays;

	var days = Math.floor(dDays);
	days = days +1;
	
	return days;
}




function dateToString(date)
{
	return lz(date.getDate()) +'/' + lz(date.getMonth()+1) +'/' +  lz(date.getFullYear()) + '  ' +  lz(date.getHours()) + ':'+lz(date.getMinutes());
}

function lz(number)
{
	if(number<10)
	{
		return '0' + number;
	}
	else
	{
		return number;
	}
}

function paintScale(visData)
{
	var lineThickness = 3;
	var start = [0,visData.contextScale.canvas.height-lineThickness];//[0,visData.contextScale.canvas.height-(lineThickness*2)];
	var ctx = visData.contextScale;
	ctx.strokeStyle = '#ffffff';
	ctx.fillStyle = '#ffffff';
	var cellSize = visData.cellSize;
	var lineLength = Math.round(ctx.canvas.width);
	var scale = ((lineLength/cellSize)*100)/1000;
	var lineStart = Math.round(ctx.canvas.width/2 - (ctx.canvas.width*0.95)/2);
	var lineStartY = 0;//visData.contextScale.canvas.height*0.75;
	var vLineHeight = visData.contextScale.canvas.height*0.35;

	$("#ScaleContainerText").text(scale.toFixed(1) + ' km');
	ctx.clearRect(0,0,visData.contextScale.canvas.width,visData.contextScale.canvas.height);
	//ctx.textAlign = "center";
	//ctx.font= vLineHeight+'px Arial';
	//ctx.fillText(scale.toFixed(1) + ' km',visData.contextScale.canvas.width/2,vLineHeight);
	ctx.beginPath();
	ctx.rect(start[0], start[1], start[0]+lineLength, start[1]+lineThickness);   
	ctx.fill();  

	ctx.beginPath();
    ctx.rect(0,visData.contextScale.canvas.height,lineThickness,-vLineHeight); 
  	ctx.fill(); 
  	ctx.beginPath();
    ctx.rect(ctx.canvas.width-lineThickness,visData.contextScale.canvas.height,ctx.canvas.width,-vLineHeight); 
  	ctx.fill(); 
}

function paintGradient(visData)
{
	//Get the correct context
	var ctx = visData.contextGradient;
	//Clear the context
	ctx.clearRect(0,0,visData.contextGradient.canvas.width,visData.contextGradient.canvas.height);
	var LineHeight = visData.contextScale.canvas.height*0.3;	
	var totalHeight = visData.contextGradient.canvas.height;
	var unitHeight = LineHeight;
	var gradientHeight = totalHeight-unitHeight;
	
	//Draw a box containing the gradient
   
	var start = [Math.round(visData.contextGradient.canvas.width*0.1),unitHeight];
	//Compensate for the height of the scale container

	var size = [Math.round(visData.contextGradient.canvas.width-start[0]*2),gradientHeight];
	// Paint the gradient inside the box
	//color = gradientrgb[index];
    for(var i=0;i<gradientHEX.length;i++)
	{
		var height = size[1]/gradientHEX.length;		
		ctx.beginPath();
		ctx.rect(start[0],start[1]+height*i, size[0], height);
		ctx.fillStyle = gradientHEX[gradientHEX.length-1-i];
		ctx.fill();		
	}
	ctx.strokeStyle = 'black';
	 ctx.fillStyle = 'black';
	ctx.beginPath();
    ctx.rect(start[0],start[1], size[0], size[1]);
    ctx.lineWidth = 1;

    //Write text on the gradient
    ctx.textAlign = "center";

    ctx.font= LineHeight+'px Arial';
      ctx.strokeStyle = 'black';
    //Start with 0
    var height = size[1];
    var max = visData.maxAmplitude;
    var steps = 4;

    ctx.fillText(0,visData.contextGradient.canvas.width/2,size[1]+LineHeight);	
    ctx.fillText(2,visData.contextGradient.canvas.width/2,size[1]/2+LineHeight);	
    ctx.fillText(4,visData.contextGradient.canvas.width/2,LineHeight*2);	
	ctx.fillText('m/s',visData.contextGradient.canvas.width/2,LineHeight);	
}

function slideToggleDiv(id) {
    $('#' + id).slideToggle();
}

function slideToggleDivDual2(id1, id2) {
    slideToggleDiv(id1);
    slideToggleDiv(id2);
}

function slideToggle(divs)
{
	for(var i=0;i<divs.length;i++)
	{
		slideToggleDiv(divs[i]);
	}
}

function slideDiv(div)
{
	var divs=['Map','Overview', 'Time','Settings','GPS','About'];
		for(var i=0;i<divs.length;i++)
	{
		if(divs[i] != div)
		$( '#'+divs[i] ).fadeOut();
	}
	$( '#'+div ).fadeIn();

	// Hide the menuItem
	MenuSet(false);
}

function MenuInit(visData)
{


	$('#MenuContainer').css({"display": 'initial'});
	
	// Set the vertical position of the menu buttons    
    
        var buttonHeight = $('.menuButton').first().outerHeight();
    // Set the top property of menubuttons such that the buttons are in the middle of screen vertically
    $('.menuButton').css({"margin-top": Math.round(-buttonHeight/2)+'px'});
    // Do the same for the MenuItems
	//var menuHeight = $('#MenuItems').first().outerHeight();
	//Calculate the size of the top margin in order to center the menu
	var menuHeight = $('#MenuItems').outerHeight();
	var displaySize = visData.displaySize[1];
	var margin = (displaySize - menuHeight)/2;
    $('#MenuItems').css({"padding-top": Math.round(margin)+'px'});
    $('#MenuContainer').css({"display": 'none'});
}

function MenuSet(open)
{
	if(open == true)
	{
		$( '#MenuOpen').fadeOut();
		$( '#MenuClose').fadeIn();
		//$( '#MenuContainer').fadeIn();	
		$('#MenuContainer').show("slide", { direction: "left" }, 500);
	}
	else
	{
		$( '#MenuOpen').fadeIn();
		$( '#MenuClose').fadeOut();
		//$( '#MenuContainer').fadeOut();
		$('#MenuContainer').hide("slide", { direction: "left" }, 500);
	}
}



function setValues(visData)
{

	if(visData)
	{
	$('#ZoomFactor').html(visData.zoomFactor.toFixed(2));
	$('#Offset').html(visData.offset[0].toFixed(2)+","+visData.offset[1].toFixed(2));
	$('#LatLon').html(visData.lat.toFixed(3) + ","+visData.lon.toFixed(3));
	$('#Matrix').html(visData.matrix[0].toFixed(2)+","+visData.matrix[1].toFixed(2));
	$('#ST').html(visData.sT.toFixed(2));
	$('#CellSize').html(visData.cellSize.toFixed(1));
	$('#Mouse').html(visData.mouse[0].toFixed(0)+","+visData.mouse[1].toFixed(0));
	$('#c0').html(visData.c0[0].toFixed(0) +"," +visData.c0[1].toFixed(0));
	$('#c1').html(visData.c1[0].toFixed(0) +"," +visData.c1[1].toFixed(0));
	//$('#ImageSize').html(visData.imageSize[0].toFixed(2) +"," +visData.imageSize[1].toFixed(2));
	$('#m0').html(visData.m0[0].toFixed(2) +"," +visData.m0[1].toFixed(2));
	$('#m1').html(visData.m1[0].toFixed(2) +"," +visData.m1[1].toFixed(2));
	$('#DisplaySize').html(visData.displaySize[0] +"," + visData.displaySize[1]);
	$('#CanvasSize').html(visData.canvasSize[0] + ","+ visData.canvasSize[1]);
	$('#Angle').html(visData.angle.toFixed(2));
	$('#t').html(visData.t.toFixed(1));
	}
}

function initValuesTable()
{
	addToValuesTable('t');
	addToValuesTable('ZoomFactor');
	addToValuesTable('Mouse');
	addToValuesTable('Matrix');
	addToValuesTable('LatLon');
	addToValuesTable('m0');
	addToValuesTable('m1');
	addToValuesTable('Offset');
	addToValuesTable('CellSize');
	addToValuesTable('Angle');
	addToValuesTable('ST');
	//addToValuesTable('Speed');
	//addToValuesTable('GPSupds');
	//addToValuesTable('Counts');
	addToValuesTable('DisplaySize');
	addToValuesTable('CanvasSize');
	addToValuesTable('ImageSize');
	addToValuesTable('c0');
	addToValuesTable('c1');

}

function addToValuesTable(id)
{
	$('#valuesTable').append('<tr><td style="text-align:right;">'+id+'</td><td id='+id+'>'+0+'</td></tr>');
}




/* Timer */
var timer = new Object();
function async(your_function, callback) {
	timer = setTimeout(
	function() 
	{
		your_function(); 
		if (callback) 
		{
			callback();
		}
	}
	,100);
}


function timerStart()
{
	async(timerStart,asynccallback);
}
function timerStop()
{
	window.clearInterval(timerStart)
}
var running = false;
function timerToggle()
{
	if(running==false)
	{
		running = true;
		timerStart();
	}
	else
	{
		running = false;
		window.clearTimeout(timer);
	}
}

var simSum = 0;
var simCount = 0;
var simStart = 0;
function asynccallback()
{	
    time(true);
}

function viewPortSize()
{
	var viewPortHeight = window.innerHeight;//$( window ).height();
	var viewPortWidth = $( window ).width();
	return [viewPortWidth,viewPortHeight];
}

function rad2deg(value)
{
	return value * (180/Math.PI)
}