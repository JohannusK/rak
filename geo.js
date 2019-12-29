// Definitions used in geo.js
var rad = 180/Math.PI;		// Define one radian
var crop = 140;				// How many cells have been cropped from the original matrix
var ewpivot=( -7.000)/rad;	// Pivot point of the matrix
var onedgr =1852*60;		// One angular degree
var orgHeight = 1501;		// Height of original matrix

//Convert geographical latitude and longitude to matrix index (x,y)
function geo2grid(lat,lon)
{
	var rlon=lon/rad-ewpivot;
	var rlat=lat/rad;
	var alat  = Math.asin( Math.sin(rlon)*Math.cos(rlat));
	var ydisp = Math.asin(Math.sin(rlat)/Math.cos(alat));
	var southb =  61.2/rad;
	var gridn  = 100/onedgr;
	var y =  1501 - (1+(ydisp-southb)*rad/gridn) -crop;
	var dist=Math.log(Math.tan((2*alat+Math.PI)/4))*rad/gridn;
	var x = (0.5*821+dist);	
	//var scaled = mapOrg2Rendered(x,y,vizObj.sT);
	//x = Math.round(x);
	//y = Math.round(y);
	var returnVal = [x,y];
	return returnVal;
}

//Convert matrix index (x,y) og geographical coordinates latitude and longitude
function grid2geo(x,y, width)
{
	var gridn  = 100/onedgr/rad;
	var southb =  61.2/rad;
	var xpivn = 0.5*width;
	y = 1501-y-crop;
	var latn=alat(x-xpivn,gridn);  
	var ydist=(y-1)*gridn;
	ydist = ydist + southb;
	var rlat =Math.asin(Math.sin(ydist)* Math.cos(latn));
	var rlon =ewpivot+Math.asin(Math.sin(latn)/Math.cos(rlat));
	var lat=rlat*rad;
	var lon=rlon*rad;
	return [lat,lon];

}

function alat(dist,grid)
{
	 return 2 * Math.atan(Math.exp(dist*grid))-(Math.PI/2);
}

function mapOrg2Rendered(x,y,s)
{
	var coords = matrix2Disp(x,y);	
	var radius = 10;
	var xcenter = coords[0];
	var ycenter = coords[1];

	contextGeo.clearRect(0, 0, window.innerWidth, window.innerHeight);
	contextGeo.lineWidth = 2;
	contextGeo.strokeStyle = "rgba(247, 216, 66, 1)";
	contextGeo.beginPath();
    contextGeo.moveTo(xcenter-radius, ycenter);
    contextGeo.lineTo(xcenter+radius, ycenter);
    contextGeo.stroke();

    contextGeo.beginPath();
    contextGeo.moveTo(xcenter, ycenter-radius);
    contextGeo.lineTo(xcenter, ycenter+radius);
    contextGeo.stroke();    

	contextGeo.beginPath();
	contextGeo.arc(xcenter, ycenter, radius, 0, 2 * Math.PI, false);
	contextGeo.lineWidth = 2;
	contextGeo.strokeStyle = "rgba(247, 216, 66, 1)";
	contextGeo.stroke(); 

}


    var currentArrow = new Image();
    currentArrow.src = 'img/currentArrow.svg';

/*
	Draws a vector from xstart,ystart with the specified length and angle on to the specified context
*/
function drawVector(xstart, ystart, length, angle, context)
{
	//length=length*0.8;
	var angleRad = angle;// *(Math.PI/180);
	//var arrowLength = length*0.5;
	//xstart = xstart +(length);//*Math.cos(angleRad-Math.PI);
	//ystart = ystart + (length);//*Math.sin(angleRad-Math.PI);
	context.save();
	context.translate(xstart, ystart);
	context.rotate(-angle);
	//context.rotate(-3.12);
	context.translate(-length/2, -length/2);
	context.drawImage(currentArrow, 0, 0,length,length);
	context.restore(); 

	/*
	var xstop = xstart + length * Math.cos(angleRad);
	var ystop = ystart - length * Math.sin(angleRad);
	//var aleft = (angle+180-45)*(Math.PI/180);
	var aleft = angleRad+Math.PI-Math.PI/16;
	var left = [xstop + arrowLength * Math.cos(aleft), ystop - arrowLength * Math.sin(aleft)   ];
	//var aright = (angle+180+45)*(Math.PI/180);
	var aright = angleRad+Math.PI+Math.PI/16;
	var right = [xstop + arrowLength * Math.cos(aright), ystop - arrowLength * Math.sin(aright)   ];
*/
	/*context.beginPath();
	context.moveTo(xstart,ystart);
	context.lineTo(xstop, ystop);
	context.lineWidth = 1;
	var colorString = 'rgb('+color[0]+','+color[1] + ','+ color[2] +')';
	context.strokeStyle = color;
	context.stroke();
	context.closePath();*/
	//Now draw the arrowhead
	//Find the three coordinates of the triangle which is the arrowhead
	// 1: bottom x,y is the same as xstop, ystop
	// 2: top x,y is 10px away from bottom x,y in the direction of the vector
	//var A =[xstop,ystop];
	//var B = [ left[0],left[1]];
	//var C = [right[0],right[1]];
/*
	context.beginPath();
	context.moveTo(A[0],A[1]);
	context.lineTo(B[0]  ,B[1]);
	context.lineTo(C[0],C[1]);
	context.closePath();
	context.fillStyle = 'black';
	context.fill();
	*/
	//context.translate(xstart, ystart); 


	
}

/*
	Draws a vector from xstart,ystart with the specified length and angle on to the specified context
*/
function drawSquare(xstart, ystart, diam, context,color)
{

	diam = Math.ceil(diam);
	xstart = Math.round(xstart -(diam/2));
	ystart = Math.round(ystart - (diam/2));
	//var colorString = 'rgb('+color[0]+','+color[1] + ','+ color[2] +')';
	context.beginPath();
	context.rect(xstart, ystart, diam+1, diam+1);	
	context.fillStyle = color;
    context.fill();
}
























