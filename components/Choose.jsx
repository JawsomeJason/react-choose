import React from 'react';
import { oneOf, string } from 'prop-types';
import castArray from 'lodash/castArray';

import withOptions from './withOptions';
import withInput from './withInput';

const SELECT = 'select';
const TEXT = 'text';
const LIST = 'list';
const TOGGLE = 'toggle';

const propTypes = {
  name: string.isRequired,
  type: oneOf([SELECT, TEXT, LIST, TOGGLE]),
  ...withOptions.propTypes,
  ...withInput.propTypes,
};

const defaultProps = {
  type: SELECT,
  ...withOptions.defaultProps,
  ...withInput.defaultProps,
};

const displayName = 'Options';

// combine group label and option label
const combine = ({ label: group }, opts) => 
  opts.map(({ label, ...option }) => ({ label: `${group} - ${label}`, ...option }));

// reducer to flatten a nested list of options
const flatten = (flattened, { options: opts, ...option }) => [
  ...flattened,
  ...(opts ? combine(option, opts) : [option]),
];

// render optgroup or options based on existence of `.options`
const option = ({ disabled, label, options: opts, value }) => opts
  ? <optgroup key={value || label} label={label} disabled={disabled}>{opts.map(option)}</optgroup>
  : <option key={value || label} value={value} disabled={disabled}>{label}</option>;

const field = ({ label, multiple, name, onChange, options: opts, selected, value, ...inputProps }) => (
  <li key={value || label}>
    {opts 
      ? <Fieldset label={label} options={opts} />
      : (
        <label>
          <input {...inputProps} type={multiple ? 'checkbox' : 'radio'} name={name} onChange={onChange} value={value} checked={selected} /> {label}
        </label>
      )
    }
  </li>
)

const Fieldset = ({ label, options: opts }) => (
  <fieldset>
    {label && <legend>{label}</legend>}
    <ul>
      {opts.map(field)}
    </ul>
  </fieldset>
);

const Choose = ({
  name,
  type,
  value,
  multiple,
  onChange,
  options,
  ...props,
}) => {
  switch(type) {
    case SELECT:
      return (
        <select multiple={multiple} onChange={onChange} value={value}>
          {options.map(option)}
        </select>
      );

    case TEXT:
      return (
        <div>
          <input list="list" onChange={onChange} />
          <datalist id="list">
            {options.reduce(flatten, []).map(option)}
          </datalist>
        </div>
      );

    case LIST:
      return <Fieldset options={options} />;

    default:
      return null;
  }
}

Choose.propTypes = propTypes;
Choose.defaultProps = defaultProps;
Choose.displayName = displayName;

export default withOptions(withInput(Choose));