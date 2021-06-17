import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Container } from './styles';
import Class1 from "./Class1"
import Class2 from "./Class2"
import Class3 from "./Class3"

export const typesClass = {
    text: <Class1 />,
    video: <Class2 />,
    activity: <Class3 />,
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
          <MenuItem value="text">Texto</MenuItem>
          <MenuItem value='video'>Video</MenuItem>
          <MenuItem value="activity">Atividades</MenuItem>
        </Select>
      }     

      {typesClass[type]}
  </Container>;
}

export default Classes;