import axios from "axios";
import React, { useState, useLayoutEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ReactSession } from "react-client-session";
import { toast } from "react-hot-toast";
import RedeemWarranties from "../components/RedeemWarranties";
import ExtendWarranty from "../components/ExtendWarranty";
import Service from "../components/Service";

const Redeem = () => {
  ReactSession.setStoreType("localStorage");
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));
  const [display, setDisplay] = useState(false);
  const [address, setAddress] = useState(ReactSession.get("address"));
  const [view, setView] = useState(0);

  useLayoutEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:5000/users/${address}`
      );
      if (response.data != "") setDisplay(true);
    })();
  }, []);

  const setViewFn = (e, i) => {
    e.preventDefault();
    setView(i);

  }

  return (
    <section className="bg-base-200">
      <Navbar />
      <div className="min-h-[90vh]">
        {display && (
          <div className="max-w-md flex justify-flex-start my-10 px-10 min-h-screen">
            <div>
              <ul className="menu bg-base-100 w-56">
                <li>
                  <a className={view==0?'active':''} onClick={(e) => setViewFn(e, 0)}>
                    Redeem warranty
                  </a>
                </li>
                <li>
                  <a className={view==1?'active':''} onClick={(e) => setViewFn(e, 1)}>Extend warranty</a>
                </li>
                <li>
                  <a className={view==2?'active':''} onClick={(e) => setViewFn(e, 2)}>Request service</a>
                </li>
              </ul>
            </div>
            <div className="px-10 w-max">
              {view == 0 && <div>
                <RedeemWarranties />
                </div>}
              {view == 1 && <div> 
                <ExtendWarranty />
                </div>}
              {view == 2 && <div> 
                <Service />
                </div>}
            </div>
          </div>
        )}
        {!display && (
          <div className="text-center">
            <span className="text-xl mt-10">Log in to view your data!</span>
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
};

export default Redeem;
