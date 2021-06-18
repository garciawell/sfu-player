import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from "socket.io-client";
import { Device } from "mediasoup-client";
import './App.css';
import Video from './components/Video';
import Button from '@material-ui/core/Button';
import Classes from './components/Classes'; 
import { Box, Container, ContainerScreen } from './styles';
import { RoomClient, TYPE_CHANGE_USER } from './socket/RoomClient';



const socket = io("http://localhost:3016", {
    transports: ["websocket", "polling"]
});

function App() {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const videoScreen = useRef(null);
  const [rc, setRc] = useState();
  const [text, setText] = useState("");
  const [share, setShare] = useState(false);
  const { id } = useParams();
  const {search} = useLocation();
  const [users, setUsers] = useState([]);
  const query = new URLSearchParams(search);
  const paramField = query.get('admin');

  ///ESTATES
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);
  const [screen, setScreen] = useState(false);


  const loginSuccess = () => {
    console.log("LOGIN SUCCESS")
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

            setTimeout(() => {
              openCamera(vds);
              openAudio(ads);
            }, 300);
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
    if (list) {
        rc?.produce(RoomClient.mediaType.video, list[0].value);
        return;
    }
    rc?.produce(RoomClient.mediaType.video, videoDevices[0].value);
  }

  const openAudio = (list) => {
    console.log("video", audio);
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
    const localStream = await navigator.mediaDevices.getDisplayMedia();
    videoScreen.current.srcObject = localStream
    localStream.getVideoTracks()[0].addEventListener('ended', () => setShare(false))
    setShare(true)
  }
  

  useEffect(() => {
    socket.on('connection', (socket) => {
      console.log('a user connected');
    });

    joinRoom("wellington", id)

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
    socket.on("connect_error", (error) => {
      console.error("GARCIAAAAAAA", error)
    })
  }, [])


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

    rc.on(RoomClient.EVENTS.startVideo, () => {
        console.log("start");
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
}, [rc]);

  

  function handleFinishingClass() {
    socket.disconnect("OPA");
  }

  console.log("videoDevices", videoDevices)
  return (
    <div className="App">

      <header className="App-header">
        <Container>
            <ContainerScreen shared={share}>
              {/* <Video ref={videoScreen} text={'Screen'} show={share}/> */}
              <Video className="local-video" ref={localRef} text={'Hydra'} show />
              <Video className="remote-video" ref={remoteRef} text={'remoto'} show />
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
