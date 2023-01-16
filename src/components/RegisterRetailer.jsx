import React, { useLayoutEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ReactSession } from "react-client-session";
import { registerCompany } from "../utils/interact";
import axios from "axios";

const RegisterRetailer = () => {
  ReactSession.setStoreType("localStorage");
  const [name, setName] = useState("");
  const [address, setAddress] = useState(ReactSession.get("address"));
  const [retailerAddress, setRetailerAddress] = useState("0x...");
  const [companyId, setCompanyId] = useState("0");
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));

  const collectData = async (e) => {
    e.preventDefault();

    try {
      const isCompany = await axios.get(
        `http://localhost:5000/isCompany/${address}`
      );
      if (!isCompany.data) {
        toast.error("Only the company can register the retailer!");
        return;
      }

      const response = await axios.post("http://localhost:5000/register", {
        type: document.querySelector("#hiddenInp").value,
        name: name,
        wallet: retailerAddress,
        companyId: parseInt(companyId),
        companyAddress: address
      });
      if (response["data"] == true)
        toast.success(`Data received successfully!`);
      else toast.error("Could not save your data!");
      setTimeout(() => {
        window.location.href = "/register";
      }, 1000);
    } catch (err) {
      console.log(err);
      toast.error('Could not register the retailer!');
    }
  };

  return (
    <div className="hero h-[80vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-5 w-100">
            Register as retailer!
          </h1>

          <form className="mt-10" onSubmit={collectData} id="registerForm">
            <input
              type="hidden"
              name="hidden"
              value="retailer"
              id="hiddenInp"
            />

            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">Retailer's Wallet Address</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder={retailerAddress}
                  className="input input-bordered w-[40vh]"
                  onChange={(e) => setRetailerAddress(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">Name</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder={name}
                  className="input input-bordered w-[40vh]"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">Company ID</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder={companyId}
                  className="input input-bordered w-[40vh]"
                  onChange={(e) => setCompanyId(e.target.value)}
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
                Register retailer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterRetailer;
