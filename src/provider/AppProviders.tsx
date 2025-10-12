'use client';

import * as React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { ClientThemeWrapper } from './ClientThemeWrapper';

export function AppProviders({ children, ...props }: ThemeProviderProps) {
    return (
        <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
            <SessionProvider>
                <NextThemesProvider {...props}>
                    <ClientThemeWrapper>
                        {children}
                    </ClientThemeWrapper>
                </NextThemesProvider>
            </SessionProvider>
        </NextAppDirEmotionCacheProvider>
    );
}