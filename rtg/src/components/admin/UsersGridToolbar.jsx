import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, IconMenu, MenuItem, TextField, Toolbar, ToolbarGroup } from 'material-ui';
import ContentFilterList from 'material-ui/svg-icons/content/filter-list';
import ActionEuroSymbol from 'material-ui/svg-icons/action/euro-symbol';
import ActionFace from 'material-ui/svg-icons/action/face';
import ActionSearch from 'material-ui/svg-icons/action/search';
import { teal200 } from 'material-ui/styles/colors';

const UsersGridToolbar = props => (
  <Toolbar style={{ backgroundColor: teal200 }}>
    <ToolbarGroup firstChild>
      <IconMenu
        iconButtonElement={
          <IconButton touch><ContentFilterList /></IconButton>
        }
      >
        <MenuItem
          primaryText="Nur aktive User"
          rightIcon={<ActionFace />}
          checked={props.filterActive}
          onClick={props.onFilterActiveToggled}
          style={{ textAlign: 'left' }}
        />
        <MenuItem
          primaryText="Nur fehlender Tippeinsatz"
          rightIcon={<ActionEuroSymbol />}
          checked={props.filterHasNotPaid}
          onClick={props.onFilterHasNotPaidToggled}
          style={{ textAlign: 'left' }}
        />
      </IconMenu>
    </ToolbarGroup>
    <ToolbarGroup>
      <ActionSearch />
      <TextField
        floatingLabelText="User suchen"
        value={props.searchTerm}
        onChange={(e, v) => props.onSearchTermUpdated(v)}
      />
    </ToolbarGroup>
  </Toolbar>
);

UsersGridToolbar.defaultProps = {
  filterActive: false,
  filterHasNotPaid: false,
  searchTerm: '',
};

UsersGridToolbar.propTypes = {
  filterActive: PropTypes.bool,
  filterHasNotPaid: PropTypes.bool,
  searchTerm: PropTypes.string,

  onFilterActiveToggled: PropTypes.func.isRequired,
  onFilterHasNotPaidToggled: PropTypes.func.isRequired,
  onSearchTermUpdated: PropTypes.func.isRequired,
};

export default UsersGridToolbar;
