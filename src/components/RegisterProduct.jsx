import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ReactSession } from "react-client-session";
import axios from "axios";

const RegisterProduct = () => {
  ReactSession.setStoreType("localStorage");
  const [company, setCompany] = useState(ReactSession.get("address"));
  const [name, setName] = useState("Washing Machine");
  const [model, setmodel] = useState("GM-550");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));

  const collectData = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:5000/register", {
      type: document.querySelector("#hiddenInp").value,
      name: name,
      model: model,
      description: description,
      manufacturer: company,
      imgUrl: imgUrl
    });
    console.log(response);
    if (response['data'] == true) toast.success("Data received successfully!");
    else toast.error("Could not save your data!");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div className="hero h-[100vh] bg-base-200">
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
                <input
                  type="text"
                  placeholder={company}
                  className="input input-bordered w-[40vh]"
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  disabled
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
                <span className="label-text font-bold">
                  Describe your product effectively
                </span>
              </label>
              <label className="input-group">
                <textarea
                  value={description}
                  className="textarea textarea-bordered h-[20vh] w-[40vh] resize-none"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                > </textarea>
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
