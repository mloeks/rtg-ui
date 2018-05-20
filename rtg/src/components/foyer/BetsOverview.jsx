import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FlatButton } from 'material-ui';
import { UserDetailsContext } from '../providers/UserDetailsProvider';
import RtgSeparator from '../RtgSeparator';
import { purple } from '../../theme/RtgTheme';
import Notification, { NotificationType } from '../Notification';

const BetsOverview = () => {
  const openBetsCountStyle = {
    margin: '0 5px',
    color: purple,
    fontFamily: '"Lobster Two", sans-serif',
    fontSize: '32px',
  };

  return (
    <section className="BetsOverview" style={{ padding: '15px', margin: '20px auto', maxWidth: 640 }}>
      <p>
        In der RTG werden traditionell <b>alle Spiele</b> der Fußball-Weltmeisterschaft getippt.
        Bitte gib deine Tipps für sämtliche Vorrundenspiele rechtzeitig bis zum Beginn des
        Eröffnungspiels am <b>Donnerstag, 14. Juni, 17:00 Uhr (MESZ)</b> ab.
        <br /><br />
        Anschließend werden auch die Spiele der K.O.-Runde getippt,
        sobald die Paarungen feststehen.
        <br /><br />
        Die ausführlichen Regeln kannst du dir hier noch einmal genauer durchlesen:
        <br />
        <Link to="/rules">
          <FlatButton primary label="Regeln und Punktevergabe" style={{ margin: '10px 0' }} />
        </Link>
      </p>

      <RtgSeparator />

      <UserDetailsContext.Consumer>
        {({ openBetsCount }) => (
          <Fragment>
            {openBetsCount > 0 &&
            <p className="BetsOverview__open-bets-info">
              Du hast aktuell noch&nbsp;
              <span style={openBetsCountStyle}>{openBetsCount}</span>&nbsp;
              {openBetsCount === 1 ? 'offenen Tipp' : 'offene Tipps'}.
              <br />
              <Link to="/bets">
                <FlatButton
                  primary
                  label={`Jetzt ${openBetsCount === 1 ? 'Tipp' : 'Tipps'} abgeben`}
                  style={{ margin: '10px 0' }}
                />
              </Link>
            </p>}
            {openBetsCount === 0 &&
            <Notification
              type={NotificationType.SUCCESS}
              title="Alles getippt!"
              subtitle="Du hast aktuell keine offenen Tipps."
            />
              }
          </Fragment>
          )}
      </UserDetailsContext.Consumer>

    </section>
  );
};

export default BetsOverview;
