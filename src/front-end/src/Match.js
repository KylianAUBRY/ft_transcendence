import React from 'react'
import './Match.css'

const Match = () => {
    var match = document.getElementById('match')
    if (match)
        match.style.background = 'green'
  
    return (
        <div className='match' id='match'><p className='username'>VS ?username</p><p className='score'>score</p><p className='date'>date - time</p>
        </div>
        );
  };
  
  export default Match;
  
  