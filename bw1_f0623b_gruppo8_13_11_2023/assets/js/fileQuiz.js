/*QUIZ GAME!

        REGOLE:
        / L'utente dovrà indovinare un certo numero di domandeThe player must guess correctly a certain amount of questions
        / Ogni risposta corretta gli darà 1 punto
        / Le domande possono avere risposte multiple o singole (true/false)
        / Al termine del quiz l'utente dovrà poter vedere il suo punteggio

        DOMANDE:
        / Le domande possono essere ottenute da questo URL ( http://bit.ly/strive_QUIZZ ) o puoi scriverne di tue
        / Possono essere composte di boolean multipli (true / false)

        TIPS:
        / Usa una variabile globale per registrare il punteggio dell'utente
        / Crea una variabile "questionNumber" per tenere traccia del numero (o posizione) della domanda presentata all'utente
        / Quando "questionNumber" è maggiore delle domande disponibili, a quel punto l'applicazione dovrà mostrare il punteggio
        / Comincia salvando le domande in una variabile (o reperiscile dall'URL fornito usando AJAX e fetch)
        / Parti con l'implementazione semplice, poi passa agli extra e ad abbellire l'interfaccia 
        / Fai test completi: controlla la console periodicamente per verificare che non ci siano errori e che il flusso di dati sia quello che ti aspetti

        EXTRA:
        / Dai un feedback sulla risposta al momento del click (corretta o sbagliata)
        / Visualizza una domanda alla volta in sequenza piuttosto che tutte assieme in forma di lista
        / Permetti all'utente di selezionare la difficoltà del quiz prima di iniziare e il numero di domande che desidera ricevere.
        ( Se hai implementato l'applicazione usando l'URL fornito, puoi ottenere i dati che ti servono in modo semplice, 
        usando query parameters in questo modo: https://opentdb.com/api.php?amount=10&category=18&difficulty=easy e modificarne il numero di domande e difficoltà )
    */
/* NON DIMENTICARE...
  di fare commit & push del codice regolarmente sulla tua repository GitHub e di condividerla con i tuoi colleghi
*/
const questions = [
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "What does CPU stand for?",
    correct_answer: "Central Processing Unit",
    allAnswers: [
      "Central Process Unit",
      "Computer Personal Unit",
      "Central Processor Unit",
      "Central Processing Unit",
    ],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "In the programming language Java, which of these keywords would you put on a variable to make sure it doesn&#039;t get modified?",
    correct_answer: "Final",
    allAnswers: ["Static", "Final", "Private", "Public"],
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question: "The logo for Snapchat is a Bell.",
    correct_answer: "False",
    allAnswers: ["True", "False",],
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question:
      "Pointers were not used in the original C programming language; they were added later on in C++.",
    correct_answer: "False",
    allAnswers: ["True", "False",],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "What is the most preferred image format used for logos in the Wikimedia database?",
    correct_answer: ".svg",
    allAnswers: [".svg", ".png", ".jpeg", ".gif",],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "In web design, what does CSS stand for?",
    correct_answer: "Cascading Style Sheet",
    allAnswers: [
      "Counter Strike: Source",
      "Cascading Style Sheet",
      "Corrective Style Sheet",
      "Computer Style Sheet",
    ],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "What is the code name for the mobile operating system Android 7.0?",
    correct_answer: "Nougat",
    allAnswers: [
      "Ice Cream Sandwich",
      "Nougat",
      "Jelly Bean",
      "Marshmallow",
    ],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "On Twitter, what is the character limit for a Tweet?",
    correct_answer: "140",
    allAnswers: ["140", "120", "160", "100"],
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question: "Linux was first created as an alternative to Windows XP.",
    correct_answer: "False",
    allAnswers: ["True", "False",],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "Which programming language shares its name with an island in Indonesia?",
    correct_answer: "Java",
    allAnswers: ["Python", "C", "Jakarta", "Java",],
  },
];

