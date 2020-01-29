import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { UserDetailsContext } from '../providers/UserDetailsProvider';
import RtgSeparator from '../RtgSeparator';
import Notification, { NotificationType } from '../Notification';

const BetsOverview = ({ theme }) => {
  const openBetsCountStyle = {
    margin: '0 5px',
    color: theme.palette.primary.main,
    fontFamily: '"Lobster Two", sans-serif',
    fontSize: '32px',
  };

  return (
    <section style={{ padding: '15px', margin: '20px auto', maxWidth: 640 }}>
      <p>
        In der RTG werden traditionell&nbsp;
        <b>alle Spiele</b>
        &nbsp;der Fußball-Weltmeisterschaft getippt.
        Bitte gib deine Tipps für sämtliche Vorrundenspiele rechtzeitig bis zum Beginn des
        Eröffnungspiels am&nbsp;
        <b>Donnerstag, 14. Juni, 17:00 Uhr (MESZ)</b>
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
          <Fragment>
            {openBetsCount > 0 && (
              <p>
                Du hast aktuell noch&nbsp;
                <span style={openBetsCountStyle}>{openBetsCount}</span>
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
          </Fragment>
        )}
      </UserDetailsContext.Consumer>

    </section>
  );
};

BetsOverview.propTypes = {
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(BetsOverview);
