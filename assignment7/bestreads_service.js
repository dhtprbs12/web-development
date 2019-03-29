/*
Sekyun Oh
Assignment 7
03/20/2019
bestreads_service.js

This is a JavaScript code for the bestreads web page's data.
This JavaScript code interacts with gerrymandering.js to send
data in HTML.
*/

/* global require */
'use strict';

const express = require("express");
const app = express();
let fs = require('fs');
app.use(express.static('public'));

// main url function
app.get('/', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	let mode = req.query.mode;
	let folder = req.query.title;

	// when page loads, list books
	if(mode == 'books') {
		let arr = [];
		fs.readdir(__dirname+'/books', function(err, folders){
			folders.forEach(function(folder){
				arr.push(buildBooksJson(folder));
			});
			let jsonBooks = JSON.stringify({'books':arr});
			res.send(jsonBooks);
		});
	}
	// when user clicks a specific book, show detail
	else{
		res.send(readFiles(folder,mode));
	}
});

/**
buildBooksJson(folder)

This function reads info.txt of chosen book
and create json based upon the data from the file.
**/
function buildBooksJson(folder){
	let info = fs.readFileSync(__dirname+'/books/'+folder+'/info.txt', 'utf8');
	let title = info.split('\n')[0];
	let json = {'title':title,'folder':folder};
	return json;
}

/**
readFiles(folder, mode)

This function read a specific file based upon the mode
and create json with data from the file.
**/
function readFiles(folder, mode){
	let data;
	// when mode is info
	if(mode == 'info'){
		let info = fs.readFileSync(__dirname+'/books/'+folder+'/info.txt', 'utf8').split('\n');
		let object = {'title':info[0],'author':info[1],'stars':info[2]};
		data = JSON.stringify(object);
	}
	// when mode is description
	else if(mode == 'description'){
		let des = fs.readFileSync(__dirname+'/books/'+folder+'/description.txt', 'utf8').split('\n');
		data = JSON.stringify({'description':des});
	}
	// when mode is reviews
	else{
		let arr = [];
		let files = fs.readdirSync(__dirname+'/books/'+folder);
		for (let i = 0; i < files.length; i++) {
			if(files[i].indexOf('review') >= 0){
				let review = fs.readFileSync(__dirname+'/books/'+folder+'/'+files[i],'utf8').split('\n');
				let object = {'name':review[0], 'stars':review[1], 'review':review[2]};
				arr.push(object);
			}
		}
		data = JSON.stringify({'reviews':arr});
	}
	return data;
}

// listen connection on 3000 PORT
app.listen(3000,function(){
	console.log('Web Service Started!');
});
