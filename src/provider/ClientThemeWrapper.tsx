'use client';

import * as React from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export function ClientThemeWrapper({ children }: { children: React.ReactNode }) {
    const muiTheme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: 'dark',
                    background: {
                        default: '#121212', // Near Black
                        paper: '#292e39',   // Dark Slate
                    },
                    text: {
                        primary: '#f2f2f2', // Off-White
                        secondary: '#a3a3a3', // Medium Gray
                    },
                    primary: {
                        main: '#3b82f6', // Vibrant Blue (blue-500)
                    },
                    secondary: {
                        main: '#a3a3a3', // Medium Gray
                    },
                },
            }),
        [],
    );

    return <MuiThemeProvider theme={muiTheme}><CssBaseline />{children}</MuiThemeProvider>;
}