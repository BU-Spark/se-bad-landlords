import Map, { Source, Layer, Popup } from 'react-map-gl';
import { WebMercatorViewport } from 'viewport-mercator-project';
import { useRouter } from 'next/router';
import { TailSpin } from 'react-loader-spinner';
import Card from '../Card/Card';
import MapSearchbar from '../MapSearchbar/MapSearchbar'
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
  neighborhoods
}
from './data';
import React, { useState, useEffect, useRef } from 'react';

const NewMap = ({ selectedCoords, isCoordsSet, setIsCoordsSet, setSelectedCoords }) => {
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null) // the <Map/> component
  const [mapLoading, setMapLoading] = useState(true) // whether the map is loading
  // uncomment this if want to fetch data manually instead of from map
  // const [geoJsonData, setGeoJsonData] = useState(null); 
  const [showCards, setShowCards] = useState(false); // trigger for card display
  const [cardPopup, setCardPopup] = useState(null)
  const [viewportBounds, setViewportBounds] = useState({ west: null, south: null, east: null, north: null }); // bound of the map
  const [hoveredNeighborhoodFeatureId, setHoveredNeighborhoodFeatureId] = useState(null) // The feature.id of the neighborhood the mouse is hovering
  const [viewport, setViewport] = useState({
    // initial state of viewport
    longitude: -71.0589,
    latitude: 42.3601,
    zoom: 11.5
  });
  // sets the map size depending on the height
  const [mapHeight, setMapHeight] = useState(null);
  
  
  // init the map height
  useEffect(() => {
    setMapHeight(window.innerHeight * 0.7);
    const handleResize = () => {
      setMapHeight(window.innerHeight * 0.7);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // init the viewport
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


  // <Map> onLoad=
  const handleMapLoad = (event) => {
    setMapLoading(false)
  }

  // <Map> onClick=
  const handleMapClick = async (event) => {
    const map = event.target;
    const selectedFeatures = event.target.queryRenderedFeatures(event.point, {layers: ["unclustered-violations", "clustered-violations", "cluster-violations-count"]});
    if(selectedFeatures.length > 0){
      console.log("The feature stored in Map is: ", selectedFeatures[0])
    }
    if (selectedFeatures && selectedFeatures.length > 0 && selectedFeatures[0].source === 'violations') {
      const selectedFeature = selectedFeatures[0];
      console.log(`feature.layer.id: ${selectedFeature.layer.id}`)
      if(selectedFeature.layer.id === "unclustered-violations"){ // a red point is clicked
        if (selectedFeature.properties.SAM_ID !== null) {
          // implement the modal pop-up here changing the state to true
          // alert(`SAM_ID: ${selectedFeature.properties.SAM_ID}`);
          console.log("DEBUG the type of selectedFeature.properties.addressDetails is", typeof selectedFeature.properties.addressDetails)
          setCardPopup({
            longitude: selectedFeature.geometry.coordinates[0],
            latitude: selectedFeature.geometry.coordinates[1],
            properties: {
              SAM_ID: selectedFeature.properties.SAM_ID,
              addressDetails: JSON.parse(selectedFeature.properties.addressDetails)
            }
          })
        }
      } else if(selectedFeature.layer.id === "clustered-violations" || selectedFeature.layer.id === "cluster-violations-count" ) { // a yellow cluster is clicked
        if (selectedFeature.properties.cluster_id !== null) {
          alert(`cluster_id: ${selectedFeature.properties.cluster_id}`)
        }
      } 
    } // 
  }
  
  // <Map> onMove = 
  const handleMapMove = (evt) => {
    
    const nextViewport = evt.viewState;
    setViewport(nextViewport); // update viewport
    
    // TODO 
    // check if cards should be displayed
    const shouldShowCards = nextViewport.zoom > 15;
    setShowCards(shouldShowCards);
  
    // update the map edge
    const width = mapContainerRef.current.offsetWidth;
    const height = mapContainerRef.current.offsetHeight;

    const viewport = new WebMercatorViewport({
      width,
      height,
      latitude: nextViewport.latitude,
      longitude: nextViewport.longitude,
      zoom: nextViewport.zoom
    });
    const bounds = viewport.getBounds();
    // console.log(bounds);
    const [west, south] = bounds[0];
    const [east, north] = bounds[1];
    setViewportBounds({
      west: west,
      south: south,
      east: east,
      north: north,
    });  
  }
  
  // <Map> onMouseMove = 
  const handleMapMouseMove = (event) => {
    if(mapLoading === true) return
    const map = event.target;
    { // neighborhoods-layer
      const selectedFeatures = map.queryRenderedFeatures(event.point, {layers: ["neighborhoods-fills"]});
      if(selectedFeatures && selectedFeatures.length > 0) {
        const selectedFeature = selectedFeatures[0]; // the selected neighborhood feature.
        /* Better take a look at what does a feature look like */
        // console.log(selectedFeature) 
        if (hoveredNeighborhoodFeatureId === null){
          // console.log(1)
          setHoveredNeighborhoodFeatureId(selectedFeature.id)
          map.setFeatureState(
            {source: 'neighborhoods', sourceLayer: 'census2020_bg_neighborhoods-5hyj9i',id: selectedFeature.id,}, 
            {hover: true,}
          );
        } else if (hoveredNeighborhoodFeatureId !== null && hoveredNeighborhoodFeatureId === selectedFeature.id){
          // console.log(2)
          // remains in the same neighborhood. do nothing
        } else if (hoveredNeighborhoodFeatureId !== null && hoveredNeighborhoodFeatureId !== selectedFeature.id){
          // console.log(3)
          // move to a new one
          setHoveredNeighborhoodFeatureId(selectedFeature.id);
          map.setFeatureState(
            {source: 'neighborhoods', sourceLayer: 'census2020_bg_neighborhoods-5hyj9i',id: selectedFeature.id,}, 
            {hover: true,}
          );
          map.setFeatureState(
            {source: 'neighborhoods', sourceLayer: 'census2020_bg_neighborhoods-5hyj9i',id: hoveredNeighborhoodFeatureId,}, 
            {hover: false,}
          );
        }
      } else {
        map.setFeatureState(
          {source: 'neighborhoods', sourceLayer: 'census2020_bg_neighborhoods-5hyj9i',id: hoveredNeighborhoodFeatureId,}, 
          {hover: false,}
        );
        setHoveredNeighborhoodFeatureId(null)
      }
    }
    { // violations layer
      const selectedFeatures = map.queryRenderedFeatures(event.point, {layers: ["unclustered-violations"]});
      if(selectedFeatures && selectedFeatures.length > 0){
        map.getCanvas().style.cursor = 'pointer'; // Change cursor to pointer
      } else {
        map.getCanvas().style.cursor = ''; // Change cursor to pointer
      }
    }
  }
  const handleMapMouseLeave = () => {
    console.log("leave")
  }
  
  return(
    <>
    <div className='relative'>
      {mapLoading && <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: mapHeight,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Light overlay, adjust as needed
        }}>
          <TailSpin color="#00BFFF" height={80} width={80} />
        </div>}
    </div>
    <div className="relative" ref={mapContainerRef} style={{ width: '100%', height: mapHeight }}>
      <Map
        {...viewport}
        onLoad={handleMapLoad}
        onMove={handleMapMove}
        onMouseMove={handleMapMouseMove}
        onClick={handleMapClick}
        onMouseLeave={handleMapMouseLeave}
        ref={mapRef}
        style={{
          width: '100%',
          height: mapHeight
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken="pk.eyJ1Ijoic3BhcmstYmFkbGFuZGxvcmRzIiwiYSI6ImNsaWpsMXc3ZTA4MGszZXFvaDBrc3I0Z3AifQ.mMM7raXYPneJfzyOoflFfQ"
      >
        <div style={{ position: 'relative', top: 30, left: 30}}>
          <MapSearchbar
            selectedCoords={selectedCoords}
            setSelectedCoords={setSelectedCoords}
            isCoordsSet={isCoordsSet}
            setIsCoordsSet={setIsCoordsSet}
          />
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
        { cardPopup && 
          <div>
              hadfajmfkoidsaoi
          <Popup
          // MUST add a key here. Or else Mapbox will destroy the Popup.
          // which prevent the second & more popup from showing up (how terrible!)
            key={cardPopup.latitude + cardPopup.longitude}
            latitude={cardPopup.latitude}
            longitude={cardPopup.longitude}
            closeButton={false}
            closeOnClick={true}
            anchor="top"
          >
            <Card 
              properties={cardPopup.properties} 
            />
          </Popup>
          </div>}

      </Map>


      {/* The neighborhood buttons */}
      <div className="absolute top-5 right-5 z-10 bg-white p-4 rounded-lg shadow-md">
        <p className="mb-2 py-2 px-4 text-center font-bold font-montserrat text-xl">
          NEIGHBORHOODS
        </p>
        <p>{cardPopup?.latitude}</p>
        <p>{cardPopup?.longitude}</p>
        {neighborhoods.map((neighborhood, index) => (
          <div key={index}>
            <button
              key={index} // Add a unique key prop
              onClick={() => {
                const { name, ...vp } = neighborhood
                setViewport(vp)
                mapRef.current?.setFeatureState(
                  {source: 'neighborhoods', sourceLayer: 'census2020_bg_neighborhoods-5hyj9i',id: hoveredNeighborhoodFeatureId,}, 
                  {hover: false,}
                );
                setHoveredNeighborhoodFeatureId(null)
              }}
              className="mb-2 py-1 px-4 bg-white-500 text-neighborhood-dark-blue font-lora rounded shadow-md hover:bg-gray-400 border-0.5 border-neighborhood-dark-blue focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-75"
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




export default NewMap;



