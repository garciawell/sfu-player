import React, { forwardRef } from 'react';


import { Container } from './styles';

const Video = forwardRef((props, videoRef) => { 



  return (
    <Container>
        <h1>OLA MUNDO</h1>

        <video autoPlay muted ref={videoRef} {...props}/>
    </Container>
  );
})

export default Video;