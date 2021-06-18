import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Container } from './styles';
import Class1 from "./Class1"
import Class2 from "./Class2"
import Class3 from "./Class3"
import Integration from "./Integration"

export const typesClass = {
    text: <Class1 />,
    video: <Class2 />,
    activity: <Class3 />,
    drive: <Integration url="https://docs.google.com/document/d/1VPvu0iaqbYEE1tFfjk-20zJetkb0UljJR5s-wPwLycw/edit" />,
    miro: <Integration url="https://miro.com/app/live-embed/o9J_l-_dh14=/?moveToViewport=-1371,-1347,4106,2035" />,
}

function Classes({ socket, type, setType, admin, room }) {

  const handleChange = (event) => {
    setType(event.target.value);
    socket.emit("activities", { value: event.target.value, room})
  };

  return <Container>
    {admin &&
       <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          className="select"
          value={type}
          onChange={handleChange}
        >
          <MenuItem value="text">Atividade 01</MenuItem>
          <MenuItem value='video'>Video</MenuItem>
          <MenuItem value="activity">Atividades</MenuItem>
          <MenuItem value="drive">Drive</MenuItem>
          <MenuItem value="miro">Miro</MenuItem>
        </Select>
      }     

      {typesClass[type]}
  </Container>;
}

export default Classes;