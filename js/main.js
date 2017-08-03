var game = new Phaser.Game(800, 500, Phaser.CANVAS, 'game'); 

var state1 = {
	preload: function() {
		g = game.add.graphics(0,0);
		this.words = [];
		this.wordList = [];
		this.isTyping = false;
		this.defaultColor = "#000";
		this.hitColor = "#fff";

		this.wordLimit = 30;
		game.load.image("bg", "assets/bg2.png");
		game.load.image("bg2", "assets/bg2_dark.png");
		this.bg = null;

		this.letters = 0;
		this.errors = 0;

		game.state.remove("menuState");

		game.load.image("retry", "assets/retry.jpg");
	}, //end of preload

	
	create: function() {	
		game.stage.backgroundColor = "#fff";
		this.bg = game.add.sprite(-2, -2, "bg");
		this.bg.scale.setTo(0.9, 1);
		
		
		window.addEventListener("keydown", this.checkKeyPress, true);
		this.readTextFile("assets/words_easy.txt");
		this.wordCreationTimer = game.time.events.loop(700, this.addWord, this);
	}, //end of create


	update: function() {
		for(i = 0; i<this.words.length;i++) {
			//game.physics.arcade.overlap(this.words[i], this.boundary, this.losePoints, null, this);
			if(this.words[i].worldPosition.y >=500){
				this.killWord(i);
			}
		}

		if(this.wordLimit <= 0){
			game.time.events.remove(this.wordCreationTimer);
		}
	}, //end of update
	
	
	spawnText: function(input) {
		var text = game.add.text( Math.random()*650, 100, input, {font: "20px Courier New", fill: this.defaultColor, backgroundColor: "rgba(0,0,0,0.2)"});
		game.physics.arcade.enable(text);
		text.body.velocity.setTo(0, 20);
		/*text.stroke = "#000";
		text.strokeThickness = 2;*/
		return text;
	}, //end of spawnText


	/*
 	* checks through all the words and sees which one you're typing
 	* @param e The letter typed in
 	*/
	checkWords: function(e){
		for(i = 0;i<this.words.length;i++)
		{
			if(e == this.words[i].text[0])
			{
				this.wordSelectIndex = i;
				this.wordTypeIndex = 1;
				this.words[i].addColor(this.hitColor, 0);
				this.words[i].addColor(this.defaultColor, 1);
				this.isTyping = true;
				//this.letters++;
				break;
			}else{
				this.errors++;
			}
		}//end of for i>words	
	}, //end of checkWords


	/*
 	* once a word is "picked" all the text you type is towards completing the word
 	* @param e The letter typed in 
 	*/
	enterText: function(e){
		//if the letter you press is the next letter in the selected word
		//change the color of that letter, and shift our "pointer"
		if(e == this.words[this.wordSelectIndex].text[this.wordTypeIndex]){
			this.words[this.wordSelectIndex].addColor(this.hitColor, this.wordTypeIndex);
			this.words[this.wordSelectIndex].addColor(this.defaultColor, this.wordTypeIndex+1);
			this.wordTypeIndex++;
			//this.letters++;
		}else{
			this.words[this.wordSelectIndex].body.velocity.y+=10;
			this.errors ++;
			console.log(this.errors);
		}

		//if you finish typing the word, kill the word
		if(this.wordTypeIndex >= this.words[this.wordSelectIndex].text.length){
			this.killWord(this.wordSelectIndex);
		}
		
	}, //end of enterText


	checkKeyPress: function(e){
		var letterPressed = String.fromCharCode(e.keyCode);
		state1.letters+=1;
		if(state1.isTyping == true)
			state1.enterText(letterPressed);
		else if(state1.isTyping == false)
			state1.checkWords(letterPressed);
	}, //end of checkKeyPress


	addWord: function() {
		var tempWord;
		var rando = Math.floor(Math.random() * this.wordList.length);
		tempWord = this.wordList[rando];
		this.words.push(this.spawnText(tempWord));
		this.wordLimit --;
	}, //end of addWord


	readTextFile: function(file) {
		console.log("reading file");
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.send();
		var text = rawFile.responseText.toUpperCase();
		this.wordList = text.split("\n");	
	}, //end of readTextFile

	killWord: function(i) {
		this.wordSelectIndex = null;
		this.wordTypeIndex = null;
		this.words[i].kill();
		this.words.splice(i, 1);
		state1.isTyping = false;

		if(this.words.length<=0){
			console.log("Errors: "+this.errors+"\tLetters: "+this.letters);
			var average = (1-(this.errors/this.letters))*100;
			average = average.toFixed(2);
			var ending;
			if(average >= 95)
				ending = "Your book was a best seller. We await your sequel.";
			else if(average >= 80 && average < 95)
				ending = "Your book was average. People enjoyed it, but some were dissapointed.";
			else if(average >=70 && average < 80)
				ending = "Your book was pretty bad. People were buying it initially, but now sales have plumitted.";
			else
				ending = "Your book was complete trash. People will never buy books from you again.";
			this.textBox(average+"%", ending);
		}
	}, //end of killWord

	textBox: function(input, ending) {
		this.bg = game.add.sprite(-2, -2, "bg2");
		this.bg.scale.setTo(0.9, 1);
		g = game.add.graphics(0,0);
		var x, y, h, w;
		h = 350;
		w = 350;
		x = game.world.centerX-(w/2);
		y = game.world.centerY-(h/2);


		
		//draw the box
		g.beginFill(0xffffff);
		g.lineStyle(10, 0x90C3D4, 1);
		g.drawRect(x, y, w, h);
		g.endFill();
		
		//write the text
		var style = { font: "20px Courier New", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle", align: "center", wordWrap: true, wordWrapWidth: w-20};
		var text = game.add.text(0, 0, input, style);
		var text2 = game.add.text(0, 0, ending, style);
		text.setTextBounds(x, y-10, w, h);	
		text2.setTextBounds(x, y+80, w, h);

		var titleStyle = { font: "24px Courier New", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle", align: "center", wordWrap: true, wordWrapWidth: w-20};
		var title = game.add.text(0,0, "Your typing accuracy is:", titleStyle);
		title.setTextBounds(x,100, w, 100);


		retry = game.add.button(game.world.centerX-32, game.world.centerY+130, "retry", function(){game.state.start("mainState")}, this);
	}, //end of textBox
}; //end of mainState

var menuState = {
	preload: function(){	
		g = game.add.graphics(0,0);
		game.load.image("button", "assets/start.jpg");
	}, 

	create: function() {
		/*g.beginFill(0xff0000);
		g.drawRect(10, 10, 780, 480);
		g.endFill();*/
		//game.state.start("mainState");
		this.textBox("In a world where literature leads to enlightenment, you are a writer with the goal of reaching millions. Your words will be the medium in which revalations will be made.\n\nTo write your novel, type the words as they appear on the screen. The better you type, the better your book will be. At the end, you will see how well you did, and how many people's lives you have touched.\n\nTo begin, press the start button.");
		//this.textBox(" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rutrum leo a tellus congue egestas. Nunc non arcu ligula. Mauris in sapien ullamcorper, placerat diam sit amet, commodo turpis. Nunc tincidunt orci justo, vitae aliquet urna pretium et. Nunc tempus leo orci. Nulla facilisi. Pellentesque lacinia eget enim et malesuada. Ut feugiat lorem eu ante ultricies euismod. Ut in odio risus. Sed a mi commodo, vehicula neque eget, dapibus ante. Vestibulum imperdiet, nunc sit amet lacinia scelerisque, urna lectus accumsan nulla, sit amet gravida est quam vel nibh.\n\nEtiam mattis turpis vel lectus porta porta vel at tortor. Maecenas porta dui quis dapibus fermentum. Aliquam ipsum erat, malesuada eu orci a, lobortis elementum neque. Proin posuere leo id ante commodo, maximus porttitor nibh hendrerit. Duis a felis justo.");

		button = game.add.button(game.world.centerX-32, game.world.centerY+140, "button", this.actionOnClick, this);
		//button.scale.setTo(0.2, 0.2);
	},

	update: function() {

	},

	actionOnClick: function() {
		//console.log("hit");
		game.state.start("mainState");
	}, 
	textBox: function(input) {
		var x, y, h, w;
		x = 10;
		y = 10;
		h = 480;
		w = 780;
		
		//draw the box
		g.beginFill(0xffffff);
		g.lineStyle(10, 0x90C3D4, 1);
		g.drawRect(x, y, w, h);
		g.endFill();
		
		//write the text
		var style = { font: "16px Courier New", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle", align: "center", wordWrap: true, wordWrapWidth: w-20};
		var text = game.add.text(0, 0, input, style);
		text.setTextBounds(x, y, w, h);
		
		var titleStyle = { font: "30px Courier New", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle", align: "center", wordWrap: true, wordWrapWidth: w-20};
		var title = game.add.text(0,0, "Title Wave", titleStyle);
		title.setTextBounds(x,20, w, 100);
	}, //end of textBox
}; //end of menuState

game.state.add('mainState', state1, true);
game.state.add("menuState", menuState ,true);
game.state.start("menuState");
