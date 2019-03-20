/*
Sekyun Oh
Assignment 5
fifteen.js

When the mouse button is pressed on a puzzle square
and if that square is next to the blank sqaure, it's moved
into the blank space. If the square doesn't neighbor the blank
square, no action accurs. Similarly, of the mouse is pressed on
the empty square or elsewhere on the page, no action occurs.
*/

"use strict";
(function(){
	let pieceCount;
	let yCoordinate = '300px';
	let xCoordinate = '300px';
	const PIECESIZE = 100;
	/**
	window.onload = function()

	This is an anonymous function that is called when html file is being loaded.
	In this function, 15 puzzles are created and initialized.
	**/
	window.onload = function (){

		let puzzleArea = document.getElementById('puzzlearea');

		//create each piece and append it to parent
		for(let i = 0; i < 15; i++) {
			let rect = document.createElement("div");
			rect.innerHTML = i + 1;
			puzzleArea.appendChild(rect);
		}

		pieceCount = puzzleArea.getElementsByTagName('div');

		for (let i = 0; i < pieceCount.length; i++) {

			pieceCount[i].className = 'puzzlepiece';
			pieceCount[i].style.left = (i % 4 * PIECESIZE)+'px';
			pieceCount[i].style.top = (parseInt(i / 4) * PIECESIZE) + 'px';
			let backgroundPs = '-' + pieceCount[i].style.left + ' ' + '-' + pieceCount[i].style.top;
			pieceCount[i].style.backgroundPosition = backgroundPs;
			//when mouse is over in puzzles
			pieceCount[i].onmouseover = function() {
				if (isMovable(parseInt(this.innerHTML))) {
					this.id = "movablepiece";
				}
			};
			//to original state
			pieceCount[i].onmouseout = function() {
				this.id = "";
			};
			//when puzzle get clicked
			pieceCount[i].onclick = function() {
				if (isMovable(parseInt(this.innerHTML))) {
					//move into empty space
					swap(this.innerHTML - 1);
					//check if game is over
					//delay 0.2 sec so that alert pops up after
					//tile get swapped with the empty square.
					if (isEnd()) {
						setTimeout(letUserKnows, 200);
					}
					return;
				}
			};
		}
		let shuffleBtn = document.getElementById('shufflebutton');
		shuffleBtn.onclick = shuffle;
	};

	/**
	shuffle()

	This function randomly shuffles puzzles.
	**/
	function shuffle() {
		for(let i = 0; i < 1000; i++){
			let arr = findMovablePieces(xCoordinate,yCoordinate);
			let rand = parseInt(Math.random() * arr.length);
			swap(arr[rand]);
		}
	}

	/**
	findMovablePieces(x,y)

	This function finds which neighbor of empty square is movable
	and return array containing its index.
	**/
	function findMovablePieces(x,y) {
		let arr = [];
		let cordX = parseInt(x);
		let cordY = parseInt(y);

		for (let i = 0; i < pieceCount.length; i++) {
			if ((parseInt(pieceCount[i].style.top) == cordY - PIECESIZE) &&
			(parseInt(pieceCount[i].style.left) == cordX)) {
				//top is movable
				arr.push(i);
			} else if ((parseInt(pieceCount[i].style.top) == cordY + PIECESIZE) &&
			(parseInt(pieceCount[i].style.left) == cordX)) {
				//bottom is movable
				arr.push(i);
			} else if ((parseInt(pieceCount[i].style.top) == cordY) &&
			(parseInt(pieceCount[i].style.left) == cordX - PIECESIZE)) {
				//left is movable
				arr.push(i);
			} else if ((parseInt(pieceCount[i].style.top) == cordY) &&
			(parseInt(pieceCount[i].style.left) == cordX + PIECESIZE)) {
				//right is movable
				arr.push(i);
			}
		}
		return arr;
	}

	/**
	isMovable(position)

	This function checks if a puzzle piece is movable.
	This function is used to determine whether border color
	need to be changed or not.
	**/
	function isMovable(position) {
		if (left(xCoordinate, yCoordinate) == (position-1)) {
			return true;
		}

		if (down(xCoordinate, yCoordinate) == (position-1)) {
			return true;
		}

		if (up(xCoordinate, yCoordinate) == (position-1)) {
			return true;
		}

		if (right(xCoordinate, yCoordinate) == (position-1)) {
			return true;
		}
	}

	/**
	letUserKnows()

	This function notifies game is done to user.
	**/
	function letUserKnows() {
		alert('Great! Shuffle to play again');
	}

	/**
	isEnd()

	This function determines if shuffled puzzle equals to orignal state.
	This is used to determine if game is done or not.
	**/
	function isEnd() {
		let flag = true;
		for (let i = 0; i < pieceCount.length; i++) {
			//for each puzzle piece
			let top = parseInt(pieceCount[i].style.top);
			let left = parseInt(pieceCount[i].style.left);
			if (left != (i % 4 * PIECESIZE) || top != parseInt(i / 4) * PIECESIZE) {
				//checks if each piece matches its left and top position
				flag = false;
				break;
			}
		}
		return flag;
	}

	/**
	left(x,y)

	This function calculates its coordinate to determine
	if a left puzzle of the empty square is an neighbor.
	**/
	function left(x, y) {
		let cordX = parseInt(x);
		let cordY = parseInt(y);
		if (cordX > 0) {
			for (let i = 0; i < pieceCount.length; i++) {
				if (parseInt(pieceCount[i].style.left) + PIECESIZE == cordX &&
				parseInt(pieceCount[i].style.top) == cordY) {
					return i;
				}
			}
		} else {
			return -1;
		}
	}

	/**
	right(x,y)

	This function calculates its coordinate to determine
	if a right puzzle of the empty square is an neighbor.
	**/
	function right(x, y) {
		let cordX = parseInt(x);
		let cordY = parseInt(y);
		if (cordX < 300) {
			for (let i = 0; i < pieceCount.length; i++){
				if (parseInt(pieceCount[i].style.left) - PIECESIZE == cordX &&
				parseInt(pieceCount[i].style.top) == cordY) {
					return i;
				}
			}
		} else {
			return -1;
		}
	}

	/**
	up(x,y)

	This function calculates its coordinate to determine
	if an up puzzle of the empty square is an neighbor.
	**/
	function up(x, y) {
		let cordX = parseInt(x);
		let cordY = parseInt(y);
		if (cordY > 0) {
			for (let i = 0; i < pieceCount.length; i++) {
				if (parseInt(pieceCount[i].style.top) + PIECESIZE == cordY &&
				parseInt(pieceCount[i].style.left) == cordX) {
					return i;
				}
			}
		} else {
			return -1;
		}
	}

	/**
	down(x,y)

	This function calculates its coordinate to determine
	if a down puzzle of the empty square is an neighbor.
	**/
	function down(x, y) {
		let cordX = parseInt(x);
		let cordY = parseInt(y);
		if (cordY < 300) {
			for (let i = 0; i < pieceCount.length; i++) {
				if (parseInt(pieceCount[i].style.top) - PIECESIZE == cordY &&
				parseInt(pieceCount[i].style.left) == cordX) {
					return i;
				}
			}
		} else {
			return -1;
		}
	}

	/**
	swap(position)

	This is a function where the actual swapping occurs.
	This function swaps a puzzle with empty square.
	**/
	function swap (position) {
		//moves the puzzle piece by switching position with an empty space
		let temp = pieceCount[position].style.top;
		pieceCount[position].style.top = yCoordinate;
		yCoordinate = temp;
		temp = pieceCount[position].style.left;
		pieceCount[position].style.left = xCoordinate;
		xCoordinate = temp;
	}
})();
