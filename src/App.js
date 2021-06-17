import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from "socket.io-client";
import './App.css';
import Video from './components/Video';
import Button from '@material-ui/core/Button';
import Classes from './components/Classes'; 
import { Box, Container } from './styles';



const socket = io("https://2686ac550eeb.ngrok.io", {transports: ['websocket']});

function App() {
  const videoRef = useRef(null);
  const [text, setText] = useState("");
  const { id } = useParams();
  const {search} = useLocation();
  const query = new URLSearchParams(search);
  const paramField = query.get('admin');

  const [type, setType] = useState('text');


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
      setText(data);
    });

    socket.on("activities", (data) => {
      setType(data)
    });

    socket.on('disconnect', () => {
      // alert("OPAAA")
    });
  }, [id])
  

  function handleFinishingClass() {
    socket.disconnect("OPA");
  }
  
  return (
    <div className="App">

      <header className="App-header">
        <Container>
            <Video ref={videoRef} />

            <Box>
              <span>Sala: {text}</span> 
              {/* <Button color="primary" variant="contained" onClick={handleJoinRoom}>Logar</Button> */}

              <Button color="primary" variant="contained" onClick={handleFinishingClass}>Finalizar Aula</Button>
            </Box>
            <Classes socket={socket} type={type} setType={setType} admin={paramField === "on"} room={id}/>
          </Container>
      </header>
    </div>
  );
}

export default App;
