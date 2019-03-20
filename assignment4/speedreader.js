/*
Sekyun Oh
Assignment 4
speedreader.js

When start button clicked, word display animation begins.
When stop button clicked, the animation stops and reset.
In terms of speed and size, when user selects different option during the animation,
it immediately applys to the animation.
*/

"use strict";
(function(){
   let timer = undefined;
   let string = undefined;
   let result = undefined;
   let counter = 0;
   let strFrame = [];
   /**
   window.onload = function()

   This is an anonymous function that is called when html file is being loaded.
   In this function, onclick properties of user-interative tags are initialized.
   **/
   window.onload = function(){
      let startButton = document.getElementById("start");
      startButton.onclick = start;
      let stopButton = document.getElementById("stop");
      stopButton.onclick = stop;
      stopButton.style.background = "lightgray";
      /*Radio Buttons to determine font size*/
      document.getElementById("medium").onclick = size;
      document.getElementById("big").onclick = size;
      document.getElementById("bigger").onclick = size;
      document.getElementById("select").onchange = speed;
   };

   /**
   start()

   This function is called when "start" button clicked.
   Basically, this function actually executes an animation of words.
   While animation is progressive, disable textarea and start button but enable stop button.
   **/
   function start(){

      string = document.getElementById("textarea").value;
      if(string.length === 0){
         alert("You should input a string before you start to read!");
         return;
      }

      document.getElementById("start").style.background = "lightgray";
      document.getElementById("stop").style.background = "white";
      document.getElementById("start").disabled = true;
      document.getElementById("textarea").disabled = true;
      document.getElementById("stop").disabled = false;

      result = string.split(/[ \t\n]+/);
      let selector = document.getElementById('select');
      let value = selector[selector.selectedIndex].value;
      if(timer === undefined){
         timer = setInterval(animate, parseInt(value));
      }
   }
    /**
    animate()

    This function is called on every "ms" until the end of the string or when stop button clicked.
    This is a place where the actual animation is occured. This function checks a word to see
    if the word contains a punctuation at the end. For that case, the punctuation gets removed and
    that word display again.
    **/
   function animate(){

      let string = result[counter];
      if(string !== undefined){
         strFrame.push(string);
         let newString = animateHelper(string);
         if(newString[1] === true){
            strFrame.push(newString[0]);
         }
      }else{
         if(strFrame[counter] === undefined){
            stop();
            return;
         }
      }
      document.getElementById("top").innerHTML = strFrame[counter];
      counter++;
   }
    /**
    animateHelper()

    This is a helper function of animate().
    This function checks a word if the word contains the punctuation at the end.
    If it contains, it gets removed and a word without punctuation get returned to
    animate() function.
    **/
   function animateHelper(arg){

      let result = arg[arg.length -1];
      let value = false;

      switch (result) {
         case ',':
         result = arg.replace(",", "");
         value = true;
         break;
         case '.':
         result = arg.replace(".", "");
         value = true;
         break;
         case '!':
         result = arg.replace("!", "");
         value = true;
         break;
         case '?':
         result = arg.replace("?", "");
         value = true;
         break;
         case ';':
         result = arg.replace(";", "");
         value = true;
         break;
         case ':':
         result = arg.replace(":", "");
         value = true;
         break;
         default:
          result = arg;
      }
      return [result,value];
   }

   /**
   stop()

   This function is called when "stop" button clicked or there is no word to animate.
   Basically, this function resets every variable and tag to the beginning.
   **/
   function stop(){

      document.getElementById("top").innerHTML = "";
      document.getElementById("stop").style.background = "lightgray";
      document.getElementById("start").style.background = "white";
      document.getElementById("stop").disabled = true;
      document.getElementById("textarea").disabled = false;
      document.getElementById("start").disabled = false;
      clearInterval(timer);
      timer = undefined;
      result = undefined;
      counter = 0;
      strFrame = [];
   }
   /**
   size()

   Change font size of an animated word immediately.
   **/
   function size(){
      let size = document.querySelector('input[name="radio"]:checked').value;
      document.getElementById("top").style.fontSize = size;
   }

    /**
    speed()

    Change speed of an animated word immediately.
    **/
   function speed(){
      let selector = document.getElementById('select');
      let value = selector[selector.selectedIndex].value;
      if(timer !== undefined){
         clearInterval(timer);
         timer = setInterval(animate, parseInt(value));
      }
   }
})();
