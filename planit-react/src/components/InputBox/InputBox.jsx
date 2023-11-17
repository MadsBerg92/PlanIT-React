import React from "react";

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
