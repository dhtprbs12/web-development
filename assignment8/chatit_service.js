/*
Sekyun Oh
CSC 337
Assignment 8
03/29/2019
chatit_service.js

This is a JavaScript code for the chatit web page's data.
This JavaScript code interacts with chatit.js to send
data to HTML.
*/

const express = require("express");
const app = express();
var fs = require('fs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(express.static('public'));

// main post comment function
app.post('/comment/post', jsonParser, function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	let comment = req.body.comment;
	let name = req.body.name;
	let string = name+':::'+comment+'\n';
	// append comment and name to the file
	fs.appendFile('messages.txt', string , function (err) {
		if (err){
			console.log(err);
			res.status(400);
		}
		res.send('success');
	});
});

// main get comment function
app.get('/comment/get',function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	let arr = [];
	let comments = fs.readFileSync(__dirname+'/messages.txt', 'utf8').split('\n');
	// execute only when file is not empty
	if(comments[0].length != 0){
		for (let i = 0; i < comments.length - 1; i++) {
			let row = comments[i].split(':::');
			let name = row[0];
			let comment = row[1];
			let obj = {'name':name, 'comment':comment};
			arr.push(obj);
		}
	}
	let object = {'messages':arr};
	res.send(JSON.stringify(object));
});

// listen connection on 3000 PORT
app.listen(3000, function(){
	console.log('web service started on 3000 port!');
});
