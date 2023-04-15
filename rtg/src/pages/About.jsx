import React from 'react';
import Button from '@mui/material/Button';
import { withRouter } from 'react-router-dom';
import ReactRouterProptypes from 'react-router-prop-types';
import Page from './Page';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/headings/silvia_zlatan.jpg';
import './About.scss';

const About = ({ history }) => (
  <Page className="AboutPage">
    <BigPicture className="AboutPage__heading" img={headingImg} positionY={21} large>
      <h2 className="BigPicture__heading">Über die RTG</h2>
    </BigPicture>

    <section className="AboutPage__content">
      <p>
        Die Royale Tippgemeinschaft ist ein alle zwei Jahre zur Fußball-WM oder EM
        stattfindendes Tippspiel, welches von der Royal Family (Dorothee von Schweden,
        ihrem Prinzgemahl Matthias und Kronprinz Jonathan Marius) organisiert wird.
        Es wendet sich an alle Freunde, Bekannte, Kollegen und Familienmitglieder
        der Organisatoren.
      </p>
      <p>
        Stetig wächst die RTG, deren Mitglieder mittlerweile nicht nur
        in ganz Deutschland, sondern auch in der ganzen Welt verteilt sind.
        Wenn Du mit der Royal Family bekannt bist, fühl Dich herzlich eingeladen,
        an diesem wunderbaren und hochroyalen Spaß teilzuhaben!
      </p>
      <br />
      <Button color="primary" onClick={() => history.push('/')}>
        Jetzt mitmachen!
      </Button>
    </section>
  </Page>
);

About.propTypes = {
  history: ReactRouterProptypes.history.isRequired,
};

export default withRouter(About);
