

function makeCharts(data)
{
	// Get the overview element and clean it
	var parent = document.getElementById("Overview");

	$('.overviewChart').remove()
	/*
	while (parent.hasChildNodes()) 
	{
    	parent.removeChild(parent.lastChild);
	}*/

	// Make new elements, one for each data set
	for(var i=0;i<data.length;i++)
	{
		var elementName = 'ChartValues' + i;
		var iDiv = document.createElement('div');
		iDiv.id = elementName;
		iDiv.className = 'overviewChart';
		document.getElementById("Overview").appendChild(iDiv);			
		paintBars(elementName, data[i]);		
	}
}

function paintBars(elementName, data)
{
	var columnLegendContent = '';
	var l = data.Points.length;
	var max = 4;
	var maxem = 10;
	//var elementName = 'ChartValues' + 1;
	$('#'+elementName).empty();
	$('#'+elementName).append('<p>' + data.Name + '</p>');	

	$( "#" + elementName ).append('<div class="axisUnit">m/s</div>')
	$( "#" + elementName ).append('<div class="chartColumn chartColumnAxis" style="height:100%;">'
	+'<div div class="subAxis"><p>4</p><div class="horizontalLine"></div></div>'
	+'<div div class="subAxis"><p>3</p><div class="horizontalLine"></div></div>'
	+'<div div class="subAxis"><p>2</p><div class="horizontalLine"></div></div>'
	+'<div div class="subAxis"><p>1</p><div class="horizontalLine"></div></div>'

	+'</div>');
	var width = (100/(l+1)) - 0.1;
	var angles = [l]
	for(var col=0;col<l;col++)
	{
		var columnLegend = '';
		if(col % 4 == 0)
		{
			columnLegend =   data.Points[col].x.getHours();
			if(columnLegend<10)
			{
				//columnLegend = '0'+columnLegend;
			}
		}
		var imgName = elementName + col+'img';
		var height = (data.Points[col].y/max*100);
		var angle = data.Points[col].z;
		var str = 'rotate(' + angle + 'deg)';
		$( "#" + elementName ).append(

		'<div class="chartColumn" style="height:100%;">'
		+'<p class="columnName">'+ columnLegend  + '</p>'
		+'<div class="columnLegend"><img id="'+ imgName+'" src="img/currentArrowFat.svg"/></div>'
		+'<div class="chartColumnContent" style="height:'+(height)+'%;">'
		+'</div></div>');
		if(col % 4 == 0)
		{
			$('#'+imgName).css({"-ms-transform": str,"-webkit-transform": str,"transform": str, });
		}
		else
		{
			$('#'+imgName).css({"display": 'none' });
		}	    
	}
	$( ".chartColumn" ).width(width + '%')
	//$( ".chartColumn" ).height(maxem + 'em')
	

}


