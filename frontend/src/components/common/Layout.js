import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
