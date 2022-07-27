import { InputBase } from "@mui/material";
import { alpha } from "@mui/material/styles";

import withStyles from "@mui/styles/withStyles";

const TextInput = withStyles((theme) => ({
  input: {
    position: "relative",
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    width: "auto",
    padding: "20px 10px",
    flexGrow: 1,
    "&:focus": {
      border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
      flexGrow: 1,
    },
  },
}))(InputBase);

const TextBox = ({
  id,
  handleChange,
  defaultValue,
  placeHolder,
  rows,
  className,
  autoFocus,
  multiline,
  inputProps,
  name,
  onKeyPress,
}) => {
  return (
    <TextInput
      defaultValue={defaultValue}
      placeholder={placeHolder}
      id={id}
      name={name}
      autoFocus={autoFocus}
      onChange={handleChange}
      multiline={multiline}
      minRows={rows}
      // className={className}
      sx={{ display: "contents" }}
      inputProps={inputProps}
      onKeyPress={onKeyPress}
      error
    />
  );
};

export default TextBox;
