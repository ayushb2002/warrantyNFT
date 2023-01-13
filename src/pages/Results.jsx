import axios from "axios";
import React, { useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Results = () => {
  const [result, setResult] = useState([]);
  const [wrong, setWrong] = useState(true);
  const { query } = useParams();

  useLayoutEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:5000/product/${query}`
      );
      setResult(response.data);
      if(response.data.length == 0)
        setWrong(false);
    })();
  }, [query]);

  return (
    <section>
      <Navbar />
      <div className="min-h-screen bg-base-200">
        {!wrong && (
          <div className="flex justify-center pt-10">
            <span className="text-4xl fw-bold">No results found for {query} !</span>
          </div>
        )}
        {wrong && (
          <div className="flex justify-flex-start px-10 pt-10">
            {result.map((item) => {
              return (
                <div className="card w-96 bg-base-100 shadow-xl" key={item._id}>
                  {console.log(item)}
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
                      <button className="btn btn-outline btn-warning">Issue warranty!</button>
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
