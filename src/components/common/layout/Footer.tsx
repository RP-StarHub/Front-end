import React from "react";
import StarHubIconFooterbar from "../../../assets/icons/StarHubIconFooterbar.png";

const Footer = () => {
  return (
    <div className="w-full bg-bold flex flex-row justify-center items-center">
      <div className="text-center px-40 py-12">
        <img
          src={StarHubIconFooterbar}
          alt={"Logo"}
          style={{ width: "auto", height: "150px" }}
        />
      </div>
      <div className="text-center px-40 py-12">
        <div className="mb-4 text-label text-white font-gmarket-bold">
          Delvelopers
        </div>
        <div className="m-0 text-regular font-scdream4 text-white">박유나</div>
        <div className="m-0 text-regular font-scdream4 text-white">김채현</div>
        <div className="m-0 text-regular font-scdream4 text-white">류지예</div>
      </div>
      <div className="text-center px-40 py-12">
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
  );
};

export default Footer;
