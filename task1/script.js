const questions = [
    {
      question: "What is the capital of India?",
      options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
      answer: 1
    },
    {
      question: "Who is known as the Father of the Nation?",
      options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Subhash Chandra Bose", "Bhagat Singh"],
      answer: 1
    },
    {
      question: "Which is the national animal of India?",
      options: ["Lion", "Elephant", "Tiger", "Peacock"],
      answer: 2
    },
    {
      question: "Which is the national flower of India?",
      options: ["Rose", "Lotus", "Marigold", "Sunflower"],
      answer: 1
    }
  ];
  
  let currentQuestion = 0;
  let score = 0;
  
  function loadQuestion() {
    const questionElement = document.getElementById("question");
    const optionButtons = document.querySelectorAll(".option-btn");
  
    questionElement.textContent = questions[currentQuestion].question;
    optionButtons.forEach((button, index) => {
      button.textContent = questions[currentQuestion].options[index];
    });
  }
  
  function checkAnswer(selectedOption) {
    if (selectedOption === questions[currentQuestion].answer) {
      score++;
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }
  
  function showResult() {
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("score").textContent = `${score} / ${questions.length}`;
  }
  
  function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById("result").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    loadQuestion();
  }
  
  // Load the first question when the page loads
  loadQuestion();
