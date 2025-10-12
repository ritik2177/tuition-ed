'use client';

import * as React from 'react';
import { SessionProvider } from 'next-auth/react';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { ClientThemeWrapper } from './ClientThemeWrapper';
import { UIProvider } from './UIProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
            <SessionProvider>
                <UIProvider>
                    <ClientThemeWrapper>{children}</ClientThemeWrapper>
                </UIProvider>
            </SessionProvider>
        </NextAppDirEmotionCacheProvider>
    );
}