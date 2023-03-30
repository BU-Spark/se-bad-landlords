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
        zoom: 11
      });
      let tract_id = null;
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
            'fill-outline-color': 'red',
            'fill-opacity': 0.3,
          }
          });
         
          map.on('mousemove', 'census-block-layer', (f) =>{
              tract_id = f.features[0].properties["FID"];
              map.getCanvas().style.cursor = 'pointer';
              map.setFeatureState(
                {
                  source: 'census',
                  id: tract_id
                },
                {
                  hover: true
                }
              );
              map.setPaintProperty('census-block-layer', 'census', 'blue');
          });
          // When the mouse leaves the earthquakes-viz layer, update the
          // feature state of the previously hovered feature
          map.on('mouseleave', 'census-block-layer', () => {
              if (tract_id) {
                map.setFeatureState(
              {
                source: 'census',
                id: tract_id
              },
              {
                hover: false
              }
              );
              }
              tract_id = null;
              // Reset the cursor style
              map.getCanvas().style.cursor = '';
          });
          
          map.addSource('violations', {
            type: 'geojson',
            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
            data: 'https://kolade2.github.io/Bad-Landlords/data/build-viol.geojson',
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
                '#31C1F7',
                90,
                '#A7E7FF',
                650,
                '#C0A9FD'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                10,
                90,
                20,
                650,
                30
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
                'text-size': 11
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
            
            // inspect a cluster on click
            map.on('click', 'clusters', (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            
            const clusterId = features[0].properties.cluster_id;
            map.getSource('violations').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
            if (err) return;
                map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
                });
                }
            );
            });
            
            // When a click event occurs on a feature in
            // the unclustered-point layer, open a popup at
            // the location of the feature, with
            // description HTML from its properties.
            map.on('click', 'unclustered-point', (e) => {
                const coordinates = e.features[0].geometry.coordinates.slice();
                const code = e.features[1].properties["code"];
                const addr = e.features[1].properties["contact_addr1"];
                const description = e.features[1].properties["description"];
                const date_time = e.features[1].properties["status_dttm"]
                // Ensure that if the map is zoomed out such that
                // multiple copies of the feature are visible, the
                // popup appears over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                
            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(
              `Address: ${addr}<br> Violation code: ${code}<br> Description: ${description}<br> Date/Time: ${date_time}`
            )
              .addTo(map);
            });
            
            map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
            });
      }); 
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  return <div className="map-container" ref={mapContainer} />;
};

export default Map;
