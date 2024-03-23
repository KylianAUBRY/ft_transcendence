import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import MyCanvas from './MyCanvas'
import React, { useState, useEffect } from 'react'

function App() {
  const [isSize, setIsSize] = useState(0);
  const [oneTime, setoneTime] = useState(true)

  const checkWindowSize = () => {
    if (window.innerHeight >= 720 && window.innerWidth >= 1280) {
      setIsSize(1);
      setoneTime(true)
    } else {
      setIsSize(0);
    }
  };

  useEffect(() => {
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<MyCanvas isSize={isSize} position={[0, 50, 0]} rotation={[-Math.PI / 2, 0, Math.PI]} route={'/'} setoneTime={setoneTime} oneTime={oneTime}/>}/>

        <Route exact path="/lobby" element={<MyCanvas isSize={isSize} position={[17, 4, 0]} rotation={[0, Math.PI / 2, 0]} route={'/lobby'}/>}/>

        <Route path="/local" element={<MyCanvas isSize={isSize} position={[0, 15, 0]} rotation={[-Math.PI / 2, 0, Math.PI]} route={'/local'}/> }/>

        <Route path="/tournament" element={<MyCanvas isSize={isSize} position={[0, 15, 0]} rotation={[-Math.PI / 2, 0, Math.PI]} route={'/tournament'}/> }/>

        <Route exact path="/online" element={<MyCanvas isSize={isSize} position={[17, 4, 0]} rotation={[0, Math.PI / 2, 0]} route={'/online'}/>}/>

        <Route exact path="/bot" element={<MyCanvas isSize={isSize} position={[17, 4, 0]} rotation={[0, Math.PI / 2, 0]} route={'/bot'}/>}/>

        <Route exact path="/register42" element={<MyCanvas isSize={isSize} position={[0, 50, 0]} rotation={[-Math.PI / 2, 0, Math.PI]} route={'/register42'}/>}/>

        <Route path="*" element={<div>Pages not Found</div>} />

      </Routes>
    </Router>
  );
}

export default App;


