import React, { Component } from 'react';
import { Paper } from 'material-ui';
import ContactFormPresentational from './ContactFormDisplay';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Notification, { NotificationType } from '../Notification';

import './ContactForm.css';

// TODO P3 Handle CSRF by reading the token from the Cookie of the first GET
// response to the backend and sending it with AJAX requests
class ContactForm extends Component {
  static getInitialState() {
    const isLoggedIn = AuthService.isAuthenticated();

    return {
      author: isLoggedIn ? AuthService.getUsername() : '',
      email: '',
      content: '',

      formHasErrors: false,
      nonFieldErrors: '',
      fieldErrors: {
        author: '',
        email: '',
        content: '',
      },

      isSaving: false,
      savingError: false,
      savingSuccess: false,
    };
  }

  static errorResponseToStateMapper(responseJson) {
    if (!responseJson) { return {}; }

    return {
      formHasErrors: true,
      nonFieldErrors: responseJson.non_field_errors && responseJson.non_field_errors[0],
      fieldErrors: {
        author: responseJson.author && responseJson.author[0],
        email: responseJson.email && responseJson.email[0],
        content: responseJson.content && responseJson.content[0],
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = ContactForm.getInitialState();

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    if (e.target) {
      const formData = new FormData(e.target);

      this.setState({ isSaving: true }, () => {
        fetch(`${API_BASE_URL}/contact/`, {
          method: 'POST',
          body: formData,
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        }).then(FetchHelper.parseJson)
          .then((response) => {
            if (response.ok) {
              this.setState({
                ...ContactForm.getInitialState(),
                isSaving: false,
                savingSuccess: true,
              });
            } else {
              this.setState(() => ({
                isSaving: false,
                savingError: true,
                ...ContactForm.errorResponseToStateMapper(response.json),
              }));
            }
          }).catch(() => this.setState({ isSaving: false, savingError: true }));
      });
    } else {
      this.setState({ savingError: true });
    }
  }

  render() {
    return (
      <Paper className="ContactForm" zDepth={4}>
        <h2>Kontakt zum Königshaus</h2>
        <p>Hier könnt ihr Fragen oder Anmerkungen an das Royale Paar übermitteln:</p>

        <form onSubmit={this.handleSubmit} noValidate>
          <ContactFormPresentational
            author={this.state.author}
            email={this.state.email}
            content={this.state.content}

            authorError={this.state.fieldErrors.author}
            emailError={this.state.fieldErrors.email}
            contentError={this.state.fieldErrors.content}

            isSaving={this.state.isSaving}
            formHasErrors={this.state.formHasErrors}

            onFieldChange={(field, value) =>
              this.setState({ [field]: value, formHasErrors: false })}
          /><br />

          {this.state.savingError &&
            <Notification
              type={NotificationType.ERROR}
              title="Das hat leider nicht geklappt"
              subtitle={this.state.formHasErrors ? 'Bitte überprüfe Deine Angaben.' : 'Bitte versuche es erneut.'}
            />}

          {this.state.savingSuccess &&
            <Notification
              type={NotificationType.SUCCESS}
              title="Danke für Dein Feedback"
              subtitle="Deine Nachricht wurde an die Poststelle des Königshauses übermittelt."
              disappearAfterMs={5000}
            />}
        </form>
      </Paper>
    );
  }
}

ContactForm.propTypes = {};

export default ContactForm;
