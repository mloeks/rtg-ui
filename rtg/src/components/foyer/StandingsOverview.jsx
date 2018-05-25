import React from 'react';
import { Link } from 'react-router-dom';
import { FlatButton } from 'material-ui';
import StandingsTable from '../standings/StandingsTable';

// TODO P3 lazy load standings when scrolled into view
const StandingsOverview = () => (
  <section style={{ margin: '20px auto', maxWidth: 640 }}>
    <StandingsTable showOnlyUserExcerpt showTableHeader={false} showStatsColumns={false} />

    <Link to="/standings">
      <FlatButton
        primary
        label="Zum vollständigen Spielstand"
        style={{ margin: '10px 0' }}
      />
    </Link>
  </section>
);

export default StandingsOverview;
