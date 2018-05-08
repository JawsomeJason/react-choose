/** provides consistent option/value properties to any component */

import React, { Component } from "react";
import { arrayOf, shape, oneOfType, func, bool, string } from "prop-types";
import castArray from 'lodash/castArray';
import union from 'lodash/union';
import difference from 'lodash/difference';

import withOptions, { addOptionContext } from './withOptions';

// generates a display name for each HoC usage
const getDisplayName = Augmented => Augmented.displayName || Augmented.name || "Component";

// these are the props to expect from any augmented component
const PROP_TYPES = {
  options: withOptions.propTypes.options,
  onChange: func,
  value: oneOfType([arrayOf(string), string]),
};

const DEFAULT_PROPS = {
  onChange: (/* e, value */) => {},
};

const NOOP = () => {}

const includes = (values, val) => castArray(values).indexOf(val) !== -1;


const getInitialState = ({ value, multiple }) => ({
  value: multiple ? castArray(value || []) : (value || ''),
});

const applyDOMValue = (current, { type, value, selectedOptions, checked }) => {
  switch(type) {
    case 'select-multiple':
      return [...selectedOptions].map(({ value }) => value);
    case 'checkbox':
      return (checked ? union : difference)(current, [value]);

    case 'select-one':
    case 'text':
    case 'radio':
    default:
      return value;
  }
}

/**
 * Higher-order compositor for components with options/choices.
 * This ensures the same props and behavior between different input components.
 */
const withInput = ComponentToAugment =>
  class WithInput extends Component {
    static propTypes = {
      ...(ComponentToAugment.propTypes || {}),
      ...PROP_TYPES
    };

    static defaultProps = {
      ...(ComponentToAugment.defaultProps || {}),
      ...DEFAULT_PROPS
    };

    static displayName = `withInput(${getDisplayName(ComponentToAugment)})`;

    state = getInitialState(this.props);

    /** handle select/unselect of an item */
    handleChange = (e = {}) => {
      const { target = {} } = e;
      const { onChange } = this.props;
      const { value } = this.state;

      const next = applyDOMValue(value, target);

      console.log({ value, next });

      this.setState({ value: next });
      onChange(e, next);
    };

    /** Allow `open` to be controlled by ancestor */
    componentWillReceiveProps(nextProps) {
      const { value: now } = this.props;
      const { value: next, multiple } = nextProps;
      
      // quick check for `multiple` type requirements
      const isMultipleValues = Array.isArray(next);
      if(multiple !== isMultipleValues) {
        console.error(`value ${multiple ? 'must' : 'must not'} be multiple`);
      }

      if (now !== next) {
        this.setState({ value: next });
      }
    }

    render() {
      const { options } = this.props;
      const { value } = this.state;

      const withInputProps = props => ({ ...props, onChange: this.handleChange, ...(props.options ? {} : { selected: includes(value, props.value) }) });
      const withInputContext = addOptionContext(withInputProps);

      return (
        <ComponentToAugment
          {...this.props}
          {...this.state}
          options={options && options.reduce(withInputContext, [])}
          onChange={this.handleChange}
        />
      );
    }
  };

withInput.propTypes = PROP_TYPES;
withInput.defaultProps = DEFAULT_PROPS;

export default withInput;