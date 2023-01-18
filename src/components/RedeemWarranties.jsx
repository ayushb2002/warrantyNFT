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
  const [ownedNFT, setOwnedNFT] = useState([]);
  const [owned, setOwned] = useState(0);

  useLayoutEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:5000/users/${address}`
      );
      var data1 = {};
      for(var i=0;i<response.data.ownedTokenId.length;i++)
      {
        data1[i] = response.data.ownedTokenId[i];
      }
      setOwned(Object.keys(data1).length);

      var htmlData1 = []
      for( var [key1, value1] of Object.entries(data1))
      {
        htmlData1.push(
          <tr key={key1}>
            <th>{parseInt(key1)+1}</th>
            <td>{value1}</td>
            <td><button className="badge badge-error" onClick={(e) => clickNFT(e, key1, value1)}>Redeem!</button></td>
          </tr>
        )
      }
      
      setOwnedTokens(htmlData1);

      var data = {};
      for(var i=0;i<response.data.redeemedTokenId.length;i++)
      {
        data[i] = response.data.redeemedTokenId[i];
      }

      var htmlData = []
      for( var [key, value] of Object.entries(data))
      {
        htmlData.push(
          <tr key={key}>
            <th>{parseInt(key)+1}</th>
            <td>{value}</td>
            <td><a href={`https://testnet.rarible.com/token/polygon/0x3258e5b5bc4a442915853338fc925e0bd4976d8c:${value}`} target="_blank"><button className="badge badge-error">View NFT!</button></a></td>
          </tr>
        )
      }

      setOwnedNFT(htmlData);

    })();
  }, []);

  const clickNFT = async (e, itemKey, itemId) => {
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
      if(!tokenURI)
      {
        toast.error('Could not mint the NFT!');
        return;
      }
      const tokenId = await redeemWarranty(address, itemId, tokenURI);
      toast.success(`NFT minted! Token Id - ${tokenId}`);

      const update = await axios.post(`http://localhost:5000/saveNFT`, {
          wallet: address,
          key: parseInt(itemId),
          tokenId: parseInt(tokenId) 
        });   
        
      if(!update.data)
      {
        toast.error('Failed updating the user profile!');
        return;
      }

      setTimeout(() => {
        window.location.href = '/redeem';
      }, 1000);
      
    }catch(e)
    {
      console.log(e);
      toast.error('Could not generate the NFT!');
      return;
    }
    return;
  }

  return (
    <div>
    {connected && (
    <div className="grid grid-cols-2 w-[70vw]">
      <div></div>
      <div className="w-[20vw] badge badge-info ml-20 text-xl my-10 py-5">
      {owned} warranty to be activated
      </div>
      <div className="m-10 col-span-2">
        <span className="text-3xl text-bold underline">Available tokens!</span>
      </div>
      <div className="mx-5 col-span-2">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Item ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ownedTokens}
          </tbody>
        </table>
      </div>
      <div className="m-10 col-span-2">
        <span className="text-3xl text-bold underline">Minted tokens!</span>
        </div>
        <div className="mx-5 col-span-2">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Token ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ownedNFT}
          </tbody>
        </table>
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
