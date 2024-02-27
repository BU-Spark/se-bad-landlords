import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface IAddress {
    FULL_ADDRESS: string;
    MAILING_NEIGHBORHOOD: string;
    PARCEL: string;
    SAM_ADDRESS_ID: string;
    X_COORD: string;
    Y_COORD: string;
    ZIP_CODE: string;
}

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
    }, [router.isReady]);

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

    return (
        <div>
            <h1>Detail Page</h1>
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
            ))}
        </div>
    );
}

export default DetailPage;
