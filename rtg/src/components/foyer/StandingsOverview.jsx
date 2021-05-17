import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import StandingsTable from '../standings/StandingsTable';

import './StandingsOverview.scss';

// TODO P3 lazy load standings when scrolled into view
const StandingsOverview = () => (
  <section className="StandingsOverview">
    <h4>Deine Platzierung</h4>
    <StandingsTable
      showOnlyUserExcerpt
      showTableHeader={false}
      showStatsColumns={false}
    />
    <Link to="/standings">
      <Button color="primary" style={{ margin: '10px 0' }}>
        Zum vollständigen Spielstand
      </Button>
    </Link>
  </section>
);

export default StandingsOverview;
