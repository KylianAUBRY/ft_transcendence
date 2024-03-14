import React from 'react'
import Ethnocentric from './Ethnocentric.otf'
import CurvedText from './CurvedText';


const Screen = ({Gltf, text, textPos, textRot, meshTextPos, meshTextRot }) => {
    const font = Ethnocentric
  
    return (
        <primitive object={Gltf}>    
            <mesh position={meshTextPos} rotation={meshTextRot} >
                <CurvedText text={text} position={textPos} rotation={textRot} curve={-5} font={font} />
                <meshBasicMaterial attach="material" />
            </mesh>
        </primitive>);
  };
  
  export default Screen;
  
  