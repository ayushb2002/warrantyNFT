import axios from "axios";
import React, { useState, useLayoutEffect } from "react";
import { ReactSession } from "react-client-session";
import { toast } from "react-hot-toast";
import { mintNFT, redeemWarranty } from "../utils/interact";

const RedeemWarranties = () => {
  ReactSession.setStoreType("localStorage");
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));
  const [address, setAddress] = useState(ReactSession.get("address"));
  const [ownedTokens, setOwnedTokens] = useState([]);
  const [owned, setOwned] = useState(0);

  useLayoutEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:5000/users/${address}`
      );
      var data = {};
      for(var i=0;i<response.data.ownedTokenId.length;i++)
      {
        data[i] = response.data.ownedTokenId[i];
      }
      setOwned(Object.keys(data).length);

      var htmlData = []
      for( var [key, value] of Object.entries(data))
      {
        htmlData.push(
          <tr key={key}>
            <th>{parseInt(key)+1}</th>
            <td>{value}</td>
            <td><button className="badge badge-error" onClick={(e) => clickNFT(e, value)}>Redeem!</button></td>
          </tr>
        )
      }
      
      setOwnedTokens(htmlData);
    })();
  }, []);

  const clickNFT = async (e, itemId) => {
    e.preventDefault();
    try{
      const response = await axios.get(
        `http://localhost:5000/item/${itemId}`
      );
      if(!response)
      {
        toast.error('Could not find the item!');
        return;
      }

      const tokenURI = await mintNFT(response.data.imgUrl, response.data.name, response.data.model);
      const tokenId = await redeemWarranty(address, itemId, tokenURI);
      
      console.log(tokenURI);
      toast.success(`NFT minted! Token Id - ${tokenId}`);
    }catch(e)
    {
      console.log(e);
      toast.error('Could not generate the NFT!');
    }
  }

  return (
    <div>
    {connected && (
    <div className="flex">
      <div className="mx-5">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Token ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ownedTokens}
          </tbody>
        </table>
      </div>
      <div className="w-[20vw] badge badge-info ml-20 text-xl py-5">
      {owned} warranty to be activated
      </div>
    </div>
    )}
    {!connected && (
      <div>Log in to access the page!</div>
    )}
  </div>
  );
};

export default RedeemWarranties;
