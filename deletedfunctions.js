function paintQuadBezier(x0,y0,x1,y1)
{
	var intersect = vectorInterSection(x0,y0,angles[Math.round(y0)][Math.round(x0)],x1,y1,angles[Math.round(y1)][Math.round(x1)]);
	var P1 = matrix2Disp(intersect[0],intersect[1], vizObj);
	var P0 = matrix2Disp(x0,y0,vizObj);
	var P2 = matrix2Disp(x1,y1,vizObj);

	var c=document.getElementById("Preview");
	var ctx=c.getContext("2d");
	ctx.strokeStyle='yellow';
	ctx.lineWidth=3;
	ctx.beginPath();
	ctx.moveTo(P0[0],P0[1]);
	ctx.quadraticCurveTo(P1[0],P1[1],P2[0],P2[1]);

	ctx.stroke();
	ctx.closePath();
}


/*
	Draws a vector from xstart,ystart with the specified length and angle on to the specified context
*/
function drawSquare2(xstart, ystart, diam, context,color)
{

	diam = Math.ceil(diam);
	xstart = Math.round(xstart -(diam/2));
	ystart = Math.round(ystart - (diam/2));
	context.beginPath();
	context.rect(xstart, ystart, diam+1, diam+1);	
	context.fillStyle = color;
    context.fill();
}


function arrowOnCell2(x,y, visData)
{
	var c = matrix2Disp(x,y,visData);
	drawVector(c[0], c[1], visData.cellSize, angles[y][x], visData.contextPreview,'black');	
}


function getGradientValue(magnitude)
{
	if(magnitude<0.5)
	{
		return [0,0,255];
	}
	else if(magnitude>=0.5 && magnitude < 1.5)
	{
		return [0,255,255];
	}
	else if(magnitude>=1.5 && magnitude < 2.5)
	{
		return [0,255,0];
	}
	else if(magnitude >=2.5 && magnitude < 3.5)
	{
		return [255,255,0];
	}
	else if(magnitude >=3.5)
	{
		return [255,0,0];
	}
}

/* Painting functions */

/*!
 * \fn void paintMatrix(matrix,canvasID, centered, matrixCoords, stretchX, stretchY)
 * \param array matrix the matrix which should be painted 
 * \param string canvasID the id of the canvas which the matrix will be painted on
 * \param bool   centered specifies if the matrix should be centered on the canvas
 * \param array matrixCoords if a section of the matrix is to be painted, this specifies the coordinates [xStart,yStart,xStop,yStop]. 
 	If it is null, the entire matrix will be painted
 *  \param bool stretchX specifies if the matrix should be stretched in the x direction (if it is narrower than the canvas)
 *  \param bool stretchY specifies if the matrix should be stretched in the y direction (if it is shorter than the canvas)
 */
