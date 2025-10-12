'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export function ClientThemeWrapper({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const muiTheme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: resolvedTheme === 'dark' ? 'dark' : 'light',
                },
            }),
        [resolvedTheme],
    );

    if (!mounted) {
        return null; // Or a loading spinner
    }

    return <MuiThemeProvider theme={muiTheme}><CssBaseline />{children}</MuiThemeProvider>;
}