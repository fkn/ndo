import React from 'react';
import PropTypes from 'prop-types';
import history from '../../history';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

const Link = ({ to, children, onClick, ...props }) => {
  const handleClick = event => {
    if (onClick) {
      onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();
    history.push(to);
  };

  return (
    <a href={to} {...props} onClick={handleClick}>
      {children}
    </a>
  );
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

Link.defaultProps = {
  onClick: null,
};

export default Link;
