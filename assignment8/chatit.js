/*
Sekyun Oh
CSC 337
Assignment 8
03/29/2019
chatit.js

This is a JavaScript code for the chatit web page's behavior.
This JavaScript code interacts with chatit_service.js to get
data from the server.
*/

'use strict';
(function(){
	/**
	window.onload = function()

	This is an anonymous function that is called when html file is being loaded.
	In this function, onclick on #post button is initialized
	and every comment are displayed and refreshed in every 5 seconds.
	**/
	window.onload = function(){
		document.getElementById('comments').style.display = 'none';
		setInterval(commentGet, 5000);
		document.getElementById('post').onclick = commentPost;
	};

	/**
	commentPost()

	This function is called when 'post' button clicked.
	It send a comment to the server.
 	**/
	function commentPost(){
		let comment = document.getElementById('comment-input');
		let name = document.getElementById('name-input');

		// if either comment or name input is empty
		if(comment.value.length == 0){
			alert('Comment Empty!');
			return;
		} else if(name.value.length == 0){
			alert('Name Empty!');
			return;
		}

		// define ajax info
		let url = 'http://localhost:3000/comment/post';
		let cmt = {
			comment: comment.value,
			name: name.value
		};

		let fetchOptions = {
			method : 'POST',
			headers : {
				'Accept': 'application/json',
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify(cmt)
		};

			// fetch url
			fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function() {
				// reset if request succeeds
				document.getElementById('comment-input').value = '';
				document.getElementById('name-input').value = '';
				commentPostResponse('Comment Posted Successfully!');
			})
			.catch(function(error) {
				// error: do something with error
				commentPostResponse(error + ' while posting the comment to the server.');
			});
		}

		/**
		commentGet()

		This function is called when page is loaded.
		It gets called on every 5 seconds.
		It requests every comment and display comments from the server.
	 	**/
		function commentGet(){
			// show and clear 'comments' div
			document.getElementById('comments').style.display = 'block';
			document.getElementById('comments').innerHTML = '';

			// call ajax
			let url = 'http://localhost:3000/comment/get';
			fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				let res = JSON.parse(responseText);
				let messages = res['messages'];
				// if there is no comment yet
				if(messages.length <= 0){
					let empty = document.createElement('p');
					empty.id = 'empty';
					empty.innerHTML = 'There is no message yet!';
					document.getElementById('comments').appendChild(empty);
				}
				else{
					// clear
					document.getElementById('comments').innerHTML = '';
					// create ol tag
					let ol = document.createElement('ol');
					ol.id = ol;
					document.getElementById('comments').appendChild(ol);
					// append every comment to 'comments' div
					let i;
					for(i = 0; i < messages.length; i++){
						// get each comment
						let row = messages[i];
						let li = document.createElement('li');
						// get name
						let name = document.createElement('p');
						let nameSpan = document.createElement('span');
						nameSpan.innerHTML = row['name'];
						name.innerHTML = 'Name: ';
						name.appendChild(nameSpan);
						// get comment
						let comment = document.createElement('p');
						let commentSpan = document.createElement('span');
						commentSpan.innerHTML = row['comment'];
						comment.innerHTML = 'Comment: ';
						comment.appendChild(commentSpan);
						// append to 'li' tag
						li.appendChild(name);
						li.appendChild(comment);
						// append to 'ol' tag
						ol.appendChild(li);
					}
				}
			})
			.catch(function(error) {
				// show error
				let err = document.createElement('div');
				err.id = 'error';
				err.innerHTML = error + ' while getting comments from the server.';
				document.getElementById('comments').appendChild(err);
				console.log(error);
			});
		}

		/**
		commentPostResponse(res)

		This function is called when post ajax is done.
		It shows whether posting comment succeeds or not.
	 	**/
		function commentPostResponse(res){
			document.getElementById('response').innerHTML = res;
			setTimeout(function(){
				document.getElementById('response').innerHTML = '';
			},2000);
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
			else{
				return Promise.reject(new Error(response.status+":"+response.statusText));
			}
		}
	})();
