/*
Sekyun Oh
Assignment 6
gerrymandering.js

This is a JavaScript code for the gerrymandering web page's behavior.
This JavaScript code interacts with gerrymandering_service.js to get
data from the server.
*/

'use strict';
(function(){
	/**
	window.onload = function()

	This is an anonymous function that is called when html file is being loaded.
	In this function, onclick on #search button is initialized.
	**/
	window.onload = function() {

		document.getElementById("search").onclick = searchBtn;

	};

	/**
	searchBtn()

	This function is called when search button is clicked.
	In this function, the Ajax call is generated.
	First of all, it calls voter_url and calls district_url
	right after the voter_url fetch has succeeded.
	**/
	function searchBtn(){

		// reset to original status if there is any inserted DOM.
		reset();

		// get user input
		let state = document.getElementById("box").value;
		let voterUrl = 'http://localhost:3000?state='+state+'&type=voters';
		let districtUrl = 'http://localhost:3000?state='+state+'&type=districts';

		// fetch voterUrl
		fetch(voterUrl)
		.then(checkStatus)
		.then(function(responseText) {
			// success: do something with the responseText
			let h4 = document.createElement('h4');
			h4.innerHTML = responseText + ' eligible voters';
			document.getElementById("voters").appendChild(h4);
			// if succeeded to fetch voter_url, call districtUrl
			fetchDistrict(districtUrl);
		})
		.catch(function(error) {
			// error: do something with error
			showError(error,' while fetching voters');
		});
	}

	/**
	fetchDistrict(districtUrl)

	This function takes district_url as a parameter.
	This function is called when fetching of voter_url has succeeded.
	**/
	function fetchDistrict(districtUrl){

		// district_url
		fetch(districtUrl)
		.then(checkStatus)
		.then(function(responseText) {
			// success: do something with the responseText
			let data = JSON.parse(responseText);
			let h2 = document.createElement('h2');
			h2.innerHTML = data.state;
			document.getElementById("statename").appendChild(h2);

			// this is an array
			let districts = data.districts;
			let totalDem = 0;
			let totalGop = 0;
			let totalWastedDem = 0;
			let totalWastedGop = 0;

			// iterate each district of the chosen state
			let i;
			for (i = 0; i < districts.length; i++) {
				// if district row had no value, not count
				if(districts[i][0] == null && districts[i][1] == null){continue;}
				let result = calculation(districts[i]);
				totalDem = totalDem + result.dem;
				totalGop = totalGop + result.gop;
				totalWastedDem = totalWastedDem + result.wastedDem;
				totalWastedGop = totalWastedGop + result.wastedGop;

				let dem = document.createElement('div');
				dem.className = 'dem';
				dem.style.width = result.width;

				let gop = document.createElement('div');
				gop.className = 'gop';
				gop.appendChild(dem);

				document.getElementById("statedata").appendChild(gop);
			}

			// determine if it is gerrymandering
			let percent = Math.floor([Math.abs(totalWastedDem - totalWastedGop) /
				(totalWastedDem + totalWastedGop)] * 100);
			let gerrymandering;

			if(percent == 0){
				gerrymandering = 'Tie';
			}
			else if(percent >= 7 && (totalDem > totalGop)){
				gerrymandering = 'Gerrymandered to favor the Democratic Party';
			}
			else if(percent >= 7 && (totalDem < totalGop)){
				gerrymandering = 'Gerrymandered to favor the Republican Party';
			}
			else{
				gerrymandering = 'Not gerrymandered';
			}

			// insert as first child
			let h3 = document.createElement('h3');
			h3.innerHTML = gerrymandering;
			document.getElementById("statedata").prepend(h3);
		})
		.catch(function(error) {
			// error: do something with error
			showError(error,' while fetching districts');
		});
	}

	/**
	calculation(districtRow)

	This function takes one parameter that contains each district's data of the chosen state.
	This function simply returns an object that has data
	which will be used to determine gerrymandered.
	**/
	function calculation(districtRow){

		let dem = districtRow[0];
		let gop = districtRow[1];
		let median = Math.floor((dem + gop) / 2) + 1;
		let width = Math.abs(dem / (dem + gop) * 100) + '%';

		let wastedDem = (dem >= median) ? (dem - median) : (dem);
		let wastedGop = (gop >= median) ? (gop - median) : (gop);

		return {'width' : width,
		'dem' : dem,
		'gop' : gop,
		'wastedDem' : wastedDem,
		'wastedGop' : wastedGop};

	}

	/**
	reset()

	This function is called when the search button is clicked.
	This function simply reset DOM to original state.
	**/
	function reset(){

		document.getElementById("statename").innerHTML = '';
		document.getElementById("voters").innerHTML = '';
		document.getElementById("statedata").innerHTML = '';
		document.getElementById("errors").innerHTML = '';

	}

	/**
	showError(error, text)

	This function takes two parameters. One for error information,
	another for which type of error occurs in: voters/districts.
	And, this simply shows the error.
	**/
	function showError(error, text){

		document.getElementById("statename").innerHTML = '';
		document.getElementById("voters").innerHTML = '';
		document.getElementById("statedata").innerHTML = '';
		document.getElementById("errors").innerHTML = error + text;

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
			return Promise.reject(new Error('There was no data for the chosen state'));
		}
		else{
			return Promise.reject(new Error(response.status+":"+response.statusText));
		}
	}
})();
