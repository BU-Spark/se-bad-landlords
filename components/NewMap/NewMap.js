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

const NewMap = () => {
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
        initialViewState={{
          longitude: -71.0589,
          latitude: 42.3601,
          zoom: 11.5
        }}
        style={{
          width: '100%',
          height: 620,
          top: 30
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
    </>
  )
}

export default NewMap;