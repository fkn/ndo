import React from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

const IconButton = ({ onClick, glyph, ...rest }) => (
  <Button onClick={onClick} {...rest}>
    <Glyphicon glyph={glyph} />
  </Button>
);

IconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  glyph: PropTypes.string.isRequired,
};

export default IconButton;
