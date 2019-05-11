var maze;

function setup(){
    createCanvas(200, 200);
	var s = 20;
	var rows = floor(height / s);
	var cols = floor(width / s);
	
	maze = new mazeSolve(rows, cols, s);
	maze.initialize();
	frameRate(30);
}

function draw() {
	background(255);
	maze.constructOneStep();
	maze.display();
}

function mazeSolve(rows, cols, s){
	this.rows = rows;
	this.cols = cols;
	this.size = s;                        
	this.walls = [];                     
	this.uSet = new unionSet();           
	this.wallIndex = 0;
	this.initialize = function(){

		for(var i = 0; i <= this.rows; i++){
			for(var j = 0; j < this.cols; j++){
				this.walls.push(new wall(i, j, i, j + 1, this.size));
			}
		}
		for(var j = 0; j <= this.cols; j++){
			for(var i = 0; i < this.rows; i++){
				this.walls.push(new wall(i, j, i + 1, j, this.size));
			}
		}

		this.walls.sort(function randomSort(a, b){return Math.random() > 0.5 ? -1 : 1;});
		for(var i = 0; i < this.rows; i++){
			for(var j = 0; j < this.cols; j++){
				this.uSet.uset.push(new cell(i, j, this.rows, this.cols));
			}
		}
	}

	this.display = function(){
		for(var i = 0; i < this.walls.length; i++){
			this.walls[i].isHighlight(false);
		}
		this.walls[this.wallIndex].isHighlight(true);
		for(var i = 0; i < this.walls.length; i++){
			this.walls[i].show();
		}
	}

	this.constructOneStep = function(){
		var wall = this.walls[this.wallIndex];          
		var isBorder = (wall.i1 == wall.i2 && (wall.i1 == 0 || wall.i1 == this.rows)) || (wall.j1 == wall.j2 && (wall.j1 == 0 || wall.j1 == this.cols));

		if(isBorder == false){
			var c1Index, c2Index;
			if(wall.i1 == wall.i2){
				c1Index = (wall.i1 - 1) * this.cols + wall.j1;
				c2Index = wall.i1 * this.cols + wall.j1;
			}else if(wall.j1 == wall.j2){
				c1Index = wall.i1 * this.cols + wall.j1 - 1;
				c2Index = wall.i1 * this.cols + wall.j1;
			}
			var p1 = this.uSet.findParent(c1Index);          
			var p2 = this.uSet.findParent(c2Index);
			if (p1 != p2){
				this.walls[this.wallIndex].breaked = true;   
				this.uSet.unionTwo(c1Index, c2Index);        
			}
		}
		this.wallIndex++;
		if(this.wallIndex >= this.walls.length){
			this.wallIndex = this.walls.length - 1;
		}
	}
}


function unionSet(){
	this.uset = [];
	this.findParent= function(ind){
		var pind = this.uset[ind].parent;
		if(pind == ind){
			return ind;
		}
		var res = this.findParent(pind);
		this.uset[ind].parent = res;
		return res;
	}
	this.unionTwo = function(ind1, ind2){
		var p1 = this.findParent(ind1);
		var p2 = this.findParent(ind2);
		this.uset[p1].parent = p2;
	}
}


function cell(i, j, rows, cols){
	this.i = i;      
	this.j = j;      
	this.rows = rows;
	this.cols = cols;
	this.parent = i * cols + j;
	this.index = i * cols + j;
}

// wall
function wall(i1, j1, i2, j2, s){
	this.i1 = i1;
	this.j1 = j1;
	this.i2 = i2;
	this.j2 = j2;
	this.s = s;
	this.breaked = false;
	this.ishigh = false;                  
	this.isHighlight = function(ishigh){
		this.ishigh = ishigh;
	}
	this.show = function(){
		if(this.breaked == false){
			if(this.ishigh){
				stroke(0, 0, 0);
				strokeWeight(2);
			}else{
				stroke(0);
				strokeWeight(2);
			}
			line(this.j1 * this.s, this.i1 * this.s, this.j2 * this.s, this.i2 * s);
		}
	}
}