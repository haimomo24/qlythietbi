import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderPage from "./component/home/HeaderPage";
import Sidebar from "./component/home/SiderBar";
import FooterPage from "./component/home/FooterPage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "IT Management System",
  description: "Hệ thống quản lý IT",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col overflow-hidden bg-slate-100 font-sans">
        {/* Header cố định phía trên */}
        <HeaderPage />

        {/* Khung giữa: Sidebar bên trái + Thân bài & Footer bên phải */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <div className="flex-1 flex flex-col overflow-y-auto">
            <main className="flex-1 p-6 bg-slate-50">
              {children}
            </main>

            {/* Footer đẩy xuống đáy nội dung */}
            <FooterPage />
          </div>
        </div>
      </body>
    </html>
  );
}