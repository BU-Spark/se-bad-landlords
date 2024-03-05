import { useState, useCallback } from 'react';

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

export interface IAddress {
    FULL_ADDRESS: string;
    MAILING_NEIGHBORHOOD: string;
    PARCEL: string;
    SAM_ADDRESS_ID: string;
    X_COORD: string;
    Y_COORD: string;
    ZIP_CODE: string;
}

export const useSearchAPI = () => {
    const [searchAddress, setSearchAddress] = useState('');
    const [addressSuggestions, setAddressSuggestions] = useState<IAddress[]>([]);

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

    // Onclick search button
    // finds the address if input length is longer than 2
    const handleSearchClick = async () => {
        if (searchAddress.length > 2) {
            await fetchAddressSuggestions(searchAddress);
        } else {
            setAddressSuggestions([]);
        }
    };

    return {
        searchAddress,
        addressSuggestions,
        handleSearchUpdate,
        handleSearchClick,
        setSearchAddress, 
        setAddressSuggestions, 
    };
}
