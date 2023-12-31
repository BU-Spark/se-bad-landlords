
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import React, { useEffect, useRef, useState } from "react";
import Table from "./Table"; 


const Map = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const [tableData, setTableData] = useState([]);
  var hoveredStateId = ""; 
  var neighborhood = "";
  var census_tract_no = "";

  //===============================================
  //initialize map with access token and mapboxgl
  //===============================================
  useEffect(() => {
    // Update table data with violations within map view bounds
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3BhcmstYmFkbGFuZGxvcmRzIiwiYSI6ImNsaWpsMXc3ZTA4MGszZXFvaDBrc3I0Z3AifQ.mMM7raXYPneJfzyOoflFfQ';
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-71.0589, 42.3601],
        zoom: 12
      });
      
      // Add the control to the map.
      map.addControl(
          new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl
        })
      );

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
          url: 'mapbox://spark-badlandlords.cxyyru86'
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
            'url': 'mapbox://spark-badlandlords.cxyyru86'
          },
          'source-layer': 'census2020_tracts-4u84f2',
          'paint':{
            'fill-color': 'blue',
            'fill-outline-color': 'red',
            'fill-opacity': 0.3
          }
        });

    //NEIGHBORHOODS LAYER CODE
    ///////////////////////////////////////////////////////////////////////////////////////
        map.addSource('neighborhoods', {
          type: 'vector',
          url: 'mapbox://spark-badlandlords.8o9j3v7f'
        });

        map.addLayer({
            'id': 'neighborhoods-fills',
            'type': 'fill',
            'source': 'neighborhoods',
            'source-layer': 'census2020_bg_neighborhoods-5hyj9i',
            'layout': {},
            'paint': {
            'fill-color': 'blue',
            'fill-opacity': [
            'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.6,
                0
                ]
              }
          });
          
          map.addLayer({
              'id': 'neighborhoods-borders',
              'type': 'line',
              'source': 'neighborhoods',
              'source-layer': 'census2020_bg_neighborhoods-5hyj9i',
              'layout': {},
              'paint': {
              'line-color': 'purple',
              'line-width': 2
            }
          });
          // When the user moves their mouse over the state-fill layer, we'll update the
          // feature state for the feature under the mouse.
          map.on('mousemove', 'neighborhoods-fills', (e) => {
            if (e.features.length > 0) {
              if (hoveredStateId !== null) {
                map.setFeatureState(
                  { source: 'neighborhoods', sourceLayer: 'census2020_bg_neighborhoods-5hyj9i', id: hoveredStateId },
                  { hover: false }
                );
              }
              hoveredStateId = e.features[0].id;
              neighborhood = e.features[0].properties["BlockGr202"]
              map.setFeatureState(
                { source: 'neighborhoods', sourceLayer: 'census2020_bg_neighborhoods-5hyj9i', id: hoveredStateId },
                { hover: true }
              );
            }
          });

          // When the mouse leaves the state-fill layer, update the feature state of the
          // previously hovered feature and hide the tooltip.
          map.on('mouseleave', 'neighborhoods-fills', () => {
            if (hoveredStateId !== null) {
              map.setFeatureState(
                { source: 'neighborhoods', sourceLayer: 'census2020_bg_neighborhoods-5hyj9i', id: hoveredStateId },
                { hover: false }
              );
            }
            hoveredStateId = null;
          });

/////////////////////////////violations code////////////////////////////////////////////////////////
          map.addSource('violations', {
            type: 'geojson',
            data: 'https://kolade2.github.io/Bad-Landlords/data/updated_data.csv.geojson',
            cluster: false,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 150, // Radius of each cluster when clustering points (defaults to 50)
          });

          map.addLayer({
          id: 'unclustered-point',
          type: 'circle', 
          source: 'violations',
          filter: [
            'all',
            [
              'match',
              ['get', 'code'],
              ['CMR410*', 'CRM410*'],
              false,
              true
            ]
          ],
          paint: {
              'circle-color': 'white',
              'circle-radius': 3,
              'circle-stroke-width': 1.5,
              'circle-stroke-color': 'purple'
          }
          });
          
          var popupContainer = document.getElementById('popupContainer');

          map.on('click', 'unclustered-point', (e) => {
            const filteredProperties = {};
            const featureId = e.features[0].id;
           
            const properties = e.features[0].properties;
            for (const key in properties) {
              if (properties.hasOwnProperty(key) && properties[key] !== "") {
                filteredProperties[key] = properties[key];
              }
            }
            const { code, OWNER1, description, case_no } = filteredProperties;
            const coordinates = e.features[0].geometry.coordinates.slice();
            
              // Update the contents of the popup container
            popupContainer.innerHTML = `
                    <div class="popup">
                      <div class="popup__header"><strong>Neighborhood:</strong></div>
                      <div class="popup__content">${neighborhood}</div>
                      <div class="popup__header"><strong>Name:</strong></div>
                      <div class="popup__content">${OWNER1}</div>
                      <div class="popup__header"><strong>Code:</strong></div>
                      <div class="popup__content">${code}</div>
                      <div class="popup__header"><strong>Description:</strong></div>
                      <div class="popup__content">${description}</div>
                      <div class="popup__header"><strong>Case No:</strong></div>
                      <div class="popup__content">${case_no}</div>
                    </div>
                  `;

              // Show the popup container
            popupContainer.style.display = 'block';
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
          });

          map.on('move', ['unclustered-point', 'neighborhood-fills'], (e) =>{
            const bounds = map.getBounds();
            // property ID is used as unique id for the table, undefined id will cause error
            // filter out features with undefined property ID
            const features = map.queryRenderedFeatures({ bounds }).filter(feat => feat.properties.OID_);
            const violationsData = features.map(e => ({
              id: e.properties.OID_, // or any other unique identifier for the row
              neighborhood: neighborhood,
              owner: e.properties.OWNER1, // replace with actual property name
              code: e.properties.code, // replace with actual property name
              description: e.properties.description,
              case_no: e.properties.case_no
              // add more properties as needed
            }));
            setTableData(violationsData);
          })
            
          }); 
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  return (
    <div>
      <div ref={mapContainer} style={{Top: 300, height:620, width:'100%'}}/>
      <br></br>
      {/* <h2 className ="table-title"> Building violations table</h2>
      <p className="table-text">Datapoints from the Map above displayed on a table</p>
      <div className="Table">
           <Table data={tableData}/>
      </div> */}
     
    </div>
  );
};

export default Map;

