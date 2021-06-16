import { useEffect, useRef } from 'react';
import './App.css';
import Video from './components/Video';

function App() {
  const videoRef = useRef();

  useEffect(() => {
    const getMediaDevices = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      videoRef.current.srcObject = localStream
    }
  
    getMediaDevices()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
          <Video playInline autoPlay ref={videoRef} />
      </header>
    </div>
  );
}

export default App;
