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

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
  baseURL: 'http://localhost:8080'
})

let stopDecompte = false

function MyCanvas( props ) {
  const [currentUser, setCurrentUser] = useState()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [email2, setEmail2] = useState('')
  const [password2, setPassword2] = useState('')
  const [t] = useTranslation("global")
  const navigate = useNavigate();

  const location = useLocation()

  const cameraRef = useRef()



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
 





  const updateSetState = (newValue) => {
   setState(newValue);
   if (newValue === 20){
        setisOnlineLoad(true)
        setTimeout(function() {
        var localMatch = document.querySelector('.onlineLoad');
        localMatch.classList.add('visible');
    }, 100); 
   }else if (newValue === 30){
      setisLocalMatch(true)
        setTimeout(function() {
        var localMatch = document.querySelector('.localMatch');
        localMatch.classList.add('visible');
    }, 100); 
    } else  if(newValue === 32) {
      setisResultLocal(true)
      setTimeout(function() {
        var localMatch = document.querySelector('.localMatch');
        localMatch.classList.add('visible');
      }, 100); 
    }
    else if (newValue === 40){
      setisTableTournament(true)
      setTimeout(function() {
        var localMatch = document.querySelector('.tournament');
        localMatch.classList.add('visible');
    }, 100); 
      setisSetterTournament(true)
      setisMatchTournament(false)
    } else if (newValue === 42 || newValue === 44 || newValue === 46 || newValue === 48 || newValue === 140 || newValue === 142 || newValue === 144){
      setisTableTournament(true)
      setTimeout(function() {
        var localMatch = document.querySelector('.tournament');
        localMatch.classList.add('visible');
    }, 100); 
      setisResultTournamnt(true)

    } else if (newValue === 50) {
        setisBotMatch(true)
        setTimeout(function() {
        var localMatch = document.querySelector('.botMatch');
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

  if (location.pathname === '/' && props.isSize){
    client.get(
      "/api/logout",
      {withCredentials: true}
    ).then(function(res){
      setCurrentUser(false)
      navigate('/')
    }).catch(function(error){
     console.log(error)
    })
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
    const buttonS = document.getElementById('btnSearch')
    buttonS.style.display = 'none'
    const buttonE = document.getElementById('btnExitMatchOnline')
    buttonE.style.margin = '0'
    const btn = document.getElementById('buttonOnline')
    btn.style.paddingTop = '0%'
    const loadDiv = document.getElementById('loader-container')
    loadDiv.style.display = 'block'
  }




  function goMatchBot(){
    var botMatch = document.querySelector('.botMatch');
    botMatch.classList.remove('visible');
    botMatch.classList.add('hidden');
    if (state === 50){
      updateSetScore('name1', 'Player 1')
      updateSetScore('name2', 'Player 2')
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
    setisResultLocal(false)
    setisLocalMatch(true)
    setTimeout(function() {
        var localMatch = document.querySelector('.localMatch');
        localMatch.classList.add('visible');
      }, 100); 
    updateSetScore('player1', 0)
    updateSetScore('player2', 0)
    updateSetState(30)
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
    if (!email2){
      document.getElementById('badEmail2').innerText = t("home.empty")
      return
    }
    if (!password2){
      document.getElementById('badPasswordl2').innerText = t("home.empty")
      return
    }
    if (!validateEmail(email)){
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
        setCurrentUser(true)
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
      });
    }
  
 


  function handleRegister(event){
    event.preventDefault()
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
      console.log('pas bon mail')
      document.getElementById('badEmail').innerText = t("home.badE")
      return
    }
    if (!passwordVerif(password)){
      console.log('pas bon password')
      document.getElementById('badPassword').innerText = t("home.badP")
      return
    }
    client.post(
      "/api/register",
      {
        email: email,
        username: username,
        password: password
      }
    ).then(function(res){
      client.post(
        "/api/login",
        {
          email: email,
          password: password
        }
      ).then(function(res){
        setCurrentUser(true)
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
    ) 
  }


  function handleLogout (event){
    event.preventDefault()
    client.get(
      "/api/logout",
      {withCredentials: true}
    ).then(function(res){
      setCurrentUser(false)
      navigate('/')
    }).catch(function(error){
     console.log(error)
    })
  }
  
useEffect(() => {
  if (currentUser === true){
    console.log('rtest')
    client.get("/api/user")
    .then(function(res){
      console.log(res.data)
      setCurrentUser(true)
    })
    .catch(function(error){
      setCurrentUser(false)
    })
  }
}, [])


const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

function passwordVerif(motDePasse) {
  return motDePasse.length >= 8;
}

    return (
        <div>
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
            <div className='bad' id='badPassword2'></div>
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
            <input placeholder='phone number' id='phone number' name='phone number' className='Winput' ></input>
            <label className='Wlabel' htmlFor='phone number'>{t("home.phone")}</label>
            <div className='bad' id='badNumber'></div>
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