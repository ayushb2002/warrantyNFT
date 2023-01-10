import React from "react";

const Hero = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <img
          src="https://picsum.photos/400/600"
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div className="mx-20">
          <h1 className="text-5xl font-bold">Warranty NFT</h1>
          <p className="py-6">
            A simple solution for managing your warranties via NFTs.
            Buy, sell or renew your warranties easily!
          </p>
          <a href="/register"><button className="btn btn-primary">Get Started</button></a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
