
	textBox: function(input) {
		var x, y, h, w;
		x = 20;
		y = 20;
		h = 100;
		w = 400;
		
		//draw the box
		g.beginFill(0xffffff);
		g.lineStyle(5, 0xffd900, 1);
		g.drawRect(x, y, w, h);
		g.endFill();
		
		//write the text
		var style = { font: "16px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle", align: "center", wordWrap: true, wordWrapWidth: w};
		var text = game.add.text(0, 0, input, style);
		text.setTextBounds(x, y, w, h);
	}, //end of textBox
