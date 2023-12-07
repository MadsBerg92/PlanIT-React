import React from "react";

/**
 * Renders an input box component based on the provided props.
 *
 * @component
 * @param {Object} props - The props for the InputBox component.
 * @param {string} props.type - The type of input box (e.g., "text", "file", "textarea").
 * @param {string} props.id - The id of the input box.
 * @param {string} props.name - The name of the input box.
 * @param {string} props.label - The label for the input box.
 * @param {string} props.placeholder - The placeholder text for the input box.
 * @param {boolean} props.required - Indicates if the input box is required.
 * @param {string} props.value - The value of the input box.
 * @param {function} props.onChange - The event handler for the input box's change event.
 * @param {boolean} props.disabled - Indicates if the input box is disabled.
 * @returns {JSX.Element} The rendered InputBox component.
 */
function InputBox(props) {
  if (props.type === "file") {
    return (
      <>
        <label htmlFor={props.id}>{props.label}</label>
        <input
          type={props.type}
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          required={props.required}
          value={props.value}
          onChange={props.onChange}
        />
        <br />
      </>
    );
  }
  if (props.type === "textarea") {
    return (
      <>
        <label htmlFor={props.id}>{props.label}</label>
        <textarea
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          required={props.required}
          value={props.value}
          onChange={props.onChange}
        />
        <br />
      </>
    );
  }
  return (
    <>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        type={props.type}
        id={props.id}
        name={props.name}
        placeholder={props.placeholder}
        required={props.required}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      <br />
    </>
  );
}

export default InputBox;