function paintMatrix(matrix,canvasID, centered, matrixCoords,interPolate, visData)
{

	//Set default start and stop coordinates in the matrix
	var xStart  = 0;
	var yStart  = 0;
	var xStop   = matrix[0].length;
	var yStop   = matrix.length;
	var stretchX = false;
	var stretchY = false;

	//If start and stop coordinates are specified as a parameter, use these instead
	if(matrixCoords)
	{
		xStart  = matrixCoords[0];
		yStart  = matrixCoords[1];
		xStop   = matrixCoords[2];
		yStop   = matrixCoords[3];
		stretchX = matrixCoords[4];
		stretchY = matrixCoords[5];
	}

	// Calculate the width and height of the matrix (or submatrix) which should be painted
	var xLength = xStop - xStart;
	var yLength = yStop - yStart;

	if(canvasID != canvasIDPre)
	{
		paintMatrixCanvas = document.getElementById(canvasID);
		//Get the context from the canvas which this matrix should be drawn on
		paintMatrixCanvas    = document.getElementById(canvasID);
		paintMatrixCanvas.width  = $('#'+canvasID).width();
		paintMatrixCanvas.height = $('#'+canvasID).height();
		paintMatrixContext          = paintMatrixCanvas.getContext("2d");
		canvasIDPre = canvasID;
	}

	// set the width of the output to the same width as the input
	var xLengthOutput = xLength;
	// Repeat for height
	var yLengthOutput = yLength;

	// Set the width of the output the same as the width of the canvas, if stretchX is true
	if(stretchX)
	{
		xLengthOutput = paintMatrixCanvas.width;
		if(xLengthOutput > paintMatrixCanvas.width)
		{
			xLengthOutput = paintMatrixCanvas.width;
		}
		yLengthOutput = yLengthOutput * (xLengthOutput / xLength);
	}
	if(stretchY)
	{
		yLengthOutput=paintMatrixCanvas.height;
		if(yLengthOutput > paintMatrixCanvas.height)
		{
			yLengthOutput = paintMatrixCanvas.height;
		}
		// Recalculate the xLengthOutput in order to maintain aspect ratio
		xLengthOutput = xLengthOutput * (yLengthOutput / yLength);
	}

	//Calculate cell size in pixels
	var nPixelsX = xLengthOutput/matrix[0].length;

	//If the matrix is smaller than the canvas, it will be centered, if the centered parameter is true.
	//Otherwise the method will start drawing in the upper right corner.
	var xoff = 0
	var yoff = 0;
	if(centered)
	{
		xoff = ((paintMatrixContext.canvas.width-xLengthOutput)/2);
		yoff = ((paintMatrixContext.canvas.height - yLengthOutput)/2);
	}	
	var repaint = false;
	//Check if matrixCoords or centered has changed since last time
	for(var i=0;i<6;i++)
	{
		if(matrixCoords[i]!=matrixCoordsPre[i])
		{
			repaint = true;
		}		
	}
	if(centered != centeredPre)
	{
		repaint = true;
		centeredPre = centered;
	}
	if(repaint == true)
	{
		for(var i=0;i<6;i++)
		{
			matrixCoordsPre[i] = matrixCoords[i];					
		}
	}
	//Check if xoff, yoff, xLengthOutput or yLengthOutput have changed since last time
	if(repaint == true)
	{
		//Store the current values
		xoffPre = xoff;
		yoffPre =yoff;
		xLengthOutputPre = xLengthOutput;
		yLengthOutputPre = yLengthOutput;
		// Get the context imagedata
		imageData = paintMatrixContext.getImageData(xoff, yoff, xLengthOutput, yLengthOutput);
		
	}

	var nPixels = imageData.width*imageData.height;
	var xScale = xLengthOutput / xLength;
	visData.xScale = xScale;
	var yScale = yLengthOutput / yLength;	

	if(repaint == true)
	{
	    var pi=0;
		for(var dispY=0;dispY<imageData.height;dispY++)
		{
			var newY = Math.round(dispY*(1/yScale)+ yStart) ;

			for(var dispX=0;dispX<imageData.width;dispX++)
			{	
				//Map dispX and dispY to the input matrix
				var newX = Math.round(dispX*(1/xScale)+ xStart) ;			
				if(newY<0)
				{
					newY = 0;
				}
				if(newY > matrix.length-1)
				{
					newY = matrix.length-1;
				}
				if(newX<0)
				{
					newX = 0;
				}
				if(newX> matrix[0].length-1)
				{
					newX = matrix[0].length-1;
				}

				var pixelIndex = (pi*4);						
				if (matrix[newY][newX] == 0 ) 
				{
					imageData.data[pixelIndex] = 255;
					imageData.data[pixelIndex + 1] = 0;
					imageData.data[pixelIndex + 2] = 0;
					imageData.data[pixelIndex + 3] = 255;

				} 							
				else 
				{					
					//Transparent ocean
					imageData.data[pixelIndex + 3] = 0;									 
				}						
				pi=pi+1;
			}
		}
		repaint = false;
		if(canvasID == 'Image')
		{
				    var pi=0;
		for(var dispY=0;dispY<imageData.height;dispY++)
		{
			var newY = Math.round(dispY*(1/yScale)+ yStart) ;

			for(var dispX=0;dispX<imageData.width;dispX++)
			{
				//Map dispX and dispY to the input matrix
				var newX = Math.round(dispX*(1/xScale)+ xStart) ;			
				if(newY<0)
				{
					newY = 0;
				}
				if(newY > matrix.length-1)
				{
					newY = matrix.length-1;
				}
				if(newX<0)
				{
					newX = 0;
				}
				if(newX> matrix[0].length-1)
				{
					newX = matrix[0].length-1;
				}

				var pixelIndex = (pi*4);						
				if (matrix[newY][newX] != 0 ) 
				{
					imageData.data[pixelIndex] = 102;
					imageData.data[pixelIndex + 1] = 153;
					imageData.data[pixelIndex + 2] = 255;
					imageData.data[pixelIndex + 3] = 255;
				}				
				pi=pi+1;
			}
		}
		}
	}

	paintMatrixContext.putImageData(imageData,xoff,yoff);
	
	if(interPolate == true && (xLength != xLengthPre | yLength != yLengthPre ))
	{
		xLengthPre = xLength;
		yLengthPre = yLength;
		interPolationDisp   = Create2DArray(xLength*yLength,3); 
	}
	
	
	var interPolationIndex = 0;
	if(visData.interPolate == true)
	{
		
		//Loop through the input matrix and find all indices which should be interpolated
		for(var x=Math.round(xStart);x<xStop;x++)
		{
			for(var y= Math.round(yStart);y<yStop;y++)
			{
				if (matrix[y][x]!=0 && matrix[y][x-1] ==0 &&  matrix[y+1][x] ==0) 
				{
					var dx = (x-xStart)*xScale-(xScale/2);
					var dy = (y-yStart)*yScale-(yScale/2);
					interPolationDisp[interPolationIndex][0] = dx+1;
					interPolationDisp[interPolationIndex][1] = dy+1;
					interPolationDisp[interPolationIndex][2] = 0;
					interPolationIndex++;			
				} 
				else if(matrix[y][x]!=0 && matrix[y][x+1] ==0 &&  matrix[y-1][x] ==0)
				{
					var dx = (x-xStart)*xScale-(xScale/2);
					var dy = (y-yStart)*yScale-(yScale/2);
					interPolationDisp[interPolationIndex][0] = dx+1;
					interPolationDisp[interPolationIndex][1] = dy+1;
					interPolationDisp[interPolationIndex][2] = 1;
					interPolationIndex++;	
				}	
				else if(matrix[y][x]!=0 && matrix[y][x+1] ==0 &&  matrix[y+1][x] ==0)
				{
					var dx = (x-xStart)*xScale-(xScale/2);
					var dy = (y-yStart)*yScale-(yScale/2);
					interPolationDisp[interPolationIndex][0] = dx+1;
					interPolationDisp[interPolationIndex][1] = dy+1;
					interPolationDisp[interPolationIndex][2] = 2;
					interPolationIndex++;	
				}
				else if(matrix[y][x]!=0 && matrix[y][x-1] ==0 &&  matrix[y-1][x] ==0)
				{
					var dx = (x-xStart)*xScale-(xScale/2);
					var dy = (y-yStart)*yScale-(yScale/2);
					interPolationDisp[interPolationIndex][0] = dx+1;
					interPolationDisp[interPolationIndex][1] = dy+1;
					interPolationDisp[interPolationIndex][2] = 3;
					interPolationIndex++;	
				}
			}
		}

		//Draw interpolation triangles
		if(xScale>2)
		{	trianglesInit = false;
			for(var i=0;i<interPolationIndex;i++)
			{
				paintTriangle(xScale,interPolationDisp[i][0],interPolationDisp[i][1],interPolationDisp[i][2], visData);
			}

		}

	}		
	return [xoff,yoff,xoff + xLengthOutput, yoff+yLengthOutput,xScale];
}

