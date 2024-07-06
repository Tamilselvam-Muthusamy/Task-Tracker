import React from "react";
import Footer from "./footer";
import Navbar from "./header";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      <div className="pt-[80px] px-4 pb-10">{children}</div>
      <Footer />
    </div>
  );
}
