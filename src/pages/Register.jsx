import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import RegisterProduct from "../components/RegisterProduct";
import RegisterCompany from "../components/RegisterCompany";

const Register = () => {

  const [sw, setSw] = useState(true);

  const companyClick = (e) => {
    e.preventDefault();
    setSw(true);
  }

  const productClick = (e) => {
    e.preventDefault();
    setSw(false);
  }

  return (
    <section>
      <Navbar />
    <div className="bg-base-200 flex justify-center py-5">
      <button className="btn btn-outline btn-warning mx-4" onClick={companyClick} >Register company</button>
      <button className="btn btn-outline btn-warning mx-4" onClick={productClick} >Register product</button>
    </div>
      {sw && <RegisterCompany />}
      {!sw && <RegisterProduct />}
      <Footer />
    </section>
  );
};

export default Register;
