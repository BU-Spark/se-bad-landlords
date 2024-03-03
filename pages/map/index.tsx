import React, { useState, useRef, useEffect } from 'react';
import NewMap from '@components/NewMap/NewMap';
import { useRouter } from 'next/router';

interface ILandlord {
    OWNER: string;
    FULL_ADDRESS: string;
    CITY: string;
    violations_count: number;
}
interface IMapProps {
    landlords: ILandlord[];
}
interface IAddress {
    FULL_ADDRESS: string;
    MAILING_NEIGHBORHOOD: string;
    PARCEL: string;
    SAM_ADDRESS_ID: string;
    X_COORD: string;
    Y_COORD: string;
    ZIP_CODE: string;
}

// debounce function, ensure api requests are not made too frequently
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
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


const Map: React.FC<IMapProps> = ({ landlords }) => {
    const [searchAddress, setSearchAddress] = useState('');
    const [addressSuggestions, setAddressSuggestions] = useState<IAddress[]>([]);
    const [selectedCoords, setSelectedCoords] = useState({ latitude: -71.0589, longitude: 42.3601 });
    const [isCoordsSet, setIsCoordsSet] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<IAddress>();

    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null); // reference for searchbox
    const suggestionsRef = useRef<HTMLUListElement>(null); // reference for suggestions

    // call /api/searchAddress with address parameter as input
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

    // the debounced version of fetchAddressSuggestions
    const debouncedFetchAddressSuggestions = debounce((searchAddress: string) => {
        fetchAddressSuggestions(searchAddress);
    }, 300);

    // Onclick search button
    // finds the address if input length is longer than 2
    const handleSearchClick = async () => {
        if (searchAddress.length > 2) {
            await fetchAddressSuggestions(searchAddress);
        } else {
            setAddressSuggestions([]);
        }
    };

    useEffect(() => {
        // define the handler
        const handleClickOutside = (event: MouseEvent) => {
            // check if the click is outside
            if (
                inputRef.current && !inputRef.current.contains(event.target as Node) &&
                suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)
            ) {
                setAddressSuggestions([]); // if it is, clear the suggestions
            }
        };

        // add global listener
        document.addEventListener('mousedown', handleClickOutside);

        // remove listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // handle search update
    const handleSearchUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchAddress(value);
        if (value.length > 2) {
            debouncedFetchAddressSuggestions(value);
        } else {
            setAddressSuggestions([]);
        }
    };
    
    const handleAddressSelection = async (address: IAddress) => {
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
            <div className='h-20 bg-[#021C66B2] bg-opacity-70 flex justify-center items-center'>
                <div className="h-10 bg-white w-5/6 rounded">
                    <div className="flex items-center">
                        <img src="/search-icon.svg" alt="saerch-icon" className="inline mx-2" />
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={searchAddress} 
                            onChange={handleSearchUpdate}
                            onClick={handleSearchClick}
                            placeholder="Search for an address" 
                            className="w-full py-2 px-1 rounded focus:outline-none placeholder:text-[#58585B]"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                        />

                    </div>
                    {addressSuggestions.length > 0 && (
                        <ul ref={suggestionsRef} className="absolute mt-1 w-5/6 bg-white border border-gray-300 z-10">
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

            {/* map */}
            <div className="w-9/10 mx-auto my-3">
                <div className='font-bold text-[#58585B] my-7 text-xl'>
                    FIND PROPERTIES WITH VIOLATIONS BY AREA
                </div>
                <NewMap selectedCoords={selectedCoords} isCoordsSet={isCoordsSet} />

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
