import React from 'react';
import { Link } from 'react-router-dom';
import { FlatButton } from 'material-ui';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import headingImg from '../theme/img/headings/neuschwanstein.jpg';
import djangoLogo from '../theme/img/libs/django.svg';
import reactLogo from '../theme/img/libs/react.svg';
import postgresLogo from '../theme/img/libs/postgresql.svg';
import nginxLogo from '../theme/img/libs/nginx.svg';

import './Imprint.css';

const Imprint = () => (
  <Page className="ImprintPage">
    <BigPicture className="ImprintPage__heading" img={headingImg}>
      <h1 className="BigPicture__heading">Impressum</h1>
    </BigPicture>
    <section className="ImprintPage__content">
      <h2>Anbieter</h2>
      <div className="ImprintPage__contact">
        (Verantwortlich nach § 6 Abs. 2 MDStV)<br /><br />
        Matthias Loeks<br />
        Lothringer Straße 79<br />
        D-50677 Köln
      </div>

      <h4>Kontakt</h4>
      <p>
        Feedback, Anregungen, Kritik, Fragen usw. jeglicher Art gerne
        jederzeit an das Königshaus.<br />
        <Link to="/contact">
          <FlatButton label="Zum Kontaktformular" primary style={{ marginTop: '20px' }} />
        </Link>
      </p>

      <hr />

      <h2>Haftungsausschluss</h2>
      <h4>Haftung für Inhalte</h4>
      <p>
        Als Anbieter des Tippspiels sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen
        Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
        jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
        überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
        hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen
        nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung
        ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
        Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte
        umgehend entfernen.
      </p>
      <p>
        Wir verfolgen mit diesem Tippspiel keinerlei kommerzielle Interessen. Der für die
        Teilnahme zu entrichtende Unkostenbeitrag fließt zu 100 % in die Gewinnausschüttung
        an die Teilnehmer zurück. Als Anbieter haben wir keine Einnahmen aus diesem Tippspiel.
        Ausnahmen sind freiwillige Spenden der Teilnehmer.<br />
        Wir beabsichtigen mit diesem privat organisierten Tippspiel kein kommerzielles Glücksspiel
        zu betreiben und übernehmen folglich keine Haftung für etwaige Suchtfolgen seitens der
        Teilnehmer. Die Teilnahme erfolgt zu 100 % freiwillig und jeder Teilnehmer wird über die
        Spielbedingungen auf dieser Webseite und per E-Mail im Vorhinein ausreichend aufgeklärt.
        Die Teilnahme ist unverbindlich und kann jederzeit kostenlos widerrufen
        werden.
      </p>

      <h4>Haftung für Links</h4>
      <p>
        Diese Webseite enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
        Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
        Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
        Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
        mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
        Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten
        Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
        Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
      </p>

      <h4>Urheberrecht</h4>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
        dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
        der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
        Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
        sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte
        auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter
        beachtet.
      </p>
      <p>
        Insbesondere wird auf folgende Inhalte Dritter hingewiesen, deren Urheberrecht vollständig
        bei den jeweiligen Erstellern liegt:
      </p>
      <p>
        Das Wappen der Royalen Tippgemeinschaft wurde in Teilen aus den Vereinswappen des
        FC Barcelona (
        <a href="http://www.fcbarcelona.com/" target="_blank" rel="noopener noreferrer">
          © FC Barcelona
        </a>, urheberrechtlich geschützt) und von Real Madrid(
        <a href="http://www.realmadrid.com/" target="_blank" rel="noopener noreferrer">
          © Real Madrid CF
        </a>, urheberrechtlich geschützt) gestaltet.
      </p>
      <p>
        Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir
        um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir
        derartige Inhalte umgehend entfernen.
      </p>
      <p>
        [Quelle:&nbsp;
        <a
          href="http://www.e-recht24.de/muster-disclaimer.htm"
          target="_blank"
          rel="noopener noreferrer"
        >eRecht24
        </a>]
      </p>

      <hr />

      <h2>Bildquellen</h2>
      <p>
        {/* TODO P2 korrekte Bildquellen angeben */}
        Alle Bildmaterialien sind Public Domain, bezogen von&nbsp;
        <a href="http://www.pixabay.com" target="_blank" rel="noopener noreferrer">Pixabay</a> &&nbsp;
        <a href="http://www.unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>.
      </p>
      <p>
        Verwendete Icons von&nbsp;
        <a href="http://www.material-ui.com" target="_blank" rel="noopener noreferrer">
          Material-UI
        </a>,&nbsp;
        <a href="https://materialdesignicons.com" target="_blank" rel="noopener noreferrer">
          Material Design Icons
        </a>,&nbsp;
        <a href="https://www.svgrepo.com" target="_blank" rel="noopener noreferrer">
          SVG Repo
        </a> &&nbsp;
        <a href="https://www.freepik.com/free-vector/damask-seamless-pattern-background_1534340.htm" target="_blank" rel="noopener noreferrer">
          Freepik
        </a>.
      </p>
      <p>
        Länderflaggen von&nbsp;
        <a href="https://www.shareicon.net/pack/flat-round-world-flag-icon-set" target="_blank" rel="noopener noreferrer">
          ShareIcon Flat Round World Flag Icon Set
        </a>.
      </p>

      <hr />
      <h2>Powered by</h2>
      <p className="ImprintPage__used-frameworks">
        <a href="https://www.djangoproject.com" target="_blank" rel="noopener noreferrer">
          <img src={djangoLogo} alt="Django logo" />
        </a>
        <a className="ImprintPage__react-logo" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} alt="React logo" />
        </a>
        <a href="https://www.postgresql.org" target="_blank" rel="noopener noreferrer">
          <img src={postgresLogo} alt="PostgreSQL logo" />
        </a>
        <a href="https://www.nginx.com" target="_blank" rel="noopener noreferrer">
          <img src={nginxLogo} alt="Nginx logo" />
        </a>
      </p>
    </section>
  </Page>
);

export default Imprint;
