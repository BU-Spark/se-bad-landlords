import Map, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { blockLayer, 
  neighborhoodsLayer, 
  neighborhoodsBordersLayer,
  neighborhoodsData,
  censusData } 
from './data';

const NewMap = () => {
  return(
    <>
      <Map
        initialViewState={{
          longitude: -71.0589,
          latitude: 42.3601,
          zoom: 12
        }}
        style={{
          width: '100%',
          top: 100,
          height: 620
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken="pk.eyJ1Ijoic3BhcmstYmFkbGFuZGxvcmRzIiwiYSI6ImNsaWpsMXc3ZTA4MGszZXFvaDBrc3I0Z3AifQ.mMM7raXYPneJfzyOoflFfQ"
      >
        <Source id="census" type="vector" url={censusData.url} >
          <Layer {...blockLayer} />
        </Source>
        <Source id="neighborhoods" type="vector" url={neighborhoodsData.url} >
          <Layer {...neighborhoodsLayer} />
          <Layer {...neighborhoodsBordersLayer} />
        </Source>
      </Map>
    </>
  )
}

export default NewMap;