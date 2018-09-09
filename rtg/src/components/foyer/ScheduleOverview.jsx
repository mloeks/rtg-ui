import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const ScheduleOverview = () => (
  <section style={{ padding: '15px', margin: '20px auto', maxWidth: 640 }}>
    <p>
      In unserem Spielplan-Bereich kannst du dir alle Paarungen der WM und die Aufteilung
      auf die Gruppen ansehen. Darüber hinaus siehst du dort auch deine Tipps für die
      entsprechenden Spiele:
    </p>
    <Link to="/schedule">
      <Button color="primary" style={{ margin: '10px 0' }}>
        Zum Spielplan der WM
      </Button>
    </Link>
  </section>
);

export default ScheduleOverview;
