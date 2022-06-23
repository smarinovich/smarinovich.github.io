// Quiz from Gary Carino at https://codepen.io/gcarino/pen/AaJBOo
(function() {
    var questions = [{
      question: "What knot connects 2 ropes?",
      choices: ['Reef Knot', 'Rolling Hitch', 'SheepShank'],
      correctAnswer: 0
    }, {
      question: "What knot can help hold out a tent fly?",
      choices: ['Bowline', 'Rolling Hitch', 'Clove Hitch'],
      correctAnswer: 1
    }, {
      question: "Which knot is used to start off bigger lashings?",
      choices: ['Alpine Butterfly', 'Sheepshank', 'Clove Hitch'],
      correctAnswer: 2
    }, {
      question: "Which knot shortens the rope?",
      choices: ['Knife', 'Sheepshank', 'Alpine Butterfly'],
      correctAnswer: 1
    }, {
      question: "What knot can create a loop in the middle of the rope?",
      choices: ['Rolling Hitch', 'Bowline', 'Sheepshank'],
      correctAnswer: 2
    },{
        question: "Which knot can create a loop at the end of a rope?",
        choices: ['Rolling Hitch', 'Bowline', 'Sheepshank'],
        correctAnswer: 1
    }, {
        question: "Which knot can make loops in a rope for someone to climb?",
        choices: ['Reef Knot', 'Alpine Butterfly', 'SheepShank'],
        correctAnswer: 1
      }, {
        question: "What knot doesn't slip when pulled?",
        choices: ['Rolling Hitch', 'Bowline', 'Clove Hitch'],
        correctAnswer: 0
      }, {
        question: "Which knot is useful to tie a rope fence?",
        choices: ['Alpine Butterfly', 'Sheepshank', 'Clove Hitch'],
        correctAnswer: 2
      }, {
        question: "Which knot strengthen the ropes?",
        choices: ['Reef Knot', 'Sheepshank', 'Alpine Butterfly'],
        correctAnswer: 1
      }, {
        question: "What knot can be used to make a loop around someone's waist",
        choices: ['Rolling Hitch', 'Bowline', 'Sheepshank'],
        correctAnswer: 1
      },{
          question: "Which knot is commonly seen as the scouts symbol?",
          choices: ['Rolling Hitch', 'Bowline', 'Reef Knot'],
          correctAnswer: 2
      }];
    
    var questionCounter = 0; //Tracks question number
    var selections = []; //Array containing user choices
    var quiz = $('#quiz'); //Quiz div object
    
    // Display initial question
    displayNext();
    
    // Click handler for the 'next' button
    $('#next').on('click', function (e) {
      e.preventDefault();
      
      // Suspend click listener during fade animation
      if(quiz.is(':animated')) {        
        return false;
      }
      choose();
      
      // If no user selection, progress is stopped
      if (isNaN(selections[questionCounter])) {
        alert('Please make a selection!');
      } else {
        questionCounter++;
        displayNext();
      }
    });
    
    // Click handler for the 'prev' button
    $('#prev').on('click', function (e) {
      e.preventDefault();
      
      if(quiz.is(':animated')) {
        return false;
      }
      choose();
      questionCounter--;
      displayNext();
    });
    
    // Click handler for the 'Start Over' button
    $('#start').on('click', function (e) {
      e.preventDefault();
      
      if(quiz.is(':animated')) {
        return false;
      }
      questionCounter = 0;
      selections = [];
      displayNext();
      $('#start').hide();
    });
    
    // Animates buttons on hover
    $('.button').on('mouseenter', function () {
      $(this).addClass('active');
    });
    $('.button').on('mouseleave', function () {
      $(this).removeClass('active');
    });
    
    // Creates and returns the div that contains the questions and 
    // the answer selections
    function createQuestionElement(index) {
      var qElement = $('<div>', {
        id: 'question'
      });
      
      var header = $('<h2>Question ' + (index + 1) + ':</h2>');
      qElement.append(header);
      
      var question = $('<p>').append(questions[index].question);
      qElement.append(question);
      
      var radioButtons = createRadios(index);
      qElement.append(radioButtons);
      
      return qElement;
    }
    
    // Creates a list of the answer choices as radio inputs
    function createRadios(index) {
      var radioList = $('<ul>');
      var item;
      var input = '';
      for (var i = 0; i < questions[index].choices.length; i++) {
        item = $('<li>');
        input = '<input type="radio" name="answer" value=' + i + ' />';
        input += questions[index].choices[i];
        item.append(input);
        radioList.append(item);
      }
      return radioList;
    }
    
    // Reads the user selection and pushes the value to an array
    function choose() {
      selections[questionCounter] = +$('input[name="answer"]:checked').val();
    }
    
    // Displays next requested element
    function displayNext() {
      quiz.fadeOut(function() {
        $('#question').remove();
        
        if(questionCounter < questions.length){
          var nextQuestion = createQuestionElement(questionCounter);
          quiz.append(nextQuestion).fadeIn();
          if (!(isNaN(selections[questionCounter]))) {
            $('input[value='+selections[questionCounter]+']').prop('checked', true);
          }
          
          // Controls display of 'prev' button
          if(questionCounter === 1){
            $('#prev').show();
          } else if(questionCounter === 0){
            
            $('#prev').hide();
            $('#next').show();
          }
        }else {
          var scoreElem = displayScore();
          quiz.append(scoreElem).fadeIn();
          $('#next').hide();
          $('#prev').hide();
          $('#start').show();
        }
      });
    }
    
    // Computes score and returns a paragraph element to be displayed
    function displayScore() {
      var score = $('<p>',{id: 'question'});
      
      var numCorrect = 0;
      for (var i = 0; i < selections.length; i++) {
        if (selections[i] === questions[i].correctAnswer) {
          numCorrect++;
        }
      }
      
      score.append('You got ' + numCorrect + ' questions out of ' +
                   questions.length + ' right!!!');
      return score;
    }
  })();
