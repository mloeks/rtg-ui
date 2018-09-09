import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import WarningIcon from '@material-ui/icons/Warning';
import PersonIcon from '@material-ui/icons/Person';
import teal from '@material-ui/core/colors/teal';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import { darkGold, darkGrey, error, gold, grey, lightGrey } from '../../theme/RtgTheme';
import { lightenDarkenColor } from '../../service/ColorHelper';

const CARD_SIZE = 140;

const DeleteConfirmationModal = (props) => {
  const actions = [
    <Button onClick={props.onCancel}>Abbrechen</Button>,
    <Button color="primary" onClick={props.onConfirm}>User löschen</Button>,
  ];

  return (
    <Dialog
      actions={actions}
      modal
      open={props.open}
      title="Löschen bestätigen"
    >
      &quot;{props.username}&quot; endgültig löschen?<br />
      Dies kann nicht rückgängig gemacht werden!
    </Dialog>
  );
};

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

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
    this.setState({ savingInProgress: true, savingIssues: false }, () => {
      const newHasPaid = !this.props.has_paid;

      fetch(`${API_BASE_URL}/rtg/users_admin/${this.props.pk}/`, {
        method: 'PATCH',
        body: JSON.stringify({ has_paid: newHasPaid }),
        headers: {
          Authorization: `Token ${AuthService.getToken()}`,
          'content-type': 'application/json',
        },
      }).then((response) => {
        if (response.ok) {
          this.setState({ savingInProgress: false });
          this.props.onHasPaidUpdated(this.props.pk, newHasPaid);
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
    this.setState({
      savingInProgress: true,
      savingIssues: false,
      deleteConfirmationModalOpen: false,
    }, () => {
      fetch(`${API_BASE_URL}/rtg/users/${this.props.pk}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${AuthService.getToken()}` },
      }).then((response) => {
        if (response.ok) {
          this.setState({ savingInProgress: false });
          this.props.onDelete(this.props.pk);
        } else {
          this.setState({ savingInProgress: false, savingIssues: true });
        }
      }).catch(() => this.setState({ savingInProgress: false, savingIssues: true }));
    });
  }

  render() {
    const isInactive = this.props.last_login === null;
    const iconButtonStyle = {
      width: 24,
      height: 24,
      padding: 0,
      margin: 0,
    };
    const paidSymbol = (
      <EuroSymbolIcon
        color={this.props.has_paid ?
          gold : lightenDarkenColor(lightGrey, 40)}
        hoverColor={this.props.has_paid ? darkGold : lightGrey}
        onClick={this.toggleHasPaid}
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
      ><PersonIcon color="white" style={{ width: '90%', height: '90%' }} />
      </div>
    );

    return (
      <Fragment>
        <DeleteConfirmationModal
          open={this.state.deleteConfirmationModalOpen}
          username={this.props.username}
          onCancel={this.handleDeleteRequestCancelled}
          onConfirm={this.handleDelete}
        />
        <Card
          style={{
            width: CARD_SIZE,
            textAlign: 'left',
            margin: '0 5px 10px',
          }}
          containerStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <CardMedia
            overlay={
              <CardHeader
                title={this.props.username}
                style={{ padding: '10px'}}
                titleStyle={{
                  color: 'white',
                  textShadow: 'black 1px 1px 4px',
                  fontFamily: '"Lobster Two", sans-serif',
                  fontSize: '18px',
                  lineHeight: '18px',
                }}
              />
            }
            style={{ height: 0.8 * CARD_SIZE, overflow: 'hidden', opacity: isInactive ? 0.3 : 1 }}
            mediaStyle={{ height: '100%', marginTop: this.props.avatar ? '-10%' : '0' }}
            overlayContentStyle={{ paddingTop: 0, background: 'rgba(0, 0, 0, 0.35)' }}
          >
            {this.props.avatar && <img src={`${API_BASE_URL}/media/${this.props.avatar}`} alt="User avatar" />}
            {!this.props.avatar && noAvatarPlaceholder}
          </CardMedia>
          <CardContent
            style={{
              fontSize: '14px',
              flexGrow: 1,
              padding: '10px',
              opacity: isInactive ? 0.3 : 1,
            }}
          >
            <span style={{ fontWeight: 500, wordBreak: 'break-word' }}>
              {`${this.props.first_name} ${this.props.last_name}`}
            </span><br />
            <div style={{
              color: grey,
              fontSize: '12px',
              fontWeight: 400,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
            ><span>{this.props.email}</span><br />
              {this.props.email2 && <span>{this.props.email2}</span>}
            </div>
          </CardContent>

          <CardActions
            style={{ display: 'flex', justifyContent: isInactive ? 'flex-end' : 'space-between' }}
          >
            {!isInactive &&
              <IconButton
                title={`Als ${this.props.has_paid ? 'unbezahlt' : 'bezahlt'} markieren`}
                onClick={this.toggleHasPaid}
                style={iconButtonStyle}
                iconStyle={{ margin: 0 }}
              >{paidSymbol}
              </IconButton>}

            {this.state.savingInProgress && <CircularProgress size={20} thickness={2} />}
            {this.state.savingIssues &&
              <IconButton
                title="Fehler beim Speichern, bitte neu laden."
                style={iconButtonStyle}
                iconStyle={{ margin: 0 }}
              ><WarningIcon color={error} />
              </IconButton>}

            <IconButton
              title="Benutzer löschen"
              onClick={this.handleDeleteRequest}
              style={iconButtonStyle}
              iconStyle={{ margin: 0 }}
            ><DeleteIcon color={grey} hoverColor={darkGrey} />
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
};

export default UserCard;
