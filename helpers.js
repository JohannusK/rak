 var step = 0;
 var statusText ='';

var initializing = true;

function ready()
{




	var delay = 100;
	statusText ='Innlesur roknimynstur ';
	step = step+1;

	if(step==1)
	{
		setTimeout(function(){loadScript('js/Components/map.js', function(){ready();})},delay);	
	}   
	else if(step==2)
	{
		setTimeout(function(){loadScript('js/Components/uMean.js', function(){ready();})},delay);	
	}    
	else if(step==3)
	{
		setTimeout(function(){loadScript('js/Components/vMean.js', function(){ready();})},delay);	
	} 	
	else if(step==4)
	{
		setTimeout(function(){loadScript('js/Components/M2Maj.js', function(){ready();})},delay);
	} 	
	else if(step==5)
	{
		setTimeout(function(){loadScript('js/Components/M2Min.js', function(){ready();})},delay);
	} 	
	else if(step==6)
	{
		setTimeout(function(){loadScript('js/Components/M2Inc.js', function(){ready();})},delay);
	} 	
	else if(step==7)
	{	
		setTimeout(function(){loadScript('js/Components/M2Pha.js', function(){ready();})},delay);	
	} 
	else if(step==8)
	{
		setTimeout(function(){loadScript('js/Components/S2Maj.js', function(){ready();})},delay);
	}
	else if(step==9)
	{
		setTimeout(function(){loadScript('js/Components/S2Min.js', function(){ready();})},delay);
	}
	else if(step==10)
	{
		setTimeout(function(){loadScript('js/Components/S2Inc.js', function(){ready();})},delay);
	}
	else if(step==11)
	{
		setTimeout(function(){loadScript('js/Components/S2Pha.js', function(){ready();})},delay);
	}
	else if(step==12)
	{
		setTimeout(function(){loadScript('js/Components/N2Maj.js', function(){ready();})},delay);
	}
	else if(step==13)
	{
		setTimeout(function(){loadScript('js/Components/N2Min.js', function(){ready();})},delay);
	}
	else if(step==14)
	{
		setTimeout(function(){loadScript('js/Components/N2Inc.js', function(){ready();})},delay);
	}
	else if(step==15)
	{
		setTimeout(function(){loadScript('js/Components/N2Pha.js', function(){ready();})},delay);
	}
	else if(step==16)
	{
		waitingState(true);
		statusText = 'Ger klárt til at tekna';
		progress(statusText);
		loadScript('js/bummelum.js', function(){ready();}) 
		initVisualization();
		scrollInit();		
		initTimePage();
		initSettingsPage();
		MenuInit(vizObj);
		initGPS();
		initGPSRose();
		initSim();
	}
	else if(step==17)
	{		
		statusText = 'Roknar løtumynd';
		progress(statusText);
		loadScript('js/bummelum.js', function(){ready();}) 
		simulateArea(vizObj.m0[0],vizObj.m1[0],vizObj.m0[1],vizObj.m1[1], 3,vizObj.selectedTime);
	}
	else if(step==18)
	{
		statusText = 'Teknar løtumynd';
		progress(statusText);
		loadScript('js/bummelum.js', function(){ready();})		
		zoomEnd(vizObj.zoomFactor,vizObj);
	}
	else if(step==19)
	{
		statusText = 'Teknar yvirlit';
		progress(statusText);
		loadScript('js/bummelum.js', function(){ready();}) 
		paintArrows(vizObj);
		slideDiv('Map');
		paintScale(vizObj);
		OverviewUpdate();	
	}
	else
	{
		waitingState(false);
		$('#LoadingDiv').fadeOut(500);
		touchStartInit();	
		initializing = false;
	}  
}




function progress(text)
{
	var status = ((step/19)*100).toFixed(0);
	var imgsrc = 'img/landmaps/'+ step + '.svg';
	$("#img").attr('src', imgsrc);
	$( '#StatusText' ).text( text );
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
    progress(statusText);
}

