import './App.css'
import React, { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import Stade from  './Stade'                
import Panel from './Panel'
import { Environment, Stars } from '@react-three/drei'
import SocialMenu from './SocialMenu'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Chart from 'chart.js/auto';
import Match from './Match'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
  baseURL: 'http://localhost:8080'
})

let stopDecompte = false

function MyCanvas( props ) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [email2, setEmail2] = useState('')
  const [password2, setPassword2] = useState('')
  const [t] = useTranslation("global")
  const navigate = useNavigate();

  const location = useLocation()

  const cameraRef = useRef()


  let initialUser = localStorage.getItem('currentUser');
  if (initialUser === null) {
    initialUser = false
  }
  const [currentUser, setCurrentUser] = useState(JSON.parse(initialUser));
  const updateUser = (newValue) => {
    setCurrentUser(newValue);
    localStorage.setItem('currentUser', JSON.stringify(newValue));
  };


  let initialToken = localStorage.getItem('csrfToken');
  if (initialToken === null) {
    initialToken = false
  }
  const [csrfToken, setcsrfToken] = useState(JSON.parse(initialToken));
  const updatecsrfToken = (newValue) => {
    setcsrfToken(newValue);
    localStorage.setItem('csrfToken', JSON.stringify(newValue));
  };

  const [isTableTournament, setisTableTournament] = useState(false)
  const [isSetterTournament, setisSetterTournament] = useState(false)
  const [isMatchTournament, setisMatchTournament] = useState(false)
  const [isResultTournamnt, setisResultTournamnt] = useState(false)
  const [isInMatchTournament, setisInMatchTournament] = useState(false)
  const [isLocalMatch, setisLocalMatch] = useState(false)
  const [isResultLocal, setisResultLocal] = useState(false)
  const [isOnlineLoad, setisOnlineLoad] = useState(false)
  const [isBotMatch, setisBotMatch] = useState(false)
  const [isDecompte, setisDecompte] = useState(false)
  const [isSocialMenu, setisSocialMenu] = useState(false)
  const [state, setState] = useState(5)
  const [isLoginPage, setisLoginPage] = useState(true)
  const [racketColor, setracketColor] = useState(0xffffff);
  const [selectedKeys, setSelectedKeys] = useState(['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight']);
  const [isProfilView, setIsProfilView] = useState(false)
 






  const updateSetState = (newValue) => {
   setState(newValue);
   if (newValue === 20){
        setisOnlineLoad(true)
        setTimeout(function() {
        var localMatch = document.querySelector('.onlineLoad');
        if (localMatch)
          localMatch.classList.add('visible');
    }, 100); 
   }else if (newValue === 30){
      setisLocalMatch(true)
        setTimeout(function() {
        var localMatch = document.querySelector('.localMatch');
        if (localMatch)
          localMatch.classList.add('visible');
    }, 100); 
    } else  if(newValue === 32) {
      setisResultLocal(true)
      setTimeout(function() {
        var localMatch = document.querySelector('.localMatch');
        if (localMatch)
          localMatch.classList.add('visible');
      }, 100); 
    }
    else if (newValue === 40){
      setisTableTournament(true)
      setTimeout(function() {
        var localMatch = document.querySelector('.tournament');
        if (localMatch)
          localMatch.classList.add('visible');
    }, 100); 
      setisSetterTournament(true)
      setisMatchTournament(false)
    } else if (newValue === 42 || newValue === 44 || newValue === 46 || newValue === 48 || newValue === 140 || newValue === 142 || newValue === 144){
      setisTableTournament(true)
      setTimeout(function() {
        var localMatch = document.querySelector('.tournament');
        if (localMatch)
          localMatch.classList.add('visible');
    }, 100); 
      setisResultTournamnt(true)

    } else if (newValue === 50) {
        setisBotMatch(true)
        setTimeout(function() {
        var localMatch = document.querySelector('.botMatch');
        if (localMatch)
          localMatch.classList.add('visible');
    }, 100); 
    }else  if(newValue === 52) {
      setisResultLocal(true)
      setTimeout(function() {
        var localMatch = document.querySelector('.localMatch');
        if (localMatch)
          localMatch.classList.add('visible');
      }, 100); 
    }else {
      setisTableTournament(false)
      setisSetterTournament(false)
      setisMatchTournament(false)
      setisResultTournamnt(false)
      setisDecompte(false)
    }

  }