function paintTriangle(size,x,y,orientation,visData)
{	
	size = Math.round(size);
	if(visData.xScale != visData.xScalePrev)
	{
		visData.xScalePrev = visData.xScale;
		initTriangles(0,0,size, 0,visData);
		initTriangles(0,0,size, 1,visData);
		initTriangles(0,0,size, 2,visData);
		initTriangles(0,0,size, 3,visData);
		trianglesInit=true;
	}
	if(orientation==1)
	{
		visData.con.putImageData(triangle1,x,y);
	}
	else if(orientation==0)
	{
		visData.con.putImageData(triangle0,x,y);
	}
	else if(orientation==2)
	{
		visData.con.putImageData(triangle2,x,y);
	}
	else if(orientation==3)
	{
		visData.con.putImageData(triangle3,x,y);
	}
}

function vectorInterSection(x0,y0,theta0,x1,y1,theta1)
{
	y0 = y0*(-1);
	y1 = y1*(-1);
	var alpha0 = Math.tan(theta0);
	var alpha1 = Math.tan(theta1);
	var b0 = y0-x0*alpha0;
	var b1 = y1-x1*alpha1;
	var x = (b1-b0)/(alpha0-alpha1);
	var y = (alpha0*x+b0)*(-1);
	return [x,y];
}


