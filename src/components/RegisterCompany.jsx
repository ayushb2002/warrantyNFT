import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ReactSession } from "react-client-session";
import axios from "axios";

const RegisterProduct = () => {
  ReactSession.setStoreType("localStorage");
  const [company, setCompany] = useState("ABC");
  const [address, setAddress] = useState(ReactSession.get("address"));
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));

  const collectData = async (e) => {
    e.preventDefault();
    if (company == "ABC" || address == "")
      toast.error("Invalid data submitted!");
    else {
      const response = await axios.post("http://localhost:5000/register", {
        type: document.querySelector("#hiddenInp").value,
        name: company,
        wallet: address,
      });
      if (response == true) toast.success("Data received successfully!");
      else toast.error("Could not save your data!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };

  return (
    <div className="hero h-[80vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-5 w-100">Register a company!</h1>
          <form className="mt-10" onSubmit={collectData} id="registerForm">
            <input type="hidden" name="hidden" value="company" id="hiddenInp" />
            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">Name of company</span>
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
                <span className="label-text font-bold">Wallet Address</span>
              </label>
              <label className="input-group">
                <span>Metamask</span>
                <input
                  type="text"
                  value={address}
                  className="input input-bordered"
                  onChange={(e) => setAddress(e.target.value)}
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
                Register company
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterProduct;
