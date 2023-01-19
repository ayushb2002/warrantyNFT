import React, { useState, useLayoutEffect } from "react";
import { ReactSession } from "react-client-session";
import { toast } from "react-hot-toast";
import axios from "axios";
import { issueRepairRequest } from "../utils/interact";

const Service = () => {

  ReactSession.setStoreType("localStorage");
  const owner = ReactSession.get('address');

  const handleService = async (e) => {
    e.preventDefault();
    const tokenId = document.querySelector('#tokenId').value;
    const response = await issueRepairRequest(tokenId, owner);
    if(!response)
    {
      toast.error('Could not record repair request!');
      return;
    }

    toast.success('Request has been generated! Company will reach out soon!');
    setTimeout(() => {
      window.location.href = '/redeem';
    }, 1000);

  }
  return (
    <div className='grid grid-cols-3 w-[70vw]'>
      <div className='col-span-3 text-center'>
        <span className='text-3xl'>Request Service</span>
      </div>
      <div></div>
      <div className='mt-10'>
        <form onSubmit={handleService}>
          <div className='form-control'>
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
          <div className='form-control text-center mt-5'>
            <label className='text-center'>
            <button className='btn btn-outline btn-warning' type='submit'>Issue a request</button>
            </label>
          </div>
        </form>
      </div>
      <div></div>
    </div>
  )
}

export default Service