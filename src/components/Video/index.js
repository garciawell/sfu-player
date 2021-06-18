import React, { forwardRef } from 'react';


import { Container } from './styles';

const Video = forwardRef((props, videoRef) => { 

  return (
    <Container show={props.show}>
        {/* {props.show && <h1>{props.text}</h1>} */}
        {/* <video autoPlay muted ref={videoRef} {...props}/> */}
        <div className={props.className} ref={videoRef} {...props}>

        </div>
    </Container>
  );
})

export default Video;