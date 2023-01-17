import axios from "axios";
import React, { useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ReactSession } from "react-client-session";
import { toast } from "react-hot-toast";

const Results = () => {
  ReactSession.setStoreType("localStorage");
  const [result, setResult] = useState([]);
  const [wrong, setWrong] = useState(true);
  const [itemId, setItemId] = useState(0);
  const [address, setAddress] = useState(ReactSession.get('address'));
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));
  const { query } = useParams();

  const sendTokenToBuyer = async (e) => {
    e.preventDefault();
    const buyerEmail = document.querySelector("#buyerEmail").value;
    if (buyerEmail == "" || buyerEmail == null) {
      toast.error("Email address cannot be empty!");
      return;
    } else {
      try {
        const isRetailer = await axios.get(`http://localhost:5000/isRetailer/${address}`);
        if(!isRetailer.data)
        {
          toast.error('The issuer must be a retailer!');
          return;
        }

        const response = await axios.post(`http://localhost:5000/bookItem`, {
          email: buyerEmail,
          tokenId: itemId,
        });

        if (response.data == true) toast.success("Sent to buyer successfully!");
        else toast.error("Could not issue warranty!");

        setTimeout(() => {
          window.location.href = `/result/${query}`;
        }, 2000);
      } catch (err) {
        console.log(err);
        toast.error("No data received!");
        return;
      }
    }
  };

  useLayoutEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:5000/product/${query}`
      );
      setResult(response.data);
      if (response.data.length == 0) setWrong(false);
    })();
  }, [query]);

  return (
    <section>
      <Navbar />
      <div className="min-h-screen bg-base-200">
        {!wrong && (
          <div className="flex justify-center pt-10">
            <span className="text-4xl fw-bold">
              No results found for {query} !
            </span>
          </div>
        )}
        {wrong && (
          <div className="flex justify-flex-start px-10 pt-10">
            {result.map((item) => {
              return (
                <div
                  className="card w-96 bg-base-100 shadow-xl mx-5"
                  key={item.itemId}
                >
                  <figure>
                    <img
                      src={item.imgUrl}
                      alt="Shoes"
                      style={{ width: "400px", height: "225px" }}
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title mb-2 text-3xl">{item.name}</h2>
                    <div className="flex justify-start">
                      <div className="badge badge-secondary w-[15vh] text-center mx-2">
                        {item.model}
                      </div>
                      <div className="badge badge-info w-[15vh] text-center mx-2">
                        {item.manufacturer[0].name}{" "}
                      </div>
                      <div className="badge badge-accent w-[15vh] text-center mx-2">
                        <p>{item.expiry} days</p>
                      </div>
                    </div>
                    <div className="card-actions justify-end">
                      <div className="mt-5">
                        <button
                          className="btn btn-outline btn-warning"
                          disabled={!connected ? true : false}
                        >
                          <label
                            htmlFor="my-modal"
                            className="text-[0.8rem]"
                            onClick={() => setItemId(item.itemId)}
                          >
                            Issue warranty!
                          </label>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg">Fill in the details -</h3>
          <div>
            <div className="form-control my-5">
              <label htmlFor="buyerEmail">Buyer's email address</label>
              <input
                type="text"
                id="buyerEmail"
                name="buyerEmail"
                className="input input-bordered"
              />
            </div>
          </div>
          <div className="modal-action">
            <label
              htmlFor="my-modal"
              className="btn btn-outline"
              onClick={sendTokenToBuyer}
            >
              Finish!
            </label>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Results;
