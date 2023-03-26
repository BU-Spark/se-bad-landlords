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
             'fill-color': '#627BC1',
              'fill-opacity': 0.5
          }
          });
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  return <div className="map-container" ref={mapContainer} />;
};

export default Map;
