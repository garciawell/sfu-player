import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from "socket.io-client";
import './App.css';
import Video from './components/Video';
import Button from '@material-ui/core/Button';
import Classes from './components/Classes'; 
import { Box, Container, ContainerScreen } from './styles';



const socket = io("https://2686ac550eeb.ngrok.io", {transports: ['websocket']});

function App() {
  const videoRef = useRef(null);
  const videoScreen = useRef(null);
  const [text, setText] = useState("");
  const [share, setShare] = useState(false);
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

  async function startScreen() {
    const localStream = await navigator.mediaDevices.getDisplayMedia();
    videoScreen.current.srcObject = localStream
    localStream.getVideoTracks()[0].addEventListener('ended', () => setShare(false))
    setShare(true)
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

  useEffect(() => {

  }, [])
  

  function handleFinishingClass() {
    socket.disconnect("OPA");
  }


  return (
    <div className="App">

      <header className="App-header">
        <Container>
            <ContainerScreen shared={share}>
              <Video ref={videoScreen} text={'Screen'} show={share}/>
              <Video ref={videoRef} text={'Hydra'} show />
            </ContainerScreen>

            <Box>
              <span>Sala: {text}</span> 
              {/* <Button color="primary" variant="contained" onClick={handleJoinRoom}>Logar</Button> */}
              <Button color="primary" variant="contained" onClick={startScreen}>Screen</Button>

              <Button color="primary" variant="contained" onClick={handleFinishingClass}>Finalizar Aula</Button>
            </Box>
            <Classes socket={socket} type={type} setType={setType} admin={paramField === "on"} room={id}/>
          </Container>
      </header>
    </div>
  );
}

export default App;
