import React, { useState } from "react";
import logo from "../img/Metamask.png";
import { ethers } from "ethers";
import { ReactSession } from "react-client-session";
import { toast, Toaster } from "react-hot-toast";

const Navbar = () => {
  ReactSession.setStoreType("localStorage");
  const [loggedIn, isLoggedIn] = useState(false);
  const [address, setAddress] = useState("");

  const metaClick = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setAddress(await signer.getAddress());
    ReactSession.set("address", await signer.getAddress());
    toast.success("Logged in!");
    isLoggedIn(true);
  };

  const logout = (e) => {
    e.preventDefault();
    ReactSession.set("address", null);
    setAddress("");
    isLoggedIn(false);
    toast.success("Logged out!");
  };

  window.onload = (e) => {
    e.preventDefault();
    if (ReactSession.get("address")) {
      setAddress(ReactSession.get("address"));
      isLoggedIn(true);
    }
  };

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl" href="/">
          warrantyNFT
        </a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search…"
              className="input input-bordered"
            />
            <button className="btn btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src={logo} style={{ width: "40px", height: "40px" }} />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            {!loggedIn && (
              <li>
                <a onClick={metaClick}>Connect Wallet</a>
              </li>
            )}

            {loggedIn && (
              <div>
                <li>
                  <a>{`${address.substring(0, 15)}`}...</a>
                </li>
                <li>
                  <a onClick={logout}>Logout</a>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
      <div>
        <Toaster />
      </div>
    </div>
  );
};

export default Navbar;
