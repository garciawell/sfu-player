import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
import './App.css';
import Video from './components/Video';
import Classes from './components/Classes'; 
import { Box } from './styles';



let socket;

function App() {
  const videoRef = useRef(null);
  const [text, setText] = useState("");
  let { id } = useParams();

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

  useEffect(() => {
     socket = io("https://d6a54e56f284.ngrok.io", {transports: ['websocket']});
  }, [])

  function handleJoinRoom() {
    socket.emit('create', id);
  }
  

  useEffect(() => {
    socket.on('connection', (socket) => {
      console.log('a user connected');
    });

    socket.emit('create', id);

    socket.on("connect_error", (error) => {
      console.log("ERROR", error)
    });

    socket.on(id, (data) => { 
      console.log("OPAAA2", data)
      setText(data);
    });

    socket.on('disconnect', () => {
      alert("OPAAA")
    });
  }, [id])
  

  function handleFinishingClass() {
    socket.disconnect("OPA");
  }
  
  return (
    <div className="App">

      <header className="App-header">
          <Video ref={videoRef} />

          <Box>
             <span>Sala: {text}</span> 
            <button onClick={handleJoinRoom}>Logar</button>

            <button onClick={handleFinishingClass}>Finalizar Aula</button>
          </Box>
          <Classes />
      </header>
    </div>
  );
}

export default App;
