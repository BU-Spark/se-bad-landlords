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
  const neighborhoodNameList = ["Back Bay", "Fenway-Kenmore", "Allston", "Beacon Hill", "Brighton", "Bay Village", "Charlestown", "South End"]
  const [viewport, setViewport] = useState({
    // initial state of viewport
    longitude: -71.0589,
    latitude: 42.3601,
    zoom: 11.5
  });
  // sets the map size depending on the height
  const [mapHeight, setMapHeight] = useState(null);
  // // sets the neighborhood data. Names and centers
  // const [neighborhoods, setNeighborhoods] = useState(neighborhoodNameList.map(neighborhoodName => 
  //   Object({
  //     name: neighborhoodName,
  //     longitude: 10.0,
  //     latitude: 20.0,
  //     zoom: 15
  //   })
  // ));
  
  useEffect(() => {
    setMapHeight(window.innerHeight * 0.7);
    const handleResize = () => {
      setMapHeight(window.innerHeight * 0.7);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useEffect(() => {
  //   const promises = neighborhoodNameList.map(neighborhoodName => {
  //     fetchNeiborhoodAddress(neighborhoodName)
  //   })
  //   Promise.all(promises)
  //     .then(results => {
  //       // results[index]: RowData[]
  //       // type RowData = {
  //       //   SAM_ADDRESS_ID: string,
  //       //   X_COORD: string | null,
  //       //   Y_COORD: string | null
  //       // }
  //       const neighborhoods = results.map((result, index) => Object({
  //         name: neighborhoodNameList[index],
  //         latitude: result.X_Coord,
  //         longitude: result.Y_Coord
  //       }))
  //       setNeighborhoods(neighborhoods);
  //     })
  //     .catch(error => {
  //       console.error("Error fetching data:", error);
  //     });
  //       // const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${fullAddress}`);
  // }, [])

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


  // async function fetchNeiborhoodAddress(neighborhoodName) {
  //   try {
  //     const res = await fetch(`/api/geojson/map-points3?neighborhoodName=${neighborhoodName}`);
  //     if (res.ok) {
  //       const geoJson = await res.json();
  //       return geoJson
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   };
  // }

  return(
    <>
    <div className="relative">
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
        {neighborhoodNameList.map((neighborhood, index) => (
          <div key={index}>
            <button
              key={neighborhood} // Add a unique key prop
              onClick={() => alert(`Button ${neighborhood} clicked!`)}
              className="mb-2 py-2 px-4 bg-blue-500 text-white font-lora rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              {neighborhood} {/* Display the neighborhood name */}
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default NewMap;
/* Rectangle 494 */

/* NEIGHBORHOODS */