function initPage()
{
    var mapSize = [$('#Map').first().outerWidth() , $('#Map').first().outerHeight()] ;
	vizObj.viewPortSize = [mapSize[0],mapSize[1]];
	
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

	$('#Content').width(mapSize[0]+'px');	
	$('#Content').height(mapSize[1]+'px');	

	//Init gradient canvas
    //Get the gradient canvas and adjust its size
    if(canvas)
    {
		var canvas    = document.getElementById('Gradient');
		canvas.width  = $('#GradientContainer').width();	
		canvas.height = $('#GradientContainer').height();
		vizObj.contextGradient = canvas.getContext("2d");

		//Get the height of the time container
		var timeHeight = $('#TimeContainer').height();
		paintScale(vizObj);
		paintGradient(vizObj);
    }
	showTimeButtons(false);
    clockTimerEnable();
}

/* Matrix functions */
function Create2DArray(rows,columns) {
	rows = Math.round(rows);
	columns = Math.round(columns);
   var x = new Array(rows);
   for (var i = 0; i < rows; i++) {
       x[i] = new Array(columns);
   }
   return x;
}

function waitingState(state)
{
	if(state == true)
	{
		$('#Waiting').css({"display": 'block'});
	}
	else
	{
		$('#Waiting').css({"display": 'none'});
	}
}

function gradientStateToggle()
{
	if($('#GradientContainer').css("display")=='none')
	{
		$('#GradientContainer').css({"display": 'initial'});
	}
	else
	{
		$('#GradientContainer').css({"display": 'none'});
	}
}
var scaleState = true;
function ScaleStateToggle()
{
	//Get the scale state
	var state = $('#ScaleContainer').css("display");
	if($('#ScaleContainer').css("display")=='block')
	{
		$('#ScaleContainer').css({"display": 'none'});
	}
	else
	{
		$('#ScaleContainer').css({"display": 'initial'});
	}	
}

function initSettingsPage()
{
	$('#ScaleContainer').css({"display": 'none'});
	$('#c3').attr('checked', false); // Unchecks it

	$('#GradientContainer').css({"display": 'none'});
	$('#c12').attr('checked', false); // Unchecks it

	$('#c2').attr('checked', false); // Unchecks it


	$("#c2").change(function(e) {      
	                                   
    	//alert('bummelum');
    	GPSStateSet(e.currentTarget.checked);
	});
}



function initTimePage()
{
	vizObj.autoTimeEnabled = true;
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
		updateSelectedTime();

	},false)

	i .addEventListener('change',function(){
		updateSelectedTime();
	},false)
	updateSelectedTime();
	if(vizObj.autoTimeEnabled == true)
	{
		$("#DatePickerContainer").slideUp(350);
		$('#AutoStartOn').prop('checked',true);
		$('#AutoStartOff').prop('checked',false);
	}
	else
	{
		$("#DatePickerContainer").slideDown(350);
		$('#AutoStartOn').prop('checked',false);
		$('#AutoStartOff').prop('checked',true);
	}
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
	$( "#overviewSelectedDate" ).text(dateToShortString(vizObj.selectedTime));		
	$( "#SelectedTimeOfDay").text(dateToString(vizObj.selectedTime));		
	
}

function timeButtonClick()
{

	waitingState(true);
	setTimeout(function() {
		simulateArea(vizObj.m0[0],vizObj.m1[0],vizObj.m0[1],vizObj.m1[1], 3,vizObj.selectedTime);	
		zoomEnd(vizObj.zoomFactor,vizObj);  
		paintArrows(vizObj);	
		slideDiv('Map');
		OverviewUpdate();
		waitingState(false);
		}, 300);
}

function nowButtonClick()
{
	var currentTime = getCurrentTime();
	if(currentTime.getTime() != vizObj.selectedTime.getTime())
	{
			vizObj.selectedTime = getCurrentTime();
		//waitingState(true);
	setTimeout(function() {
		simulateArea(vizObj.m0[0],vizObj.m1[0],vizObj.m0[1],vizObj.m1[1], 3,vizObj.selectedTime);	
		zoomEnd(vizObj.zoomFactor,vizObj);  
		paintArrows(vizObj);	
		
		OverviewUpdate();
		//waitingState(false);
		}, vizObj.waitingTimeout);


	
	$("#HourSlider").attr("value", vizObj.selectedTime.getHours()*60 + vizObj.selectedTime.getMinutes());
	$("#HourSlider").val(vizObj.selectedTime.getHours()*60 + vizObj.selectedTime.getMinutes());
	$( "#SelectedDateTime" ).text(dateToString(vizObj.selectedTime));
	$( "#MapSelectedDate" ).text(dateToString(vizObj.selectedTime));	
	$( "#overviewSelectedDate" ).text(dateToShortString(vizObj.selectedTime));		
	$('#DatePicker').datepicker("setDate", vizObj.selectedTime );
	}

}



