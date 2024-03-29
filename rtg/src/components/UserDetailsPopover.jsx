import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles, withTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import PlaceIcon from '@mui/icons/Place';
import CloseIcon from '@mui/icons/Close';

import UserAvatar from './UserAvatar';
import FetchHelper from '../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../service/AuthService';

import './UserDetailsPopover.scss';

const styles = {
  paper: {
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
};

// TODO P3 also load statistics and offer to show rank, bet stats etc. to other users
class UserDetailsPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      detailsLoading: true,
    };
  }

  componentDidMount() {
    this.loadDetails();
  }

  async loadDetails() {
    const { userId } = this.props;
    fetch(`${API_BASE_URL}/rtg/users_public/${userId}/`,
      { headers: { Authorization: `Token ${AuthService.getToken()}` } })
      .then(FetchHelper.parseJson).then((response) => (
        this.setState({
          detailsLoading: false, ...response.ok && { user: response.json },
        })
      )).catch(() => this.setState({ detailsLoading: false }));
  }

  render() {
    const { detailsLoading, user } = this.state;
    const {
      anchorEl,
      anchorOrigin,
      avatar,
      classes,
      onClose,
      transformOrigin,
      theme,
      username,
    } = this.props;

    return (
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        classes={{ paper: classes.paper }}
        onClose={onClose}
        open
        PaperProps={{ elevation: 0 }}
        transformOrigin={transformOrigin}
        style={{ backgroundColor: 'transparent', boxShadow: 'none', marginBottom: 10 }}
      >
        <div className="UserDetailsPopover">
          <div className="UserDetailsPopover__content">
            <div className="UserDetailsPopover__avatar-wrapper">
              <div className="UserDetailsPopover__avatar-background">
                <UserAvatar
                  className="UserDetailsPopover__avatar"
                  size={130}
                  username={username}
                  img={avatar}
                />
              </div>
            </div>

            <IconButton
              className="UserDetailsPopover__close-icon"
              onClick={onClose}
              title="Schließen"
              style={{ position: 'absolute', top: 0, right: 0 }}
            >
              <CloseIcon style={{ color: theme.palette.grey['900'], width: 18, height: 18 }} />
            </IconButton>

            <h3 className="UserDetailsPopover__username">{username}</h3>

            {detailsLoading && <CircularProgress />}

            {!detailsLoading && user && (
              <div className="UserDetailsPopover__details">
                {user.about && (
                  <p className="UserDetailsPopover__about">
                    »&nbsp;
                    {user.about}
                    &nbsp;«
                  </p>
                )}
                {user.location && (
                  <p
                    className="UserDetailsPopover__location"
                    style={{ color: theme.palette.grey['600'] }}
                  >
                    <PlaceIcon color="inherit" style={{ width: 18, height: 18 }} />
                    &nbsp;
                    {user.location}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Popover>
    );
  }
}

UserDetailsPopover.defaultProps = {
  anchorEl: null,
  avatar: null,
  anchorOrigin: { horizontal: 'left', vertical: 'top' },
  transformOrigin: { horizontal: 'left', vertical: 'bottom' },
};

UserDetailsPopover.propTypes = {
  anchorEl: PropTypes.instanceOf(Element),
  anchorOrigin: PropTypes.shape({
    horizontal: PropTypes.string.isRequired,
    vertical: PropTypes.string.isRequired,
  }),
  transformOrigin: PropTypes.shape({
    horizontal: PropTypes.string.isRequired,
    vertical: PropTypes.string.isRequired,
  }),
  avatar: PropTypes.string,
  userId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,

  onClose: PropTypes.func.isRequired,

  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(withTheme(UserDetailsPopover));
