'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React from 'react';

function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const muiTheme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: resolvedTheme === 'dark' ? 'dark' : 'light',
                },
            }),
        [resolvedTheme],
    );

    return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
}

export function AppProviders({ children, ...props }: ThemeProviderProps) {
    return (
        <SessionProvider>
            <NextThemesProvider {...props}><MuiThemeWrapper>{children}</MuiThemeWrapper></NextThemesProvider>
        </SessionProvider>
    );
}