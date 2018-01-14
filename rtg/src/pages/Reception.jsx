import React from 'react';
import Header from '../components/Header';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/img7.jpg';

const Reception = () => (
  <div>
    <Header />
    <BigPicture className="Reception__welcome" img={headingImg}>
      <h1 className="BigPicture__heading">Willkommen! ...</h1>
    </BigPicture>
  </div>
);

export default Reception;
