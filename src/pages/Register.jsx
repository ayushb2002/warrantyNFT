import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Register = () => {

    const [company, setCompany] = useState("");
    const [productId, setProductId] = useState(0);

  return (
    <section>
      <Navbar />
      <div className="hero bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold mb-5">Register a product!</h1>
            <form action="#" className="mt-10">
              <div className="form-control my-6">
                <label className="label">
                  <span className="label-text font-bold">Name of company the product belongs to</span>
                </label>
                <label className="input-group">
                  <span>Company</span>
                  <input
                    type="text"
                    placeholder="ABC"
                    className="input input-bordered"
                  />
                </label>
              </div>

              <div className="form-control my-6">
                <label className="label">
                  <span className="label-text font-bold">Unique Identification code for product</span>
                </label>
                <label className="input-group">
                  <span>Porduct ID</span>
                  <input
                    type="number"
                    placeholder={productId}
                    className="input input-bordered"
                  />
                </label>
              </div>
              
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Register;
