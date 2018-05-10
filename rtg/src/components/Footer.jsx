import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { lighten } from 'material-ui/utils/colorManipulator';
import SvgIcon from 'material-ui/SvgIcon';
import muiThemeable from 'material-ui/styles/muiThemeable';

import './Footer.css';
import logo from '../theme/img/logo_tiny.png';

/* eslint-disable max-len */
const FacebookIcon = props => (
  <SvgIcon {...props}>
    <path d="M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-.006V1.08C115.325.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761h28.48z" />
  </SvgIcon>
);
/* eslint-enable max-len */

/* eslint-disable max-len */
const InstagramIcon = props => (
  <SvgIcon {...props}>
    <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
  </SvgIcon>
);
/* eslint-enable max-len */

// TODO P2 add a Twitter account and then this link
/* eslint-disable max-len */
// const TwitterIcon = props => (
//   <SvgIcon {...props}>
//     <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
//   </SvgIcon>
// );
/* eslint-enable max-len */

const Footer = props => {
  const socialMediaIconColor = props.muiTheme.palette.footerSocialIconColor;
  const socialMediaIconHoverColor = lighten(socialMediaIconColor, 0.7);

  return (
    <footer className="Footer" style={{backgroundColor: props.muiTheme.palette.footerColor}}>
      <Link to="/" className="Footer__title">
        <img alt="logo" className="Footer__logo" src={logo}/>
        <h4 className="Footer__title--full">Royale Tippgemeinschaft 2018</h4>
        <h4 className="Footer__title--abbrev">RTG 2018</h4>
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
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon
              className="Footer__socialmedia-icon"
              viewBox="0 0 155.139 155.139"
              color={socialMediaIconColor}
              hoverColor={socialMediaIconHoverColor}
            />
          </a>
          <a
            href="https://www.instagram.com/royaletippgemeinschaft/"
            title="Zur Instagram-Gruppe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon
              className="Footer__socialmedia-icon"
              viewBox="0 0 24 24"
              color={socialMediaIconColor}
              hoverColor={socialMediaIconHoverColor}
            />
          </a>
          <a
            href="http://www.twitter.com"
            title="Zur Twitter-Gruppe"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* TODO P2 kick off Twitter account */}
            {/*<TwitterIcon*/}
              {/*className="Footer__socialmedia-icon"*/}
              {/*viewBox="0 0 24 24"*/}
              {/*color={socialMediaIconColor}*/}
              {/*hoverColor={socialMediaIconHoverColor}*/}
            {/*/>*/}
          </a>
        </div>
      </div>

      {/* TODO P3 add 10 years jubilee logo  */}
      <div className="Footer__copyright">© Copyright 2008 - 2018 Royale Tippgemeinschaft</div>
    </footer>
  );
};

Footer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
};

export default muiThemeable()(Footer);
