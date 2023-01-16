import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import RegisterProduct from "../components/RegisterProduct";
import RegisterCompany from "../components/RegisterCompany";
import RegisterBuyer from "../components/RegisterBuyer";
import RegisterRetailer from "../components/RegisterRetailer";

const Register = () => {

  const [sw, setSw] = useState(0);

  const companyClick = (e) => {
    e.preventDefault();
    setSw(0);
  }

  const productClick = (e) => {
    e.preventDefault();
    setSw(1);
  }

  const buyerClick = (e) => {
    e.preventDefault();
    setSw(2);
  }

  const retailerClick = (e) => {
    e.preventDefault();
    setSw(3);
  }

  return (
    <section>
      <Navbar />
    <div className="bg-base-200 flex justify-center py-5">
      <button className="btn btn-outline btn-warning mx-4" onClick={companyClick} >Register company</button>
      <button className="btn btn-outline btn-warning mx-4" onClick={productClick} >Register product</button>
      <button className="btn btn-outline btn-warning mx-4" onClick={buyerClick} >Register buyer</button>
      <button className="btn btn-outline btn-warning mx-4" onClick={retailerClick} >Register retailer</button>
    </div>
      {sw==0 && <RegisterCompany />}
      {sw==1 && <RegisterProduct />}
      {sw==2 && <RegisterBuyer />}
      {sw==3 && <RegisterRetailer />}
      <Footer />
    </section>
  );
};

export default Register;
