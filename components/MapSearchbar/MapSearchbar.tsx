import React, { useEffect, useState, useRef} from 'react';
import { useRouter} from 'next/router';
import { IAddress, ICoords } from '@components/types';

function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout | null = null;
  
    return (...args: any[]) => {
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


const MapSearchbar = ({ selectedCoords, isCoordsSet, setIsCoordsSet, setSelectedCoords } : {
    selectedCoords: ICoords,
    isCoordsSet: boolean,
    setIsCoordsSet: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedCoords: React.Dispatch<React.SetStateAction<ICoords>>
}) => {
    const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
    const [addressSuggestions, setAddressSuggestions] = useState<IAddress[]>([]);
    const [searchAddress, setSearchAddress] = useState<string>('');
    
    const inputRef = useRef(null); // reference for searchbox
    const suggestionsRef = useRef(null); // reference for suggestions

    const fetchAddressSuggestions = async (searchAddress: string) => {
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
      const handleSearchUpdate: React.ChangeEventHandler<HTMLInputElement> = (event) => {
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
    
      const handleAddressSelection = async (address: IAddress) => {
        setSelectedAddress(address);
        //const addressString = JSON.stringify(address);
        //const encodedAddress = encodeURIComponent(addressString);
        //router.push(`/map/detail?address=${encodeURIComponent(encodedAddress)}`);
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
    return (
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
    )
};

export default MapSearchbar;