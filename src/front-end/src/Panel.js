import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import Screen from './Screen'
import { useThree } from 'react-three-fiber'
import { gsap } from 'gsap/gsap-core'
import Pong from './Pong'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const loader = new GLTFLoader()
let loaderGltf
let cone = null
let child2 = null
let child3 = null
let child4 = null
let child5 = null
let prevScreen = 0
let stateG = 1
let test = 0
let rotaPanel = 0
let anim = false



const Panel = React.forwardRef((props, ref) => {
const [t] = useTranslation("global")
// Declaration des variables
const panelRef = useRef()
const { camera } = useThree();
const [isPanel, setIsPanel] = useState(true);
const [oneTime, setoneTime] = useState(true);
const [click, setClick] = useState(-10)
const navigate = useNavigate();
const location = useLocation()


if (typeof Panel.dir === 'undefined') {
  Panel.dir = 0;
}
if (typeof Panel.move === 'undefined') {
  Panel.move = false;
}
if (loaderGltf && loaderGltf.scene){
  loaderGltf.scene.rotation.y = rotaPanel
}


if (props.state === 30 && oneTime === true){
  setIsPanel(false)
  setoneTime(false)
}




// Chargement du model 3d
const [gltf, setGltf] = React.useState(null);
React.useEffect((rotaY) => {
  loader.load('./panel.glb', (loadedGltf) => {
    setGltf(loadedGltf);
    loaderGltf = loadedGltf
    
    loaderGltf.scene.traverse((child) => {
      if (child.name === "Cone")
        child.material = new THREE.MeshBasicMaterial({ color: 0x848bab });
    })
    if (loadedGltf && loadedGltf.scene && loadedGltf.scene.children) {
      loadedGltf.scene.children.forEach((child, index) => {
        if (index === 0) {
          cone = child;
        } else if (index === 1) {
          child2 = child;
        } else if (index === 2) {
          child3 = child;
        } else if (index === 3) {
          child4 = child;
        } else if (index === 4) {
          child5 = child;

        }
      });
    }

    

  }, undefined, (error) => {
    console.error('Erreur lors du chargement du fichier GLTF', error);
  });
}, []);


function handleStart(){
  props.updateSetState(10)
  stateG = 1
  anim = true     
   console.log('test2')
     navigate('/lobby')
  gsap.to(camera.position, {
    duration:3,
    x: 17,
    y: 4,
    z: 0,
    onComplete: () => {
      setIsPanel(true)

      anim = false
    }
  })
  gsap.to(camera.rotation, {
    duration:2,
    x: 0,
    y: Math.PI / 2,
    z: 0,    
  })
}

function handleBtnExit(){
  props.updateSetState(10)
  stateG = 1
  anim = true
  if (camera.position.x !== 17){
    gsap.to(camera.position, {
      duration:1,
      x: 17,
      y: 4,
      z: 0,
      onComplete: () => {
        setIsPanel(true)
        gsap.delayedCall(1, () => {
          navigate('/lobby');
        });
      }
    })
    gsap.to(camera.rotation, {
      duration:2,
      x: 0,
      y: Math.PI / 2,
      z: 0,
    })
  } else{
      setIsPanel(true)
      navigate('/lobby')
  }
}

document.addEventListener('keydown', function(event) {
  // Vérifie si la touche pressée est la touche "Entrée" (code 13)
  if (event.keyCode === 13) {
    // Appel de la fonction Click()
    Click(loaderGltf.scene.rotation.y);
  }
});



  useEffect(() => {
    if (click === -10 || anim === true)
      return
    const rota = click
    if (rota === 0 || (rota < -6.27 && rota > -6.31) || (rota < 6.31 && rota > 6.27)) {
      //clique online 
      props.updateSetState(20)
      stateG = 2
      rotaPanel = 0
      setIsPanel(true)
      navigate('/online');
    } else if ((rota < 4.74 && rota > 4.70) || (rota < -1.56 && rota > -1.60)) {
      // local
      stateG = 3
      rotaPanel = (3 * Math.PI) / 2
      setIsPanel(false)
      gsap.to(camera.position, {
        duration: 1,
        x: 0,
        y: 15,
        z: 0,
      })
      gsap.to(camera.rotation, {
        duration: 2,
        x: -Math.PI / 2,
        y: 0,
        z: Math.PI,
        onComplete: () => {
          props.updateSetState(30)
          navigate('/local');
        }
      })

    } else if ((rota < 3.17 && rota > 3.13) || (rota < -3.13 && rota > -3.17)) {
      // tounament
      stateG = 4
      rotaPanel = Math.PI
      setIsPanel(false)
      gsap.to(camera.position, {
        duration: 1,
        x: 0,
        y: 15,
        z: 0,
      })
      gsap.to(camera.rotation, {
        duration: 2,
        x: -Math.PI / 2,
        y: 0,
        z: Math.PI,
        onComplete: () => {
          props.updateSetState(40)
          navigate('/tournament');
        }
      })
    } else if ((rota < 1.60 && rota > 1.56) || (rota < -4.70 && rota > -4.74)) {
      // computer
      props.updateSetState(50)
      stateG = 5
      rotaPanel = Math.PI / 2
      setIsPanel(true)
      navigate('/bot');
    }
    setClick(-10)
  }, [click]); 


// Touche apuyee
  const onKeyDown = function (event) {
  if (loaderGltf && loaderGltf.scene && stateG === 1 && props.isSocialMenu === false && props.state < 11){
    switch (event.code) {
      case "ArrowRight":
      case "KeyD":
          if ((prevScreen === 0 || prevScreen === -2* Math.PI) && test === 0){test++
            loaderGltf.scene.rotation.y = 0
            if (!gsap.isTweening(loaderGltf.scene.rotation)){
            gsap.to(loaderGltf.scene.rotation, {
              duration:1.5,
              y: -Math.PI / 2,
              onComplete: () => {test = 0}
            })
            prevScreen = -Math.PI / 2
            }
          } else if ((prevScreen === -Math.PI / 2 || prevScreen === (3 * Math.PI) / 2) && test === 0) {test++
            loaderGltf.scene.rotation.y = -Math.PI / 2
            if (!gsap.isTweening(loaderGltf.scene.rotation)){
            gsap.to(loaderGltf.scene.rotation, {
              duration:1.5,
              y: -Math.PI,
              onComplete: () => {test = 0}
            })
            prevScreen = -Math.PI
            }
          } else if ((prevScreen === -Math.PI || prevScreen === Math.PI) && test === 0){test++
            loaderGltf.scene.rotation.y = -Math.PI
            if (!gsap.isTweening(loaderGltf.scene.rotation)){
            gsap.to(loaderGltf.scene.rotation, {
              duration:1.5,
              y: (-3 * Math.PI) / 2,
              onComplete: () => {test = 0}
            })
            prevScreen = (-3 * Math.PI) / 2
            }
          } else if ((prevScreen === (-3 * Math.PI) / 2 || prevScreen === Math.PI / 2) && test === 0){test++
            loaderGltf.scene.rotation.y = (-3 * Math.PI) / 2
            if (!gsap.isTweening(loaderGltf.scene.rotation)){
            gsap.to(loaderGltf.scene.rotation, {
              duration:1.5,
              y: -2* Math.PI,
              onComplete: () => {test = 0}
            })
            prevScreen = 0
            }
          }
          Panel.dir = 1
          break
      case "ArrowLeft":
      case "KeyA":
        if ((prevScreen === 0 || prevScreen === 2* Math.PI) && test === 0){test++
          loaderGltf.scene.rotation.y = 0
          if (!gsap.isTweening(loaderGltf.scene.rotation)){
          gsap.to(loaderGltf.scene.rotation, {
            duration:1.5,
            y: Math.PI / 2,
            onComplete: () => {test = 0}
          })
          prevScreen = Math.PI / 2
          }
        } else if ((prevScreen === Math.PI / 2 || prevScreen === (-3 * Math.PI) / 2) && test === 0) {test++
          loaderGltf.scene.rotation.y = Math.PI / 2
          if (!gsap.isTweening(loaderGltf.scene.rotation)){
          gsap.to(loaderGltf.scene.rotation, {
            duration:1.5,
            y: Math.PI,
            onComplete: () => {test = 0}
          })
          prevScreen = Math.PI
          }
        } else if ((prevScreen === Math.PI || prevScreen === -Math.PI) && test === 0){test++
          loaderGltf.scene.rotation.y = Math.PI
          if (!gsap.isTweening(loaderGltf.scene.rotation)){
          gsap.to(loaderGltf.scene.rotation, {
            duration:1.5,
            y: (3 * Math.PI) / 2,
            onComplete: () => {test = 0}
          })
          prevScreen = (3 * Math.PI) / 2
          }
        } else if ((prevScreen === (3 * Math.PI) / 2 || prevScreen === -Math.PI / 2) && test === 0){test++
          loaderGltf.scene.rotation.y = (3 * Math.PI) / 2
          if (!gsap.isTweening(loaderGltf.scene.rotation)){
          gsap.to(loaderGltf.scene.rotation, {
            duration:1.5,
            y: 2* Math.PI,
            onComplete: () => {test = 0}
          })
          prevScreen = 0
          }
        }
        Panel.dir = 1
        break
    default:
      break
    }}
};


const addEventListenerFunction = () => {
  document.addEventListener("keydown", onKeyDown);
};



const timeoutId = setTimeout(addEventListenerFunction, 2000);
    
  useEffect((timeoutId) => {
    return () => {

      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(timeoutId);
    };
  }, []);



  function childFunction(i) {
    if (i === 1){
      handleBtnExit()
    } else if (i === 2){
      handleStart()
    }
}




React.useImperativeHandle(ref, () => ({
        childFunction: childFunction,
    }));



useEffect(() => {
  if (location.pathname === '/lobby' || location.pathname === ''){
    stateG = 1
  if (camera.position.x !== 17){
    gsap.to(camera.position, {
      duration:1,
      x: 17,
      y: 4,
      z: 0,
      onComplete: () => {
        setIsPanel(true)
        gsap.delayedCall(1, () => {
          navigate('/lobby');
        });
      }
    })
    gsap.to(camera.rotation, {
      duration:2,
      x: 0,
      y: Math.PI / 2,
      z: 0,
    })
  } else{
      setIsPanel(true)
      navigate('/lobby')
  }
  }
  if (props.state === 40){
    setIsPanel(false)
  }
}, [location.pathname]);


function Click (rota) {
  setClick(rota)
}


// Envoi de la balise html
    if (gltf) {
      return (
        <>
        {isPanel ? (
          <mesh ref={panelRef} onClick={()=>{Click(loaderGltf.scene.rotation.y)}}>
            <mesh
                geometry={cone.geometry}
                material={cone.material}
                position={cone.position}
                scale={cone.scale}
                rotation={cone.rotation}
                
            />
            <Screen model={child2} Gltf={gltf.scene} text={t("game.computer")} meshTextPos={[0, 7.5, 4.3]} meshTextRot={[0.4, 0, 0]} textPos={[0, 0, 0]} textRot={[0, 0, 0]} />
            <Screen model={child3} Gltf={gltf.scene} text={t("game.online")}  meshTextPos={[4.3, 7.5, 0]} meshTextRot={[0, Math.PI / 2, 0]} textPos={[0, 0, 0]} textRot={[0.4, 0, 0]} />
            <Screen model={child4} Gltf={gltf.scene} text={t("game.local")}  meshTextPos={[0, 7.5, -4.3]} meshTextRot={[-0.4, Math.PI, 0]} textPos={[0, 0, 0]} textRot={[0, 0, 0]} />
            <Screen model={child5} Gltf={gltf.scene} text={t("game.tournament")} meshTextPos={[-4.3, 7.5, 0]} meshTextRot={[0, -Math.PI / 2, 0]} textPos={[0, 0, 0]} textRot={[0.4, 0, 0]} />
          </mesh>
        ) : null}
        <Pong stateGame={props.state} updateSetState={props.updateSetState} formData8={props.formData8} formData4={props.formData4} formData2={props.formData2} winnerTournament={props.winnerTournament} score={props.score} updateSetScore={props.updateSetScore} racketColor={props.racketColor} selectedKeys={props.selectedKeys} findOnlineGame={props.findOnlineGame} newUrl={props.newUrl} username={props.username} userId={props.userId} gameId={props.gameId} position={props.position} rotation={props.rotation} multiple={props.multiple}/>
      </>
      ) 
    } else {
      return null;
    }
  });
  
  export default Panel;