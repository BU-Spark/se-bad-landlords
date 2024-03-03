import Map, { Source, Layer } from 'react-map-gl';
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
import React, { useState, useEffect } from 'react';


const NewMap = ({ selectedCoords, isCoordsSet }) => {
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
    <div className="relative">
      <Map
        {...viewport}
        onMove={
          evt => {setViewport(evt.viewState)}
        }
        style={{
          width: '100%',
          height: mapHeight
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken="pk.eyJ1Ijoic3BhcmstYmFkbGFuZGxvcmRzIiwiYSI6ImNsaWpsMXc3ZTA4MGszZXFvaDBrc3I0Z3AifQ.mMM7raXYPneJfzyOoflFfQ"
        onClick={handleMapClick}
      >
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

      {/* The search bar */}
      <div className="absolute top-5 left-5 z-10 bg-white p-4 rounded-lg shadow-md">
        THE_SEARCH_BAR
      </div>

      {/* The neighborhood buttons */}
      <div className="absolute top-5 right-5 z-10 bg-white p-4 rounded-lg shadow-md">
        <p className="mb-2 py-2 px-4 text-center font-bold font-montserrat text-xl">
          NEIGHBORHOODS
        </p>
        {neighborhoods.map((neighborhood, index) => (
          <div key={index}>
            <button
              key={index} // Add a unique key prop
              onClick={() => {
                // alert(`Button ${neighborhood.name} clicked!`);
                const { name, ...vp } = neighborhood
                setViewport(vp)
              }}
              className="mb-2 py-2 px-4 bg-blue-500 text-white font-lora rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              {neighborhood.name} {/* Display the neighborhood name */}
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

const neighborhoods = [
  {
    name: "Back Bay",
    latitude: 42.34935079219511,
    longitude: -71.07768484195698,
    zoom: 14.5
  },
  {
    name: "Fenway-Kenmore",
    latitude: 42.34410046840793,
    longitude: -71.09149456439195,
    zoom: 14.5
  },
  {
    name: "Allston",
    latitude: 42.354073887542484,
    longitude: -71.12205552803877,
    zoom: 14.5
  },
  {
    name: "Beacon Hill",
    latitude: 42.35772707692351,
    longitude: -71.06063056114242,
    zoom: 14.5
  },
  {
    name: "Brighton",
    latitude: 42.349807928693366,
    longitude: -71.15428721858567,
    zoom: 14
  },
  {
    name: "Bay Village",
    latitude: 42.34867038592486,
    longitude: -71.0656615496278,
    zoom: 15
  },
  {
    name: "Charlestown",
    latitude: 42.37803429987562,
    longitude: -71.06114769366161,
    zoom: 14.5
  },
  {
    name: "South End",
    latitude: 42.340878919021804,
    longitude: -71.07653159645594,
    zoom: 14.5
  },
]

export default NewMap;



