import React from 'react';
import { Link } from 'react-router-dom';
import { FlatButton } from 'material-ui';
import Page from './Page';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/headings/queens_guard.jpg';
import './Rules.css';

const Rules = () => (
  <Page className="RulesPage">
    <BigPicture className="RulesPage__heading" img={headingImg}>
      <h1 className="BigPicture__heading">Die Regeln der RTG</h1>
    </BigPicture>
    <section className="RulesPage__content">
      <h4>Tipps Vorrunde</h4>
      <p>
        Sämtliche Vorrundenspiele werden vor Beginn der WM getippt. Ihr könnt Eure Tipps bis zum
        Anstoß des Eröffnungsspiels am <b>14.06.2018 um 17 Uhr (MESZ)</b> ändern. Danach könnt Ihr
        nichts verändern. Geht also sicher, dass Ihr JEDES Spiel getippt habt und ALLES
        ausgefüllt ist!
      </p>

      <hr />

      <h4>Tipps K.O.-Runde</h4>
      <p>
        Ab dem Achtelfinale (Nach der Vorrunde, letztes Spiel Gruppe H) wird wieder losgetippt.
        Das bedeutet: vergesst nicht zu tippen! Die anstehenden Paarungen und fehlenden Tipps
        werden euch natürlich hier in der RTG angezeigt. Das Königshaus bietet euch überdies
        den Service einer Tipperinnerung an. Ab jetzt könnt Ihr also jedes K.O.-Spiel&nbsp;
        <b>bis zum Spielbeginn</b> tippen.<br /><br />
        Getippt wird das Ergebnis für JEDES Spiel <b>nach 90 Minuten</b>! Das bedeutet, Ihr könnt
        IMMER ein Unentschieden tippen, auch in den K.O.-Spielen, in denen es theoretisch auch
        Verlängerung und Elfmeterschießen gibt.
      </p>

      <hr />

      <h4>Wetteinsatz</h4>
      <p>
        Der Wetteinsatz beträgt 5 €. Bitte übermittelt den Betrag bis spätestens&nbsp;
        <b>Donnerstag, 21.06.16</b> an das Royale Paar, via&nbsp;
        <a href="https://paypal.me/rtg2018/5" target="_blank" rel="noopener noreferrer">
          PayPal
        </a>,&nbsp;
        bar auf die Kralle oder per Überweisung (Bankdaten siehe Willkommens-Email).
      </p>

      <hr />

      <h4>Gewinn</h4>
      <p>
        Die Gewinnausschüttung hängt von der Teilnehmerzahl ab. Wenn wir am 14. Juni sehen, wie
        viele Teilnehmer es geworden sind, werden wir alle gemeinsam demokratisch (Demokratie
        trotz Monarchie!) abstimmen, wie der Gewinn ausgeschüttet wird. Dann können wir auch
        eine genaue Angabe zu den Gewinnsummen geben.
      </p>

      <hr />

      <h4>Punktevergabe</h4>
      <p>
        Für einen komplett richtigen Tipp gibt es <b>5 Punkte</b> (z.B. Deutschland - Mexiko
        geht 5:0 aus und Ihr tippt 5:0).<br /><br />

        Für einen richtigen Differenztipp (z.B. Deutschland - Mexiko geht 5:0 aus und Ihr
        tippt 6:1) gibt es <b>3 Punkte</b>.<br /><br />

        Für eine richtige Tendenz (Ihr tippt z.B., dass Deutschland gegen Mexiko
        gewinnt und Deutschland gewinnt auch) dann bekommt Ihr <b>1 Punkt</b>.<br /><br />

        Tippt ihr Unentschieden, z.B. 1:1, das Spiel geht aber 2:2 aus, dann gibt es&nbsp;
        <b>2 Punkte</b>, weil man zwar die Differenz richtig hat, aber es ja auch nicht so
        schwer ist, in der Differenz bei Unentschieden richtig zu liegen. Deswegen die
        2 Punkte als Kompromiss.
      </p>

      <hr />

      <h4>Paare</h4>
      <p>
        Wie immer dürfen Liebespaare im Team spielen! Euer Username sollte dann eine
        Kombination aus euren beiden Vornamen sein! ;-) Sooo romantisch! Und royal!
      </p>

      <Link to="/">
        <FlatButton primary label="Zurück" style={{ marginTop: '30px' }} />
      </Link>
    </section>
  </Page>
);

export default Rules;
