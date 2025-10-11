"use client";

import { useEffect, useState } from "react";
import CardNav, { CardNavProps } from "./CardNav";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

export default function ThemedCardNav(props: CardNavProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navProps: CardNavProps = {
    ...props,
    loginButton: <button className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">Login</button>,
    themeChanger: isMounted ? <AnimatedThemeToggler /> : <div className="w-9 h-9" />,
  };

  return <CardNav {...navProps} />;
}