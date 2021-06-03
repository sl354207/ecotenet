import { MapContainer, TileLayer,Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import"leaflet-defaulticon-compatibility";
const Map = () => {
    return (
        <div >
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}
            style={{ height: 1000 }}>
  <TileLayer
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    url="https://api.mapbox.com/styles/v1/sl354207/ckpeg5lg3082517o51188lef0/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2wzNTQyMDciLCJhIjoiY2twZTZkanh4MWw1cjJ3bzF4aHc4ejY2eCJ9.DHLCLKrqz-v8d1dQvkiyrg
    "
  />
  <Marker position={[51.505, -0.09]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</MapContainer>
        </div>
    )
}


export default Map
