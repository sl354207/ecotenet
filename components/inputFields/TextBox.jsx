import { OutlinedInput } from "@mui/material";

const TextBox = ({
  id,
  handleChange,
  defaultValue,
  placeHolder,
  rows,
  autoFocus,
  multiline,
  inputProps,
  name,
  onKeyPress,
  error,
}) => {
  return (
    <OutlinedInput
      defaultValue={defaultValue}
      placeholder={placeHolder}
      id={id}
      name={name}
      autoFocus={autoFocus}
      onChange={handleChange}
      multiline={multiline}
      minRows={rows}
      inputProps={inputProps}
      onKeyPress={onKeyPress}
      color="secondary"
      error={error}
    />
  );
};

export default TextBox;
