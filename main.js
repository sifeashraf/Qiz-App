let g = console.log;
let bullets = document.querySelector(".bullets");
let spans = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");

let answarArea = document.querySelector(".answar-area");

//submit btn
let btn = document.querySelector(".submit");

let theRightAnswer = 0;

let count = document.querySelector(".quiz-info .count span");

let countdownintrval;

let countdownElemnt = document.querySelector(".count-down");

//set options
let currentIndex = 0;

let resultsContainer = document.querySelector(".results");
function getquestions() {
  let request = new XMLHttpRequest();

  request.onload = function () {
    if (this.readyState === 4 && this.status === 200) {
      let question = JSON.parse(this.responseText);

      creatspans(question.length);

      addQuestionData(question[currentIndex], question.length);

      countdown(65, question.length);

      btn.onclick = function () {
        let therRghtAnswar = question[currentIndex].right_answer;
        //incress the index to move to the next qeustion
        currentIndex++;

        checkAnswar(therRghtAnswar, question.length);
        clearquiz();
        addQuestionData(question[currentIndex], question.length);
        creatspans(question.length);

        countdown(60, question.length);

        showResults(question.length);
      };
    }
  };
  request.open("GET", "./html_question.json", true);
  request.send();
}
getquestions();

function creatspans(length) {
  for (let i = 0; i < length; i++) {
    //creat bullet
    let createdspan = document.createElement("span");
    //check if the i is equel zero if its 0 then do it
    if (i <= currentIndex) {
      createdspan.classList.add("on");
    }

    spans.appendChild(createdspan);
  }
  //! get the number of the question
  // let numbers = document.getElementsByClassName("on")
  // g(numbers.length)
  count.innerHTML = length;
}

function addQuestionData(currentObject, count) {
  if (currentIndex < count) {
    quizArea.innerHTML = `<h2>${currentObject.title}</h2> `;

    //creat maindiv
    for (let i = 1; i <= 4; i++) {
      // creat main div
      let maindiv = document.createElement("div");
      //add answar class
      maindiv.className = "answar";
      //creat the inpt
      let input = document.createElement("input");

      //Add type + Name + id + dataset
      input.type = "radio";
      input.name = "question";
      input.id = `answer_${i}`;
      input.dataset.answar = `${currentObject[`answer_${i}`]}`;

      //creat the lable
      let label = document.createElement("label");
      //this html for mean for or lable for
      label.htmlFor = `answer_${i}`;
      //the lable text
      let labletext = document.createTextNode(`${currentObject[`answer_${i}`]}`);
      //apend to the text to the lable
      label.appendChild(labletext);

      //append input + lable to the mainDiv
      maindiv.appendChild(input);
      maindiv.appendChild(label);
      answarArea.appendChild(maindiv);
    }
  }
}
//check for the the answar if its right
function checkAnswar(rAnsawr, qcount) {
  //after addQuestionData run and add question with name question
  //this will collect all the questions
  let theQuestion = document.getElementsByName("question");
  //make it global variable
  let theschosenasnwar;
  //loop over the question wiich is 4
  for (let i = 0; i < theQuestion.length; i++) {
    //will loop over the radio input and find the checked one
    if (theQuestion[i].checked) {
      //the variable will resign the value with the chosen
      theschosenasnwar = theQuestion[i].dataset.answar;
    }
  }
  //will Comparing the inpt that have check attrubite with the right answar ()
  if (rAnsawr === theschosenasnwar) {
    theRightAnswer++;
  }
}

//clear the borard
function clearquiz() {
  answarArea.innerHTML = "";
  quizArea.innerHTML = "";
  spans.innerHTML = "";
}
function showResults(count) {
  let theresults;
  if (currentIndex === count) {
    quizArea.remove();
    answarArea.remove();
    btn.remove();
    bullets.remove();

    if (theRightAnswer > count / 2 && theRightAnswer < count) {
      theresults = `<span class="good">Good</span>, ${theRightAnswer} From ${count}`;
    } else if (theRightAnswer === count) {
      theresults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theresults = `<span class="bad">Bad</span>, ${theRightAnswer} From ${count}`;
    }
    resultsContainer.innerHTML = theresults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}
function countdown(duration, count) {
  clearInterval(countdownintrval);
  let minuts, seconds;

  if (currentIndex < count) {
    console.log(duration);
    countdownintrval = setInterval(() => {
      minuts = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minuts = minuts < 10 ? `0${+minuts}` : minuts;
      seconds = seconds < 10 ? `0${+seconds}` : seconds;
      countdownElemnt.innerHTML = `${minuts}:${seconds}`;
      --duration;
      if (duration < 0) {
        clearInterval(countdownintrval);
        btn.click();
      }
    }, 1000);
  }
}
