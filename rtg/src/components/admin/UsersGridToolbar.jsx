import React from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';

import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import BackspaceIcon from '@material-ui/icons/Backspace';
import teal from '@material-ui/core/colors/teal';

const UsersGridToolbar = ({
  filterActive, filterHasNotPaid, onFilterHasNotPaidToggled, filterInactive,
  onFilterActiveToggled, onFilterInactiveToggled, onSearchTermUpdated, searchTerm, theme,
}) => (
  <Toolbar
    className="UsersGridToolbar"
    style={{
      position: 'sticky',
      top: 0,
      backgroundColor: teal['200'],
      height: '60px',
      boxShadow: '0 3px 5px rgba(57, 63, 72, 0.3)',
      zIndex: 100,
      transition: 'top 200ms cubic-bezier(0.0, 0.0, 0.2, 1)',
    }}
  >
    <Menu
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      clickCloseDelay={0}
      iconButtonElement={(
        <IconButton>
          <FilterListIcon style={{ color: theme.palette.grey['700'] }} />
        </IconButton>
      )}
    >
      <MenuItem
        primaryText="Nur aktive User"
        checked={filterActive}
        insetChildren
        onClick={onFilterActiveToggled}
        style={{ textAlign: 'left' }}
      />
      <MenuItem
        primaryText="Nur inaktive User"
        checked={filterInactive}
        insetChildren
        onClick={onFilterInactiveToggled}
        style={{ textAlign: 'left' }}
      />
      <Divider />
      <MenuItem
        primaryText="Tippeinsatz unbezahlt"
        checked={filterHasNotPaid}
        insetChildren
        onClick={onFilterHasNotPaidToggled}
        style={{ textAlign: 'left' }}
      />
    </Menu>
    <SearchIcon style={{
      position: 'absolute',
      left: 0,
      bottom: '20px',
      width: 20,
      height: 20,
      color: theme.palette.grey['500'],
    }}
    />
    <TextField
      hintText="User suchen"
      value={searchTerm}
      onChange={(e, v) => onSearchTermUpdated(v)}
      hintStyle={{ padding: '0 25px' }}
      inputStyle={{ padding: '0 25px', width: 'auto' }}
    />
    <IconButton
      iconStyle={{ width: 20, height: 20 }}
      style={{ position: 'absolute', right: 0, bottom: '6px' }}
      onClick={() => onSearchTermUpdated('')}
    >
      <BackspaceIcon style={{ color: theme.palette.grey['700'] }} />
    </IconButton>
  </Toolbar>
);

UsersGridToolbar.defaultProps = {
  filterActive: false,
  filterInactive: false,
  filterHasNotPaid: false,
  searchTerm: '',
};

UsersGridToolbar.propTypes = {
  filterActive: PropTypes.bool,
  filterInactive: PropTypes.bool,
  filterHasNotPaid: PropTypes.bool,
  searchTerm: PropTypes.string,

  onFilterActiveToggled: PropTypes.func.isRequired,
  onFilterInactiveToggled: PropTypes.func.isRequired,
  onFilterHasNotPaidToggled: PropTypes.func.isRequired,
  onSearchTermUpdated: PropTypes.func.isRequired,

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme()(UsersGridToolbar);
