var simLocations = new Object();
var watchID = 0;
var GPSState = false;
function initGPS()
{
 	GPSStateSet(GPSState);    
}

function initGPSRose()
{
    var viewPortWidth = vizObj.viewPortSize[0];
    var viewPortHeight = vizObj.viewPortSize[1];   
	// Put the compass needle in the center of the screenpos
	var displayWidth = vizObj.viewPortSize[0];
	var compassWidth = $('.compassRose').outerWidth();
	var left = displayWidth/2 - compassWidth/2;
	$('.compassImage').css({"left": left +'px'});
}

/*
function GPSStateToggle()
{
	if(GPSState == false)
	{
		var options = { frequency: 3000 , enableHighAccuracy: true}; //THIS I SPECIFY INTERVAL TIME TO SEND POSITIONS
		watchID = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, options);
		//Show the LocationInfo element
		//$('#LocationInfo').css({"display": 'initial'});
		GPSState = true;
	}
	else
	{
		navigator.geolocation.clearWatch(watchID);
		//Hide the LocationInfo element
		//$('#LocationInfo').css({"display": 'none'});
			GPSState = false;
	}
}
*/

function GPSStateSet(state)
{
	if(state == true)
	{
		var options = { frequency: 3000 , enableHighAccuracy: true}; //THIS I SPECIFY INTERVAL TIME TO SEND POSITIONS
		watchID = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, options);
		//Show the LocationInfo element
		$('#LocationInfo').css({"display": 'initial'});
		$("#LocationInfo").css({"top": (-10000) + "px" });
		GPSState = true;
	}
	else
	{
		navigator.geolocation.clearWatch(watchID);
		//Hide the LocationInfo element
//		$('#LocationInfo').css({"display": 'none'});
		$("#LocationInfo").css({"top": (-10000) + "px" });

		GPSState = false;
	}
}


function updateGPSValues()
{
	if(vizObj.Position.coords)
	{		
		$('#GPS_Speed').html(Number((vizObj.Position.coords.speed)*18/5).toFixed(1));
		$('#GPS_Latitude').html(Number(vizObj.Position.coords.latitude).toFixed(5));
		$('#GPS_Longitude').html(Number(vizObj.Position.coords.longitude).toFixed(5));

		if( ((vizObj.Position.coords.speed)*18/5) >= 2)
		{
			$('#GPS_Heading').html(Number(vizObj.Position.coords.heading).toFixed(0) + '° ' + CompassAngleName(vizObj.Position.coords.heading) );
			var str = 'rotate(' + Number(vizObj.Position.coords.heading).toFixed(2) + 'deg)';
			$('#GPS_Heading_Img').css({"-ms-transform": str,"-webkit-transform": str,"transform": str, });
			$('#GPS_Heading_Img').css({"opacity": 1});
		}
		else
		{
			$('#GPS_Heading').html('-');
			var str = 'rotate(' + 0 + 'deg)';
			$('#GPS_Heading_Img').css({"-ms-transform": str,"-webkit-transform": str,"transform": str, });
			$('#GPS_Heading_Img').css({"opacity": 0.25});
		}

		$('#GPS_Altitude').html(Number(vizObj.Position.coords.altitude).toFixed(0));
		$('#GPS_Accuracy').html(Number(vizObj.Position.coords.accuracy).toFixed(0));

		GPSDisplayUpdate(vizObj.Position.coords.latitude,vizObj.Position.coords.longitude);
	}
}

var geolocationSuccess = function(position) {
    vizObj.Position = position;
    updateGPSValues();
};

var geolocationError = function onError(error) { 
}

