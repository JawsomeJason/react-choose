/** provides consistent option/value properties to any component */

import React, { Component } from "react";
import { arrayOf, shape, oneOfType, func, bool, string } from "prop-types";
import castArray from 'lodash/castArray';

// generates a display name for each HoC usage
const getDisplayName = Augmented => Augmented.displayName || Augmented.name || "Component";

const OPTION_TYPE = {
  label: string.isRequired,
  value: string.isRequired,
  name: string,
  selected: bool,
  disabled: string,
};

const OPTGROUP_TYPE = {
  label: string.isRequired,
  name: string,
  options: arrayOf(shape(OPTION_TYPE)).isRequired,
};

// these are the props to expect from any augmented component
const PROP_TYPES = {
  options: arrayOf(oneOfType([ 
    shape(OPTION_TYPE), 
    shape(OPTGROUP_TYPE) 
  ])).isRequired,
  onChange: func,
  multiple: bool,
  value: oneOfType([arrayOf(string), string]),
};

const DEFAULT_PROPS = {
  multiple: false,
  onChange: (/* e, value */) => {},
};

const NOOP = () => {}

const includes = (values, val) => castArray(values).indexOf(val) !== -1;

/** returns an options reducer that adds contextual props like input name and current selected state */
export const addOptionContext = (context = NOOP) => {
  const reducer = (current, { ...props }) => [
    ...current,
    {
      // include original props
      ...props,
      // add contextual props
      ...context(props),
      // if there are child options, add context to them as well
      ...(props.options ? { options: props.options.reduce(reducer, []) } : {}),
    }
  ]

  return reducer;
}

const getInitialState = ({ value, multiple }) => ({
  value: multiple ? castArray(value || []) : (value || ''),
});

/**
 * Higher-order compositor for components with options/choices.
 * This ensures the same props and behavior between different input components.
 */
const withOptions = ComponentToAugment =>
  class WithOptions extends Component {
    static propTypes = {
      ...(ComponentToAugment.propTypes || {}),
      ...PROP_TYPES
    };

    static defaultProps = {
      ...(ComponentToAugment.defaultProps || {}),
      ...DEFAULT_PROPS
    };

    static displayName = `withOptions(${getDisplayName(ComponentToAugment)})`;

    state = getInitialState(this.props);

    render() {
      const { name, multiple } = this.props;
      const { value } = this.state;
      const withOptionProps = addOptionContext(props => ({ ...props, name, multiple }));
      const options = this.props.options.reduce(withOptionProps, []);

      const overrides = {
        options,
      };

      return (
        <ComponentToAugment
          {...this.props}
          {...this.state}
          options={options}
        />
      );
    }
  };

withOptions.propTypes = PROP_TYPES;
withOptions.defaultProps = DEFAULT_PROPS;

export default withOptions;