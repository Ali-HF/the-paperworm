import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "The Paperworm — Books, slightly gnawed at the edges",
  description:
    "An independent online bookstore. Browse fiction, mystery, sci-fi, fantasy, romance, horror, poetry, and non-fiction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
