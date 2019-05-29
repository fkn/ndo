import PropTypes from 'prop-types';
import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import Link from '../Link';

function logout(event) {
  event.preventDefault();
  fetch('/logout', { method: 'POST' }).then(
    () => (window.location.pathname = 'login'),
  );
}

function Navigation({ user }) {
  return (
    <Navbar inverse fixedTop defaultExpanded fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">NDO</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavItem
            componentClass={Link}
            eventKey={1}
            to="/courses"
            href="/courses"
          >
            Courses
          </NavItem>
          {user &&
            user.isAdmin && (
              <NavItem
                componentClass={Link}
                eventKey={2}
                to="/users"
                href="/users"
              >
                Users
              </NavItem>
            )}
          {user && (
            <NavItem
              componentClass={Link}
              eventKey={3}
              to="/files"
              href="/files"
            >
              Files
            </NavItem>
          )}
          {user &&
            user.isAdmin && (
              <NavItem
                componentClass={Link}
                eventKey={4}
                to="/tests"
                href="/tests"
              >
                Tests
              </NavItem>
            )}
          {user &&
            user.isAdmin && (
              <NavItem
                componentClass={Link}
                eventKey={5}
                to="/codejudge"
                href="/codejudge"
              >
                Codejudge
              </NavItem>
            )}
        </Nav>
        {user ? (
          <Nav pullRight>
            <NavItem
              componentClass={Link}
              eventKey={1}
              to={`/users/${user.id}`}
              href={`/users/${user.id}`}
            >
              {user.email}
            </NavItem>

            <NavItem eventKey={2} onClick={logout}>
              Log out
            </NavItem>
          </Nav>
        ) : (
          <Nav pullRight>
            <NavItem
              componentClass={Link}
              eventKey={1}
              to="/login"
              href="/login"
            >
              Log in
            </NavItem>
            {/* <NavItem
              componentClass={Link}
              eventKey={2}
              to="/register"
              href="/register"
            >
              Sign up
            </NavItem> */}
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

Navigation.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
};

Navigation.defaultProps = {
  user: null,
};

export default connect(state => ({
  user: state.user,
}))(Navigation);