function generateQuestions() {
  /* 
  agganciato il wrapper che conterrà il titolo della domanda generata 
  e crea un altro container che conterrà le risposte possibili
  */
  let wrapper = document.getElementById('questionWrapper');
  wrapper.innerHTML = `
  <div id="question">
    <h2 id="titoloDomanda">${randomQuestions[currentQuestion].question}</h2>
  </div>
  <div id="answer" class="align-center"></div>
  `;
  /* 
  aggancio il container precedentemente generato
  tramite il for loop partendo da indice = 0, ovvero currentQuestion
  abbiamo ciclato per tutta la lunghezza del array allAnswer all'interno dell'oggetto questions
  */
  let containerQuestion = document.getElementById('answer');
  for (let i = 0; i < randomQuestions[currentQuestion].allAnswers.length; i++) {
    containerQuestion.innerHTML += `
    <div class="option">${randomQuestions[currentQuestion].allAnswers[i]}</div>
    `;
  }
  /*
  sempre utilizzando il template literal abbiamo iniettato nel wrapper il valore (numero) corrente della domanda a cui stiamo rispondendo
  */
  wrapper.innerHTML += `
  <div id="currentQuestion">Domanda ${currentQuestion + 1}/10</div>
  `
  /* 
  prendiamo ogni singola opzione tra le quattro, aggiungiamo un eventListener che al click triggera la funzione nextQuestion 
  */
  let option = document.getElementsByClassName('option');

  for (let i = 0; i < option.length; i++) {
    let element = option[i];
    element.addEventListener("click", () => {
      nextQuestion(element.innerHTML);
      
    })
  }
}

/* 
questa funzione controlla se l'array delle risposte è più corto dell'array che contiene tutte le domande
se la condizione è vera la stringa all'interno del contenitore option viene pushata nell'array userAnswer
l'indice aumenta di 1
viene riavviata la funzione generateQuestion e viene resettato il timer
se quella condizione è falsa e quindi l'utente ha risposto a tutte le domande il timer viene fermato
e vengono rimossi tutti gli elementi al'interno del main, per creare spazio alla pagina del risultato (tramite funzione result)  
*/
let nextQuestion = function (string) {
  if (userAnswers.length < randomQuestions.length-1) {
  userAnswers.push(string);
  console.log(userAnswers);
  currentQuestion += 1;
  generateQuestions(currentQuestion, userAnswers);
  resetTimer();
}
  else {
  userAnswers.push(string);
  console.log(userAnswers);
  stopTimer();
  let wrapper = document.getElementById('questionWrapper');
  wrapper.remove();
  let orologio = document.getElementById('timer')
  orologio.remove();
  let progressBar = document.getElementById('progressBar');
  progressBar.remove();
  result();
  }
}

/* 
viene agganciato il main, inizializzo due variabili, ciclo la lunghezza dell'array questions
se la risposta pushata nell'array userAnswers è uguale a una delle risposte contenute nella collezione correct_answer,
il valore della variabile rightAnswers incrementa di uno, altrimenti incrementerà quello di wrongAnswers

*/
function result () {
  let main = document.getElementById('main');
  let rightAnswers = 0;
  let wrongAnswers = 0;
  for(let i=0; i < randomQuestions.length; i++) {
    if (randomQuestions[i].correct_answer == userAnswers[i]){
      rightAnswers+=1;
    } else {
      wrongAnswers+=1;
    }
  }
/*
dopodiché viene stabilito, tramite template literal, il nuovo HTML che dovrà avere la pagina del risultato,
inserendo anche il calcolo in percentuale delle risposte giuste/sbagliate
*/
  main.innerHTML =`

<div>
  <h2 class="evidenziato">Result</h2> 
  <p id="sottotitolo">the summary of your answer: <p> 
</div>

<div id="flexContainer">

  <div class="Answers">
   Correct <br> <span class="evidenziato"> ${(rightAnswers / questions.length)*100}% </span>
  </div>

  <div id="risultatoTestuale" class="flex">
  
  </div>

  <div class="Answers">
    Wrong <br> <span class="evidenziato"> ${(wrongAnswers / questions.length)*100}% </span>
  </div>

</div>

<div>
  <form action = "feedback.html">
    <button id="resultButton"> RATE US </button>
  </form>
</div>
  `;
/*
qui viene dichiarata una variabile alla quale verrà assegnato un valore differente a seconda del numero di risposte esatte,
se sono maggiori o uguali a 5 verrà mostrato un messaggio, altrimenti un altro. La variabile testo che contiene i messaggi 
sarà utilizzata come valore del div con Id risultatoTestuale precedentemente generato con il template literal. 
*/
  let testo; 

  if ( rightAnswers >= 5 ) {
    testo =`<span class="colorato"> Congratulazioni! Hai superato il test! </span>`
  } else {
    testo = ` <span class="colorato"> Mi dispiace, non hai superato il Test! </span>`
  }


  const risultatoTestuale = document.getElementById("risultatoTestuale"); 
  risultatoTestuale.innerHTML = testo;
}

