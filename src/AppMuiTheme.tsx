// https://stackoverflow.com/questions/57222924/override-material-ui-button-text
import { createTheme } from "@mui/material/styles";

// Button text to be displayed as coded.
const theme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

export default theme;
