import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ReactSession } from "react-client-session";
import axios from "axios";
import { registerProductToBlockchain } from "../utils/interact";

const RegisterProduct = () => {
  ReactSession.setStoreType("localStorage");
  const [company, setCompany] = useState(ReactSession.get("address"));
  const [companyId, setCompanyId] = useState("0");
  const [name, setName] = useState("Washing Machine");
  const [model, setmodel] = useState("GM-550");
  const [expiry, setExpiry] = useState(0);
  const [imgUrl, setImgUrl] = useState("Ideally 400px x 225px");
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));

  const collectData = async (e) => {
    e.preventDefault();
    try {
      var itemId = await registerProductToBlockchain(companyId, expiry);
      if (itemId) {
        itemId = itemId.toNumber();
        const response = await axios.post("http://localhost:5000/register", {
          type: document.querySelector("#hiddenInp").value,
          itemId: itemId,
          name: name,
          model: model,
          expiry: expiry,
          manufacturer: company,
          imgUrl: imgUrl,
        });
        console.log(response);
        if (response["data"] == true)
          toast.success("Data received successfully!");
        else toast.error("Could not save your data!");
        setTimeout(() => {
          window.location.href = "/register";
        }, 1000);
      } else {
        toast.error("Could not create the item!");
      }
    } catch (err) {
      console.log(err);
      toast.error('Operation failed!');
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-5">Register a product!</h1>
          <form className="mt-10" onSubmit={collectData} id="registerForm">
            <input type="hidden" name="hidden" value="product" id="hiddenInp" />
            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">
                  Company the product belongs to
                </span>
              </label>
              <label className="input-group">
                <span>Metamask</span>
                <input
                  type="text"
                  placeholder={company}
                  className="input input-bordered w-[40vh]"
                  required
                  disabled
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

            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">
                  Name of the product
                </span>
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
                <span className="label-text font-bold">
                  Unique Identification code for product
                </span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder={model}
                  className="input input-bordered w-[40vh]"
                  onChange={(e) => setmodel(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">
                  Url for product image
                </span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder={imgUrl}
                  className="input input-bordered w-[40vh]"
                  onChange={(e) => setImgUrl(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">Expiry Period</span>
              </label>
              <label className="input-group">
                <input
                  type="number"
                  placeholder={expiry}
                  className="input input-bordered w-[40vh]"
                  onChange={(e) => setExpiry(e.target.value)}
                  min="0"
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
