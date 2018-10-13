import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import PlaceIcon from '@material-ui/icons/Place';
import CloseIcon from '@material-ui/icons/Close';

import UserAvatar from './UserAvatar';
import FetchHelper from '../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../service/AuthService';

import './UserDetailsPopover.css';

// TODO P3 also load statistics and offer to show rank, bet stats etc. to other users
class UserDetailsPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      detailsLoading: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      this.loadDetails();
    }
  }

  async loadDetails() {
    const { userId } = this.props;
    fetch(`${API_BASE_URL}/rtg/users_public/${userId}/`,
      { headers: { Authorization: `Token ${AuthService.getToken()}` } })
      .then(FetchHelper.parseJson).then(response => (
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
      onClose,
      open,
      targetOrigin,
      theme,
      username,
    } = this.props;

    return (
      <Popover
        animated={false}
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        onRequestClose={onClose}
        open={open}
        targetOrigin={targetOrigin}
        style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
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

            <h3 className="UserDetailsPopover__username">{this.props.username}</h3>

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
                  <p className="UserDetailsPopover__location">
                    <PlaceIcon
                      style={{ color: theme.palette.grey['400'], width: 18, height: 18 }}
                    />
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
  targetOrigin: { horizontal: 'left', vertical: 'bottom' },
};

UserDetailsPopover.propTypes = {
  anchorEl: PropTypes.object,
  anchorOrigin: PropTypes.shape({
    horizontal: PropTypes.string.isRequired,
    vertical: PropTypes.string.isRequired,
  }),
  targetOrigin: PropTypes.shape({
    horizontal: PropTypes.string.isRequired,
    vertical: PropTypes.string.isRequired,
  }),
  avatar: PropTypes.string,
  open: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,

  onClose: PropTypes.func.isRequired,

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme()(UserDetailsPopover);
