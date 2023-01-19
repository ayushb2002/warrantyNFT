import React, { useState, useLayoutEffect } from "react";
import { ReactSession } from "react-client-session";
import { toast } from "react-hot-toast";
import axios from "axios";
import { returnItemIdFromTokenId, extendWarranty } from "../utils/interact";

const ExtendWarranty = () => {
  ReactSession.setStoreType("localStorage");
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));
  const [address, setAddress] = useState(ReactSession.get("address"));
  const [tokenId, setTokenId] = useState(0);
  const [extension, setExtension] = useState(365);

  const extendWarrantyForm = async (e) => {
    e.preventDefault();
    // Payment API Implemented
    const itemId = await returnItemIdFromTokenId(tokenId);
    if (!itemId) {
      toast.error("Could not find the item requested for!");
      return;
    }

    const response = await axios.post("http://localhost:5000/extendWarranty", {
      itemId: parseInt(itemId),
      tokenId: parseInt(tokenId),
      payment: true,
      extension: parseInt(extension),
    });

    if (!response.data) {
      toast.error(
        "Could not extend the warranty! Your money will be send back within 3 - 4 days!"
      );
      return;
    }

    const txn = await extendWarranty(
      parseInt(tokenId),
      parseInt(extension),
      address
    );

    if (!txn) {
      toast.error(
        "Could not extend the warranty! Your money will be send back within 3 - 4 days!"
      );
      return;
    }

    toast.success("Succesfully extended the warranty period!");

    setTimeout(() => {
      window.location.href = "/redeem";
    }, 1000);
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
                onChange={(e) => setTokenId(e.target.value)}
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
                value={extension}
                className="input input-bordered w-[40vw]"
                disabled
                onChange={(e) => setExtension(e.target.value)}
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
              <button
                className="btn btn-outline btn-error"
                type="submit"
                disabled={connected ? false : true}
              >
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
