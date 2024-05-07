import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SvgIcon from '@material-ui/core/SvgIcon';
import { withTheme } from '@material-ui/core/styles';

import './Footer.scss';
import logo from '../theme/img/logo_tiny.png';

const Footer = ({ theme }) => (
  <footer className="Footer" style={{ backgroundColor: theme.palette.custom.footer.main }}>
    <Link to="/" className="Footer__title">
      <img alt="logo" className="Footer__logo" src={logo} />
      <h2 className="Footer__title--full">Royale Tippgemeinschaft 2024</h2>
      <h2 className="Footer__title--abbrev">RTG 2024</h2>
    </Link>

    <div className="Footer__content">
      <ul className="Footer__links">
        <li><Link to="/">Foyer</Link></li>
        <li><Link to="/about">Über die RTG</Link></li>
        <li><Link to="/rules">Regeln</Link></li>
        <li><Link to="/imprint">Impressum</Link></li>
        <li><Link to="/contact">Kontakt</Link></li>
        <li><Link to="/donate">Spenden</Link></li>
      </ul>

      <div className="Footer__socialmedia">
        <a
          href="http://www.facebook.com/groups/219528178065049"
          title="Zur Facebook-Gruppe"
          aria-label="Zur Facebook-Grupe"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SvgIcon className="Footer__socialmedia-icon" color="secondary" viewBox="0 0 155.139 155.139">
            <path d="M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-.006V1.08C115.325.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761h28.48z" />
          </SvgIcon>
        </a>
        <a
          href="https://www.instagram.com/royaletippgemeinschaft/"
          title="Zur Instagram-Gruppe"
          aria-label="Zur Instagram-Gruppe"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SvgIcon className="Footer__socialmedia-icon" viewBox="0 0 24 24" color="secondary">
            <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
          </SvgIcon>
        </a>
      </div>
    </div>

    <div className="Footer__copyright">© Copyright 2008 - 2024 Royale Tippgemeinschaft</div>
  </footer>
);

Footer.propTypes = {
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(Footer);
