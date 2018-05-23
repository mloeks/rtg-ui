import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, IconMenu, MenuItem, TextField, Toolbar, ToolbarGroup } from 'material-ui';
import ContentFilterList from 'material-ui/svg-icons/content/filter-list';
import ActionEuroSymbol from 'material-ui/svg-icons/action/euro-symbol';
import ActionFace from 'material-ui/svg-icons/action/face';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ContentBackspace from 'material-ui/svg-icons/content/backspace';
import { teal200, teal400 } from 'material-ui/styles/colors';
import { darkGrey, grey, lightGrey } from '../../theme/RtgTheme';
import { lightenDarkenColor } from "../../service/ColorHelper";

const UsersGridToolbar = props => (
  <Toolbar
    style={{
      position: 'sticky',
      top: 0,
      backgroundColor: teal200,
      height: '60px',
      boxShadow: '0 3px 5px rgba(57, 63, 72, 0.3)',
      zIndex: 100,
    }}
  >
    <ToolbarGroup firstChild>
      <IconMenu
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        clickCloseDelay={0}
        iconButtonElement={
          <IconButton>
            <ContentFilterList color={grey} hoverColor={darkGrey} />
          </IconButton>
        }
      >
        <MenuItem
          primaryText="Nur aktive User"
          rightIcon={<ActionFace color={teal400} />}
          checked={props.filterActive}
          insetChildren
          onClick={props.onFilterActiveToggled}
          style={{ textAlign: 'left' }}
        />
        <MenuItem
          primaryText="Tippeinsatz unbezahlt"
          rightIcon={<ActionEuroSymbol color={lightenDarkenColor(lightGrey, 40)} />}
          checked={props.filterHasNotPaid}
          insetChildren
          onClick={props.onFilterHasNotPaidToggled}
          style={{ textAlign: 'left' }}
        />
      </IconMenu>
    </ToolbarGroup>
    <ToolbarGroup style={{ position: 'relative' }}>
      <ActionSearch style={{
        position: 'absolute',
        left: 0,
        bottom: '20px',
        width: 20,
        height: 20,
        color: grey,
      }}
      />
      <TextField
        hintText="User suchen"
        value={props.searchTerm}
        onChange={(e, v) => props.onSearchTermUpdated(v)}
        hintStyle={{ padding: '0 25px' }}
        inputStyle={{ padding: '0 25px' }}
      />
      <IconButton
        iconStyle={{ width: 20, height: 20 }}
        style={{ position: 'absolute', right: 0, bottom: '6px' }}
        onClick={() => props.onSearchTermUpdated('')}
      >
        <ContentBackspace color={grey} hoverColor={darkGrey} />
      </IconButton>
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
