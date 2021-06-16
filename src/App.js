import { useEffect, useRef, useState } from 'react';
import './App.css';
import Video from './components/Video';
import { io } from "socket.io-client";
import { joinRoom } from "./socket";
import { useParams } from 'react-router-dom';



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
     socket = io("http://localhost:3333", {transports: ['websocket']});
  }, [])

  function handleJoinRoom() {
    socket.emit('create', id);
  }
  

  useEffect(() => {
    socket.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });

    socket.emit('create', id);

    socket.on("connect_error", (error) => {
      console.log("ERROR", error)
    });

    socket.on(id, (data) => { 
      console.log("OPAAA2", data)
      setText(data);
    });
  }, [id])
  
  
  return (
    <div className="App">

      <header className="App-header">
          <Video ref={videoRef} />
          OPS: {text}
          <button onClick={handleJoinRoom}>Logar</button>
      </header>
    </div>
  );
}

export default App;
