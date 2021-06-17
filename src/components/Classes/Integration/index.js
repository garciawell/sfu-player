import React from 'react';

 import { Container } from './styles';

function Integration( {url}) {
  return <Container>
      <iframe title="Integração" src={url} frameBorder="0" scrolling="no" allowFullScreen></iframe>

  </Container>;
}

export default Integration;