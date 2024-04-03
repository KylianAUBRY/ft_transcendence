import React, {useState} from 'react'
import './Match.css'




const Match = (matchObject) => {
    const id = matchObject.matchObject.gameId
    var match = document.getElementById(`match${id}`)
    console.log('mtch', matchObject)

    if (matchObject.matchObject.isWin){
        try{
            match.style.background = 'green'
        } catch{}
    } else {
        try{
            match.style.background = 'red'
        } catch{}
    }
        

    const opponentUsername = matchObject.matchObject.opponentUsername
    const score = matchObject.matchObject.userScore + ' - ' + matchObject.matchObject.opponentScore
    const date = matchObject.matchObject.gameDate
    const time = matchObject.matchObject.gameTime
    return (
        <>
        <div className='match' id={`match${id}`}>
            <p className='username'>VS {opponentUsername}</p><p className='score'>{score}</p><p className='date'>{date} - {time} sec</p>
        </div>
        </>
        );
  };
  
  export default Match;
  
  