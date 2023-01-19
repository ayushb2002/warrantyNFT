import React, { useState, useLayoutEffect } from "react";
import { ReactSession } from "react-client-session";
import { toast } from "react-hot-toast";
import axios from "axios";

const ExtendWarranty = () => {
  ReactSession.setStoreType("localStorage");
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));
  const [address, setAddress] = useState(ReactSession.get("address"));

  const extendWarrantyForm = (e) => {
    e.preventDefault();

  };

  return (
    <div className="grid grid-cols-3 w-[70vw]">
      <div className="col-span-3 text-center">
        <span className="text-3xl">Extend warranty</span>
      </div>
      <div></div>
      <div className="mt-10">
        <form onSubmit={extendWarrantyForm}>
          <div className="form-control my-5">
            <label className="label">
              <span className="label-text">Token ID</span>
            </label>
            <label className="input-group">
              <input
                type="number"
                placeholder="Your token Id goes here..."
                className="input input-bordered w-[40vw]"
              />
            </label>
          </div>
          <div className="form-control my-5">
            <label className="label">
              <span className="label-text">Extension Desired</span>
            </label>
            <label className="input-group">
              <input
                type="number"
                value="365"
                className="input input-bordered w-[40vw]"
                disabled
              />
            </label>
          </div>
          <div className="form-control my-5">
            <label className="text-center mb-5">
              <span className="label-text text-center">
                Payment per year - Rs. 500
              </span>
            </label>
            <label className="text-center">
              <button className="btn btn-outline btn-error" type="submit">
                Make Payment
              </button>
            </label>
          </div>
        </form>
      </div>
      <div></div>
    </div>
  );
};

export default ExtendWarranty;
