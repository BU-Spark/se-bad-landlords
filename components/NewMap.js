import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


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


      </Map>
    </>
  )
}

export default NewMap;