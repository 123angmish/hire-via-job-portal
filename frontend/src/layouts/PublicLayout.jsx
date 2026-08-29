import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
