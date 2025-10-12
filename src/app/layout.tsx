import "./globals.css";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { AppProviders } from "@/provider/AppProviders";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Navbar themeToggler={<AnimatedThemeToggler />} />
          <div className="pt-16">
            {children}
          </div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
