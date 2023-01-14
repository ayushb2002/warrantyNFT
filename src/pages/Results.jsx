import axios from "axios";
import React, { useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ReactSession } from "react-client-session";
import minting from "../utils";
import { toast } from "react-hot-toast";

const Results = () => {
  ReactSession.setStoreType("localStorage");
  const [result, setResult] = useState([]);
  const [wrong, setWrong] = useState(true);
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));
  const { query } = useParams();

  useLayoutEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:5000/product/${query}`
      );
      setResult(response.data);
      if (response.data.length == 0) setWrong(false);
    })();
  }, [query]);

  const mint = async (e) => {
    e.preventDefault();
    const addr = result.map((item) => {
      return item.manufacturer[0].wallet;
    });
    const nft = minting(addr[0], document.querySelector('#expiry').value);
    console.log(nft);
    toast.success('Minted NFT!');
  };

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
                <div className="card w-96 bg-base-100 shadow-xl" key={item._id}>
                  <figure>
                    <img
                      src={item.imgUrl}
                      alt="Shoes"
                      style={{ width: "400px", height: "225px" }}
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">
                      {item.name}
                      <div className="badge badge-secondary">{item.model}</div>
                      <div className="badge badge-info">
                        {item.manufacturer[0].name}{" "}
                      </div>
                    </h2>
                    <p>{item.details}</p>
                    <div className="card-actions justify-end">
                      <button
                        className="btn btn-outline btn-warning"
                        disabled={!connected ? true : false}
                      >
                        <label htmlFor="my-modal">
                        Issue warranty!
                        </label>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">
            Enter warranty period in days!
          </h3>
          <div>
            <form onSubmit={mint}>
              <div className="form-group m-5 flex justify-center">
              <input type="number" placeholder="365" id="expiry" className="input input-bordered input-accent w-full max-w-xs" />
              </div>
              <div className="form-group m-5 flex justify-center">
                <button className="btn btn-outline btn-info" type="submit">Mint NFT!</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
