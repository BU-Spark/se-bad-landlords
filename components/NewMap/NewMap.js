import Map, { Source, Layer } from 'react-map-gl';
import { useRouter } from 'next/router';

import 'mapbox-gl/dist/mapbox-gl.css';
import {
  blockLayer, 
  neighborhoodsLayer, 
  neighborhoodsBordersLayer,
  unclusteredViolationsLayer,
  clusteredViolationsLayer,
  clusterViolationsCountLayer,
  neighborhoodsData,
  censusData,
  violationsData,
}
from './data';
import React, { useState, useEffect, useRef } from 'react';

// debounce function, ensure api requests are not made too frequently
function debounce(func, wait) {
  let timeout = null;

  return (...args) => {
      const later = () => {
          timeout = null;
          func(...args);
      };

      if (timeout) {
          clearTimeout(timeout);
      }

      timeout = setTimeout(later, wait);
  };
}


const NewMap = ({ selectedCoords, isCoordsSet }) => {
  const router = useRouter();

  const [searchAddress, setSearchAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const inputRef = useRef(null); // reference for searchbox
  const suggestionsRef = useRef(null); // reference for suggestions

  const [viewport, setViewport] = useState({
    // initial state of viewport
    longitude: -71.0589,
    latitude: 42.3601,
    zoom: 11.5
  });
  // sets the map size depending on the height
  const [mapHeight, setMapHeight] = useState(null);
  useEffect(() => {
    setMapHeight(window.innerHeight * 0.7);
    const handleResize = () => {
      setMapHeight(window.innerHeight * 0.7);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const debouncedFetchAddressSuggestions = debounce((searchAddress) => {
    fetchAddressSuggestions(searchAddress);
  }, 300);

  // handle search update
  const handleSearchUpdate = (event) => {
    const value = event.target.value;
    setSearchAddress(value);
    if (value.length > 2) {
        debouncedFetchAddressSuggestions(value);
    } else {
        setAddressSuggestions([]);
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

  const handleAddressSelection = async (address) => {
    setSelectedAddress(address);
    const addressString = JSON.stringify(address);
    const encodedAddress = encodeURIComponent(addressString);
    router.push(`/map/detail?address=${encodeURIComponent(encodedAddress)}`);
    try {
        setIsCoordsSet(true);
        /**
         * Implementation of data fetch using samId in bpv dataset.
         * This doesn't work because BPV datasets only have properties with violations.
         * SAM dataset contains all street address.
         * I am leaving this here as all you need to do is change bpv to something else over in the api file
         * if new dataset is found.
         */
        // const response = await fetch(`/api/parcel?samId=${address.SAM_ADDRESS_ID}`);
        // const data = await response.json();
        /**
         * Receive data and extract latitude and longtitude here if new dataset found.
         */

        // console.log('Clicked address:', address);
        
        /* This is OpenStreetMap Implementation
           Issue with this was showing very wrong coords some property.
           Probably due to having unit numbers.
        */
        const fullAddress = `${address.FULL_ADDRESS}, ${address.MAILING_NEIGHBORHOOD}, ${address.ZIP_CODE}`;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${fullAddress}`);
        const data = await response.json();
        
        if (data.length > 0) {
            const latitude = parseFloat(data[0].lat);
            const longitude = parseFloat(data[0].lon);

            if (!isNaN(latitude) && !isNaN(longitude)) {
                setSelectedCoords({
                    latitude: latitude,
                    longitude: longitude
                });
            }
        } else {
            console.log('No Address!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
  };
  const handleMapClick = async (event) => {
    const clickedFeatures = event.target.queryRenderedFeatures(event.point);
    if (clickedFeatures && clickedFeatures.length > 0 && clickedFeatures[0].source === 'violations') {
      const feature = clickedFeatures[0];
      if (feature.properties.SAM_ID != null) {
        // implement the modal pop-up here changing the state to true
        alert(`SAM_ID: ${feature.properties.SAM_ID}`);
        const propertyDetails = await fetchPropertyDetails(feature.properties.SAM_ID);
        if (propertyDetails) {
          console.log(propertyDetails);
        }
      }
    }
  }

  useEffect(() => {
    if (selectedCoords.latitude && selectedCoords.longitude && isCoordsSet) {
      setViewport({
        ...viewport,
        latitude: selectedCoords.latitude,
        longitude: selectedCoords.longitude,
        zoom: 17 // zoom level for when user searches
      });
    }
  }, [selectedCoords, isCoordsSet]);

  const fetchPropertyDetails = async (samId) => {
    try {
      const response = await fetch(`/api/property/details?sam_id=${samId}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  };

  return(
    <>
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewport)}
        style={{
          width: '100%',
          height: mapHeight
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken="pk.eyJ1Ijoic3BhcmstYmFkbGFuZGxvcmRzIiwiYSI6ImNsaWpsMXc3ZTA4MGszZXFvaDBrc3I0Z3AifQ.mMM7raXYPneJfzyOoflFfQ"
        onClick={handleMapClick}
      >
        <div style={{ position: 'relative', top: 30, left: 30}}>
          <div className="h-9 bg-white w-1/4 rounded" >
            <div className="flex items-center">
              <img src="/search-icon.svg" alt="saerch-icon" className="inline mx-2" />
              <input
                ref={inputRef}
                type="text"
                value={searchAddress}
                onClick={handleSearchClick}
                onChange={handleSearchUpdate}
                placeholder="Search for an address"
                className="w-full py-2 px-1 rounded focus:outline-none placeholder:text-[#58585B] "
                onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
              />
            </div>
            {addressSuggestions.length > 0 && (
              <ul ref={suggestionsRef} className="absolute mt-1 w-1/4 bg-white border border-gray-300 z-10">
                  {addressSuggestions.map((address, index) => (
                      <li 
                          key={index} 
                          onClick={() => {
                              setSearchAddress(`${address.FULL_ADDRESS}, ${address.MAILING_NEIGHBORHOOD}, ${address.ZIP_CODE}`);
                              setAddressSuggestions([]);
                              handleAddressSelection(address);
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                          {address.FULL_ADDRESS}, {address.MAILING_NEIGHBORHOOD}, {address.ZIP_CODE}
                      </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        <Source id="census" type="vector" url={censusData.url} >
          <Layer {...blockLayer} />
        </Source>
        <Source id="neighborhoods" type="vector" url={neighborhoodsData.url} >
          <Layer {...neighborhoodsLayer} />
          <Layer {...neighborhoodsBordersLayer} />
        </Source>
        <Source 
          id='violations' 
          type='geojson' 
          data={violationsData.url}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusteredViolationsLayer} />
          <Layer {...clusterViolationsCountLayer} />
          <Layer {...unclusteredViolationsLayer} />
        </Source>
      </Map>
    </>
  )
}

export default NewMap;