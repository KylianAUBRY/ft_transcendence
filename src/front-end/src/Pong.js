import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap/gsap-core';
import { useLocation } from 'react-router-dom';

const loader = new GLTFLoader();
let loaderGltf
let racket1 = null
let racket2 = null
let ball = null
let startVal = 0
let running = false
let preparationNewRound = false
let keyListenerActive = false
let newRound = true
let keysPressed = {}
let stop = false




const Pong = ({ stateGame, updateSetState, formData8, formData4, formData2, winnerTournament, score, updateSetScore, racketColor, selectedKeys, client }) => {
  const location = useLocation()
  if (racket1 && racket2){
    racket1.material = new THREE.MeshBasicMaterial({ color: racketColor })
    racket2.material = new THREE.MeshBasicMaterial({ color: racketColor })
  }

    // Chargement du model 3d
    const [gltf, setGltf] = React.useState(null);
    React.useEffect(() => {
      loader.load('./pong.glb', (loadedGltf) => {
        setGltf(loadedGltf);
        loaderGltf = loadedGltf
        loadedGltf.scene.traverse((child) => {
          child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        if (child.name === 'Player1'){
          racket1 = child
          racket1.position.z = 0
          racket1.position.x = 11
          racket1.position.y = 0.5
        }else if (child.name === 'Player2'){
          racket2 = child
          racket2.position.z = 0
          racket2.position.x = -11
          racket2.position.y = 0.5
        }else if (child.name === 'Ball'){
          ball = child
          ball.position.x = 0
          ball.position.y = 0.5
          ball.position.z = 0
          if (typeof ball.velocity === 'undefined') {
            ball.velocity = {
              x: 0,
              z: 0
             };
          }
          if (typeof ball.stopped === 'undefined') {
            ball.stopped = true
          }
        }
        })
      }, undefined, (error) => {
        console.error('Erreur lors du chargement du fichier GLTF', error);
      });
    }, []);
    
 function startBallMovement() {
   var direction = Math.random() > 0.5 ? -1 : 1;
   ball.velocity = {
     z: 0,
     x: direction * 0.1
    };
    ball.stopped = false;
  }




  

  
  function processBallMovement() {
    
    if(startVal === 0) {
      startBallMovement();
      startVal++
    }
    if(ball.$stopped) {
      return;
      
    }
    updateBallPosition();
    
    if(isSideCollision()) {
      ball.velocity.z *= -1; 
    }
    
    if(isPaddle1Collision()) {
      hitBallBack(racket1)
    }
    
    if(isPaddle2Collision()) {
      hitBallBack(racket2)
    }
    
    if(isPastPaddle1()) {
      scoreBy('player2')
      return
    }
    
    if(isPastPaddle2()) {
      scoreBy('player1')
      return
    }
  }
  
  function isPastPaddle1() {
    return ball.position.x > racket1.position.x;
  }
  
  function isPastPaddle2() {
    return ball.position.x < racket2.position.x;
  }
  
  function updateBallPosition() {
    var ballPos = ball.position;
    
    ballPos.x += ball.velocity.x;
    ballPos.z += ball.velocity.z;
  }
  
  function isSideCollision() {
    var ballX = ball.position.z,
        halfFieldWidth = 15.4 / 2;
    return ballX - 0.207 < -halfFieldWidth || ballX + 0.207 > halfFieldWidth;
  }
  
  function hitBallBack(paddle) {
    ball.velocity.z = (ball.position.z - paddle.position.z) / 10; 
    ball.velocity.x *= -1;
  }
  
  function isPaddle2Collision() {
    return ball.position.x - 0.207 <= racket2.position.x && 
        isBallAlignedWithPaddle(racket2);
  }
  
  function isPaddle1Collision() {
    return ball.position.x + 0.207 >= racket1.position.x && 
        isBallAlignedWithPaddle(racket1);
  }
  
  function isBallAlignedWithPaddle(paddle) {
    var halfPaddleWidth = 2 / 2,
        paddleX = paddle.position.z,
        ballX = ball.position.z;
    return ballX > paddleX - halfPaddleWidth && 
        ballX < paddleX + halfPaddleWidth;
  }
  







function endGame(winner)
{
    if (stateGame === 31){
      winner === 1 ? winnerTournament.player = 'player 1' : winnerTournament.player = 'player 2'
      updateSetState(32)
    }
    else if (stateGame === 41){
      winner === 1 ? formData4.player1 = formData8.player1 : formData4.player1 = formData8.player2
      updateSetState(42)
    } else if (stateGame === 43){
      winner === 1 ? formData4.player2 = formData8.player3 : formData4.player2 = formData8.player4
      updateSetState(44)
    }else if (stateGame === 45){
      winner === 1 ? formData4.player3 = formData8.player5 : formData4.player3 = formData8.player6
      updateSetState(46)
    }else if (stateGame === 47){
      winner === 1 ? formData4.player4 = formData8.player7 : formData4.player4 = formData8.player8
      updateSetState(48)
    }else if (stateGame === 49){
      winner === 1 ? formData2.player1 = formData4.player1 : formData2.player1 = formData4.player2
      updateSetState(140)
    }else if (stateGame === 141){
      winner === 1 ? formData2.player2 = formData4.player3 : formData2.player2 = formData4.player4
      updateSetState(142)
    }else if (stateGame === 143){
      winner === 1 ? winnerTournament.player = formData2.player1 : winnerTournament.player = formData2.player2
      updateSetState(144)
  }else if (stateGame === 51){
    winner === 1 ? winnerTournament.player = 'player 1' : winnerTournament.player = 'AI-bot'
    updateSetState(52)
  }
}






  function scoreBy(playerName) {
      stopBall()
      stopRender()
      ball.material = new THREE.MeshBasicMaterial({ color: 0xff1500 });
      preparationNewRound = true
      if (playerName === "player1"){
        updateSetScore('player1', ++score.player1)
      }
        
      else if (playerName === "player2")
        updateSetScore('player2', ++score.player2)
      if (score.player1 === 5){
        setTimeout(reset(false), 2000)
        endGame(1)
        newRound = true
      } else if (score.player2 === 5){
        setTimeout(reset(false), 2000)
        endGame(2)
        newRound = true
      } else {
        gsap.to(ball.position, {
          duration: 1.5,
          onComplete: () => {
            setTimeout(reset(true), 2000)
          }
        })

        
      }
  }
  




  
  function stopBall(){ 
    ball.stopped = true;
  }
  

  
  function startRender(){
    running = true;
    startVal = 0
    render();  
  }
  
  function stopRender() {
    running = false;
  }
  
  function render() {
    if(running) {
      requestAnimationFrame(render);
      processBallMovement();
      processBotPaddle()
    }
  }
  

  function processBotPaddle() {
    if(racket2.position.z > ball.position.z) {
      racket2.position.z -= Math.min(racket2.position.z - ball.position.z, 0.05);
    }else if(racket2.position.z < ball.position.z) {
      racket2.position.z  += Math.min(ball.position.z - racket2.position.z, 0.05);
    }
  }











  function reset(bool) {
    ball.velocity.x = 0
    ball.velocity.y = 0
    if (bool){
      gsap.to(ball.position, {
        duration:2,
        z: 0,
        x: 0,
        onComplete: () => {
          ball.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        }
      })
      gsap.to(ball.position, {
        duration:3,
        onComplete: () => {
          if (stop === false){
            startRender()
          } else{
            stop = false
            stopRender()
            ball.velocity.x = 0
            ball.velocity.y = 0
            ball.position.x = 0
            ball.position.z = 0
            racket1.position.z = 0
            racket2.position.z = 0
            return
          }
          
        }
      })
      
    } else {
    gsap.to(racket1.position, {
      duration:1,
      z: 0,
    })
    gsap.to(racket2.position, {
      duration:1,
      z: 0,
    })
    gsap.to(ball.position, {
      duration:3,
      z: 0,
      x: 0,
      onComplete: () => {
        ball.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        preparationNewRound = false
      }
    })
    }
    
  }
  



  const onKeyPress = function (event) {
    if (!keyListenerActive) return
    keysPressed[event.code] = true
  };
  
  const onKeyRelease = function (event) {
    if (!keyListenerActive) return
    keysPressed[event.code] = false
  };
  
  const handleKeys = function () {
    if (!keyListenerActive) return
    if (loaderGltf && loaderGltf.scene) {
      if (stateGame < 50 && stateGame > 52){
        if (keysPressed[selectedKeys[3]]) {
          if (racket2.position.z < 6.55)
            racket2.position.z += 0.05
        }
        if (keysPressed[selectedKeys[2]]) {
          if (racket2.position.z > -6.55)
            racket2.position.z -= 0.05
        }
    }
      if (keysPressed[selectedKeys[0]]) {
        if (racket1.position.z < 6.55)
          racket1.position.z += 0.05  
      }
      if (keysPressed[selectedKeys[1]]) {
        if (racket1.position.z > -6.55)
          racket1.position.z -= 0.05
      }
    }
    requestAnimationFrame(handleKeys);
  };


  let serv
  let userId
  let gameId
  const [socket, setSocket] = useState(null);

  if (stateGame === 21 || stateGame === 31 || stateGame === 41 || stateGame === 43 || stateGame === 45 || stateGame === 47 || stateGame === 49 || stateGame === 141 || stateGame === 143 || stateGame === 51) {
    if (newRound === true){
      newRound = false
        startRender()
      }
    keyListenerActive = true
    document.addEventListener("keydown", onKeyPress)
    document.addEventListener("keyup", onKeyRelease)
    handleKeys()
    if (stateGame === 21){
      client.post(
        "/api/JoinQueue",
        {
          userId: userId,
        }
      )
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
      if (gameId)
      {
        serverUpdate(gameId)
      }
    }
  } else {
    keyListenerActive = false
    keysPressed = {}
    document.removeEventListener("keydown", onKeyPress)
    document.removeEventListener("keyup", onKeyRelease)
  }





  async function serverUpdate(gameId){
    while (match){
      useEffect(() => {
        const newSocket = io('ws://localhost:8080/ws/game/' + gameId);
        newSocket.on('connect', () => {
          console.log('Socket.IO connection established.');
        });
        newSocket.on('state_update', (data) => {
          console.log('state_update', data)
        });
        setSocket(newSocket);
    
        /*return () => {
          newSocket.disconnect();
        };*/
      }, []);
    }
  }


  async function serverGame() {
    if (socket) {
      socket.emit('playerAction', {
        move: up down or none,
        idMatch: gameId,
        idPlayer: player_id,
        isReady: False or True (si tout charge de ton côté),
        username: username 
      });
    }
  }



// WEBSOCKET //
/*
  const [playerId, setPlayerId] = useState(null);
  const [players, setPlayers] = useState({});
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('ws://localhost:8000');
    newSocket.on('connect', () => {
      console.log('Socket.IO connection established.');
    });
    newSocket.on('playerId', (data) => {
      setPlayerId(data.playerId);
    });
    newSocket.on('stateUpdate', (data) => {
      const { objects } = data;
      setPlayers(objects.players);
      setBallPosition(objects.ball);
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handlePlayerMovement = (direction) => {
    if (socket) {
      socket.emit('playerAction', {
        type: 'playerAction',
        playerId: playerId,
        action: `move_${direction}`
      });
    }
  };

*/
// WEBSOCKET //






  

  useEffect(() => {
    if (location.pathname === '/lobby'){
      
      if (running === true){
        stopRender()
        ball.velocity.x = 0
        ball.velocity.y = 0
        ball.position.x = 0
        ball.position.z = 0
        racket1.position.z = 0
        racket2.position.z = 0
      } else if (preparationNewRound === true){
          stop = true
      }
      newRound = true
        
      
      
      }
  }, [location.pathname]);
  



    if (gltf) {
      return (
        <>
          <primitive object={gltf.scene} position={[0, 0, 0]}/>
        </>
      )
    } else {
      return null;
    }
  };
  
  export default Pong;

