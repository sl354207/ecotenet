import { InputBase } from "@material-ui/core";
import { alpha, withStyles } from "@material-ui/core/styles";

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
  inputProps,
  name,
}) => {
  return (
    <TextInput
      defaultValue={defaultValue}
      placeholder={placeHolder}
      id={id}
      name={name}
      autoFocus={autoFocus}
      onChange={handleChange}
      multiline
      minRows={rows}
      className={className}
      inputProps={inputProps}
      error
    />
  );
};

export default TextBox;
