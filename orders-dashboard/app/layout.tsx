import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orders Dashboard",
  description: "Internal order operations dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div>
            <span className="eyebrow">Operations</span>
            <h1>Orders Dashboard</h1>
          </div>
          <span className="environment">Internal</span>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
