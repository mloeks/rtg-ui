import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles, withTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Menu from '@mui/material/Menu';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';

import BackspaceIcon from '@mui/icons/Backspace';
import EuroSymbolIcon from '@mui/icons/EuroSymbol';
import FilterListIcon from '@mui/icons/FilterList';
import PersonIcon from '@mui/icons/Person';
import PersonOutlineIcon from '@mui/icons/PersonOutline';
import SearchIcon from '@mui/icons/Search';
import SortByAlphaIcon from '@mui/icons/SortByAlpha';
import teal from '@mui/material/colors/teal';

const styles = {
  filterMenu: {
    minWidth: 300,
  },
};

class UsersGridToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterMenuAnchorEl: null,
      sortMenuAnchorEl: null,
    };
  }

  render() {
    const { filterMenuAnchorEl, sortMenuAnchorEl } = this.state;
    const {
      classes, filterActive, filterHasNotPaid, onFilterHasNotPaidToggled, filterInactive,
      onFilterActiveToggled, onFilterInactiveToggled, onSearchTermUpdated, onSortByChanged,
      searchTerm, sortBy, theme,
    } = this.props;

    return (
      <Toolbar
        className="UsersGridToolbar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          backgroundColor: teal['200'],
          height: 60,
          boxShadow: '0 3px 5px rgba(57, 63, 72, 0.3)',
          zIndex: 100,
          transition: 'top 200ms cubic-bezier(0.0, 0.0, 0.2, 1)',
        }}
      >
        <IconButton
          aria-label="Filter"
          onClick={(e) => this.setState({ filterMenuAnchorEl: e.currentTarget })}
        >
          <FilterListIcon style={{ color: theme.palette.grey['700'] }} />
        </IconButton>
        <Menu
          anchorEl={filterMenuAnchorEl}
          open={Boolean(filterMenuAnchorEl)}
          onClose={() => this.setState({ filterMenuAnchorEl: null })}
          classes={{ paper: classes.filterMenu }}
        >
          <ListItem>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Nur aktive User" />
            <ListItemSecondaryAction>
              <Switch onChange={onFilterActiveToggled} checked={filterActive} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon><PersonOutlineIcon /></ListItemIcon>
            <ListItemText primary="Nur inaktive User" />
            <ListItemSecondaryAction>
              <Switch onChange={onFilterInactiveToggled} checked={filterInactive} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon><EuroSymbolIcon /></ListItemIcon>
            <ListItemText primary="Tippeinsatz unbezahlt" />
            <ListItemSecondaryAction>
              <Switch onChange={onFilterHasNotPaidToggled} checked={filterHasNotPaid} />
            </ListItemSecondaryAction>
          </ListItem>
        </Menu>

        <IconButton
          aria-label="Sortierung"
          onClick={(e) => this.setState({ sortMenuAnchorEl: e.currentTarget })}
        >
          <SortByAlphaIcon style={{ color: theme.palette.grey['700'] }} />
        </IconButton>
        <Menu
          anchorEl={sortMenuAnchorEl}
          open={Boolean(sortMenuAnchorEl)}
          onClose={() => this.setState({ sortMenuAnchorEl: null })}
          classes={{ paper: classes.sortMenu }}
        >
          <FormControl component="fieldset">
            <RadioGroup aria-label="Sortierung" name="sort" value={sortBy} onChange={onSortByChanged}>
              <FormControlLabel value="username" control={<Radio />} label="Username" />
              <FormControlLabel value="openBets" control={<Radio />} label="Offene Tipps" />
            </RadioGroup>
          </FormControl>
        </Menu>

        <FormControl style={{ flexGrow: 1 }}>
          <Input
            value={searchTerm}
            placeholder="User suchen"
            onChange={(e) => onSearchTermUpdated(e.target.value)}
            startAdornment={(
              <InputAdornment position="start">
                <SearchIcon style={{ color: theme.palette.grey['600'] }} />
              </InputAdornment>
            )}
            endAdornment={(
              <InputAdornment position="end">
                <IconButton
                  aria-label="Suchbegriff löschen"
                  onClick={() => onSearchTermUpdated('')}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  <BackspaceIcon style={{ color: theme.palette.grey['600'] }} />
                </IconButton>
              </InputAdornment>
            )}
          />
        </FormControl>
      </Toolbar>
    );
  }
}

UsersGridToolbar.defaultProps = {
  filterActive: false,
  filterInactive: false,
  filterHasNotPaid: false,
  searchTerm: '',
  sortBy: 'username',
};

UsersGridToolbar.propTypes = {
  filterActive: PropTypes.bool,
  filterInactive: PropTypes.bool,
  filterHasNotPaid: PropTypes.bool,
  searchTerm: PropTypes.string,
  sortBy: PropTypes.oneOf(['username', 'openBets']),

  onFilterActiveToggled: PropTypes.func.isRequired,
  onFilterInactiveToggled: PropTypes.func.isRequired,
  onFilterHasNotPaidToggled: PropTypes.func.isRequired,
  onSearchTermUpdated: PropTypes.func.isRequired,
  onSortByChanged: PropTypes.func.isRequired,

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(withTheme(UsersGridToolbar));