useEffect(() => {
 setisTableTournament(false)
  setisSetterTournament(false)
  setisMatchTournament(false)
  setisResultTournamnt(false)
  setisInMatchTournament(false)
  setisLocalMatch(false)
  setisResultLocal(false)
  setisOnlineLoad(false)
  setisBotMatch(false)
  setisDecompte(false)
  setisSocialMenu(false)
  setState(5)
  setisLoginPage(true)
  stopDecompte = true

  if (location.pathname !== '/' && currentUser === false){
    navigate('/')
  }


  if (location.pathname === '/' && props.isSize){
    if (currentUser === true){
   /* client.get(
      "/api/logout",
      {withCredentials: true}
    ).then(function(res){
      updateUser(false)
    }).catch(function(error){
     console.log(error)
    })*/
    }

    


  const tokenCookie = getCookie('csrftoken')
  updatecsrfToken(tokenCookie)


    
 


    
    const initialFormData8 = {
      player1: '',
      player2: '',
      player3: '',
      player4: '',
      player5: '',
      player6: '',
      player7: '',
      player8: '',
  };
  setFormData8(initialFormData8);
  const initialFormData4 = {
    player1: '',
    player2: '',
    player3: '',
    player4: '',
  };
  setFormData4(initialFormData4);
  const initialFormData2 = {
    player1: '',
    player2: '',
  };
  setFormData2(initialFormData2);
  const initialFormData = {
    player: '',
  };
  setwinnerTournament(initialFormData);
  const initialFormDataScore = {
    name1: '',
    name2: '',
    player1: 0,
    player2: 0,
  };
  setscore(initialFormDataScore);
    updateSetState(5)
    setisLoginPage(true)
    setTimeout(function() {
      var loginPage = document.getElementById('loginPage');
      if (loginPage)
        loginPage.classList.add('visible');
  }, 100); 
  } else if (location.pathname === '/lobby' && props.isSize){
    const initialFormData8 = {
      player1: '',
      player2: '',
      player3: '',
      player4: '',
      player5: '',
      player6: '',
      player7: '',
      player8: '',
  };
  setFormData8(initialFormData8);
  const initialFormData4 = {
    player1: '',
    player2: '',
    player3: '',
    player4: '',
  };
  setFormData4(initialFormData4);
  const initialFormData2 = {
    player1: '',
    player2: '',
  };
  setFormData2(initialFormData2);
  const initialFormData = {
    player: '',
  };
  setwinnerTournament(initialFormData);
  const initialFormDataScore = {
    name1: '',
    name2: '',
    player1: 0,
    player2: 0,
  };
  setscore(initialFormDataScore);
    updateSetState(10)
  } else if (location.pathname === '/local' && props.isSize){
    const initialFormData8 = {
      player1: '',
      player2: '',
      player3: '',
      player4: '',
      player5: '',
      player6: '',
      player7: '',
      player8: '',
  };
  setFormData8(initialFormData8);
  const initialFormData4 = {
    player1: '',
    player2: '',
    player3: '',
    player4: '',
  };
  setFormData4(initialFormData4);
  const initialFormData2 = {
    player1: '',
    player2: '',
  };
  setFormData2(initialFormData2);
  const initialFormData = {
    player: '',
  };
  setwinnerTournament(initialFormData);
  const initialFormDataScore = {
    name1: '',
    name2: '',
    player1: 0,
    player2: 0,
  };
  setscore(initialFormDataScore);
    updateSetState(30)
  } else if (location.pathname === '/tournament' && props.isSize){
    updateSetState(40)
  } else if (location.pathname === '/online' && props.isSize){
    const initialFormData8 = {
      player1: '',
      player2: '',
      player3: '',
      player4: '',
      player5: '',
      player6: '',
      player7: '',
      player8: '',
  };
  setFormData8(initialFormData8);
  const initialFormData4 = {
    player1: '',
    player2: '',
    player3: '',
    player4: '',
  };
  setFormData4(initialFormData4);
  const initialFormData2 = {
    player1: '',
    player2: '',
  };
  setFormData2(initialFormData2);
  const initialFormData = {
    player: '',
  };
  setwinnerTournament(initialFormData);
  const initialFormDataScore = {
    name1: '',
    name2: '',
    player1: 0,
    player2: 0,
  };
  setscore(initialFormDataScore);
    updateSetState(20)
  } else if (location.pathname === '/bot' && props.isSize){
    const initialFormData8 = {
      player1: '',
      player2: '',
      player3: '',
      player4: '',
      player5: '',
      player6: '',
      player7: '',
      player8: '',
  };
  setFormData8(initialFormData8);
  const initialFormData4 = {
    player1: '',
    player2: '',
    player3: '',
    player4: '',
  };
  setFormData4(initialFormData4);
  const initialFormData2 = {
    player1: '',
    player2: '',
  };
  setFormData2(initialFormData2);
  const initialFormData = {
    player: '',
  };
  setwinnerTournament(initialFormData);
  const initialFormDataScore = {
    name1: '',
    name2: '',
    player1: 0,
    player2: 0,
  };
  setscore(initialFormDataScore);
    updateSetState(50)
  }
}, [location.pathname, props.isSize]);



  const [score, setscore] = useState({
    name1: '',
    name2: '',
    player1: 0,
    player2: 0,
  });





  function searchOpponent(){
    /*const buttonS = document.getElementById('btnSearch')
    buttonS.style.display = 'none'
    const buttonE = document.getElementById('btnExitMatchOnline')
    buttonE.style.margin = '0'
    const btn = document.getElementById('buttonOnline')
    btn.style.paddingTop = '0%'
    const loadDiv = document.getElementById('loader-container')
    loadDiv.style.display = 'block'


*/

    client.get("/api/user")
      .then(res => {
        user = res.data.user
        LongestExchange = user.LongestExchange
        aceRate = user.aceRate
        nbAce = user.nbAce
        nbGameLose = user.nbGameLose
        nbGamePlayed = user.nbGamePlayed
        nbGameWin = user.nbGameWin
        nbPointLose = user.nbPointLose
        nbPointMarked = user.nbPointMarked
        nbTouchedBall = user.nbTouchedBall
        name = user.username
        winRate = user.winRate
        userId = user.user_id
        language = user.language
        color = user.color
        music = user.music
        key1 = user.key1
        key2 = user.key2
        key3 = user.key3
        key4 = user.key4
        console.log(user)
    }).then(function(res){

        console.log(csrfToken)
        console.log('userId', userId)
      /*  client.post(
          "/api/JoinQueue",
          {
            headers: {
              'X-CSRFToken': csrfToken,
              'Content-Type': 'application/json'
            }
          },
          {
            userId: userId,
          }
        ).then(function(res){

          console.log('reussi', res)

        }).catch(function(err){
          console.error(err)
        })

    }).catch(function(err){
      console.error(err)
    })*/

    fetch('http://localhost:8080/api/JoinQueue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Registration successful:', data);
    })
    .catch(error => {
      console.error('There was a problem registering:', error);
    })



  })












    /*
    do {
      client.get(
        "/api/CheckJoinGame",
        {withCredentials: true}
      ).then(function(res){
        console.log(res)
        serv = res
      }).catch(function(error){
       console.log(error)
      })
    } while (!serv)
*/
  }




  function goMatchBot(){
    var botMatch = document.querySelector('.botMatch');
    botMatch.classList.remove('visible');
    botMatch.classList.add('hidden');
    if (state === 50){
      updateSetScore('name1', 'Player 1')
      updateSetScore('name2', 'AI-bot')
    }
    setTimeout(function() {
        setisBotMatch(false)
        setisDecompte(true)
    }, 500); 
   
    setisInMatchTournament(true)
  }





  function goMatchLocal(){
    var localMatch = document.querySelector('.localMatch');
    localMatch.classList.remove('visible');
    localMatch.classList.add('hidden');
    if (state === 30){
      updateSetScore('name1', 'Player 1')
      updateSetScore('name2', 'Player 2')
    }
    setTimeout(function() {
        setisLocalMatch(false)
        setisDecompte(true)
    }, 500); 
   
    setisInMatchTournament(true)
  }


  function replayLocal(){
    if (state === 32){
      setisResultLocal(false)
      setisLocalMatch(true)
      setTimeout(function() {
          var localMatch = document.querySelector('.localMatch');
          localMatch.classList.add('visible');
        }, 100); 
      updateSetScore('player1', 0)
      updateSetScore('player2', 0)
      updateSetState(30)
    } else if (state === 52){
      setisResultLocal(false)
      setisBotMatch(true)
      setTimeout(function() {
          var localMatch = document.querySelector('.botMatch');
          localMatch.classList.add('visible');
        }, 100); 
        updateSetScore('player1', 0)
        updateSetScore('player2', 0)
      updateSetState(50)
    }
    
  }









  const updateSetScore = (player, newScore) => {
    setscore(prevScore => ({
      ...prevScore,
      [player]: newScore
    }));
  };

  const [formData8, setFormData8] = useState({
    player1: '',
    player2: '',
    player3: '',
    player4: '',
    player5: '',
    player6: '',
    player7: '',
    player8: '',
  });



  const [formData4, setFormData4] = useState({
    player1: '',
    player2: '',
    player3: '',
    player4: '',
  });

  const [formData2, setFormData2] = useState({
    player1: '',
    player2: '',
  });

  const [winnerTournament, setwinnerTournament] = useState({
    player: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData8((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


function exitTournament(){
    setisResultLocal(false)
    setisLocalMatch(false)
    setisResultTournamnt(false)
    setisTableTournament(false)
    setisInMatchTournament(false)
    if (isOnlineLoad){
        var onlineMatch = document.querySelector('.onlineLoad');
        onlineMatch.classList.remove('visible');
        onlineMatch.classList.add('hidden');
        setTimeout(function() {
            setisOnlineLoad(false)
        }, 500);
    }
    if (isBotMatch){
        var botMatch = document.querySelector('.botMatch');
        botMatch.classList.remove('visible');
        botMatch.classList.add('hidden');
        setTimeout(function() {
            setisBotMatch(false)
        }, 500); 
    }
    const initialFormData8 = {
      player1: '',
      player2: '',
      player3: '',
      player4: '',
      player5: '',
      player6: '',
      player7: '',
      player8: '',
  };
  setFormData8(initialFormData8);
  const initialFormData4 = {
    player1: '',
    player2: '',
    player3: '',
    player4: '',
  };
  setFormData4(initialFormData4);
  const initialFormData2 = {
    player1: '',
    player2: '',
  };
  setFormData2(initialFormData2);
  const initialFormData = {
    player: '',
  };
  setwinnerTournament(initialFormData);
  const initialFormDataScore = {
    name1: '',
    name2: '',
    player1: 0,
    player2: 0,
  };
  setscore(initialFormDataScore);
  callChildFunction()
  updateSetState(10)
  }




  function newTournament(){
    setisResultTournamnt(false)
    setisTableTournament(false)
    setisInMatchTournament(false)
    const initialFormData8 = {
      player1: '',
      player2: '',
      player3: '',
      player4: '',
      player5: '',
      player6: '',
      player7: '',
      player8: '',
  };
  setFormData8(initialFormData8);
  const initialFormData4 = {
    player1: '',
    player2: '',
    player3: '',
    player4: '',
  };
  setFormData4(initialFormData4);
  const initialFormData2 = {
    player1: '',
    player2: '',
  };
  setFormData2(initialFormData2);
  const initialFormData = {
    player: '',
  };
  setwinnerTournament(initialFormData);
  updateSetState(40)
  }



  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}







  useEffect(() => {

function affResult(){
  const winner = document.getElementById('winner')
  const textWinner = document.getElementById('textWinner')
  if (state === 32){
    const winnerLocal = document.getElementById('winnerLocal')
    winnerLocal.textContent = winnerTournament.player
  } else if (state === 42){
    winner.textContent = formData4.player1
  } else if (state === 44){
    winner.textContent = formData4.player2
  } else if (state === 46){
    winner.textContent = formData4.player3
  } else if (state === 48){
    winner.textContent = formData4.player4
  } else if (state === 140){
    winner.textContent = formData2.player1
  } else if (state === 142){
    winner.textContent = formData2.player2
  } else if (state === 144){
    textWinner.textContent = 'Final Victory of'
    winner.textContent = winnerTournament.player
  } else if (state === 52){
    const winnerLocal = document.getElementById('winnerLocal')
    winnerLocal.textContent = winnerTournament.player
  }
}




function affDecompte(){
   const decompte = document.getElementById('decompte')
    var tempsRestant = 3
    stopDecompte = false

    var intervalID = setInterval(function() {
        if (stopDecompte === true){
          stopDecompte = false
          clearInterval(intervalID)
          setisDecompte(false)
          return
        }
        if (tempsRestant <= 0) {
            clearInterval(intervalID)
            setState(state + 1)
            setisDecompte(false)
        } else {
          decompte.textContent = tempsRestant
            tempsRestant--
        }
    }, 1000)

}

  function affMatch(){
    if (state === 40){
      const player1 = document.getElementById('matchplayer1')
      player1.textContent = formData8.player1
      const player2 = document.getElementById('matchplayer2')
      player2.textContent = formData8.player2
    } else if (state === 42){
      const player3 = document.getElementById('matchplayer1')
      player3.textContent = formData8.player3
      const player4 = document.getElementById('matchplayer2')
      player4.textContent = formData8.player4
    }else if (state === 44){
      const player5 = document.getElementById('matchplayer1')
      player5.textContent = formData8.player5
      const player6 = document.getElementById('matchplayer2')
      player6.textContent = formData8.player6
    }else if (state === 46){
      const player7 = document.getElementById('matchplayer1')
      player7.textContent = formData8.player7
      const player8 = document.getElementById('matchplayer2')
      player8.textContent = formData8.player8
    }else if (state === 48){
      const player1 = document.getElementById('matchplayer1')
      player1.textContent = formData4.player1
      const player2 = document.getElementById('matchplayer2')
      player2.textContent = formData4.player2
    }else if (state === 140){
      const player3 = document.getElementById('matchplayer1')
      player3.textContent = formData4.player3
      const player4 = document.getElementById('matchplayer2')
      player4.textContent = formData4.player4
    }else if (state === 142){
      const player1 = document.getElementById('matchplayer1')
      player1.textContent = formData2.player1
      const player2 = document.getElementById('matchplayer2')
      player2.textContent = formData2.player2
    }

  }



  function affScoreDirect(){

    const Score = document.getElementById('scoreDirect')
    Score.textContent = score.name1 + ': ' + score.player1 + '-' + score.player2 + ' :' + score.name2
  }




    if (isMatchTournament) {
        affMatch()
    }
    if (isDecompte){
      affDecompte()
    }
    if (isResultTournamnt || isResultLocal){
      affResult()
    }
    if (isInMatchTournament){
      affScoreDirect()
    }

}, [isMatchTournament, isDecompte, isResultTournamnt, isInMatchTournament, score, isResultLocal])





  function goMatch(){
    var localMatch = document.querySelector('.tournament');
    localMatch.classList.remove('visible');
    localMatch.classList.add('hidden');
    if (state === 40){
      updateSetScore('name1', formData8.player1)
      updateSetScore('name2', formData8.player2)
    }
    setTimeout(function() {
        setisMatchTournament(false)
        setisTableTournament(false)
        setisInMatchTournament(true)
        setisDecompte(true)
    }, 500); 
   
  }


  function goNextMatch(){
    setisResultTournamnt(false)
    setisMatchTournament(true)
    updateSetScore('player1', 0)
    updateSetScore('player2', 0)
    switch (state){
      case 42:
        updateSetScore('name1', formData8.player3)
        updateSetScore('name2', formData8.player4)
        break;
      case 44:
        updateSetScore('name1', formData8.player5)
        updateSetScore('name2', formData8.player6)
        break;
      case 46:
        updateSetScore('name1', formData8.player7)
        updateSetScore('name2', formData8.player8)
        break;
      case 48:
        updateSetScore('name1', formData4.player1)
        updateSetScore('name2', formData4.player2)
        break;
      case 140:
        updateSetScore('name1', formData4.player3)
        updateSetScore('name2', formData4.player4)
        break;
      case 142:
        updateSetScore('name1', formData2.player1)
        updateSetScore('name2', formData2.player2)
        break;
      default:
        break
      }
  }





    const handleSubmit = (e) => {
      e.preventDefault();
      setisSetterTournament(false)
      setisMatchTournament(true)
    };
    const childRef = useRef(null);
    function callChildFunction() {
      if (childRef.current) {
          childRef.current.childFunction(1)
      }
  }




  function handleconnection(event) {
    event.preventDefault()
    refBadPassword.current.innerText = ''
    document.getElementById('badEmail2').innerText = ''
    document.getElementById('badPassword2').innerText = ''
    document.getElementById('badEmail2').innerText = ''
    if (!email2){
      document.getElementById('badEmail2').innerText = t("home.empty")
      return
    }
    if (!password2){
      document.getElementById('badPassword2').innerText = t("home.empty")
      return
    }
    if (!validateEmail(email2)){
      document.getElementById('badEmail2').innerText = t("home.badE")
      return
    }
    client.post(
      "/api/login",
      {
        email: email2,
        password: password2
      }
    ).then(function(res){
      console.log(res)
      updateUser(true)
        var loginPage = document.getElementById('loginPage');
        loginPage.classList.remove('visible');
        loginPage.classList.add('hidden');
        setTimeout(function() {
          setisLoginPage(false)
          if (childRef.current) {
            childRef.current.childFunction(2)
        }
        }, 800);
        setEmail2('')
        setPassword2('')
      }).catch(function(error) {
        console.error("Erreur lors de la requête de connexion :", error);
        refBadPassword.current.innerText = t("home.WPass")
      }); 
      
    }
 


  function handleRegister(event){
    event.preventDefault()
    document.getElementById('badEmail').innerText = ''
    document.getElementById('badLogin').innerText = ''
    document.getElementById('badPassword').innerText = ''
    document.getElementById('badEmail').innerText = ''
    document.getElementById('badPassword').innerText = ''
    if (!email){
      document.getElementById('badEmail').innerText = t("home.empty")
      return
    }
    if(!username){
      document.getElementById('badLogin').innerText = t("home.empty")
      return
    }
    if(!password){
      document.getElementById('badPassword').innerText = t("home.empty")
      return
    }
    if (!validateEmail(email)){
      document.getElementById('badEmail').innerText = t("home.badE")
      return
    }
    if (!passwordVerif(password)){
      document.getElementById('badPassword').innerText = t("home.badP")
      return
    }
    console.log('post', csrfToken)


    client.post(
      "/api/register",
      {
        email: email,
        username: username,
        password: password
      },
      {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json'
        }
      }
    ).then(function(res){
      client.post(
        "/api/login",
        {
          email: email,
          password: password
        }
      ).then(function(res){




        searchOpponent()
        updateUser(true)
        var loginPage = document.getElementById('loginPage');
        loginPage.classList.remove('visible');
        loginPage.classList.add('hidden');
        setTimeout(function() {
          setisLoginPage(false)
          if (childRef.current) {
            childRef.current.childFunction(2)
        }
        }, 800);
        setEmail('')
        setUsername('')
        setPassword('')
      })
    }
    ) /*
    fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Registration successful:', data);
    })
    .catch(error => {
      console.error('There was a problem registering:', error);
    });*/

  }


  function handleLogout (event){
    event.preventDefault()
    client.get(
      "/api/logout",
      {withCredentials: true}
    ).then(function(res){
      updateUser(false)
      navigate('/')
    }).catch(function(error){
     console.log(error)
    })
  }


const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

function passwordVerif(motDePasse) {
  return motDePasse.length >= 8;
}


var profil = document.getElementById('profil')


let user 
let LongestExchange
let aceRate
let nbAce
let nbGameLose
let nbGamePlayed
let nbGameWin 
let nbPointLose
let nbPointMarked
let nbTouchedBall
let name
let winRate
let userId
let language
let color
let music
let key1
let key2
let key3
let key4






const matchArray = Array.from({ length: 42 });

const chartRef = useRef(null)
const chartRef2 = useRef(null)

const chartRef1 = useRef(null)
const ref1 = useRef(null)
const ref2 = useRef(null)
const ref3 = useRef(null)
const ref4 = useRef(null)
const ref5 = useRef(null)
const ref6 = useRef(null)
const ref7 = useRef(null)
const ref8 = useRef(null)
const refBadPassword = useRef(null)

function getChart() {
  if (currentUser === true){
    client.get("/api/user")
      .then(res => {
        user = res.data.user
        LongestExchange = user.LongestExchange
        aceRate = user.aceRate
        nbAce = user.nbAce
        nbGameLose = user.nbGameLose
        nbGamePlayed = user.nbGamePlayed
        nbGameWin = user.nbGameWin
        nbPointLose = user.nbPointLose
        nbPointMarked = user.nbPointMarked
        nbTouchedBall = user.nbTouchedBall
        name = user.username
        winRate = user.winRate
        userId = user.userId
        language = user.language
        color = user.color
        music = user.music
        key1 = user.key1
        key2 = user.key2
        key3 = user.key3
        key4 = user.key4
    }).then(function(res){


      if (chartRef.current !== null) {
        chartRef.current.destroy();
      }



        chartRef.current = new Chart(chartRef1.current, {
        type: 'pie',
        data: {
          labels: [
            'Wins',
            'Lose'
          ],
          datasets: [{
            data: [nbGameWin, nbGameLose],
            backgroundColor: [
              'green',
              'red'
            ],
            hoverOffset: 4
          }]
        }
      })
  
        let can2 = document.getElementById('chart2')
      if (can2){
        if (chartRef2.current !== null) {
          chartRef2.current.destroy();
        }
        chartRef2.current = new Chart(can2, {
        type: 'pie',
        data: {
          labels: [
            'Points Wins',
            'Points Loses'
          ],
          datasets: [{
            data: [nbPointMarked, nbPointLose],
            backgroundColor: [
              'green',
              'red'
            ],
            hoverOffset: 4
          }]
        }
      })
      }
      ref1.current.innerText = t("home.nbGamePlayed") + nbGamePlayed
      ref2.current.innerText = t("home.nbGameWin") + nbGameWin
      ref3.current.innerText = t("home.nbGameLose") + nbGameLose
      ref4.current.innerText = t("home.LongestExchange") + LongestExchange
      ref5.current.innerText = t("home.nbTouchedBall") + nbTouchedBall
      ref6.current.innerText = t("home.nbAce") + nbAce
      ref7.current.innerText = t("home.nbPointMarked") + nbPointMarked
      ref8.current.innerText = t("home.nbPointLose") + nbPointLose

          
        }).catch(function(err){
          console.error(err)
        })
      }

}
  
const elements = {
  nbGamePlayed: document.getElementById('nbGamePlayed'),
  nbGameWin: document.getElementById('nbGameWin'),
  nbGameLose: document.getElementById('nbGameLose'),
  LongestExchange: document.getElementById('LongestExchange'),
  nbTouchedBall: document.getElementById('nbTouchedBall'),
  nbAce: document.getElementById('nbAce'),
  nbPointMarked: document.getElementById('nbPointMarked'),
  nbPointLose: document.getElementById('nbPointLose')
};


function handleProfil(){
  if (isProfilView === false)
    setIsProfilView(true)
  else if (isProfilView === true)
    setIsProfilView(false)
}


useEffect(() => {
  if (chartRef1.current) {
    getChart()
  }
  
}, [isProfilView]);


    return (
        <div>
           {currentUser && state === 10 ? (
            <button onClick={handleProfil} className='btnProfil'><img src='/profil.png' alt='profil' className='profil' id="profil"/></button>
            ) : null}
            {isProfilView ? (
              <div className='profilView'>Your Profile
                <div className="stats">
                  <div className='graph1'><canvas className='canv1' id='chart1' ref={chartRef1} aria-label='chart' role='img'></canvas></div>
                  <div className='graph2'><canvas className='canv2' id='chart2' aria-label='chart' role='img'></canvas></div>
                  <div className='stats1'>
                    <p ref={ref1} id='nbGamePlayed'></p>
                    <p ref={ref2} id='nbGameWin'></p>
                    <p ref={ref3} id='nbGameLose'></p>
                    <p ref={ref4} id='LongestExchange'></p>
                  </div>
                  <div className='stats2'>
                    <p ref={ref5} id='nbTouchedBall'></p>
                    <p ref={ref6} id='nbAce'></p>
                    <p ref={ref7} id='nbPointMarked'></p>
                    <p ref={ref8} id='nbPointLose'></p>
                  </div>
                  <div className='history'>
                    {matchArray.map((_, index) => (
                      <Match key={index} />
                    ))}
                  </div>
                </div>
                </div>  
            ) : null}
    {props.isSize ? (
        <div>
          {isLoginPage ? (
      <div className='loginPage' id='loginPage'>
      <h3 className='titleWelcome'>{t("home.welcome")}</h3>
      <div className='form'>
        <form onSubmit={handleconnection} className='signinForm'>
          <div className='Wgroup'>
            <input placeholder='login' id='login' name='login' className='Winput' onChange={e => setEmail2(e.target.value)}></input>
            <label className='Wlabel' htmlFor='login'>{t("home.email")}</label>
            <div className='bad' id='badEmail2'></div>
          </div>
          <div className='Wgroup'>
            <input placeholder='password' id='password' name='password' className='Winput' onChange={e => setPassword2(e.target.value)}></input>
            <label className='Wlabel' htmlFor='password'>{t("home.password")}</label>
            <div className='bad' id='badPassword2' ref={refBadPassword}></div>
          </div>
          <div className='btn'>
            <button type='submit' className='btnlogin'>{t("home.signin")}</button>      
          </div>
        </form>
        <form onSubmit={handleRegister} className='signupForm'>
        <div className='Wgroup'>
            <input placeholder='e-mail' id='e-mail' name='e-mail' className='Winput' onChange={e => setEmail(e.target.value)}></input>
            <label className='Wlabel' htmlFor='e-mail'>{t("home.email")}</label>
            <div className='bad' id='badEmail'></div>
          </div>
          <div className='Wgroup'>
            <input placeholder='login' id='login2' name='login2' className='Winput' onChange={e => setUsername(e.target.value)}></input>
            <label className='Wlabel' htmlFor='login2'>{t("home.login")}</label>
            <div className='bad' id='badLogin'></div>
          </div>
          <div className='Wgroup'>
            <input placeholder='password' id='password2' name='password2' className='Winput' onChange={e => setPassword(e.target.value)}></input>
            <label className='Wlabel' htmlFor='password2'>{t("home.password")}</label>
            <div className='bad' id='badPassword'></div>
          </div>
          <div className='btn'>
            <button type='submit' className='btnlogin'>{t("home.signup")}</button>
          </div>
        </form>
        </div>
      </div>
      ) : null}
    { state === 10 ? (
      <SocialMenu setisSocialMenu={setisSocialMenu} setracketColor={setracketColor} selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} currentUser={currentUser} handleLogout={handleLogout}/>
    ) : null}
            {isInMatchTournament ? (
      <div className='scoreDirect' id='scoreDirect'>Score</div>
    ): null}
    {isTableTournament ? (
      <div className='tournament'>
          <div>
            <p className='text-tournament'>{t("game.tournament")}</p>
          </div>
          {isSetterTournament ? (
            <form onSubmit={handleSubmit}>
          <div className="input-container">
            <div>
              <div className='Tgroup'>
                <input type='text' maxLength={'15'} placeholder='player 1' id='player1' className='Tinput' name='player1' value={formData8.player1} required onChange={handleChange}></input>
                <label htmlFor="player1" className="Tlabel">{t("game.player1")}</label>
              </div>
              <div className='Tgroup'>
                <input type='text' maxLength={'15'} placeholder='player 2' id='player2' className='Tinput' name='player2' value={formData8.player2} required onChange={handleChange}></input>
                <label htmlFor="player2" className="Tlabel">{t("game.player2")}</label>
              </div>
              <div className='Tgroup'>
                <input type='text' maxLength={'15'} placeholder='player 3' id='player3' className='Tinput' name='player3' value={formData8.player3} required onChange={handleChange}></input>
                <label htmlFor="player3" className="Tlabel">{t("game.player3")}</label>
              </div>
              <div className='Tgroup'>
                <input type='text' maxLength={'15'} placeholder='player 4' id='player4' className='Tinput' name='player4' value={formData8.player4} required onChange={handleChange}></input>
                <label htmlFor="player4" className="Tlabel">{t("game.player4")}</label>
              </div>
            </div>
            <div>
              <div className='Tgroup'>
                <input type='text' maxLength={'15'} placeholder='player 5' id='player5' className='Tinput' name='player5' value={formData8.player5} required onChange={handleChange}></input>
                <label htmlFor="player5" className="Tlabel">{t("game.player5")}</label>
              </div>
              <div className='Tgroup'>
                <input type='text' maxLength={'15'} placeholder='player 6' id='player6' className='Tinput' name='player6' value={formData8.player6} required onChange={handleChange}></input>
                <label htmlFor="player6" className="Tlabel">{t("game.player6")}</label>
              </div>
              <div className='Tgroup'>
                <input type='text' maxLength={'15'} placeholder='player 7' id='player7' className='Tinput' name='player7' value={formData8.player7} required onChange={handleChange}></input>
                <label htmlFor="player7" className="Tlabel">{t("game.player7")}</label>
              </div>
              <div className='Tgroup'>
                <input type='text' maxLength={'15'} placeholder='player 8' id='player8' className='Tinput' name='player8' value={formData8.player8} required onChange={handleChange}></input>
                <label htmlFor="player8" className="Tlabel">{t("game.player8")}</label>
              </div>

            </div>

        </div>
          <div className='btn2'>
          <button className='btnExitMatch' type='button' onClick={exitTournament}>{t("game.exit")}</button>
            <button className='btnStartMatch' type='submit'>{t("game.start")}</button>
          </div>
        </form>
          ) : isMatchTournament ?(
            <div className='matchTournament'>
              <div id='matchplayer1' className='matchPlayer1'></div>
              <div className='matchVS'>VS</div>
              <div id='matchplayer2' className='matchPlayer2'></div>
              <button className='btnPlayMatch' onClick={goMatch}>{t("game.play")}</button>
            </div>
          ) : isResultTournamnt ? (
            <div className='resultTournament'>
              <div id='textWinner' className='textWinner'>{t("game.victory")}</div>
              <div id='winner' className='winner'>player</div>
              {state !== 144 ?(
                <button className='btnNextMatch' onClick={goNextMatch}>{t("game.next")}</button>
              ) : state === 144 ? (
                <div className='btn22'>
                  <button className='btnExit2Match' onClick={exitTournament}>{t("game.exit")}</button>
                  <button className='btnNewMatch' onClick={newTournament}>{t("game.new")}</button>
                </div>
              ) : null }

            </div>
          ) : null}

      </div>
    ) : isDecompte ? (
      <div className='decompte' id='decompte'>
      </div>
    ) : isLocalMatch ? (
      <div className='localMatch'>
        <p className='text-local'>{t("game.local")}</p>

        <div className='matchLocal'>
              <div id='matchplayer1' className='matchPlayer1Local'>{t("game.player1")}</div>
              <div className='matchVS'>VS</div>
              <div id='matchplayer2' className='matchPlayer2Local'>{t("game.player2")}</div>
              <div className='buttonLocal'>
                <button className='btnExitMatchLocal' onClick={exitTournament}>{t("game.exit")}</button>
                <button className='btnPlayMatchLocal' onClick={goMatchLocal}>{t("game.play")}</button>
              </div>
            </div>
      </div>
    ): isResultLocal ? (
      <div id='lcl' className='localMatch'>
        <p className='text-local'>{t("game.local")}</p>
        <div id='textWinner' className='textWinnerLocal'>{t("game.victory")}</div>
        <div id='winnerLocal' className='winnerLocal'></div>
        <div className='buttonLocal'>
          <button className='btnExitMatchLocal' onClick={exitTournament}>{t("game.exit")}</button>
          <button className='btnPlayMatchLocal' onClick={replayLocal}>{t("game.replay")}</button>
        </div>
      </div>
    ): isOnlineLoad ? (
        <div className='onlineLoad'>
            <p className='text-online'>{t("game.online")}</p>

            <div id='loader-container' className="loader-container">
                <div className="progress float shadow">
                    <div className="progress__item"></div>
                </div>
            </div>

            <div id='buttonOnline' className='buttonOnline'>
                <button id='btnExitMatchOnline' className='btnExitMatchOnline' onClick={exitTournament}>{t("game.exit")}</button>
                <button id='btnSearch' className='btnSearch' onClick={searchOpponent}>{t("game.search")}</button>
            </div>
        </div>
    ): isBotMatch ? (
        <div className='botMatch'>
            <p className='text-bot'>{t("game.computer")}</p>
            <div className='buttonBot'>
                <button className='btnExitMatchBot' onClick={exitTournament}>{t("game.exit")}</button>
                <button className='btnPlayMatchBot' onClick={goMatchBot}>{t("game.play")}</button>
              </div>
        </div>
    ): null}

      
<Canvas
        style={{
          height: "100vh",
          width: "100vw",
        }}>
         
          <PerspectiveCamera ref={cameraRef} makeDefault fov={80} position={props.position} rotation={props.rotation}/>
          
          
  
       
          <pointLight intensity={700} position={[0, 0, 0]} color={0xffffff} />
          <ambientLight intensity={0.3} />
  
  
          <Environment files="fond.hdr" background blur={0.5}/>
          <Suspense fallback={null}>
            <Panel state={state} updateSetState={updateSetState} formData8={formData8} formData4={formData4} formData2={formData2} winnerTournament={winnerTournament} score={score} updateSetScore={updateSetScore} isSocialMenu={isSocialMenu} ref={childRef} racketColor={racketColor} selectedKeys={selectedKeys}/>
            <Stade/>
          </Suspense>
          <Stars
              radius={160}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade
            />
  
        </Canvas>
        </div>
    ) : (
        <div>{t("game.length")}</div>
    )}
    
        </div>













    )}


export default MyCanvas