import React, { Component } from 'react';
import ContactFormPresentational from './ContactFormDisplay';
import { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Notification, { NotificationType } from '../Notification';

import './ContactForm.css';
import { Paper } from "material-ui";

class ContactForm extends Component {
  static getInitialState() {
    return {
      author: '',
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

  static userErrorResponseToState(responseJson) {
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

    this.setState({ isSaving: true }, () => {
      const payload = {
        author: this.state.author,
        email: this.state.email,
        content: this.state.content,
      };

      fetch(`${API_BASE_URL}/contact/`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'content-type': 'application/json' },
      }).then(FetchHelper.parseJson)
        .then((response) => {
          if (response.ok) {
            this.setState({ isSaving: false, savingSuccess: true });
          } else {
            this.setState(() => ({
              isSaving: false,
              savingError: true,
              ...ContactForm.errorResponseToStateMapper(response.json),
            }));
          }
        }).catch(() => this.setState({ isSaving: false, savingError: true }));
    });
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

            onFieldChange={(field, value) => this.setState({ [field]: value })}
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
