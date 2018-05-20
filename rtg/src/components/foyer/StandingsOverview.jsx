import React from 'react';
import { Link } from 'react-router-dom';
import { FlatButton } from 'material-ui';
import StandingsTable from '../standings/StandingsTable';

const StandingsOverview = () => (
  <section style={{ margin: '20px auto', maxWidth: 640 }}>
    <p>Das sind unsere aktuellen Top-Tipper:</p>
    <StandingsTable showOnlyTopPart={250} showTableHeader={false} showStatsColumns={false} />

    <Link to="/standings">
      <FlatButton
        primary
        label="Zum ausführlichen Spielstand"
        style={{ margin: '10px 0' }}
      />
    </Link>
  </section>
);

export default StandingsOverview;
