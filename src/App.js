import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Mic from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import { Device,  } from "mediasoup-client";
import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import io from "socket.io-client";
import './App.css';
import Classes from './components/Classes';
import Video from './components/Video';
import { RoomClient, TYPE_CHANGE_USER } from './socket/RoomClient';
import { Box, Container, ContainerScreen } from './styles';

const socket = io('wss://18.217.182.229:3016', { 
  transports: ['websocket', 'polling'],
});


function App() {
  const localRef = useRef(null);
  const remoteRef = useRef(null);

  const [rc, setRc] = useState();
  const [text, setText] = useState("");
  const [share, setShare] = useState(false);
  const { id } = useParams();
  const {search} = useLocation();
  const [users, setUsers] = useState([]);
  const query = new URLSearchParams(search);
  const paramField = query.get('admin');
  const userName = query.get('name');

  ///ESTATES
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);
  const [screen, setScreen] = useState(false);


  const loginSuccess = () => {
    console.log("LOGIN SUCCESS", users)
  }



  const [type, setType] = useState('text');

  const joinRoom = async (name, room_id) => {
    if (rc && rc.isOpen()) {
      console.log('already connected to a room')
    } else {
      const newRc = new RoomClient(null, null, null, Device, socket, room_id, name, loginSuccess)
      console.log(newRc);
      
      setRc(newRc);
    //   const newRc = new RoomClient(localMedia, remoteVideos, remoteAudios, window.mediasoupClient, socket, room_id, name, roomOpen)
    }
  
  }

  useEffect(() => {
    if(!!rc) {
    try {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const vds = [], ads = [];
            devices.forEach(device => {
                if ('audioinput' === device.kind) {
                    ads.push(device)
                } else if ('videoinput' === device.kind) {
                    vds.push(device)
                }
            });
            setAudioDevices(ads);
            setVideoDevices(vds);
        })
    } catch (error) {
        alert("No device or no permission use device");
    }
    if (!rc) return;
    rc.localMediaEl = localRef.current;
    rc.remoteVideoEl = remoteRef.current;

    rc.onChangeUser = (data, type) => {
        const userCollection = data?.users || [];
        // console.log("chage",    userCollection);

        setUsers(userCollection);
        console.log(data?.user);
        socket.emit('create', id);
        
        switch (type) {
            case TYPE_CHANGE_USER.join:
                console.log("Join success", 2)
                break;
            case TYPE_CHANGE_USER.add:
                console.log(data?.user?.name + " Join", 2);
                break;
            case TYPE_CHANGE_USER.exit:
                console.log(data?.user?.name + " exit", 2);
                break;
            default:
                break;
        }
    }
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [rc]);


  const openCamera = (list) => {
    if (screen) return;
    console.log("video", video);
    if (video) {
        console.log("close vd", video);
        rc?.closeProducer(RoomClient.mediaType.video);
        setVideo(false)
        return;
    }
    setVideo(true);
    if (list.length) {
      rc?.produce(RoomClient.mediaType.video, list[0].value);
      return;
    }else if(videoDevices.length) {
      rc?.produce(RoomClient.mediaType.video, videoDevices[0].value);
      return 
    }
    setVideo(false);
  }

  const openAudio = (list) => {
    if (audio) {
        console.log("close vd", audio);
        rc?.closeProducer(RoomClient.mediaType.audio);
        setAudio(false)
        return;
    }
    setAudio(true);
    if (list) {
        rc?.produce(RoomClient.mediaType.audio, list[0].value);
        return;
    }
    rc?.produce(RoomClient.mediaType.audio, audioDevices[0].value);
  }


  async function startScreen() {
   await rc?.produce(RoomClient.mediaType.screen);
    setScreen(!screen)
    setShare(true)
  }
  

  useEffect(() => {
    socket.on('connection', (socket) => {
      console.log('a user connected');
    });

    joinRoom(userName? userName :"wellington", id)

    socket.on(id, (data) => { 
      setText(data);
    });

    socket.on("activities", (data) => {
      setType(data)
    });

    socket.on('disconnect', () => {
      // alert("OPAAA")
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    socket.on("connect_error", (error) => {
      console.error("GARCIAAAAAAA", error)
    })
  }, [])

  useEffect(() => {
    if(rc && !!videoDevices[0]) {
      setTimeout(() => {
        rc?.produce(RoomClient.mediaType.video, videoDevices[0].value);
      }, 3000);
    }
  }, [rc, videoDevices])


  const addListeners = () => {
    if (!rc) return;
    rc.on(RoomClient.EVENTS.startScreen, () => {
    })

    rc.on(RoomClient.EVENTS.stopScreen, () => {
    })

    rc.on(RoomClient.EVENTS.stopAudio, () => {
    })
    rc.on(RoomClient.EVENTS.startAudio, () => {
    })    
    
    rc.on(RoomClient.EVENTS.openRoom, () => {
      console.log("OPEN ROOM")
    })

    rc.on(RoomClient.EVENTS.startVideo, () => {
      console.log("START VIDEO")
    })
    rc.on(RoomClient.EVENTS.stopVideo, () => {
    })
    rc.on(RoomClient.EVENTS.exitRoom, () => {
    })
  }



  useEffect(() => {
      if (!rc) return;
      console.log("users", rc.getUsers())
      addListeners();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rc]);

  

  function handleFinishingClass() {
    socket.disconnect("OPA");
  }


  return (
    <div className="App">

      <header className="App-header">
        <Container>
          <h1>Hydra</h1>
            <ContainerScreen shared={share}>
              {/* <Video ref={localScreen} text={'Screen'} show={share}/>
              <Video ref={remoteScreen} text={'Screen'} show={share}/> */}
              <Video className="local-video" ref={localRef} text={'Hydra'} show />
              <Video className="remote-video" ref={remoteRef} text={'remoto'} show />
            </ContainerScreen>

            <IconButton color="secondary" className="icon-button" onClick={() => openCamera(videoDevices)}>
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton color="secondary" className="icon-button" onClick={() => openAudio(audioDevices)}>
              {audio ? <Mic /> : <MicOffIcon />}
            </IconButton>

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
