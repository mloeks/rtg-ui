import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FlatButton } from 'material-ui';
import StandingsTable from '../standings/StandingsTable';

import './StandingsOverview.css';

// TODO P3 lazy load standings when scrolled into view
const StandingsOverview = () => (
  <Fragment>
    <section className="StandingsOverview">
      <StandingsTable
        showOnlyUserExcerpt
        showTableHeader={false}
        showStatsColumns={false}
      />
    </section>
    <Link to="/standings">
      <FlatButton
        primary
        label="Zum vollständigen Spielstand"
        style={{ margin: '10px 0' }}
      />
    </Link>
  </Fragment>
);

export default StandingsOverview;
