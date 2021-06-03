import { useState } from "react";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

const Map1 = () => {
    const mapBox = 'pk.eyJ1Ijoic2wzNTQyMDciLCJhIjoiY2twaDJ1OTU1MDhtZDJ1b2x0N3c3ZnYwdiJ9.P7qlEddqung5yTH_u8VF7Q'

    const ecoLayer = {
        id: 'eco-data',
        type: 'fill',
        source: 'eco-data',
        'source-layer': 'wwf_terr_ecos-bwy8bw',
        paint: {
            'fill-outline-color': 'rgba(0,0,0,1)',
            'fill-color': 'rgba(0,0,0,0.5)',
            
        }
    }
    const [viewport, setViewport] = useState({
        latitude: 37.8,
        longitude: -122.4,
        zoom: 14,
        bearing: 0,
        pitch: 0
      });
    
      return (
        <ReactMapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/sl354207/ckph5dyvu1xio17tfsiau4wjs/draft"
        onViewportChange={setViewport}
        mapboxApiAccessToken={mapBox}>
            <Source 
            id="eco-data"
            type="vector" url="mapbox://sl354207.0w3ac669">
                <Layer beforeId="waterway-label" {...ecoLayer} />
            </Source>
        </ReactMapGL >
      )
}

export default Map1
