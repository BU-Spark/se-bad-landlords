import React, { useState, useEffect } from 'react';
import NewMap from '@components/NewMap/NewMap';

const Home = () => {
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
        <div>
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
            {/* <div style={{ marginTop: '100px', marginBottom: '50px' }}>
                <h3>Top 10 Bad Landlords:</h3>
                <ul>
                    {landlords.map((landlord, index) => (
                        <li key={index}>{landlord.OWNER} - {landlord.violations_count} Violations</li>
                    ))}
                </ul>
            </div> */}
        </div>
    </>
  );
};

// export const getStaticProps = async () => {
//   try {
//     const res = await fetch(`${base_url}/api/landlords/top-ten`);
//     if (res.ok) {
//       const landlords = await res.json();
//       return { props: { landlords } };
//     }
    
//     console.error('Failed to fetch landlords:', res.statusText);
//     return { props: { landlords: [] } };
//   } catch (err) {
//     console.error(err);
//     return { props: { landlords: [] } };
//   }
// }

export default Home;
