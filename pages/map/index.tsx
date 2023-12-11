import React, { useState, useEffect } from 'react';
import NewMap from '@components/NewMap/NewMap';


interface ILandlord {
    OWNER: string;
    FULL_ADDRESS: string;
    CITY: string;
    violations_count: number;
}
interface MapProps {
    landlords: ILandlord[];
}

const Map: React.FC<MapProps> = ({ landlords }) => {
  // const [searchAddress, setSearchAddress] = useState('');
  // const [addressSuggestions, setAddressSuggestions] = useState([]);

  // call /api/searchAddress with address parameter as input
  // const fetchAddressSuggestions = async (searchAddress: string) => {
  //   try {
  //     const res = await fetch(`/api/addresses?search=${searchAddress}`);
  //     if (res.ok) {
  //       const suggestions = await res.json();
  //       setAddressSuggestions(suggestions);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // Onclick search button
  // finds the address if input length is longer than 2
  // const handleSearchClick = async () => {
  //   if (searchAddress.length > 2) {
  //     await fetchAddressSuggestions(searchAddress);
  //   } else {
  //     setAddressSuggestions([]);
  //   }
  // };
  
  // this function can do something when displayed address is clicked
  // right now only shows full address data on console
  // const handleAddressSelection = (address) => {
  //   console.log('Clicked address:', address);
  // };

  return (
    <>
        {/* image title */}
        <div className="h-56 bg-map-page-image">
            <div className="px-10 flex flex-col items-start justify-center bg-[#021C6666] h-full w-full">
                <div className="text-white font-bold text-2xl mb-5">SCOFFLAW OWNERS BOSTON</div>
                <div className="text-white font-['Lora'] text-sm">
                    Discover the Truth about Boston’s Bad Landlords <br/>
                    Our Website Exposes Property Violations and Brings Transparency to Code Enforcement, <br/>
                    Empowering Tenants and Advocating for a Fair Housing System
                </div>
            </div>
        </div>

        {/* map */}
        <div className="w-9/10 mx-auto my-3">
            <div className='font-bold text-[#58585B] my-7 text-xl'>
                FIND PROPERTIES WITH VIOLATIONS BY AREA
            </div>
            <NewMap />
            {/*below are the code example using api*/}
            {/*this shows the full address using search box*/}
            {/* <div style={{ marginTop: '100px', marginBottom: '50px' }}>
                <input 
                type="text" 
                value={searchAddress} 
                onChange={(e) => setSearchAddress(e.target.value)} 
                placeholder="Search for an address" 
                />
                <button onClick={handleSearchClick}>Search</button>
                {addressSuggestions.length > 0 && (
                <ul>
                    {addressSuggestions.map((address, index) => (
                    <li key={index} onClick={() => handleAddressSelection(address)}>
                        {address.FULL_ADDRESS}, {address.MAILING_NEIGHBORHOOD}, {address.ZIP_CODE}
                    </li>
                    ))}
                </ul>
                )}
            </div> */}
            {/*this shows top 10 landlords using getStaticProps*/}
            <div className='font-bold text-[#58585B] mt-12 mb-10 text-xl'>
                TOP 10 PROPERTIES BY VIOLATION COUNT
            </div>
            <div className="grid grid-cols-1 mb-20 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-9 gap-y-16">
                {landlords.map((landlord, index) => (
                    <div className="grid-item bg-white p-4 rounded-lg border-[0.5px] border-[#58585B]" key={index}>
                        <div>
                            <div className="font-['Lora'] text-sm mb-4">Property Type</div>
                            <span className="block font-bold text-lg text-[#58585B]">{landlord.FULL_ADDRESS},</span>
                            <span className="block font-bold text-lg text-[#58585B]">{landlord.CITY} MA</span>
                        </div>
                        <div className="flex justify-end">
                            <img src="/property-arrow.svg" alt="property-arrow" className="mt-5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
  );
};

// netlify site url will be used if not available then localhost
const base_url = process.env.SITE_URL || 'http://localhost:3000';
export const getStaticProps = async () => {
    try {
        const res = await fetch(`${base_url}/api/landlords/top-ten`);
        if (res.ok) {
            const landlords: ILandlord[] = await res.json();
            return { props: { landlords } };
        }
        
        console.error('Failed to fetch landlords:', res.statusText);
        return { props: { landlords: [] } };
    } catch (err) {
        console.error(err);
        return { props: { landlords: [] } };
    }
}

export default Map;
