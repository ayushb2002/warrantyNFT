import React, { useState } from "react";
import logo from "../img/Metamask.png";
import { ethers } from "ethers";
import { ReactSession } from "react-client-session";
import { toast, Toaster } from "react-hot-toast";

const Navbar = () => {
  ReactSession.setStoreType("localStorage");
  const [loggedIn, isLoggedIn] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(-1);

  const metaClick = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setAddress(await signer.getAddress());
    setBalance(await signer.getBalance()/(10**18));
    ReactSession.set("address", await signer.getAddress());
    ReactSession.set("balance", await signer.getBalance()/(10**18));
    toast.success("Logged in!");
    isLoggedIn(true);
    ReactSession.set('loggedIn', true);
    window.location.reload();
  };

  const logout = (e) => {
    e.preventDefault();
    ReactSession.set("address", null);
    ReactSession.set("balance", -1);
    ReactSession.set("loggedIn", false);
    setAddress("");
    setBalance(-1)
    isLoggedIn(false);
    toast.success("Logged out!");
    window.location.reload();
  };

  const loadBalance = (e) => {
    e.preventDefault();
    if(ReactSession.get('balance') == -1)
    {
      toast.error('Could not load wallet balance!');
    }
    else
    {
      setBalance(ReactSession.get('balance'));
      toast.success(`Balance - ${balance}`);
    }
  }

  window.onload = (e) => {
    e.preventDefault();
    if (ReactSession.get("address")) {
      setAddress(ReactSession.get("address"));
      setBalance(ReactSession.get("balance"));
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
        <div className="form-control lg:shown xs:visible">
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
                  <a onClick={loadBalance}>{`${address.substring(0, 15)}`}...</a>
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
