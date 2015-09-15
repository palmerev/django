//needs tones.js

//namespace for interval and note data
//TODO: configure for generic exercise or have different files or namespaces for each course type
var EP = {
    currentExercise: {
        id: 0,
        answerGiven: false,
        intervalName: "",
        topNoteName: "",
        topNoteOctave: 0,
        bottomNoteName: "",
        bottomNoteOctave: 0,
        result: ""
    },
    course: {
        allExercises: [],
        completedExercises: [],
        remainingExercises: [],
        //total number of exercises in course
        numExercises: function() {
            return EP.course.allExercises.length;
        },
    }
}

function showCourseResultsDialogue() {
    showCCDialogue(); //in dialogue.js
}

function saveExerciseResult(event) {
    if (EP.currentExercise.answerGiven) {
      if(event.target.innerHTML === EP.currentExercise.intervalName) {
          EP.currentExercise.result = "correct";
      }
      else {
          EP.currentExercise.result = "incorrect";
      }
    }
    else {
        EP.currentExercise.result = "skipped";
    }
    EP.course.completedExercises.push(EP.currentExercise);
    if (EP.currentExercise.answerGiven) {
        showExerciseResult(event);
    }
}

function saveResult (event) {
    var formdata = new FormData();
    var responseData;
    var request = new XMLHttpRequest();
    request.onload = function () {
        responseData = JSON.parse(this.responseText);
        if (EP.currentExercise.answerGiven) {
            showExerciseResult(event);
        }
    }
    request.open('POST', '/courses/intervals/exercises/save-student-exercise/');
    formdata.append("exercise_id", EP.currentExercise.id);
    if (EP.currentExercise.answerGiven) {
        if(event.target.innerHTML === EP.currentExercise.intervalName) {
            formdata.append("result", "correct");
        }
        else {
            formdata.append("result", "incorrect");
        }
    }
    else {
        formdata.append("result", "skipped");
    }
    request.send(formdata);
}

function showExerciseResult(event){
    //console.log(event.target.innerHTML);
    var result = document.getElementById("answer-result");
    var correctAnswer = document.getElementById("correct-answer");
    if(result.innerHTML === ""){
        // TODO: get class-based style working in ear_training.css (separate CSS and JS as much as possible)
        // event.target.classList.add("pushed-button");
        var s = event.target.style;
        s.border = "3px solid yellow";
        s.background = "blue";
            if (event.target.innerHTML === EP.currentExercise.intervalName) {
            result.style.color = "blue";
            result.innerHTML = "Correct!";
        }
        else {
            result.style.color = "red";
            result.innerHTML = "Incorrect. It's a " + EP.currentExercise.intervalName + ".";
        }
    }
}


function makeExercisesFromData(data) {
    var numButtons = Math.min(data.length, 4);
    if(data) {
        EP.course.allExercises = data;
        EP.course.remainingExercises = EP.course.allExercises.slice();
    }
    else {
        console.log("No JSON data");
        return false;
    }
    setRandomIntervalExercise();
    createAnswerButtons(numButtons);
    updateAnswerButtonText();
    resetStylesAndSound();
    setupListeners();
    updateProgressCounter();
}

function initProgressCounter(curr, total) {
    //number of exercises (keys) in the course data object + current exercise
    var numExercises = Object.keys(EP.course.remainingExercises).length;
    total.innerHTML = numExercises;
    curr.innerHTML = 1;
}

function updateProgressCounter() {
    var current = document.getElementById("current");
    var currentCount = parseInt(current.innerHTML);
    var totalExercises = document.getElementById("course-total");
    var totalExercisesCount = parseInt(totalExercises.innerHTML);

    if(totalExercises.innerHTML === "") {
        initProgressCounter(current, totalExercises);
        return;
    }

    if (currentCount < totalExercisesCount) {
        current.innerHTML = currentCount + 1;
    }
    else {
        showCCDialogue();
        // saveCourseCompletion();
    }
}

function setRandomIntervalExercise() {
    /*
    selects a random exercise from the array of exercises and assigns values
    for the next exercise, then removes that exercise from the array
    */
    console.log("setRandomIntervalExercise::EP.course.remainingExercises:");
    console.log(EP.course.remainingExercises);
    EP.currentExercise.answerGiven = false;
    if (EP.course.remainingExercises.length > 0) {
        var index = randIndex(EP.course.remainingExercises.length);
        var selected = EP.course.remainingExercises[index];
        EP.currentExercise.id = selected.id;
        EP.currentExercise.intervalName = selected.interval_name;
        EP.currentExercise.topNoteName = selected.top_note.name;
        EP.currentExercise.topNoteOctave = parseInt(selected.top_note.octave);
        EP.currentExercise.bottomNoteName = selected.bottom_note.name;
        EP.currentExercise.bottomNoteOctave = parseInt(selected.bottom_note.octave);
    }
    else {
        //should never happen...
        console.log("out of exercises!");
    }
}

