import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    info: { main: "#1975d2" },
    primary: { main: "#1a237e" },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 410,
      md: 640,
      lg: 900,
      xl: 1200,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        color: "info",
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
      styleOverrides: {
        root: {
          padding: "6px 8px",
          borderRadius: "12px",
          "&:focus-visible": {
            outline: "3px solid rgba(0, 127, 255, 0.5)",
            outlineOffset: "2px",
          },
        },
      },
    },
  },
});

theme.typography.h1 = {
  ...theme.typography.h1,
  fontWeight: 600,
  fontSize: "1.8rem",
  [theme.breakpoints.up("sm")]: {
    fontSize: "2rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2.3rem",
  },
};

theme.typography.h2 = {
  ...theme.typography.h2,
  fontWeight: 600,
  fontSize: "1.5rem",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.8rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2rem",
  },
};

theme.typography.h3 = {
  ...theme.typography.h3,
  fontWeight: 500,
  fontSize: "1rem",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.1rem",
  },
};

export default theme;
