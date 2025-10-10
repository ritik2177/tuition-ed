import "./globals.css";
import { CardNavItem } from "../components/CardNav";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemedCardNav from "@/components/ThemedCardNav";
import Footer from "@/components/footer";

const navItems: CardNavItem[] = [
  {
    label: 'Products',
    bgColor: '#0D0716',
    textColor: '#fff',
    links: [
      { label: 'The Platform', href: '#', ariaLabel: 'Learn about our platform' },
      { label: 'Pricing', href: '#', ariaLabel: 'View our pricing' },
      { label: 'Integrations', href: '#', ariaLabel: 'Explore integrations' },
    ],
  },
  {
    label: 'Solutions',
    bgColor: '#170D27',
    textColor: '#fff',
    links: [
      { label: 'For Startups', href: '#', ariaLabel: 'Solutions for startups' },
      { label: 'For Enterprise', href: '#', ariaLabel: 'Solutions for enterprise' },
      { label: 'Case Studies', href: '#', ariaLabel: 'Read our case studies' },
    ],
  },
  {
    label: 'Resources',
    bgColor: '#271E37',
    textColor: '#fff',
    links: [
      { label: 'Blog', href: '#', ariaLabel: 'Visit our blog' },
      { label: 'Documentation', href: '#', ariaLabel: 'Read our documentation' },
      { label: 'Support', href: '#', ariaLabel: 'Get support' },
    ],
  },
];

const Logo = () => (
  <span className="font-bold text-xl tracking-tight">
    Tuition-ed
  </span>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ThemedCardNav logo={<Logo />} items={navItems} ctaButton={<AnimatedThemeToggler />} />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
