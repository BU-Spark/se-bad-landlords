
import React, { useState, useEffect } from 'react';
import Navbar from '@components/Navbar';
import Map from '@components/Map';
import NewMap from '@components/NewMap/NewMap';

// Change this to netlify url.
// This was needed because getStaticProps only supported static route
const base_url = "http://localhost:3000/" 

const MapPage = ({ landlords }) => {
  const [searchAddress, setSearchAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);

  // call /api/searchAddress with address parameter as input
  const fetchAddressSuggestions = async (searchAddress) => {
    try {
      const res = await fetch(`/api/addresses?search=${searchAddress}`);
      if (res.ok) {
        const suggestions = await res.json();
        setAddressSuggestions(suggestions);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Onclick search button
  // finds the address if input length is longer than 2
  const handleSearchClick = async () => {
    if (searchAddress.length > 2) {
      await fetchAddressSuggestions(searchAddress);
    } else {
      setAddressSuggestions([]);
    }
  };
  
  // this function can do something when displayed address is clicked
  // right now only shows full address data on console
  const handleAddressSelection = (address) => {
    console.log('Clicked address:', address);
  };

  return (
    <>
        <Navbar />
        <div className="landing-body bottom-10">
            <div className="section-title">
                <h2 className="section-title-header">Bad Landlords Visualization</h2>
            </div>
            <hr className="hr-index"></hr> 
            <NewMap />
            <div id="popupContainer">
            </div>
            {/*below are the code example using api*/}
            {/*this shows the full address using search box*/}
            <div style={{ marginTop: '100px', marginBottom: '50px' }}>
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
            </div>
            {/*this shows top 10 landlords using getStaticProps*/}
            <div style={{ marginTop: '100px', marginBottom: '50px' }}>
                <h3>Top 10 Bad Landlords:</h3>
                <ul>
                    {landlords.map((landlord, index) => (
                        <li key={index}>{landlord.OWNER} - {landlord.violations_count} Violations</li>
                    ))}
                </ul>
            </div>
        </div>
    </>
  );
};

export const getStaticProps = async () => {
  try {
    const res = await fetch(`${base_url}/api/landlords/top-ten`);
    if (res.ok) {
      const landlords = await res.json();
      console.log(landlords)
      return { props: { landlords } };
    }
    
    console.error('Failed to fetch landlords:', res.statusText);
    return { props: { landlords: [] } };
  } catch (err) {
    console.error(err);
    return { props: { landlords: [] } };
  }
}

export default MapPage;