function paintMatrix2(matrix,canvasID, matrixCoords,dispCoords, visData)
{

	xStart  = matrixCoords[0];
	yStart  = matrixCoords[1];
	xStop   = matrixCoords[2];
	yStop   = matrixCoords[3];	

	// Calculate the width and height of the matrix (or submatrix) which should be painted
	var xLength = xStop - xStart;
	var yLength = yStop - yStart;

	if(canvasID != canvasIDPre)
	{
		paintMatrixCanvas = document.getElementById(canvasID);
		//Get the context from the canvas which this matrix should be drawn on
		paintMatrixCanvas    = document.getElementById(canvasID);
		paintMatrixCanvas.width  = $('#'+canvasID).width();
		paintMatrixCanvas.height = $('#'+canvasID).height();
		paintMatrixContext          = paintMatrixCanvas.getContext("2d");
		canvasIDPre = canvasID;
	}

	// set the width of the output to the same width as the input
	var xLengthOutput = xLength;
	// Repeat for height
	var yLengthOutput = yLength;

	//Calculate cell size in pixels
	var nPixelsX = xLengthOutput/matrix[0].length;
	// Get the context imagedata
	imageData = paintMatrixContext.getImageData(dispCoords[0], dispCoords[1], dispCoords[2]-dispCoords[0], dispCoords[3]-dispCoords[1]);


	var nPixels = imageData.width*imageData.height;
	var xScale = imageData.width / xLength;
	visData.xScale = xScale;
	visData.cellSize = xScale;
	var yScale = imageData.height / yLength;	

	    var pi=0;
		for(var dispY=0;dispY<imageData.height;dispY++)
		{
			var newY = Math.round(dispY*(1/yScale)+ yStart) ;

			for(var dispX=0;dispX<imageData.width;dispX++)
			{			

				//Map dispX and dispY to the input matrix
				var newX = Math.round(dispX*(1/xScale)+ xStart) ;			
				if(newY<0)
				{
					newY = 0;
				}
				if(newY > matrix.length-1)
				{
					newY = matrix.length-1;
				}
				if(newX<0)
				{
					newX = 0;
				}
				if(newX> matrix[0].length-1)
				{
					newX = matrix[0].length-1;
				}

				var pixelIndex = (pi*4);						
				if (matrix[newY][newX] == 0 ) 
				{
					imageData.data[pixelIndex] = 255;
					imageData.data[pixelIndex + 1] = 0;
					imageData.data[pixelIndex + 2] = 0;
					imageData.data[pixelIndex + 3] = 255;
				} 							
				else 
				{					
					//Transparent ocean
					imageData.data[pixelIndex + 3] = 0;									 
				}						
				pi=pi+1;
			}
		}
	
	paintMatrixContext.putImageData(imageData,dispCoords[0],dispCoords[1]);
}


//var xoffPre = 0;
//var yoffPre = 0;
//var xLengthOutputPre = 0;
///var yLengthOutputPre = 0;

//var xLengthPre = 0;
//var yLengthPre = 0;
//var interPolationDisp = Object();
//var canvasIDPre = '';
//var paintMatrixCanvas = new Object();

//var matrixCoordsPre = [0,0,0,0,0,0];
//var centeredPre = new Object();


