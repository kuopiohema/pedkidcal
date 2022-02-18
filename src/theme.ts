import { createTheme } from "@mui/material/styles";
import { deepPurple, amber, grey } from "@mui/material/colors";

const light = createTheme({
    palette: {
        primary: {
            main: deepPurple[600],
        },
        secondary: {
            main: amber[600],
        },
        background: {
            default: grey[400],
            paper: grey[50]
        },
        mode: 'light',
    },
});

const dark = createTheme({
    palette: {
        primary: {
            main: deepPurple[600],
        },
        secondary: {
            main: amber[600],
        },
        mode: 'dark'
    },
    components: {
        MuiLink: {
            defaultProps: {
                color: 'secondary',
            },
        },
        MuiTextField: {
            defaultProps: {
                color: 'secondary',
            },
        },
        MuiSelect: {
            defaultProps: {
                color: 'secondary',
            },
        },
        MuiInputLabel: {
            defaultProps: {
                color: 'secondary',
            },
        },
    },
});

export { light, dark };