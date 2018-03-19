import React from 'react';
import { FlatButton } from 'material-ui';
import { withRouter } from 'react-router-dom';
import ReactRouterProptypes from 'react-router-prop-types';
import Page from './Page';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/img7.jpg';
import './About.css';

const About = (props) => (
  <Page className="AboutPage">
    <BigPicture className="AboutPage__heading" img={headingImg}>
      <h1 className="BigPicture__heading">Über die RTG</h1>
    </BigPicture>

    <section className="AboutPage__content">
      <h3>Über Uns</h3>
      <p>
        Die Royale Tippgemeinschaft ist ein alle zwei Jahre zur Fußball-WM oder EM
        stattfindendes Tippspiel, welches vom Royalen Paar (Dorothee von Schweden und
        ihrem Prinzgemahl Matthias) organisiert wird. Es wendet sich an alle Freunde,
        Bekannte, Kollegen und Familienmitglieder der Organisatoren.
      </p>
      <p>
        Stetig wächst die Gruppe der RTG, die Mitglieder sind nicht nur
        in ganz Deutschland sondern mittlerweile auch in der ganzen Welt verteilt.
        Wenn Du mit dem Royalen Paar bekannt bist, fühl Dich herzlich eingeladen,
        an diesem wunderbaren und hochroyalen Spaß teilzuhaben!
      </p><br />
      <FlatButton
        label="Jetzt mitmachen!"
        primary
        onClick={() => props.history.push('/')}
      />
    </section>
  </Page>
);

About.propTypes = {
  history: ReactRouterProptypes.history.isRequired, // eslint-disable-line react/no-typos
};

export default withRouter(About);
