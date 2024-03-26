import Map, { Source, Layer, Popup, MapRef } from 'react-map-gl';
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
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IAddress, ICardPopup, ICoords, IProperties, IViewport } from '../types'
import { MapEvent, MapSourceDataEvent, ViewStateChangeEvent } from 'react-map-gl/dist/esm/types';


const NewMap = (
  { selectedCoords, isCoordsSet, setIsCoordsSet, setSelectedCoords }: 
  {
    selectedCoords: ICoords,
    isCoordsSet: boolean,
    setIsCoordsSet: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedCoords: React.Dispatch<React.SetStateAction<ICoords>>
  }
) => {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapRef>(null); // the <Map/> ref

  const [mapLoading, setMapLoading] = useState<boolean>(true) // whether the map is loading
  const [cardPopup, setCardPopup] = useState<ICardPopup | null>(null)
  // const [viewportBounds, setViewportBounds] = useState({ west: null, south: null, east: null, north: null }); // bound of the map
  const [hoveredNeighborhoodFeatureId, setHoveredNeighborhoodFeatureId] = useState<number | null>(null) // The feature.id of the neighborhood the mouse is hovering
  const [hoveredNeighborhoodFeatureName, setHoveredNeighborhoodFeatureName] = useState<string | null>(null) // The feature.id of the neighborhood the mouse is hovering
  // const [hoveredBlockFeatureId, setHoveredBlockFeatureId] = useState<number | null>(null) // The feature.id of the neighborhood the mouse is hovering
  const [viewport, setViewport] = useState<IViewport>({
    longitude: -71.0589,
    latitude: 42.3601,
    zoom: 11.5
  });// initial state of viewport (somewhere near back bay...)
  const [mapHeight, setMapHeight] = useState<number | null>(null); // sets the map size depending on the height
  
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
        latitude: selectedCoords.latitude,
        longitude: selectedCoords.longitude,
        zoom: 17 // zoom level for when user searches
      });
    }
  }, [selectedCoords, isCoordsSet]);


  // <Map> onLoad=
  const handleMapLoad = (event: MapEvent<mapboxgl.Map, undefined>) => {
    setMapLoading(false)
  }


  // <Map> onClick=
  const handleMapClick = async (event: any) => {
    const map = event.target;
    { // violations layer
      const selectedFeatures = event.target.queryRenderedFeatures(event.point, {layers: ["unclustered-violations", "clustered-violations", "cluster-violations-count"]});
      if(selectedFeatures.length > 0)
        console.log("The feature stored in Map is: ", selectedFeatures[0])
      if (selectedFeatures && selectedFeatures.length > 0 && selectedFeatures[0] && selectedFeatures[0].source === 'violations') {
        const selectedFeature = selectedFeatures[0];
        console.log(`feature.layer.id: ${selectedFeature.layer.id}`)
        if(selectedFeature.layer.id === "unclustered-violations"){ // a red point is clicked
          if (selectedFeature.properties.SAM_ID !== null) {
            // implement the modal pop-up here changing the state to true
            // alert(`SAM_ID: ${selectedFeature.properties.SAM_ID}`);
            // console.log("DEBUG the type of selectedFeature.properties.addressDetails is", typeof selectedFeature.properties.addressDetails)
            setCardPopup({
              longitude: selectedFeature.geometry.coordinates[0],
              latitude: selectedFeature.geometry.coordinates[1],
              properties: {
                SAM_ID: selectedFeature.properties.SAM_ID,
                addressDetails: (typeof selectedFeature.properties.addressDetails ==="string" ? JSON.parse(selectedFeature.properties.addressDetails) : selectedFeature.properties.addressDetails)
              }
            })
          }
        } else if(selectedFeature.layer.id === "clustered-violations" || selectedFeature.layer.id === "cluster-violations-count" ) { // a yellow cluster is clicked
          if (selectedFeature.properties.cluster_id !== null) {
            alert(`cluster_id: ${selectedFeature.properties.cluster_id}`)
            const coordinates: ICoords = {
              longitude: selectedFeature.geometry.coordinates[0],
              latitude: selectedFeature.geometry.coordinates[1]
            }
            const vp: IViewport = {
              ...coordinates,
              zoom: 14
            }
            setViewport(vp);
          }
        } 
        return; // do not check the neighborhood if click on a red point
      } 
    }
    { // neighborhood layer
      const selectedFeatures = event.target.queryRenderedFeatures(event.point, {layers: ["neighborhoods-fills"]});
      if (selectedFeatures && selectedFeatures.length > 0 && selectedFeatures[0]) {
        const selectedFeature = selectedFeatures[0];
        console.log(selectedFeature)
        // The data is so weird... Sometimes it's wrapped in an array sometimes it's not.
        let lnglats = selectedFeature.geometry.coordinates[0]
        if(typeof lnglats[0][0] !== "number") {
          lnglats = lnglats[0]
        } 
        const total = lnglats.reduce((acc: Array<number>, val: Array<number>) => {
          acc[0] += val[0]; // Accumulate longitude
          acc[1] += val[1]; // Accumulate latitude
          return acc;
        }, [0, 0]); // Initial accumulator value
      
        const coordinates: ICoords = {
          longitude: total[0]/lnglats.length,
          latitude: total[1]/lnglats.length,
        } 
        setViewport({zoom: 14, ...coordinates})
        console.log("set viewport... ", coordinates.latitude, coordinates.longitude)
        if(selectedFeature.id != hoveredNeighborhoodFeatureId){
          setHoveredNeighborhoodFeatureId(selectedFeature.id);
          // move to a new one
          setHoveredNeighborhoodFeatureId(selectedFeature.id);
          setHoveredNeighborhoodFeatureName(selectedFeature?.properties?.BlockGr202)
          map.setFeatureState(
            {source: 'neighborhoods', sourceLayer: 'census2020_bg_neighborhoods-5hyj9i',id: selectedFeature.id,}, 
            {hover: true,}
          );
          map.setFeatureState(
            {source: 'neighborhoods', sourceLayer: 'census2020_bg_neighborhoods-5hyj9i',id: hoveredNeighborhoodFeatureId,}, 
            {hover: false,}
          );
        }
      }
    }
  }
  
  // <Map> onMove = 
  const handleMapMove = (evt: ViewStateChangeEvent<mapboxgl.Map>) => {
    const nextViewport = evt.viewState;
    setViewport(nextViewport); // update viewport
    // // check if cards should be displayed
    // const shouldShowCards = nextViewport.zoom > 15;
    // setShowCards(shouldShowCards);
  
    // // update the map edge
    // const width = mapContainerRef?.current?.offsetWidth;
    // const height = mapContainerRef?.current?.offsetHeight;

    // const viewport = new WebMercatorViewport({
    //   width,
    //   height,
    //   latitude: nextViewport.latitude,
    //   longitude: nextViewport.longitude,
    //   zoom: nextViewport.zoom
    // });
    // const bounds = viewport.getBounds();
    // const [west, south] = bounds[0];
    // const [east, north] = bounds[1];
    // setViewportBounds({
    //   west: west,
    //   south: south,
    //   east: east,
    //   north: north,
    // });  
  }
  
  // <Map> onMouseMove = 
  const handleMapMouseMove = (event: any) => {
    if(mapLoading === true) return
    const map = event.target;
    { // neighborhoods-layer
      const selectedFeatures = map.queryRenderedFeatures(event.point, {layers: ["neighborhoods-fills"]});
      if(selectedFeatures && selectedFeatures.length > 0 && selectedFeatures[0]) {
        const selectedFeature = selectedFeatures[0]; // the selected neighborhood feature.
        /* Better take a look at what does a feature look like */
        // console.log(selectedFeature) 
        if (hoveredNeighborhoodFeatureId === null){
          // console.log(1)
          setHoveredNeighborhoodFeatureId(selectedFeature.id)
          setHoveredNeighborhoodFeatureName(selectedFeature?.properties?.BlockGr202)
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
          setHoveredNeighborhoodFeatureName(selectedFeature?.properties?.BlockGr202)
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
        setHoveredNeighborhoodFeatureName(null)
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

  const handleMapZoom = (event: ViewStateChangeEvent<mapboxgl.Map>) => {
    // TODO
  }

  const handleMapOnSourceData = (event: MapSourceDataEvent<mapboxgl.Map>) => {
    if (event.sourceId == "violations" && mapRef.current) {
      const isViolationsSourceLoaded = mapRef?.current?.isSourceLoaded("violations");
      setMapLoading(mapLoading && !isViolationsSourceLoaded)
    }
  }

  return(
    <>
      <div style={{position: 'relative', width: '100%', height: mapHeight? mapHeight: 10 }}>
        {/* The `Loading...` Spinner */}
        {mapLoading && <div className='z-50' style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Light overlay, adjust as needed
          }}>
            <TailSpin color="#00BFFF" height={80} width={80} />
          </div>}
        {/* The Map Container*/}
        <div className="relative" ref={mapContainerRef} style={{ width: '100%', height: mapHeight? mapHeight: 10 }}>
          <Map
            {...viewport}
            onLoad={handleMapLoad}
            onClick={handleMapClick}
            onMove={handleMapMove}
            onMouseMove={handleMapMouseMove}
            onZoom={handleMapZoom}
            onSourceData={handleMapOnSourceData}
            ref={mapRef}
            style={{
              width: '100%',
              height: mapHeight? mapHeight : 10
            }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken="pk.eyJ1Ijoic3BhcmstYmFkbGFuZGxvcmRzIiwiYSI6ImNsaWpsMXc3ZTA4MGszZXFvaDBrc3I0Z3AifQ.mMM7raXYPneJfzyOoflFfQ"
          >
            {/* Map config */}
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
            {/* Searchbar */}
            <section style={{ position: 'relative', top: 30, left: 30}}>
              <MapSearchbar
                selectedCoords={selectedCoords}
                setSelectedCoords={setSelectedCoords}
                isCoordsSet={isCoordsSet}
                setIsCoordsSet={setIsCoordsSet}
              />
            </section>
            {/* The neighborhood buttons */}
            <section className="absolute top-5 right-5 z-10 bg-white p-4 rounded-lg shadow-md">
              {/* <p>{mapLoading ? "t": "f"}</p>
              <p>{mapRef?.current?.isSourceLoaded("violations") ? "yes": "no"}</p> */}
              <p className="mb-2 mx-4 text-center font-bold font-montserrat text-xl">
                NEIGHBORHOODS
              </p>
              {/* <p>{viewport.longitude}   {viewport.latitude}</p>
              <p>{selectedCoords.longitude}   {selectedCoords.latitude}</p> */}
              {hoveredNeighborhoodFeatureName && 
                <p className='text-lg font-lora mb-2 mt-2 text-center text-neighborhood-dark-blue'>
                  {hoveredNeighborhoodFeatureName}
                </p>
              }
              {neighborhoods.map((neighborhood, index) => (
                <div key={index}>
                  <button
                    key={index} // Add a unique key prop
                    onClick={() => {
                      const { name, ...vp } = neighborhood
                      setViewport(vp)
                      if(mapRef?.current && hoveredNeighborhoodFeatureId ){
                        mapRef?.current.setFeatureState(
                          {source: 'neighborhoods', sourceLayer: 'census2020_bg_neighborhoods-5hyj9i',id: hoveredNeighborhoodFeatureId,}, 
                          {hover: false,}
                        );
                        setHoveredNeighborhoodFeatureId(null)
                      }
                    }}
                    className="mb-2 py-1 px-4 bg-white-500 text-neighborhood-dark-blue font-lora rounded shadow-md hover:bg-gray-400 border-0.5 border-neighborhood-dark-blue focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-75"
                  >
                    {neighborhood.name} {/* Display the neighborhood name */}
                  </button>
                </div>
              ))}
            </section>
            {/* Popup */}
            <section>
            { cardPopup && 
              <div>
              <Popup
              // MUST add a key here. Or else Mapbox will destroy the Popup.
              // which prevent the next popup from showing up (how terrible!)
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
            </section>
          </Map>
        </div>
      </div>
    </>
  )
}

export default NewMap;