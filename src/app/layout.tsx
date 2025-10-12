import "./globals.css";
import { AppProviders } from "@/provider/AppProviders";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body>
        <AppProviders><Navbar />
        <div className="pt-16">{children}</div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
