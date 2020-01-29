// Disable camelcase linting as long as snake-cased fields from backend response
// are directly used for props
/* eslint-disable camelcase */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import WarningIcon from '@material-ui/icons/Warning';
import PersonIcon from '@material-ui/icons/Person';
import teal from '@material-ui/core/colors/teal';

import DeleteConfirmationModal from './DeleteConfirmationModal';

import AuthService, { API_BASE_URL } from '../../service/AuthService';

const CARD_SIZE = 140;

// TODO P3 add possibility to change username inline
class UserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteConfirmationModalOpen: false,
      savingInProgress: false,
      savingIssues: false,
    };
    this.toggleHasPaid = this.toggleHasPaid.bind(this);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
    this.handleDeleteRequestCancelled = this.handleDeleteRequestCancelled.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  toggleHasPaid() {
    const { has_paid, onHasPaidUpdated, pk } = this.props;

    this.setState({ savingInProgress: true, savingIssues: false }, () => {
      const newHasPaid = !has_paid;

      fetch(`${API_BASE_URL}/rtg/users_admin/${pk}/`, {
        method: 'PATCH',
        body: JSON.stringify({ has_paid: newHasPaid }),
        headers: {
          Authorization: `Token ${AuthService.getToken()}`,
          'content-type': 'application/json',
        },
      }).then((response) => {
        if (response.ok) {
          this.setState({ savingInProgress: false });
          onHasPaidUpdated(pk, newHasPaid);
        } else {
          this.setState({ savingInProgress: false, savingIssues: true });
        }
      }).catch(() => this.setState({ savingInProgress: false, savingIssues: true }));
    });
  }

  handleDeleteRequest() {
    this.setState({ deleteConfirmationModalOpen: true });
  }

  handleDeleteRequestCancelled() {
    this.setState({ deleteConfirmationModalOpen: false });
  }

  handleDelete() {
    const { onDelete, pk } = this.props;
    this.setState({
      savingInProgress: true,
      savingIssues: false,
      deleteConfirmationModalOpen: false,
    }, () => {
      fetch(`${API_BASE_URL}/rtg/users/${pk}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${AuthService.getToken()}` },
      }).then((response) => {
        if (response.ok) {
          this.setState({ savingInProgress: false });
          onDelete(pk);
        } else {
          this.setState({ savingInProgress: false, savingIssues: true });
        }
      }).catch(() => this.setState({ savingInProgress: false, savingIssues: true }));
    });
  }

  render() {
    const { deleteConfirmationModalOpen, savingInProgress, savingIssues } = this.state;
    const {
      avatar,
      email,
      email2,
      first_name,
      has_paid,
      last_login,
      last_name,
      theme,
      username,
    } = this.props;

    const isInactive = last_login === null;
    const iconButtonStyle = {
      width: 24,
      height: 24,
      padding: 0,
      margin: 0,
    };
    const paidSymbol = (
      <EuroSymbolIcon
        style={{ color: has_paid ? theme.palette.secondary.main : theme.palette.grey['300'] }}
      />);

    const noAvatarPlaceholder = (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          backgroundColor: teal['400'],
        }}
      >
        <PersonIcon style={{ color: theme.palette.common.white, width: '90%', height: '90%' }} />
      </div>
    );

    const usernameOverlay = (
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        padding: 10,
        background: 'rgba(0, 0, 0, 0.35)',
        color: 'white',
        textShadow: 'black 1px 1px 4px',
        fontFamily: '"Lobster Two", sans-serif',
        fontSize: '18px',
        lineHeight: '18px',
      }}
      >
        {username}
      </div>
    );

    return (
      <Fragment>
        <DeleteConfirmationModal
          open={deleteConfirmationModalOpen}
          username={username}
          onCancel={this.handleDeleteRequestCancelled}
          onConfirm={this.handleDelete}
        />
        <Card
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: CARD_SIZE,
            textAlign: 'left',
            margin: '0 5px 10px',
          }}
        >
          <CardContent
            style={{
              position: 'relative',
              height: 0.8 * CARD_SIZE,
              padding: 0,
              overflow: 'hidden',
              opacity: isInactive ? 0.3 : 1,
            }}
          >
            {avatar && (
              <img
                src={`${API_BASE_URL}/media/${avatar}`}
                alt="User avatar"
                style={{ marginTop: '-10%', width: '100%' }}
              />
            )}
            {!avatar && noAvatarPlaceholder}
            {usernameOverlay}
          </CardContent>
          <CardContent
            style={{
              fontSize: '14px',
              flexGrow: 1,
              padding: '10px',
              opacity: isInactive ? 0.3 : 1,
            }}
          >
            <span style={{ fontWeight: 500, wordBreak: 'break-word' }}>
              {`${first_name} ${last_name}`}
            </span>
            <br />
            <div style={{
              color: theme.palette.grey['500'],
              fontSize: '12px',
              fontWeight: 400,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
            >
              <span>{email}</span>
              <br />
              {email2 && <span>{email2}</span>}
            </div>
          </CardContent>

          <CardActions style={{
            display: 'flex',
            justifyContent: isInactive ? 'flex-end' : 'space-between',
            padding: 8,
          }}
          >
            {!isInactive && (
              <IconButton
                title={`Als ${has_paid ? 'unbezahlt' : 'bezahlt'} markieren`}
                onClick={this.toggleHasPaid}
                style={iconButtonStyle}
              >
                {paidSymbol}
              </IconButton>
            )}

            {savingInProgress && <CircularProgress size={20} thickness={2} />}
            {savingIssues && (
              <IconButton
                title="Fehler beim Speichern, bitte neu laden."
                style={iconButtonStyle}
              >
                <WarningIcon style={{ color: theme.palette.error.main }} />
              </IconButton>
            )}

            <IconButton
              title="Benutzer löschen"
              onClick={this.handleDeleteRequest}
              style={iconButtonStyle}
            >
              <DeleteIcon style={{ color: theme.palette.grey['500'] }} />
            </IconButton>
          </CardActions>
        </Card>
      </Fragment>
    );
  }
}

UserCard.defaultProps = {
  avatar: null,
  email2: null,
  last_login: null,
};

UserCard.propTypes = {
  pk: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  email2: PropTypes.string,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  has_paid: PropTypes.bool.isRequired,
  last_login: PropTypes.string,

  onHasPaidUpdated: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(UserCard);