function getCurrentTime()
{
	var date = new Date();
	var minutes = date.getMinutes();
	minutes = ((((60/vizObj.timeIncrement)* minutes)/59) .toFixed(0))/ (60/vizObj.timeIncrement);
	minutes = minutes * 60;
	if(minutes == 60)
	{
		minutes = 0;
		date.setHours(date.getHours() +1);
	}
	
	date.setMinutes(minutes);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
}

function settingsButtonClick()
{
	slideDiv('Map');
	$( '#MenuOpen').fadeIn();
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
	var shortYear = date.getFullYear();
	shortYear = Math.floor(shortYear/100)*100;
	return lz(date.getDate()) +'/' + lz(date.getMonth()+1) +'/' +  lz(date.getFullYear()-shortYear) + '  ' +  lz(date.getHours()) + ':'+lz(date.getMinutes());
}

function dateToShortString(date)
{
	var shortYear = date.getFullYear();
	shortYear = Math.floor(shortYear/100)*100;
	return lz(date.getDate()) +'/' + lz(date.getMonth()+1) +'/' +  lz(date.getFullYear()-shortYear);
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
	var start = [0,visData.contextScale.canvas.height-lineThickness];
	var ctx = visData.contextScale;
	ctx.strokeStyle = '#ffffff';
	ctx.fillStyle = '#ffffff';
	var cellSize = visData.cellSize;
	var lineLength = Math.round(ctx.canvas.width);
	var scale = ((lineLength/cellSize)*100)/1000;
	var lineStart = Math.round(ctx.canvas.width/2 - (ctx.canvas.width*0.95)/2);
	var lineStartY = 0;
	var vLineHeight = visData.contextScale.canvas.height*0.35;

	$("#ScaleContainerText").text(scale.toFixed(1) + ' km');
	ctx.clearRect(0,0,visData.contextScale.canvas.width,visData.contextScale.canvas.height);
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
	var totalHeight = visData.contextGradient.canvas.height;
    var width = visData.contextGradient.canvas.width;	
	//Draw a box containing the gradient   
	var start = [0,0];
	//Compensate for the height of the scale container
	var size = [(visData.contextGradient.canvas.width-start[0]*2),totalHeight];
	// Paint the gradient inside the box
    for(var i=0;i<gradientHEX.length;i++)
	{
		var posn = gradientHEX.length - i;
		var relPosn = (posn / gradientHEX.length);
		var height =  totalHeight*relPosn;	
		ctx.beginPath();
		ctx.rect(0,0, width, height);
		ctx.fillStyle = gradientHEX[i];
		ctx.fill();		
	}
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
	if(div=='Map')
	{
		$( '#MenuOpen').fadeIn();
	}
	// Hide the menuItem
	MenuSet(false);
}

function changeTimeFromMap()
{
	$( '#MenuOpen').fadeOut();
	slideDiv('Time');
}

function MenuInit(visData)
{
	$('#MenuContainer').css({"display": 'initial'});	
	//Calculate the size of the top margin in order to center the menu
	var menuHeight = $('#MenuItems').outerHeight();
	var displaySize = visData.displaySize[1];
	var margin = (displaySize - menuHeight)/2;
    $('#MenuContainer').css({"display": 'none'});
}

function MenuSet(open)
{
	if(open == true)
	{
		$( '#MenuOpen').fadeOut();
		$('#MenuContainer').show("slide", { direction: "right" }, 500);
	}
	else
	{
		$('#MenuContainer').hide("slide", { direction: "right" }, 500);
	}
}