var gpsSimSteps = 20;
function makeSimLocations()
{	
	var cs = [143,332];
	var r = 10;
	simLocations = Create2DArray(gpsSimSteps,2);
	var stepRad = (2*Math.PI)/gpsSimSteps;
	for(s=0;s<gpsSimSteps;s++)
	{
		var x =  ( Math.cos(stepRad*s)*r + cs[0]);
		var y =  ( Math.sin(stepRad*s)*r + cs[1]);
		simLocations[s] = [x,y];
		simLocations[s] = grid2geo(simLocations[s][0],simLocations[s][1], 821)
	}	
	GPSTimerStart();
}

/* GPS simulation timer */

var GPSTimer = new Object();
function async(your_function, callback)
{
	GPSTimer = setTimeout(function() {your_function();if (callback) {callback();}},1000);
}

function GPSTimerStart()
{
	async(GPSTimerStart,GPSTimerasynccallback);
}

function GPSTimerStop()
{
	window.clearInterval(GPSTimerStart)
}

var GPSTimerrunning = false;
function GPSTimertimerToggle()
{
	if(GPSTimerrunning==false)
	{
		GPSTimerrunning = true;
		GPSTimertimerStart();
	}
	else
	{
		GPSTimerrunning = false;
		window.clearTimeout(GPSTimertimer);
	}
}

function GPSDisplayUpdate(lat,long)
{
	if(lat == 0 || long ==0)
	{
		return;
	}
	var mposn = geo2grid(lat,long);
	if(mposn[0] <0 && mposn[1]<0)
	{
	return;	
	}
	var screenposn = geo2grid(lat,long);
	screenposn =  matrix2Disp(screenposn[0], screenposn[1],vizObj);	

    gpsPosn = gpsPosn+1;
    if(gpsPosn>gpsSimSteps-1)
    {
    	gpsPosn = 0;
    	GPSTimerStop();
    }

	var infoWidth = Math.round( $('#LocationInfo').width()/2);
	var angle = angles[Math.round(mposn[1])][Math.round(mposn[0])];

	angle = rad2deg(angle);
	angle = (450-angle) % 360;
	angle = angle.toFixed(0);
	
	var amplitude = amplitudes[Math.round(mposn[1])][Math.round(mposn[0])];

	if(amplitude >=0 && angle != 'NaN')
	{
		amplitude = amplitude.toFixed(5);
		$('#LocationInfoAmplitude').html(lat.toFixed(5) + ' ' + long.toFixed(5) + ' ' + amplitude +'m/s');
		$('#LocationInfoAngle').html(angle +'° ' +CompassAngleName(angle));
	}
	else
	{
		$('#LocationInfoAmplitude').html('');		
		$('#LocationInfoAngle').html('');
	}	
	
	var imageHeight =  $('#LocationInfoIcon').height();
	var imageWidth = $('#LocationInfoIcon').width();
	$("#LocationInfo").css({"top": (screenposn[1]-imageHeight) + "px", "left": screenposn[0]-infoWidth+ "px" });

}

var gpsPosn = 0;
function GPSTimerasynccallback()
{	
	GPSDisplayUpdate(simLocations[gpsPosn][0],simLocations[gpsPosn][1])
    gpsPosn = gpsPosn+1;
    if(gpsPosn>gpsSimSteps-1)
    {
    	gpsPosn = 0;
    	GPSTimerStop();
    }
}

function CompassAngleName(angle)
{
	if(angle >=0 && angle <= 22.5)
	{
		return 'N';
	}
	else if(angle >337.5)
	{
		return 'N';
	}
	else if(angle >22.5 && angle <=67.5)
	{
		return 'NE';
	}
	else if(angle > 67.5 && angle <=112.5)
	{
		return 'E';
	}
	else if(angle > 112.5 && angle <= 157.5)
	{
		return 'SE';
	}
	else if(angle > 157.5 && angle <=202.5)
	{
		return 'S';
	}
	else if(angle > 202.5 && angle <= 247.5)
	{
		return 'SW';
	}
	else if(angle > 247.5 && angle <=292.5)
	{
		return 'W';
	}
	else if(angle >292.5 && angle <337.5)
	{
		return 'NW';
	}
}




















