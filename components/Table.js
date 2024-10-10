"use client"
import { useEffect, useState } from "react";
import StopWatch from "./StopWatch";

const cards = [
  1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8
];

export default function Table() {
  const [clickedCard, setClickedCard] = useState([]);
  const [randomSort, setRandomSort] = useState([]);
  const [rightCard, setRightCard] = useState([]);
  const [playing, setPlaying] = useState(0); //to check when to start timing 0 = before play, 1 = playing, 2 = end
  const [flipTurn, setFlipTurn] = useState(0);
  let isWaiting = false;

  const reset = () => {
    setClickedCard([]);
    getRandomSort();
    setRightCard([]);
    setFlipTurn(0);
    setPlaying(0);
  }
  useEffect(() => {
    getRandomSort();
  }, []);

  useEffect(()=>{
    if(clickedCard.length === 2){
      if(randomSort[clickedCard[0]] === randomSort[clickedCard[1]]){
        setRightCard([...rightCard,clickedCard[0],clickedCard[1]]);
        setClickedCard([]);
      } else {          
        isWaiting = true;
        setTimeout(() => {
          setClickedCard([]);
          isWaiting = false;
        },1000)          
      }
    }
  },[clickedCard])    

  useEffect(() => {
    if(rightCard.length === 16){
      setPlaying(2);
    }
  },[rightCard])

  function getRandomSort() {
    const randomIndices = [];
    const randomSortTemp = [];
    while(randomSortTemp.length < cards.length) {
      const randomIndex = Math.floor(cards.length *  Math.random());
      if(randomIndices.includes(randomIndex)){
        continue;
      }
      randomSortTemp.push(cards[randomIndex]);
      randomIndices.push(randomIndex);
    } 

    setRandomSort(randomSortTemp);
  }

  const flip = (i) => {
    if(isWaiting){
      return;
    }

    if(!playing){
      setPlaying(1);
    }

    if(clickedCard.length === 0){
      setFlipTurn(flipTurn + 1);
    }
    setClickedCard([...clickedCard,(i)]); //already turned card 
  };

  if(randomSort.length === 0) {
    return <>loading</>;
  }

  return (
    <>
      <div className="pt-3 noselect" style={{height:"100%", display:"flex", alignItems:"start", justifyContent:"center", backgroundColor: "#fff0db"}}>
          <div style={{height:"600px", width:"600px"}}>
            <div className="row g-0">
              {randomSort.map((num, i) => {
                return (
                  <div key={i} className="col-3 p-2">
                    <div onClick={()=> {
                      if(!clickedCard.includes(i) && !rightCard.includes(i)) {
                        flip(i);
                      }
                    }} className={clickedCard.includes(i) || rightCard.includes(i)?'flip-card flipped':'flip-card'}>
                      <div className="flip-card-inner">
                        <div className="d-flex justify-content-center align-items-center" style={{height:"100%", backgroundColor: "white", borderRadius:"6px", border: rightCard.includes(i) ? "2px solid #ffb660" : "none"}} >
                          {(clickedCard.includes(i) || rightCard.includes(i)) ? <img src={`/images/${num}.jpg`} alt={num} style={{height:"75px"}}/>: <img src="/images/back.jpg" alt="back" style={{height:"75px"}}/>}
                        </div>
                      </div>
                    </div>
                  </div>
                ) 
              })}
            </div>
          </div>
          <div className="d-flex flex-column ms-3 pt-3">
            <div style={{color: playing ===2 ? "green" : "black", textAlign: "center"}}>Turns: {flipTurn} </div>
            <StopWatch playing={playing} />
            <button className="btn btn-outline-secondary" onClick={() => reset()}>{playing ===2 ? "play again" : "reset"}</button>
          </div>
      </div>
    </>
  );
}