function setValues(visData)
{
	if(visData)
	{
		var test = dateToString(visData.selectedTime);
		$('#valuesTable').find('#Timetd').html(''+ test);
		$('#valuesTable').find('#AutoTime').html(visData.autoTimeEnabled.toString());
		$('#valuesTable').find('#ZoomFactor').html(visData.zoomFactor.toFixed(2));
		$('#valuesTable').find('#LatLon').html(visData.lat.toFixed(3) + ","+visData.lon.toFixed(3));
		$('#valuesTable').find('#Matrix').html(visData.matrix[0].toFixed(2)+","+visData.matrix[1].toFixed(2));
		$('#valuesTable').find('#ST').html(visData.sT.toFixed(2));
		$('#valuesTable').find('#CellSize').html(visData.cellSize.toFixed(1));
		$('#valuesTable').find('#Mouse').html(visData.mouse[0].toFixed(0)+","+visData.mouse[1].toFixed(0));
		$('#valuesTable').find('#m0').html(visData.m0[0].toFixed(2) +"," +visData.m0[1].toFixed(2));
		$('#valuesTable').find('#m1').html(visData.m1[0].toFixed(2) +"," +visData.m1[1].toFixed(2));
		$('#valuesTable').find('#DisplaySize').html(visData.displaySize[0] +"," + visData.displaySize[1]);
		$('#valuesTable').find('#CanvasSize').html(visData.canvasSize[0] + ","+ visData.canvasSize[1]);
		$('#valuesTable').find('#Angle').html( rad2deg(visData.angle).toFixed(2));
	}
}

function initValuesTable()
{
	addToValuesTable('Timetd');
	addToValuesTable('AutoTime')
	addToValuesTable('ZoomFactor');
	addToValuesTable('Mouse');
	addToValuesTable('Matrix');
	addToValuesTable('LatLon');
	addToValuesTable('m0');
	addToValuesTable('m1');
	addToValuesTable('CellSize');
	addToValuesTable('Angle');
	addToValuesTable('ST');
	addToValuesTable('DisplaySize');
	addToValuesTable('CanvasSize');
}

function addToValuesTable(id)
{
	$('#valuesTable').append('<tr><td style="text-align:right;">'+id+'</td><td id='+id+'>'+0+'</td></tr>');
}

/* Timer */
var timer = new Object();
function asyncTimer(your_function, callback) {
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
	asyncTimer(timerStart,asynccallback);
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

function rad2deg(value)
{
	return value * (180/Math.PI)
}

//Timer for clock auto increment
var clockTimer = new Object();
function asyncClock(your_function, callback) {
	clockTimer = setTimeout(
	function() 
	{
		your_function(); 
		if (callback) 
		{
			callback();
		}
	}
	,1000);
}

function clockTimerEnable()
{
	asyncClock(clockTimerEnable,clockTimerCallback);
}
function clockTimerStop()
{
	window.clearTimeout(clockTimer);
	window.clearInterval(clockTimerEnable);
}

function clockTimerCallback()
{	
	nowButtonClick();
}


function AutTimeIncrement()
{
	vizObj.selectedTime = getCurrentTime();
	timeButtonClick();
	$("#HourSlider").attr("value", vizObj.selectedTime.getHours()*60 + vizObj.selectedTime.getMinutes());
	$("#HourSlider").val(vizObj.selectedTime.getHours()*60 + vizObj.selectedTime.getMinutes());
	$( "#SelectedDateTime" ).text(dateToString(vizObj.selectedTime));
	$( "#MapSelectedDate" ).text(dateToString(vizObj.selectedTime));	
	$( "#overviewSelectedDate" ).text(dateToShortString(vizObj.selectedTime));		
	$('#DatePicker').datepicker("setDate", vizObj.selectedTime );
}
function setAutoTime(value)
{
	clockTimerStop();	
	if(value=='on')
	{
		showTimeButtons(false);
		vizObj.autoTimeEnabled = true;
		nowButtonClick();
		clockTimerEnable();
		$("#DatePickerContainer").slideUp(350);
	}
	else
	{	
		vizObj.autoTimeEnabled = false;
		showTimeButtons(true);
		clockTimerStop();	
		$("#DatePickerContainer").slideDown(350);
	}
}

function showTimeButtons(value)
{
	if(value==true)
	{
		$('#TimeContainer').find('.timeButton').fadeIn();
	}
	else
	{
		$('#TimeContainer').find('.timeButton').fadeOut();
	}
	

}
