import React from 'react';
import { Link } from 'react-router-dom';
import { FlatButton } from 'material-ui';
import Page from './Page';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/headings/room_flowers.jpg';
import payPalLogo from '../theme/img/paypal/de-pp-logo-100px.png';
import './Donate.css';

const Donate = () => (
  <Page className="DonatePage">
    <BigPicture className="DonatePage__heading" img={headingImg}>
      <h1 className="BigPicture__heading">Spenden</h1>
    </BigPicture>

    <section className="DonatePage__content">
      <h3>Unterstütze das Königshaus</h3>
      <p>
        Vor den großen Fußballturnieren dieser Welt opfern wir regelmäßig einen Großteil unserer
        Freizeit, um Euch die RTG mit allem, was dazu gehört, präsentieren zu können. Wir haben
        genauso wie ihr großen Spaß daran (möglicherweise noch größeren), dennoch entstehen auch
        einige Unkosten, um beispielsweise diese Webseite zu betreiben.
      </p>
      <p>
        Vielleicht hast Du Lust, uns mit einer kleinen Spende dabei zu unterstützen?<br />
        Wie viel Du spendest liegt ganz bei dir, jeder Cent hilft dem Königshaus, ihr wisst ja,
        verarmter Adel und so...
      </p>
      <p>
        Klicke auf das Logo, um direkt per PayPal zu spenden:
      </p><br />

      <a href="https://paypal.me/rtg2018" target="_blank" rel="noopener noreferrer">
        <img src={payPalLogo} alt="PayPal Logo" style={{ width: '100px' }} />
      </a>

      <br />
      <h4>Vielen herzlichen Dank für Deine Unterstützung!</h4>

      <Link to="/">
        <FlatButton primary label="Zurück" style={{ marginBottom: '15px' }} />
      </Link>
    </section>
  </Page>
);

export default Donate;
