'use client';

import * as React from 'react';
import { SessionProvider } from 'next-auth/react';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { ClientThemeWrapper } from './ClientThemeWrapper';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
            <SessionProvider>
                <ClientThemeWrapper>{children}</ClientThemeWrapper>
            </SessionProvider>
        </NextAppDirEmotionCacheProvider>
    );
}