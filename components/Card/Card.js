import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Card = ({ properties }) => {
  const router = useRouter();
  const { SAM_ID } = properties;

  const [addressDetails, setAddressDetails] = useState(null);

  // find the address by sam id
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // call the detail api to fetch by sam id
        const response = await fetch(`/api/property/details?sam_id=${encodeURIComponent(SAM_ID)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }
        const data = await response.json();
        setAddressDetails(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    if (SAM_ID) {
      fetchDetails();
    }
  }, [SAM_ID]);

  const handleButtonClick = () => {
    if (addressDetails) {
      const addressString = JSON.stringify(addressDetails);
      const encodedAddress = encodeURIComponent(addressString);
      router.push(`/map/detail?address=${encodedAddress}`);
    }
  };
  return (
    <div className="grid-item bg-white p-4 rounded-lg border-[0.5px] border-[#58585B]">
      <div>
        {addressDetails ? (
          <span className="block font-bold text-lg text-[#58585B]">{addressDetails.FULL_ADDRESS},</span>
        ) : (
          <span>Loading...</span>
        )}
      </div>
      <div className="flex justify-end">
        {/* click the button to redirect to the detail page */}
        <img src="/property-arrow.svg" onClick={handleButtonClick} alt="property-arrow" className="mt-5 cursor-pointer" />
      </div>
    </div>

  );
};

export default Card;