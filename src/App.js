//react
import { useCallback, useEffect, useState } from 'react';

//data

import { wordsList } from './data/words';

//css
import './App.css';

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQtd = 3;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words, setWords] = useState(wordsList);


  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQtd);
  const [score, setScore] = useState(0);


  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    console.log(category)

    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word)

    return { word, category };
  },[words]);

  //stars the secret word game
  const startGame = useCallback(() => {

    //clear all letters
    clearLetterStates();

    //pick word and category
    const { word, category } = pickWordAndCategory();

    //create an array of letters  
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(wordLetters);

    //fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  },[pickWordAndCategory()]);

  //process the letter input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

    //check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    //push a guessed letter or remove a change
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);

    };
  }


  const clearLetterStates = () => {
      setGuessedLetters([]);
      setWrongLetters([]);
  }
  

    useEffect(() => {
      if (guesses <= 0) {
        clearLetterStates();

        setGameStage(stages[2].name);
      }
    }, [guesses]);

    //check win conditions
    useEffect(() => {
      const uniqueLetters = [...new Set(letters)];

      //win condition
       if(guessedLetters.length === uniqueLetters.length){
        //add score
        setScore((actualScore) => actualScore += 100 )
        
        //restart game w new word
        startGame();

       }

      console.log(uniqueLetters)
    }, [guessedLetters, letters, startGame]);


    //restarts the game
    const retry = () => {

      setScore(0);
      setGuesses(guessesQtd);

      setGameStage(stages[0].name);
    }

    return (
      <div className="App">
        {gameStage === 'start' && <StartScreen startGame={startGame} />}
        {gameStage === 'game' && (
          <Game
            verifyLetter={verifyLetter}
            pickedWord={pickedWord}
            pickedCategory={pickedCategory}
            letters={letters}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            guesses={guesses}
            score={score}
          />
        )
        }
        {gameStage === 'end' && <GameOver retry={retry} score={score} />}
      </div>
    );
  }



export default App;
