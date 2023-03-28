import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";

const Map = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  
  //===============================================
  //initialize map with access token and mapboxgl
  //===============================================
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia29sYWRlYWRlZ2JheWUiLCJhIjoiY2xmcHNpMnBrMDFxNzQybzNzcHFrenI5OSJ9.pNixVb7d1UUfPIgmxqoitg';
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-71.0589, 42.3601],
        zoom: 10
      });

      //===============================================
      //load the default map mapbox/streets-v11
      //===============================================
      map.on('load', () => {
        setMap(map);
        
        //=================================================================
        //add census data information from mapbox studio to map as a source
        //url should be the mapbox://{tileset-ID}
        //=================================================================
        map.addSource('census', {
          type: 'vector',
          url: 'mapbox://koladeadegbaye.bpyqog0g'
          });

        //===================================================
        //add census data layer to map
        //source layer information should be the tileset name
        //===================================================
        map.addLayer({
          'id': 'census-block-layer',
          'type': 'fill',
           'source': {
            'type': 'vector',
            'url': 'mapbox://koladeadegbaye.bpyqog0g'
          },
          'source-layer': 'census2020_tracts-baue3k',
          'paint': {
            'fill-color': 'blue',
            'fill-opacity': 0.5,
          }
          });
         
          map.addSource('violations', {
            type: 'geojson',
            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
            data: '../data/building-violations.geojson',
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
          });
          map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'violations',
            filter: ['has', 'point_count'],
            paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                100,
                '#f1f075',
                750,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
            ]
          }
          });
          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'violations',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
              }
            });
            
            map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'violations',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
            });
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  return <div className="map-container" ref={mapContainer} />;
};

export default Map;
