import React, { useState } from "react";
import { ReactSession } from "react-client-session";
import { toast } from "react-hot-toast";
import { issueRepairRequest, returnRepairs } from "../utils/interact";

const Service = () => {
  ReactSession.setStoreType("localStorage");
  const owner = ReactSession.get("address");
  const [tokenId, setTokenId] = useState(0);
  const [listData, setListData] = useState();

  const addDays = (days) => {
    var result = new Date("1970-01-01");
    result.setDate(result.getDate() + days);
    return result;
  };

  const handleService = async (e) => {
    e.preventDefault();
    const _tokenId = document.querySelector("#tokenId").value;
    const response = await issueRepairRequest(_tokenId, owner);
    if (!response) {
      toast.error("Could not record repair request!");
      return;
    }

    toast.success("Request has been generated! Company will reach out soon!");
    setTimeout(() => {
      window.location.href = "/redeem";
    }, 1000);
  };

  const previousRequests = async (e) => {
    e.preventDefault();
    try {
      const prevRequestArr = await returnRepairs(tokenId);
      if(prevRequestArr.length == 0)
      {
        toast.error('No service requests found!');
        return;
      }
      var issueDates = [];
      prevRequestArr.forEach((element) => {
        issueDates.push(addDays(parseInt(element)));
      });

      var htmlData = [];
      var i = 0;
      issueDates.forEach((element) => {
        i += 1;
        htmlData.push(
        <tr key={i}>
          <td>{i}</td>
          <td>{element.toString()}</td>
        </tr>
          );

        setListData(htmlData);
        toast.success('Found your data!');
      });
    } catch (err) {
      console.log(err);
      return;
    }
  };

  return (
    <div className="grid grid-cols-3 w-[70vw]">
      <div className="col-span-3 text-center">
        <span className="text-3xl">Request Service</span>
      </div>
      <div></div>
      <div className="mt-10">
        <form onSubmit={handleService}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Token ID</span>
            </label>
            <label className="input-group">
              <input
                type="number"
                min="1"
                placeholder="Your token Id goes here..."
                className="input input-bordered w-[40vw]"
                id="tokenId"
              />
            </label>
          </div>
          <div className="form-control text-center mt-5">
            <label className="text-center">
              <button className="btn btn-outline btn-warning" type="submit">
                Issue a request
              </button>
            </label>
          </div>
        </form>
      </div>
      <div></div>
      <div></div>
      <div className="mt-10">
        <form onSubmit={previousRequests}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Token Id</span>
            </label>
            <label className="input-group">
              <input
                type="number"
                className="input input-bordered w-[40vw]"
                placeholder="Your token Id goes here..."
                onChange={(e) => setTokenId(e.target.value)}
              />
            </label>
          </div>
          <div className="form-control mt-5">
            <label className="text-center">
              <button className="btn btn-outline btn-error" type="submit">
                View previous requests
              </button>
            </label>
          </div>
        </form>
      </div>
      <div></div>
      {tokenId && (
        <div className="overflow-x-auto mt-10 col-span-3">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {listData}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default Service;
