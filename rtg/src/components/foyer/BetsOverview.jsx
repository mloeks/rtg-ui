import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { UserDetailsContext } from '../providers/UserDetailsProvider';
import RtgSeparator from '../RtgSeparator';
import Notification, { NotificationType } from '../Notification';

const BetsOverview = () => (
  <section style={{ padding: '15px', margin: '20px auto', maxWidth: 640 }}>
    <p>
      In der RTG werden traditionell&nbsp;
      <b>alle Spiele</b>
      &nbsp;der Fußball-Europameisterschaft getippt.
      Bitte gib deine Tipps für sämtliche Vorrundenspiele rechtzeitig bis zum Beginn des
      Eröffnungspiels am&nbsp;
      <b>Freitag, 12. Juni, 21:00 Uhr (MESZ)</b>
      &nbsp;ab.
      <br />
      <br />
      Anschließend werden auch die Spiele der K.O.-Runde getippt,
      sobald die Paarungen feststehen.
      <br />
      <br />
      Die ausführlichen Regeln kannst du dir hier noch einmal genauer durchlesen:
      <br />
      <Link to="/rules">
        <Button color="primary" style={{ margin: '10px 0' }}>Regeln und Punktevergabe</Button>
      </Link>
    </p>

    <RtgSeparator />

    <UserDetailsContext.Consumer>
      {({ openBetsCount }) => (
        <>
          {openBetsCount > 0 && (
            <p>
              Du hast aktuell noch&nbsp;
              <Typography color="primary" component="span" variant="h1">{openBetsCount}</Typography>
              &nbsp;
              {openBetsCount === 1 ? 'offenen Tipp.' : 'offene Tipps.'}
              <br />
              <Link to="/bets">
                <Button color="primary" style={{ margin: '10px 0' }}>
                  {`Jetzt ${openBetsCount === 1 ? 'Tipp' : 'Tipps'} abgeben`}
                </Button>
              </Link>
            </p>
          )}
          {openBetsCount === 0 && (
            <Notification
              type={NotificationType.SUCCESS}
              title="Alles getippt!"
              subtitle="Du hast aktuell keine offenen Tipps."
            />
          )}
        </>
      )}
    </UserDetailsContext.Consumer>

  </section>
);

export default BetsOverview;
