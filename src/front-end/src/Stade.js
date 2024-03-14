import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import React from 'react';
import * as THREE from 'three';


const loader = new GLTFLoader();


const Stade = () => {
  
    const [gltf, setGltf] = React.useState(null);
  
    React.useEffect(() => {
      loader.load('./stade.glb', (loadedGltf) => {
        setGltf(loadedGltf)
        loadedGltf.scene.traverse((child) => {
          if (child.name === 'Circle')
            child.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
          if (child.name === 'Plane001')
            child.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
          if (child.name === 'TerrainLower')
            child.material = new THREE.MeshBasicMaterial({ color: 0x052352 });
        })
      }, undefined, (error) => {
        console.error('Erreur lors du chargement du fichier GLTF', error);
      });
    }, [loader]);
    
  
  
    if (gltf) {
      return <primitive object={gltf.scene} position={[0, 0, 0]}/> ;
    } else {
      return null;
    }
  };
  
  export default Stade;

