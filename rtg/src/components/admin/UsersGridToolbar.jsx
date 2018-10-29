import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles, withTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Menu from '@material-ui/core/Menu';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';

import BackspaceIcon from '@material-ui/icons/Backspace';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import FilterListIcon from '@material-ui/icons/FilterList';
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import SearchIcon from '@material-ui/icons/Search';
import teal from '@material-ui/core/colors/teal';

const styles = {
  filterMenu: {
    minWidth: 300,
  },
};

class UsersGridToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = { filterMenuAnchorEl: null };
  }

  render() {
    const { filterMenuAnchorEl } = this.state;
    const {
      classes, filterActive, filterHasNotPaid, onFilterHasNotPaidToggled, filterInactive,
      onFilterActiveToggled, onFilterInactiveToggled, onSearchTermUpdated, searchTerm, theme,
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
          onClick={e => this.setState({ filterMenuAnchorEl: e.currentTarget })}
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

        <FormControl>
          <Input
            value={searchTerm}
            placeholder="User suchen"
            onChange={e => onSearchTermUpdated(e.target.value)}
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

  /* eslint-disable react/forbid-prop-types */
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default withStyles(styles)(withTheme()(UsersGridToolbar));
