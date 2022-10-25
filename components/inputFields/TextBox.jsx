import { InputBase } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

const TextInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    position: "relative",
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: "4px",
    width: "auto",
    padding: "20px 10px",
    flexGrow: 1,
  },
  "& .MuiInputBase-input:focus": {
    border: `1px solid ${alpha(theme.palette.secondary.main, 1)}!important`,
    flexGrow: 1,
  },
}));

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
      className={className}
      sx={{ display: "flex" }}
      inputProps={inputProps}
      onKeyPress={onKeyPress}
      error
    />
  );
};

export default TextBox;
