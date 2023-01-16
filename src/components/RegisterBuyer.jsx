import React, { useLayoutEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ReactSession } from "react-client-session";
import axios from "axios";

const RegisterBuyer = () => {
  ReactSession.setStoreType("localStorage");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(ReactSession.get("address"));
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));
  const [display, setDisplay] = useState(false);
  useLayoutEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:5000/users/${address}`
      );
      if (response.data != "") setDisplay(true);
    })();
  }, []);

  const collectData = async (e) => {
    e.preventDefault();

    const response = await axios.post("http://localhost:5000/register", {
      type: document.querySelector("#hiddenInp").value,
      name: name,
      email: email,
      wallet: address,
    });
    if (response["data"] == true) toast.success(`Data received successfully!`);
    else toast.error("Could not save your data!");
    setTimeout(() => {
      window.location.href = "/register";
    }, 1000);
  };

  return (
    <div className="hero h-[80vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-5 w-100">Register as buyer!</h1>
          {!display && (
            <form className="mt-10" onSubmit={collectData} id="registerForm">
              <input type="hidden" name="hidden" value="buyer" id="hiddenInp" />

              <div className="form-control my-6">
                <label className="label">
                  <span className="label-text font-bold">Wallet Address</span>
                </label>
                <label className="input-group">
                  <span>Metamask</span>
                  <input
                    type="text"
                    value={address}
                    className="input input-bordered w-[40vh]"
                    required
                    disabled
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
                  <span className="label-text font-bold">Email Address</span>
                </label>
                <label className="input-group">
                  <input
                    type="email"
                    placeholder={email}
                    className="input input-bordered w-[40vh]"
                    onChange={(e) => setEmail(e.target.value)}
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
                  Register buyer
                </button>
              </div>
            </form>
          )}

          {display && (
            <span>Wallet already registered as buyer!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterBuyer;
