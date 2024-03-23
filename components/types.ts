// Pass this to the <Popup> component
export interface ICardPopup {
    longitude: number;
    latitude: number;
    properties: IProperties;
}

// `properties` attribute of each Mapbox Feature
export interface IProperties {
    SAM_ID: string;
    addressDetails: IAddress;
}

export interface ICoords {
    latitude: number;
    longitude: number;
}

// Mapbox Viewport
export interface IViewport {
    latitude: number;
    longitude: number;
    zoom: number;
}

// Interface between detail_page and Map_page. Same to prisma.sam
export interface IAddress {
    FULL_ADDRESS: string;
    MAILING_NEIGHBORHOOD: string;
    PARCEL: string;
    SAM_ADDRESS_ID: string;
    X_COORD: string;
    Y_COORD: string;
    ZIP_CODE: string;
}