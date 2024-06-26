import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import RtgSeparator from '../components/RtgSeparator';

import headingImg from '../theme/img/headings/queens_guard.jpg';
import './Rules.scss';

const Rules = () => (
  <Page className="RulesPage">
    <BigPicture className="RulesPage__heading" img={headingImg} positionY={70}>
      <h2 className="BigPicture__heading">Die Regeln der RTG</h2>
    </BigPicture>
    <section className="RulesPage__content">
      <h4>Tipps Vorrunde</h4>
      <p>
        Sämtliche Vorrundenspiele werden vor Beginn der EURO getippt. Ihr könnt Eure Tipps bis zum
        Anstoß des Eröffnungsspiels am
        {' '}
        <b>14.06.2024 um 21 Uhr (MESZ)</b>
        {' '}
        ändern. Danach könnt ihr
        nichts verändern. Geht also sicher, dass ihr JEDES Spiel getippt habt und ALLES
        ausgefüllt ist!
      </p>

      <RtgSeparator />

      <h4>Tipps K.O.-Runde</h4>
      <p>
        Ab dem Achtelfinale (Nach der Vorrunde, letztes Spiel Gruppe F) wird wieder losgetippt.
        Das bedeutet: vergesst nicht zu tippen! Die anstehenden Paarungen und fehlenden Tipps
        werden euch natürlich hier in der RTG angezeigt. Das Königshaus bietet euch überdies
        den Service einer Tipperinnerung an. Ab jetzt könnt ihr also jedes K.O.-Spiel&nbsp;
        <b>bis zum Spielbeginn</b>
        {' '}
        tippen.
        <br />
        <br />
        Getippt wird das Ergebnis für JEDES Spiel
        {' '}
        <b>nach 90 Minuten</b>
        ! Das bedeutet, ihr könnt
        IMMER ein Unentschieden tippen, auch in den K.O.-Spielen, in denen es theoretisch auch
        Verlängerung und Elfmeterschießen gibt.
      </p>

      <RtgSeparator />

      <h4>Wetteinsatz</h4>
      <p>
        Der Wetteinsatz beträgt 5 €. Bitte übermittelt den Betrag bis spätestens&nbsp;
        <b>Freitag, 21.06.2024</b>
        {' '}
        an das Royale Paar, via&nbsp;
        <a href="https://paypal.me/rtg2018/5" target="_blank" rel="noopener noreferrer">
          PayPal
        </a>
        ,&nbsp;
        bar auf die Kralle oder per Überweisung (Bankdaten siehe Willkommens-Email).
      </p>

      <RtgSeparator />

      <h4>Gewinn</h4>
      <p>
        Die Gewinnausschüttung hängt von der Teilnehmerzahl ab. Wenn wir bei Turnierstart sehen, wie
        viele Teilnehmer es geworden sind, werden wir alle gemeinsam demokratisch (Demokratie
        trotz Monarchie!) abstimmen, wie der Gewinn ausgeschüttet wird. Dann können wir auch
        eine genaue Angabe zu den Gewinnsummen geben.
      </p>

      <RtgSeparator />

      <h4>Punktevergabe</h4>
      <p>
        Für einen komplett richtigen Tipp gibt es
        {' '}
        <b>3 Punkte</b>
        {' '}
        (z.B. Deutschland - Schottland
        geht 5:0 aus und ihr tippt 5:0).
        <br />
        <br />

        Für einen richtigen Differenztipp (z.B. Deutschland - Schottland geht 5:0 aus und ihr
        tippt 6:1) gibt es
        {' '}
        <b>2 Punkte</b>
        .
        <br />
        <br />

        Für eine richtige Tendenz (ihr tippt z.B., dass Deutschland 4:0 gegen Schottland
        gewinnt, Deutschland gewinnt auch, aber nur mit 1:0) dann bekommt ihr&nbsp;
        <b>1 Punkt</b>
        .
        <br />
        <br />

        Tippt ihr Unentschieden, z.B. 1:1, das Spiel geht aber 2:2 aus, dann gibt es ebenfalls&nbsp;
        <b>1 Punkt</b>
        .
      </p>

      <RtgSeparator />

      <h4>Platzierung</h4>
      <p>
        Bei Punktgleichheit zwischen zwei oder mehreren Mitspielern werden keine weiteren
        Kriterien zur Entscheidung über die Platzierung angewendet. D.h. diese Spieler
        haben dann allesamt den gleichen Tabellenplatz erreicht.
      </p>

      <RtgSeparator />

      <h4>Paare & Familien</h4>
      <p>
        Wie immer dürfen Liebespaare und Familien im Team spielen! Euer Username kann dann z.B. eine
        lustige Kombination eurer Vornamen sein! ;-) Sooo romantisch! Und royal!
      </p>

      <Link to="/">
        <Button color="primary" style={{ marginTop: '30px' }}>Zurück</Button>
      </Link>
    </section>
  </Page>
);

export default Rules;
