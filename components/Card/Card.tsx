import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IAddress } from '@pages/api/search';

type IProperties = {
  SAM_ID: string;
  addressDetails: IAddress;
}

const Card = ({ properties }: {properties: IProperties} ) => {
  const router = useRouter();
  const SAM_ID: string = properties.SAM_ID
  const addressDetails: IAddress = properties.addressDetails
  // console.log("card -- SAM_ID: ", SAM_ID)
  // console.log("card -- addressDetails: ", addressDetails)

  const handleButtonClick = () => {
    if (addressDetails) {
      const addressString = JSON.stringify(addressDetails);
      const encodedAddress = encodeURIComponent(addressString);
      router.push(`/map/detail?address=${encodedAddress}`);
    }
  };
  return (
    <div className="grid-item bg-white p-4 rounded-lg border-[0.5px] border-[#58585B]">
        {addressDetails.FULL_ADDRESS}
      <div className="flex justify-end">
        {/* click the button to redirect to the detail page */}
        <img src="/property-arrow.svg" onClick={handleButtonClick} alt="property-arrow" className="mt-5 cursor-pointer" />
      </div>
    </div>
  )
};

export default Card;