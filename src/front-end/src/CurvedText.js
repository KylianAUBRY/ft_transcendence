import React, { useRef } from 'react'
import { Text } from '@react-three/drei'

const CurvedText = ({text, position, curve, rotation, font}) => {
    const textRef = useRef();
  
    return (
      <Text
        ref={textRef}
        text={text}
        position={position}
        rotation={rotation}
        anchorX="center"
        anchorY="middle"
        fontSize={0.4}
        font={font}
        maxWidth={10}
        curveRadius={curve}
        color={0x144378}>
        <meshBasicMaterial attach="material" depthWrite={false} />
      </Text>
    );
  };

  export default CurvedText
