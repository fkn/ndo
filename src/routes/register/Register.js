/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonToolbar,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  FormGroup,
  Button,
  PageHeader,
  HelpBlock,
  ControlLabel,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Register.css';

class Register extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  state = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  validatePassword() {
    const { password, confirmPassword } = this.state;
    if (!password.length && !confirmPassword.length) return null;
    return password === confirmPassword ? 'success' : 'error';
  }

  validateEmail() {
    const { email } = this.state;
    if (!email.length) return null;
    return /^[a-zA-Z0-9+.\-_]+@[a-zA-Z0-9+.\-_]+$/.test(email)
      ? 'success'
      : 'error';
  }

  render() {
    const { title } = this.props;
    const { email, password, confirmPassword } = this.state;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <PageHeader>{title}</PageHeader>
          <form action="/register" method="post">
            <FormGroup controlId="email" validationState={this.validateEmail()}>
              <ControlLabel>Email address</ControlLabel>
              <FormControl
                required
                onChange={this.handleChange}
                type="email"
                placeholder="email@example.com"
                name="email"
                autoFocus
                value={email}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup
              controlId="password"
              validationState={this.validatePassword()}
            >
              <ControlLabel>Password</ControlLabel>
              <FormControl
                required
                minLength={6}
                onChange={this.handleChange}
                type="password"
                name="password"
                value={password}
              />
              <HelpBlock>Make sure it`s at least 6 characters.</HelpBlock>
            </FormGroup>
            <FormGroup
              controlId="confirmPassword"
              validationState={this.validatePassword()}
            >
              <ControlLabel>Repeat password</ControlLabel>
              <FormControl
                required
                minLength={6}
                onChange={this.handleChange}
                type="password"
                value={confirmPassword}
                name="confirmPassword"
              />
              <HelpBlock>Passwords must match</HelpBlock>
            </FormGroup>
            <FormGroup controlId="username">
              <ControlLabel>Username</ControlLabel>
              <FormControl
                type="text"
                name="name"
                placeholder="pick username"
              />
            </FormGroup>
            <FormGroup controlId="gender">
              <ControlLabel>Gender</ControlLabel>
              <ButtonToolbar>
                <ToggleButtonGroup type="radio" name="gender">
                  <ToggleButton value="male">Male</ToggleButton>
                  <ToggleButton value="female">Female</ToggleButton>
                </ToggleButtonGroup>
              </ButtonToolbar>
            </FormGroup>
            <Button
              bsStyle="primary"
              bsSize="large"
              type="submit"
              disabled={
                this.validateEmail() === 'error' ||
                this.validatePassword() === 'error'
              }
            >
              Sign up
            </Button>
            <HelpBlock>
              Already have an account?
              <Button bsStyle="link" href="/login">
                Log in
              </Button>
            </HelpBlock>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Register);