function startTimer () {
  timerInterval = setInterval(function() {updateTimer();}, 1000);
}

function stopTimer () {
  clearInterval(timerInterval);
}
function updateTimer() {

  reloadTimerHtml();
  if (timerSeconds == 0) {nextQuestion(null);}
  else {timerSeconds--;}
}
function resetTimer() {
  stopTimer();
  timerSeconds = 30;
  reloadTimerHtml();
  timerSeconds--;
  startTimer(); 
}
function reloadTimerHtml() {
  let orologio = document.getElementById('timer');
  orologio.innerHTML=timerSeconds;
  let progressBar = document.getElementById('progressBar');
  let percentage = (timerSeconds / 30) * 100;
  progressBar.style.width = percentage + '%';
}
/*

*/
function stopTimer () {
  clearInterval(timerInterval);
}
function randomize() {
  let tempIndex = temp.length
  for (let i = 0; i < tempIndex; i++) {
    let randValue = Math.floor(Math.random() * temp.length);
    randomQuestions.push(temp[randValue]);
    temp.splice(randValue, 1);
  }
}
/*
qui c'è la lista delle variabili dichiarate
timerSeconds è utilizzata per storare il valore del timer in un determinato momento;
timerInterval è utilizzata per storare il timer in se;


*/
let timerSeconds;
let timerInterval;
let userAnswers = [];
let currentQuestion;
let temp = [...questions];
let randomQuestions = [];

window.onload = function () {
  currentQuestion=0;
  randomize();
  generateQuestions();
  timerSeconds = 30;
  let orologio = document.getElementById('timer')
  orologio.innerHTML=timerSeconds;
  timerSeconds--;
  timerInterval = setInterval(function() {updateTimer();}, 1000);

};

  // TIPS:

  // SE MOSTRI TUTTE LE RISPOSTE ASSIEME IN FORMATO LISTA:
  // Per ogni domanda, crea un container e incorporale tutte all'interno. 
  // Crea poi dei radio button
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio
  // con le risposte corrette e incorrette come opzioni
  // (dovrai probabilmente cercare su un motore di ricerca come ottenere un valore da un radio button in JS per ottenere il punteggio finale) 
  //
  // SE MOSTRI UNA DOMANDA ALLA VOLTA:
  // Mostra la prima domanda con il testo e i radio button.
  // Quando l'utente seleziona una risposta, passa alla domanda successiva dell'array e sostituisci quella precedentemente visualizzata con quella corrente,
  // salvando le risposte dell'utente in una variabile


// Come calcolare il risultato? Hai due strade:
// Se stai mostrando tutte le domande nello stesso momento, controlla semplicemente se i radio button selezionati sono === correct_answer
// Se stai mostrando una domanda alla volta, aggiungi semplicemente un punto alla variabile del punteggio che hai precedentemente creato SE la risposta selezionata è === correct_answer

// BUON LAVORO 💪🚀