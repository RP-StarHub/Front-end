import React from "react";
import StarHubIconFooterbar from "../../../assets/icons/StarHubIconFooterbar.png";

const Footer = () => {
  return (
    <div className="w-full bg-bold flex flex-col md:flex-row justify-center items-center md:items-start text-center md:text-left">
      <div className="text-center px-4 sm:px-6 md:px-12 lg:px-20 py-8">
        <img
          src={StarHubIconFooterbar}
          alt="Logo"
          className="h-[100px] md:h-[150px] mx-auto"
        />
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-12 py-12">
        <div className="flex flex-col items-start">
          <div className="mb-4 text-label text-white font-gmarket-bold">
            Delvelopers
          </div>
          <div className="m-0 text-regular font-scdream4 text-white">
            박유나
          </div>
          <div className="m-0 text-regular font-scdream4 text-white">
            김채현
          </div>
          <div className="m-0 text-regular font-scdream4 text-white">
            류지예
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="mb-4 text-label text-white font-gmarket-bold">
            Contact
          </div>
          <div className="m-0 text-regular font-scdream4 text-white">
            yndbsk9372@gmail.com
          </div>
          <div className="m-0 text-regular font-scdream4 text-white">
            imddoy@gmail.com
          </div>
          <div className="m-0 text-regular font-scdream4 text-white">
            devdaradara@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
