import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { useSearchAPI, IAddress } from '../../api/search';

interface IViolation {
    code: string;
    longitude: string;
    sam_id: string;
    status_dttm: string;
    latitude: string;
    status: string;
    description: string;
    case_no: string;
}

function DetailPage() {
    const router = useRouter();
    const [addressObj, setAddressObj] = useState<IAddress | null>(null);
    const [violations, setViolations] = useState<IViolation[]>([]);
    const [expandTableVisible_st, setexpandTableVisible_st] = useState(false);
    const [expandTableVisible_la, setexpandTableVisible_la] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null); 
    const suggestionsRef = useRef<HTMLUListElement>(null);
    const expandTableRef = useRef<HTMLTableSectionElement>(null); 

    const {
        searchAddress,
        addressSuggestions,
        handleSearchUpdate,
        handleSearchClick,
        setSearchAddress,
        setAddressSuggestions
    } = useSearchAPI();

    const handleAddressSelection = async (address: IAddress) => {
        // setSelectedAddress(address);
        const addressString = JSON.stringify(address);
        const encodedAddress = encodeURIComponent(addressString);
        router.push(`/map/detail?address=${encodeURIComponent(encodedAddress)}`);
    };

    useEffect(() => {
        if (router.isReady) {
            const address = router.query.address;
            const addressString = Array.isArray(address) ? address[0] : address;
            
            try {
                const decodedAddress = decodeURIComponent(addressString || '');
                setAddressObj(JSON.parse(decodedAddress));
                // fetch violations
                fetchViolations(JSON.parse(decodedAddress).SAM_ADDRESS_ID);
            } catch (error) {
                console.error("Error parsing address:", error);
                setAddressObj(null);
            }
        }
    }, [router.isReady, router.query.address]);

    const fetchViolations = async (sam_id: string) => {
        try {
            const res = await fetch(`/api/violations?sam_id=${sam_id}`);
            if (res.ok) {
                const data = await res.json();
                setViolations(data);
                console.log("data:" + data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!addressObj) {
        return <div>Loading...</div>;
    }

    const toggleTableVisibility_st = () => {
        setexpandTableVisible_st(!expandTableVisible_st);
    };

    const toggleTableVisibility_la = () => {
        setexpandTableVisible_la(!expandTableVisible_la);
    };

    return (
        <div className="px-10 relative">
            <div className='h-20 flex justify-center items-center'>
                <div className="h-10 bg-white justify-center w-full rounded">
                    <div className="flex items-center">
                        <img src="/search-icon.svg" alt="saerch-icon" className="inline mx-2" />
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={searchAddress} 
                            onClick={handleSearchClick}
                            onChange={handleSearchUpdate} 
                            placeholder="Search for an address" 
                            className="w-full py-2 px-1 rounded focus:outline-none placeholder:text-[#58585B]"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                        />

                    </div>
                    {addressSuggestions.length > 0 && (
                        <ul ref={suggestionsRef} className="z-20 absolute mt-1 w-5/6 bg-white border border-gray-300 z-10">
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
            <div className="flex flex-col items-start justify-center h-full w-full">
                <div className="text-black font-bold text-6xl mb-5">
                    {addressObj.FULL_ADDRESS},<br/>
                    {addressObj.MAILING_NEIGHBORHOOD}, MA, {addressObj.ZIP_CODE}
                </div>
                <div className="text-grey font-['Lora'] text-l">
                    Explore this page to find violations associated with <br/>
                    {addressObj.FULL_ADDRESS} and the landlord associated 
                </div>
                <div className="h-7"></div>
            </div>

            {/* street violations table */}
            <div className="max-w-full overflow-x-auto">
                <div className="text-lg text-white font-semibold py-2 px-4 bg-[#c8a992]">
                    {addressObj.FULL_ADDRESS} VIOLATIONS
                </div>
                <table className="min-w-full leading-normal text-center">
                    <thead>
                        <tr>
                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-white text-center font-bold text-gray-600 uppercase tracking-wider">
                                 
                            </th>
                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-white text-center font-bold text-gray-600 uppercase tracking-wider">
                                CODE VIOLATIONS
                            </th>
                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-white text-center font-bold text-gray-600 uppercase tracking-wider">
                                DESCRIPTION
                            </th>
                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-white text-center font-bold text-gray-600 uppercase tracking-wider">
                                LAST ISSUED
                            </th>
                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-white text-center font-bold text-gray-600 uppercase tracking-wider">
                                NOTES
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-2 py-3 border-b border-gray-200 bg-white text-3xl text-right">
                                <button onClick={toggleTableVisibility_st} className="font-bold">{"›"}</button>
                            </td>
                            <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                <p className="text-gray-900 whitespace-no-wrap">{violations.length > 0 ? violations[0].case_no : ""}</p>
                            </td>
                            <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                <p className="text-gray-900 whitespace-no-wrap">{violations.length > 0 ? violations[0].description : ""}</p>
                            </td>
                            <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                <p className="text-gray-900 whitespace-no-wrap">{violations.length > 0 ? violations[0].status_dttm.split(" ")[0] : ""}</p>
                            </td>
                            <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                <p className="text-gray-900 whitespace-no-wrap">{violations.length > 0 ? violations[0].status : ""}</p>
                            </td>
                        </tr>
                    </tbody>
                    {expandTableVisible_st && violations.length > 1 && (
                    // <div className="absolute left-0 w-full">
                        //  {/* <table className="min-w-full leading-normal text-center"> */}
                            <tbody ref={expandTableRef} >
                                {violations.slice(1).map((violation, index) => (
                                    <tr
                                        key={index}>
                                        <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                            <button className="font-bold"></button>
                                        </td>
                                        <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                            <p className="text-gray-900 whitespace-no-wrap">{violation.case_no}</p>
                                        </td>
                                        <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                            <p className="text-gray-900 whitespace-no-wrap">{violation.description}</p>
                                        </td>
                                        <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                            <p className="text-gray-900 whitespace-no-wrap">{violation.status_dttm.split(" ")[0]}</p>
                                        </td>
                                        <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                            <p className="text-gray-900 whitespace-no-wrap">{violation.status}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        //  {/* </table> */}
                    // </div>
                )}
                </table>
            </div>

            <div className="h-11"></div>
            <div className="text-black font-bold text-4xl mb-2">
                LANDLORD ASSOCIATED
            </div>
            <hr style={{ width: '100%', borderTop: '6px solid black' }} />
            <div className="h-11"></div>

            <div className="flex gap-20 justify-center items-center">
                {/* Left side component */}
                <div className="flex-1 max-w-md p-4 bg-white border rounded">
                    <p className="text-2xl font-bold">{" "}</p>
                    <h2 className="text-2xl font-bold">JA INVESTMENTS LLC</h2>
                    <p className="text-lg">Landlord Address: 100 Charles Street</p>
                    <p className="mt-2">100 addresses in total</p>
                    <p className="text-blue-600">64 properties without violations</p>
                    <p className="text-red-600">37 properties with violations</p>
                    <p className="text-2xl font-bold"></p>
                </div>

                {/* Right side component */}
                <div className="flex-1 max-w-md p-4 rounded">
                    <h2 className="text-2xl font-bold text-orange-600">SCOFFLAW LANDLORD</h2>
                    <p>
                    The text here is to help explain the specific criteria the landlord has done to appear on this scofflaw list Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>
            </div>
            <div className="h-11"></div>
            
            {/* landlord violations table */}
            <div className="max-w-full overflow-x-auto">
                <div className="text-lg text-white font-semibold py-2 px-4 bg-[#c8a992]">
                    LANDLORD VIOLATIONS
                </div>
                <table className="min-w-full leading-normal text-center">
                    <thead>
                        <tr>
                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-white text-center font-bold text-gray-600 uppercase tracking-wider">
                                 
                            </th>
                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-white text-center font-bold text-gray-600 uppercase tracking-wider">
                                NUMBER
                            </th>
                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-white text-center font-bold text-gray-600 uppercase tracking-wider">
                                DESCRIPTION
                            </th>
                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-white text-center font-bold text-gray-600 uppercase tracking-wider">
                                LAST ISSUED
                            </th>
                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-white text-center font-bold text-gray-600 uppercase tracking-wider">
                                NOTES
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-2 py-3 border-b border-gray-200 bg-white text-3xl text-right">
                                <button onClick={toggleTableVisibility_la} className="font-bold">{"›"}</button>
                            </td>
                            <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                <p className="text-gray-900 whitespace-no-wrap">{violations.length > 0 ? violations[0].case_no : ""}</p>
                            </td>
                            <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                <p className="text-gray-900 whitespace-no-wrap">{violations.length > 0 ? violations[0].description : ""}</p>
                            </td>
                            <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                <p className="text-gray-900 whitespace-no-wrap">{violations.length > 0 ? violations[0].status_dttm.split(" ")[0] : ""}</p>
                            </td>
                            <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                <p className="text-gray-900 whitespace-no-wrap">{violations.length > 0 ? violations[0].status : ""}</p>
                            </td>
                        </tr>
                    </tbody>
                    {expandTableVisible_la && violations.length > 1 && (
                    // <div className="absolute left-0 w-full">
                        //  {/* <table className="min-w-full leading-normal text-center"> */}
                            <tbody ref={expandTableRef} >
                                {violations.slice(1).map((violation, index) => (
                                    <tr
                                        key={index}>
                                        <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                            <button className="font-bold"></button>
                                        </td>
                                        <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                            <p className="text-gray-900 whitespace-no-wrap">{violation.case_no}</p>
                                        </td>
                                        <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                            <p className="text-gray-900 whitespace-no-wrap">{violation.description}</p>
                                        </td>
                                        <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                            <p className="text-gray-900 whitespace-no-wrap">{violation.status_dttm.split(" ")[0]}</p>
                                        </td>
                                        <td className="px-2 py-3 border-b border-gray-200 bg-white">
                                            <p className="text-gray-900 whitespace-no-wrap">{violation.status}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        //  {/* </table> */}
                    // </div>
                )}
                </table>
            </div>
            <div className="h-11"></div>

            {/* <h1>Detail Page</h1>
            <p>Full Address: {addressObj.FULL_ADDRESS}</p>
            <p>Mailing Neighborhood: {addressObj.MAILING_NEIGHBORHOOD}</p>
            <p>Parcel: {addressObj.PARCEL}</p>
            <p>SAM ID: {addressObj.SAM_ADDRESS_ID}</p>
            <p>X_COORD: {addressObj.X_COORD}</p>
            <p>Y_COORD: {addressObj.Y_COORD}</p>
            <p>Zip Code: {addressObj.ZIP_CODE}</p>
            {violations.map(violation => (
                <div key={violation.case_no}>
                    <p>Case No: {violation.case_no}</p>
                    <p>Description: {violation.description}</p>
                    <p>Status: {violation.status}</p>
                    <p>Status Date: {violation.status_dttm}</p>
                </div>
            ))} */}
        </div>
    );
}

export default DetailPage;
