import React from 'react';

import { Container } from './styles';
import Class1 from "./Class1"
import Class2 from "./Class2"
import Class3 from "./Class3"

const typesClass = {
    text: <Class1 />,
    video: <Class2 />,
    activity: <Class3 />,
}

function Classes() {
  return <Container>
      {typesClass["text"]}
  </Container>;
}

export default Classes;