function resetStylesAndSound() {
      //reset styles that have changed
      //TODO: change to class-based style in ear_training.css
      var result = document.getElementById("answer-result");
      result.innerHTML = "";
      var answerBtns = document.getElementsByClassName("answer-button");
      for (var i = 0; i < answerBtns.length; i++) {
          if (answerBtns[i].hasAttribute("style")) {
              // console.log(answerBtns[i].innerHTML);
              answerBtns[i].style.background = "linear-gradient(to bottom, #E38900, #C06600)";
              answerBtns[i].style.border = "none";
          }
          //IDEA: This would be a better way. Keep CSS out of JS
          // if (answerBtns[i].classList.contains("pushed-button")){
          //     answerBtns[i].classList.remove("pushed-button");
          //     answerBtns[i].classList.add("unpushed-button")
          // }
      }
      //TODO IDEA: add radio buttons for sound type
      //set sound quality
      tones.type = "sine";
      tones.release = 150;
}

function createAnswerButtons(numButtonLimit) {
    var answerBtns = document.getElementsByClassName("answer-button");
    var answerBtnContainer = document.getElementById("answer-button-container");
    for (var i = 1; i < numButtonLimit; i++) {
        var newBtn = answerBtns[0].cloneNode(false);
        answerBtnContainer.appendChild(newBtn);
    }
}

function updateAnswerButtonText() {
    var exercises = EP.course.allExercises.slice();
    console.log("updateAnswerButtonText::exercises: ")
    console.log(exercises);
    var answerBtns = document.getElementsByClassName("answer-button");
    var numButtons = answerBtns.length;
    var answerText = EP.currentExercise.intervalName;
    var answerIndex = getObjectIndexByProperty("interval_name", answerText, exercises);
    var correctAnswer = exercises.splice(answerIndex, 1)[0];
    console.log("exercises w/o correctAnswer:");
    console.log(exercises);
    var newOptions = [];
    var incorrectAnswers = randomSample(numButtons - 1, exercises);
    console.log("updateAnswerButtonText::incorrectAnswers: ")
    console.log(incorrectAnswers);
    //add answer to list of new options
    newOptions = incorrectAnswers.concat([correctAnswer]);
    console.log(newOptions);
    inPlaceShuffle(newOptions);
    for (var i = 0; i < answerBtns.length; i++) {
        var current = answerBtns[i];
        current.innerHTML = newOptions[i]["interval_name"];
    }
}

function doAnswer(event) {
    EP.currentExercise.answerGiven = true;
    saveExerciseResult(event);
}

function setupPlayButtonListeners() {
    var topButton = document.getElementById("top-note-button");
    var bottomButton = document.getElementById("bottom-note-button");
    var bothButton = document.getElementById("both-notes-button");
    //global variables update each time a new exercise is generated
    topButton.addEventListener("click", function() {
        tones.play(EP.currentExercise.topNoteName, EP.currentExercise.topNoteOctave);
    });
    bottomButton.addEventListener("click", function() {
        tones.play(EP.currentExercise.bottomNoteName, EP.currentExercise.bottomNoteOctave);
    });
    bothButton.addEventListener("click", function() {
        tones.play(EP.currentExercise.topNoteName, EP.currentExercise.topNoteOctave);
        setTimeout(function(){
            tones.play(EP.currentExercise.bottomNoteName, EP.currentExercise.bottomNoteOctave);
        }, 200);
    });
    var answers = document.getElementsByClassName("answer-button");
    for(var i = 0; i < answers.length; i++){
        answers[i].addEventListener("click", doAnswer);
    }
}

function setupNextButtonListener() {
    var next = document.getElementById("next");
    next.addEventListener("click", goToNextExercise);
}

function goToNextExercise(e) {
    if(!EP.currentExercise.answerGiven) {
        saveExerciseResult(e); //passes click event for "Next Exercise" (rather than answer button)
    }
    setRandomIntervalExercise();
    updateAnswerButtonText();
    resetStylesAndSound();
    updateProgressCounter();
    var nextButton = document.getElementById("next");
    var current = parseInt(document.getElementById("current").innerHTML)
    var courseTotal = parseInt(document.getElementById("course-total").innerHTML)
    if(current === courseTotal) {
        nextButton.innerHTML = "Get results";
    }
    //TODO: figure out where to put this. Maybe "goToNextExercise"?
    // EP.course.remainingExercises.splice(EP.currentExercise.answerIndex, 1);
    var answerIndex = getObjectIndexByProperty(
          "interval_name",
          EP.currentExercise.intervalName,
          EP.course.remainingExercises
    );
    EP.course.remainingExercises.splice(answerIndex, 1);
}

function setupListeners() {
    setupPlayButtonListeners();
    setupNextButtonListener();
}

function getCourseExercises() {
    var checkedIds = getIdsOfChecked();
    if (checkedIds.split(" ").length < 2) {
        alert("You must choose at least two intervals");
        return false;
    }
    var request = new XMLHttpRequest();
    request.onload = function() {
        console.log("It worked!");
        var exercises = JSON.parse(this.responseText);
        console.log(exercises);
        makeExercisesFromData(exercises.data);
    }
    var data = new FormData();
    data.append("html_names", checkedIds);
    request.open("POST", "/interval-selection/", true);
    request.send(data);
    return true;
}

function confirmSIDialogue() {
    if(getCourseExercises()) {
        hideSIDialogue();
    }
}

function showSelectionDialogue() {
    // TODO: modify getCourseExercises to confirm selection and send selected names to Django
    var siGrayout = document.getElementById("si-grayout");
    var siDialogue = document.getElementById("si-dialogue");
    siGrayout.classList.remove("hidden");
    siDialogue.classList.remove("hidden");
    document.getElementById("build-course-button").addEventListener("click", confirmSIDialogue);
}
document.addEventListener("DOMContentLoaded", showSelectionDialogue);
