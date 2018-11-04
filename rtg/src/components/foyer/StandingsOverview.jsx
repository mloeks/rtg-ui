import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import StandingsTable from '../standings/StandingsTable';

import './StandingsOverview.scss';

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
      <Button color="primary" style={{ margin: '10px 0' }}>
        Zum vollständigen Spielstand
      </Button>
    </Link>
  </Fragment>
);

export default StandingsOverview;
