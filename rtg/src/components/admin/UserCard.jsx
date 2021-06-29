// Disable camelcase linting as long as snake-cased fields from backend response
// are directly used for props
/* eslint-disable camelcase */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import WarningIcon from '@material-ui/icons/Warning';
import PersonIcon from '@material-ui/icons/Person';
import teal from '@material-ui/core/colors/teal';

import { format, formatDistanceToNow } from 'date-fns';
import de from 'date-fns/locale/de';

import DeleteConfirmationModal from './DeleteConfirmationModal';

import AuthService, { API_BASE_URL } from '../../service/AuthService';

import './UserCard.scss';

const CARD_SIZE = 140;
const OPEN_BETS_BADGE_HEIGHT = 22;

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

  toggleHasPaid() {
    const { hasPaid, onHasPaidUpdated, pk } = this.props;

    this.setState({ savingInProgress: true, savingIssues: false }, () => {
      const newHasPaid = !hasPaid;

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

  render() {
    const { deleteConfirmationModalOpen, savingInProgress, savingIssues } = this.state;
    const {
      active,
      avatar,
      email,
      email2,
      firstName,
      hasPaid,
      lastName,
      lastLogin,
      openBettables,
      theme,
      username,
    } = this.props;

    const iconButtonStyle = {
      width: 24,
      height: 24,
      padding: 0,
      margin: 0,
    };
    const paidSymbol = (
      <EuroSymbolIcon
        style={{ color: hasPaid ? theme.palette.secondary.main : theme.palette.grey['300'] }}
      />
    );

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
        fontSize: '18px',
        lineHeight: '18px',
      }}
      >
        {username}
      </div>
    );

    return (
      <>
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
              opacity: active ? 1 : 0.3,
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
              opacity: active ? 1 : 0.3,
            }}
          >
            <span style={{ fontWeight: 500, wordBreak: 'break-word' }}>
              {`${firstName} ${lastName}`}
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
              <br />
              Zuletzt eingeloggt:
              <br />
              {lastLogin && (
                <span title={format(lastLogin, 'Pp', { locale: de })}>
                  <i>{formatDistanceToNow(lastLogin, { addSuffix: true, locale: de })}</i>
                </span>
              )}
            </div>
          </CardContent>

          <CardActions style={{
            display: 'flex',
            justifyContent: active ? 'space-between' : 'flex-end',
            padding: 8,
          }}
          >
            {active && (
              <IconButton
                title={`Als ${hasPaid ? 'unbezahlt' : 'bezahlt'} markieren`}
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

            <Avatar
              style={{
                backgroundColor: openBettables > 0
                  ? theme.palette.error.main
                  : theme.palette.success.main,
                width: OPEN_BETS_BADGE_HEIGHT,
                height: OPEN_BETS_BADGE_HEIGHT,
                fontSize: 0.5 * OPEN_BETS_BADGE_HEIGHT,
                margin: 0,
              }}
              title={`${openBettables} offene Tipps`}
            >
              {openBettables || <CheckIcon style={{ width: 0.75 * OPEN_BETS_BADGE_HEIGHT }} />}
            </Avatar>

            <IconButton
              title="Benutzer löschen"
              onClick={this.handleDeleteRequest}
              style={iconButtonStyle}
            >
              <DeleteIcon style={{ color: theme.palette.grey['500'] }} />
            </IconButton>
          </CardActions>
        </Card>
      </>
    );
  }
}

UserCard.defaultProps = {
  avatar: null,
  email2: null,
  lastLogin: null,
};

UserCard.propTypes = {
  pk: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  email2: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  avatar: PropTypes.string,
  hasPaid: PropTypes.bool.isRequired,
  lastLogin: PropTypes.instanceOf(Date),
  openBettables: PropTypes.number.isRequired,

  onHasPaidUpdated: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(UserCard);
