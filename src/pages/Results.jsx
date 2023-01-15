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
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));
  const { query } = useParams();

  const recordBuyerAddress = async (e, itemId) => {
    e.preventDefault();
    const buyerEmail = prompt("Enter buyer's email address!");
    const response = await axios.post(`http://localhost:5000/bookItem`, {
      email: buyerEmail,
      tokenId: itemId
    });

    console.log(response.data);

    if(response.data == true)
      toast.success('Sent to buyer successfully!');
    else
      toast.error('Could not issue warranty!');

    setTimeout(() => {
      window.location.href = '/';
    }, 2000);

  }

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
                    <h2 className="card-title">
                      {item.name} (ID - {item.itemId})
                    </h2>
                    <div className="flex justify-start">
                    <div className="badge badge-secondary w-[10vh] mx-2">
                        {item.model}
                      </div>
                      <div className="badge badge-info mx-2">
                        {item.manufacturer[0].name}{" "}
                      </div>
                      <div className="badge badge-accent mx-2">
                        <p>{item.expiry} days</p>
                      </div>
                    </div>
                    <div className="card-actions justify-end">
                      <div className="mt-5">
                        <button
                          className="btn btn-outline btn-warning"
                          disabled={!connected ? true : false}
                          onClick={(e) => recordBuyerAddress(e, item.itemId)}
                        >
                          Issue warranty!
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
      <Footer />
    </section>
  );
};

export default Results;
