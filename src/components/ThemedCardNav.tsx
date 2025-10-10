"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import CardNav, { CardNavProps } from "./CardNav";

export default function ThemedCardNav(props: CardNavProps) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a placeholder or nothing on the server to avoid hydration mismatch
    return <div style={{ height: '60px' }} />;
  }

  const isDark = theme === "dark";

  const navProps: CardNavProps = {
    ...props,
    baseColor: isDark ? "hsl(var(--background) / 0.5)" : "hsl(var(--background) / 0.8)",
    menuColor: isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
  };

  return <CardNav {...navProps} />;
}