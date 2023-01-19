import axios from "axios";
import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ReactSession } from "react-client-session";
import { toast } from "react-hot-toast";
import { sellNFT } from "../utils/interact";

const SellProduct = () => {
  ReactSession.setStoreType("localStorage");
  const [address, setAddress] = useState(ReactSession.get("address"));
  const [buyerAddress, setBuyerAddress] = useState('');
  const [connected, setConnected] = useState(ReactSession.get("loggedIn"));
  const [tokenId, setTokenId] = useState(0);

  const collectData = async (e) => {
    e.preventDefault();
    const response = await axios.post(`http://localhost:5000/soldNFT`,{
    sellerWallet: address,
    buyerWallet: buyerAddress,
    tokenId: parseInt(tokenId)
    });

    if(!response.data)
    {
      toast.error('Could not register the transfer!');
      return;
    }

    const txn = await sellNFT(address, buyerAddress, tokenId);
    if(!txn)
    {
        toast.error('Token ID does not belong to the user or the address of buyer is incorrect!');
        return;
    }

    toast.success(`Transferred the NFT to ${buyerAddress.substring(0, 7)}... successfully!`);
    setTimeout(() => {
      window.location.href = '/sellProduct';
    }, 1000);
  }
  return (
    <section>
      <Navbar />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-5 w-100">Sell your product!</h1>
          <form className="mt-10" onSubmit={collectData} id="registerForm">
            <input type="hidden" name="hidden" value="company" id="hiddenInp" />
            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">Enter your product ID</span>
              </label>
              <label className="input-group">
                <span>Token</span>
                <input
                  type="number"
                  placeholder={tokenId}
                  className="input input-bordered w-[40vh]"
                  onChange={(e) => setTokenId(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-bold">Wallet Address of Buyer</span>
              </label>
              <label className="input-group">
                <span>Metamask</span>
                <input
                  type="text"
                  placeholder="Buyer's wallet address..."
                  className="input input-bordered w-[40vh]"
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control my-10 text-center">
                <label className="text-center">
              <button
                className="btn btn-outline btn-info"
                type="submit"
                disabled={!connected ? true : false}
              >
                Sell NFT
              </button>
              </label>
            </div>
          </form>

          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default SellProduct;