var xScaleOld = 0;
function PaintTrianges(xScale)
{
	if(xScale != xScaleOld)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function getSubMatrix(iw,ih, canvasID,zf, xoff, yoff)
{
	if(!xoff)
	{
		xoff=0;
	}
	if(!yoff)
	{
		yoff=0;
	}
    var stretchX = false;
	var stretchY = false;	

    //Get the context from the canvas which this matrix should be drawn on
	var canvas    = document.getElementById(canvasID);

	//Based on the size of the template and the size of the display calculate suitable scaling factor
	var sX = canvas.width  / iw; //Calculate scaling factor for x-axis
	var sY = canvas.height / ih; //Calculate scaling factor for y-axis	
	var st = 1;
	//Check if it is possible to use sY to also scale the x dimension
	if(ih * sX <= canvas.height )
	{
		st = sX; 
	}
	else
	{
		st = sY;  
	}
	
	var yzft = (st * zf*ih)/canvas.height;
	var xzft = (st * zf*iw)/canvas.width;
	if(zf <=1)
	{
		yzft = 1;
		xzft = 1;
	}
	var yCrop = (ih / yzft);
	var yStart = ((ih - yCrop)/2) +yoff;
	if(yStart < 0 )
	{
		yStart = 0;
	}
	var yStop  = (yStart )+ yCrop;
	// Validate yStart and yStop
	if(yStart < 0)
	{
		yStart = 0;
		yStop = yStart + yCrop;
	}
	else if(yStop > ih)
	{
		yStop = ih ;
		yStart = yStop - yCrop;
	}
	var xCrop = (iw / xzft);
	var xStart = ((iw - xCrop)/2)+xoff;
	if(xStart < 0)
	{
		xStart = 0;
	}
	var xStop  = (xStart + xCrop);
	// Validate xStart and xStop
	if(xStart < 0)
	{
		xStart = 0;
		xStop = xStart + xCrop;
	}
	else if(xStop > iw)
	{
		xStop = iw;
		xStart = 0;
		xCrop = iw;
	}

    var aspectRatioCanvas = canvas.width / canvas.height;
    var aspectRatioImage = (xStop-xStart) / (yStop-yStart);
    var strecthX = false;
    var stretchY = false;

	if(aspectRatioCanvas.toFixed(2) == aspectRatioImage.toFixed(2))
	{
		stretchX = true;			     	
	}
	else if(aspectRatioCanvas > aspectRatioImage)
	{
		stretchY = true;
    	stretchX = false;
	}
	else if(aspectRatioCanvas < aspectRatioImage)
	{
		stretchY = false;
    	stretchX = true;
	}

	return [xStart,yStart,xStop,yStop, stretchX, stretchY];
}


// Pan timer
var panTimer = new Object();
function async2(your_function, callback) {
	panTimer = setTimeout(
	function() 
	{
		your_function(); 
		if (callback) 
		{
			callback();
		}
	}
	,500);
}

function panEnable()
{
	async2(panEnable,panEnableCallback);
}
function panEnableTimerStop()
{

	window.clearTimeout(panTimer);
	window.clearInterval(panEnable);
}

function panEnableCallback()
{	
    pan.options.enable = true;
    panEnableTimerStop();
    //alert('pan re-enabled');
}

// Pinch timer
var pinchTimer = new Object();
function async3(your_function, callback) {
	pinchTimer = setTimeout(
	function() 
	{
		your_function(); 
		if (callback) 
		{
			callback();
		}
	}
	,500);
}

function pinchEnable()
{
	async3(pinchEnable,pinchEnableCallback);
}
function pinchEnableTimerStop()
{

	window.clearTimeout(pinchTimer);
	window.clearInterval(pinchEnable);
}

function pinchEnableCallback()
{	
    pinch.options.enable = true;
    pinchEnableTimerStop();
    //alert('pinch re-enabled');
}

// Zoomend timer
var zoomEndTimer = new Object();
function async4(your_function, callback) {
	zoomEndTimer = setTimeout(
	function() 
	{
		your_function(); 
		if (callback) 
		{
			callback();
		}
	}
	,500);
}

function zoomEndEnableFunction()
{
	async4(zoomEndEnableFunction,zoomEndEnableCallback);
}
function zoomEndEnableTimerStop()
{

	window.clearTimeout(zoomEndTimer);
	window.clearInterval(zoomEndEnableFunction);
}

function zoomEndEnableCallback()
{	
zoomEndEnable = true;

    zoomEndEnableTimerStop();
    //alert('zoomEnd re-enabled');
}




function viewPortSize()
{
	var viewPortHeight = window.innerHeight;
	var viewPortWidth = $( window ).width();
	return [viewPortWidth,viewPortHeight];
}