"use client";
import { useEffect, useState } from "react";
import StopWatch from "./StopWatch";
import { Roboto_Mono } from "next/font/google";

const robo = Roboto_Mono({ subsets: ['latin'] });

const cards = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
const demoCards = ["11", "12", "21", "22", "31", "32", "41", "42", "51", "52", "61", "62", "71", "72", "81", "82"];

//mode 0 = pic with pic ; 1= pic with word
const themes = [
  { type: "awei", borderColor: "#ffb660", backgroundColor: "#fff0db", value: 0, label: "阿偉", mode: 0},
  { type: "soymilk", borderColor: "#beda84", backgroundColor: "#f1ece9", value: 1, label: "豆乳", mode: 0 },
  { type: "panda", borderColor: "#beda84", backgroundColor: "#f1ece9", value: 2, label: "胖達", mode: 0 },
  { type: "chiikawa", borderColor: "#beda84", backgroundColor: "#f1ece9", value: 3, label: "吉伊", mode: 0 },
  { type: "human", borderColor: "#beda84", backgroundColor: "#f1ece9", value: 4, label: "人", mode: 1 },
  { type: "jpAnimal", borderColor: "#beda84", backgroundColor: "#f1ece9", value: 5, label: "日語-動物", mode: 1 },
];

export default function Table() {
  const [clickedCard, setClickedCard] = useState([]);
  const [randomSort, setRandomSort] = useState([]);
  const [rightCard, setRightCard] = useState([]);
  const [playing, setPlaying] = useState(0); // 0: before play, 1: playing, 2: end
  const [flipTurn, setFlipTurn] = useState(0);
  const [theme, setTheme] = useState(themes[0]);
  const [themePicked, setThemePicked] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0); // Track selected theme index

  const reset = () => {
    setClickedCard([]);
    shuffleCards();
    setRightCard([]);
    setFlipTurn(0);
    setPlaying(0);
    setGameScore(0);
    setGameTime(0); // Reset game time
    setThemePicked(false);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  useEffect(() => {
    if (clickedCard.length === 2) {
      console.log(randomSort[clickedCard[0]][0]);
      console.log(randomSort[clickedCard[1]]);
      console.log(typeof randomSort[clickedCard[1]]);

      if (randomSort[clickedCard[0]][0] === randomSort[clickedCard[1]][0]) {
        // clikedCard =[1, 4];
          //const randomSort = ["11", "12", "21", "22", "31", "32", "41", "42", "51", "52", "61", "62", "71", "72", "81", "82"];

        setRightCard(prev => [...prev, clickedCard[0], clickedCard[1]]);
        setClickedCard([]);
      } else {
        setIsWaiting(true);
        setTimeout(() => {
          setClickedCard([]);
          setIsWaiting(false);
        }, 1000);
      }
    }
  }, [clickedCard]);
  

  const handleTimeChange = (totalSeconds) => {
    setGameTime(totalSeconds);
  };

  useEffect(() => {
    if (rightCard.length === 16) {
      calculateScore();
      setPlaying(2);
    }
  }, [rightCard]);

  const calculateScore = () => {
    let score = 0;
    if (gameTime <= 20) score += 10;
    else if (gameTime <= 30) score += 8;
    else if (gameTime <= 40) score += 5;
    else score += 1;

    if (flipTurn === 8) score += 10;
    else if (flipTurn <= 16) score += 8;
    else if (flipTurn <= 20) score += 5;
    else score += 1;

    setGameScore(score);
  };

  function shuffleCards() {
    const randomSortTemp = [];
    const randomIndices = new Set();
    while (randomSortTemp.length < demoCards.length) {
      const randomIndex = Math.floor(Math.random() * demoCards.length);
      if (!randomIndices.has(randomIndex)) {
        randomSortTemp.push(demoCards[randomIndex]);
        randomIndices.add(randomIndex);
      }
    }
    setRandomSort(randomSortTemp);
  }

  const flip = (i) => {
    if (isWaiting || rightCard.includes(i)) return;

    if (!playing) setPlaying(1);
    if (!themePicked) setThemePicked(true);

    if (clickedCard.length === 0) {
      setFlipTurn(prev => prev + 1);
    }
    setClickedCard(prev => [...prev, i]);
  };

  if (randomSort.length === 0) {
    return <div>Loading game... Please wait.</div>;
  }

  return (
    <div
      className={`pt-3 noselect flex-sm-row flex-column-reverse justify-content-sm-center justify-content-end ${robo.className}`}
      style={{ height: "100%", display: "flex", alignItems: "start", backgroundColor: theme.backgroundColor }}
    > 
      <div className="cards">
        <div className="row g-0 mt-3 mt-sm-0">
          {randomSort.map((num, i) => (
            <div key={i} className="col-3 p-sm-2 p-1">
              <div
                onClick={() => {
                  if (!clickedCard.includes(i) && !rightCard.includes(i)) {
                    flip(i);
                  }
                }}
                className={clickedCard.includes(i) || rightCard.includes(i) ? 'flip-card flipped' : 'flip-card'}
              >
                <div className="flip-card-inner">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "100%", backgroundColor: "white", borderRadius: "6px", border: rightCard.includes(i) ? `2px solid ${theme.borderColor}` : "none" }}
                  >
                    {(clickedCard.includes(i) || rightCard.includes(i)) ? (
                      <img src={`/images/${theme.type}/${theme.mode === 0? num[0]: num}.jpg`} alt={`Card ${num}`} style={{ height: "75px" }} />
                    ) : (
                      <img src="/images/back.jpg" alt="Card back" style={{ height: "75px" }} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex flex-sm-column align-items-center ms-3 pt-0 pt-sm-3">
        <div style={{ color: playing === 2 ? "green" : "black", textAlign: "center" }}>Turns: {flipTurn}</div>
        <StopWatch playing={playing} onTimeChange={handleTimeChange} />
        <button className="btn btn-outline-secondary" onClick={reset} aria-label={playing === 2 ? "Play Again" : "Reset Game"}>
          {playing === 2 ? "Play Again" : "Reset"}
        </button>
        {!themePicked ? (
          <select 
            className="m-2" 
            value={selectedThemeIndex} 
            onChange={(e) => {
              const index = Number(e.target.value);
              setSelectedThemeIndex(index);
              setTheme(themes[index]);
            }}
          >
            {themes.map((theme, index) => (
              <option key={index} value={index}>{theme.label}</option>
            ))}
          </select>
        ) : (
          <div className="d-flex">
            <div className="m-2">Score: {gameScore}</div>
          </div>
        )}
      </div>
    </div>
  );
}
