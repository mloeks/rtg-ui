import React from 'react';
import { Link } from 'react-router-dom';
import SvgIcon from 'material-ui/SvgIcon';
import { darkGrey, lightGrey, white } from '../theme/RtgColours';

import './Footer.css';
import logo from '../theme/img/logo_tiny.png';

/* eslint-disable max-len */
const FacebookIcon = props => (
  <SvgIcon {...props}>
    <path d="M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-.006V1.08C115.325.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761h28.48z" />
  </SvgIcon>
);
/* eslint-enable max-len */

const Footer = () => (
  <footer className="Footer" style={{ backgroundColor: darkGrey }}>
    <Link to="/" className="Footer__title">
      <img alt="logo" className="Footer__logo" src={logo} />
      <h4 className="Footer__title--full">Royale Tippgemeinschaft 2018</h4>
      <h4 className="Footer__title--abbrev">RTG 2018</h4>
    </Link>

    <div className="Footer__content">
      <ul className="Footer__links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">Über die RTG</Link></li>
        <li><Link to="/rules">Regeln</Link></li>
        <li><Link to="/imprint">Impressum</Link></li>
        <li><Link to="/contact">Kontakt</Link></li>
        <li><Link to="/donate">Spenden</Link></li>
      </ul>

      <div className="Footer__socialmedia">
        <a href="http://www.facebook.com/groups/219528178065049">
          <FacebookIcon
            viewBox="0 0 155.139 155.139"
            color={lightGrey}
            hoverColor={white}
          />
        </a>
      </div>
    </div>

    <div className="Footer__copyright">© Copyright 2008 - 2018 Royale Tippgemeinschaft</div>
  </footer>
);

export default Footer;
