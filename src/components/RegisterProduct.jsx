import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ReactSession } from "react-client-session";
import axios from "axios";

const RegisterProduct = () => {
  ReactSession.setStoreType("localStorage");
  const [company, setCompany] = useState("ABC");
  const [product, setProduct] = useState("Washing Machine");
  const [productId, setProductId] = useState("GM-550");
  const [description, setDescription] = useState("Here goes...");
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));

  const collectData = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:5000/register", {
      type: document.querySelector("#hiddenInp").value,
      name: product,
      model: productId,
      description: description,
      manufacturer: company,
    });
    if (response == true) toast.success("Data received successfully!");
    else toast.error("Could not save your data!");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div className="hero h-[80vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-5">Register a product!</h1>
          <form className="mt-10" onSubmit={collectData} id="registerForm">
            <input type="hidden" name="hidden" value="product" id="hiddenInp" />
            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">
                  Name of company the product belongs to
                </span>
              </label>
              <label className="input-group">
                <span>Company</span>
                <input
                  type="text"
                  placeholder={company}
                  className="input input-bordered"
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">
                  Name of the product
                </span>
              </label>
              <label className="input-group">
                <span>Product</span>
                <input
                  type="text"
                  placeholder={product}
                  className="input input-bordered"
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">
                  Unique Identification code for product
                </span>
              </label>
              <label className="input-group">
                <span>Product ID</span>
                <input
                  type="text"
                  placeholder={productId}
                  className="input input-bordered"
                  onChange={(e) => setProductId(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">
                  Describe your product effectively
                </span>
              </label>
              <label className="input-group">
                <span>Desc</span>
                <input
                  type="text"
                  placeholder={description}
                  className="input input-bordered"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control my-10 w-[25vh]">
              <button
                className="btn btn-outline btn-info"
                type="submit"
                disabled={!connected ? true : false}
              >
                Register a product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterProduct;
