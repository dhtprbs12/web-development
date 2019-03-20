/*
Sekyun Oh
Assignment 7
03/20/2019
bestreads.js

This is a JavaScript code for the bestreads web page's behavior.
This JavaScript code interacts with bestreads_service.js to get
data from the server.
*/

'use strict';
(function(){
	/**
	window.onload = function()

	This is an anonymous function that is called when html file is being loaded.
	In this function, onclick on #back button is initialized
	and every books are displayed.
	**/
	window.onload = function(){
		loadBooks();
		document.getElementById('back').onclick = home;
	};

	/**
	home()

	This function is called when 'home' div clicked.
	It performs same function as if the page loads first time.
 	**/
	function home(){
		loadBooks();
	}

	/**
	loadBooks()

	This function is called when the page is loaded.
	This function gets every book's data from the server
	and display them into the page.
	**/
	function loadBooks(){
		// show allbooks
		document.getElementById('allbooks').style.display = 'block';
		// hidden singlebook div
		document.getElementById('singlebook').style.display = 'none';
		document.getElementById('reviews').innerHTML = '';
		// fetch getBooksUrl
		let getBooksUrl = 'http://localhost:3000?mode=books';
		fetch(getBooksUrl)
		.then(checkStatus)
		.then(function(responseText) {
			let books = JSON.parse(responseText)['books'];
			var i;
			for(i = 0; i < books.length; i++){
				let book = books[i];
				let img = document.createElement('img');
				img.src = './books/'+book['folder']+'/cover.jpg';
				let p = document.createElement('p');
				p.innerHTML = book['title'];
				let div = document.createElement('div');
				div.id = book['title'];
				div.className = book['folder']
				div.onclick = bookDetail;
				div.appendChild(img);
				div.appendChild(p);
				document.getElementById('allbooks').appendChild(div);
			}
		})
		.catch(function(error) {
			// error: do something with error
			showError(error,' while fetching books');
		});
	}

	/**
	bookDetail()

	This function is called when user clicks a specific book.
	This function simply gets all the data about the book and
	display them into the page.
	**/
	function bookDetail(){
		// allbooks visibility hidden
		document.getElementById('allbooks').innerHTML = '';
		document.getElementById('allbooks').style.display = 'none';
		// singlebook now visible
		document.getElementById('singlebook').style.display = 'block';
		// set cover image
		document.getElementById('cover').src = './books/'+this.className+'/cover.jpg';
		// fetch urls
		let infoUrl = 'http://localhost:3000?mode=info&title='+this.className;
		let desUrl = 'http://localhost:3000?mode=description&title='+this.className;
		let reviewsUrl = 'http://localhost:3000?mode=reviews&title='+this.className;

		fetch(infoUrl)
		.then(checkStatus)
		.then(function(responseText){
			let json = JSON.parse(responseText);
			document.getElementById('title').innerHTML = json['title'];
			document.getElementById('author').innerHTML = json['author'];
			document.getElementById('stars').innerHTML = json['stars'];
			fetchDes(desUrl);
			fetchReviews(reviewsUrl);
		})
		.catch(function(error) {
			// error: do something with error
			showError(error,' while fetching info');
		});
	}

	/**
	fetchDes(url)

	This function is called when fetch info succeeded.
	This simply gets description of the chosen book from
	the server.
	**/
	function fetchDes(url){
		fetch(url)
		.then(checkStatus)
		.then(function(responseText){
			let json = JSON.parse(responseText);
			document.getElementById('description').innerHTML = json['description'];
		})
		.catch(function(error) {
			// error: do something with error
			showError(error,' while fetching description');
		});
	}

	/**
	fetchReviews(url)

	This function is called when fetch description succeeded.
	This simply gets reviews of the chosen book from
	the server.
	**/
	function fetchReviews(url){
		fetch(url)
		.then(checkStatus)
		.then(function(responseText){
			let json = JSON.parse(responseText);

			let reviews = json['reviews'];
			console.log(reviews);
			var i;
			for(i = 0; i < reviews.length; i++){
				let star = reviews[i]['stars'];
				let name = reviews[i]['name'];
				let review = reviews[i]['review'];
				let span = document.createElement('span');
				span.innerHTML = star;
				let h3 = document.createElement('h3');
				h3.innerHTML = name;
				h3.appendChild(span);
				let p = document.createElement('p');
				p.innerHTML = review;

				document.getElementById('reviews').appendChild(h3);
				document.getElementById('reviews').appendChild(p);
			}
		})
		.catch(function(error) {
			// error: do something with error
			showError(error,' while fetching reviews');
		});
	}

	/**
	checkStatus(response)

	This function is called when Ajax fetchs url.
	This function simply determines if the Ajax call was successful or not.
	This is a main function that we can handle errors.
	**/
	function checkStatus(response) {

		if (response.status >= 200 && response.status < 300) {
			return response.text();
		}
		else if(response.status == 410){
			return Promise.reject(new Error('Something went wrong while communication with the server'));
		}
		else{
			return Promise.reject(new Error(response.status+":"+response.statusText));
		}
	}
})();
