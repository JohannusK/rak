function zoomInit()
{
	var counts = 0;
	var myElement = document.getElementById('myElement');

	var mc = new Hammer.Manager(myElement);

	// create a pinch and rotate recognizer
	// these require 2 pointers
	var pinch = new Hammer.Pinch();
	var tap = new Hammer.Tap();

	// we want to detect both the same time
	pinch.recognizeWith(tap);

	// add to the Manager
	mc.add([pinch, tap]);


	mc.on("pinchout pinchin tap", function(ev) {
		if(ev.type == "pinchin")
		{
		myElement.textContent = ev.type +":"+ev.scale;
		
		}
		else if (ev.type == "tap")
		{
			myElement.textContent = ev.type;
			counts = 0;
		}
		else
		{
				myElement.textContent = ev.type +":"+ev.scale;
		
		}

	});

	
}