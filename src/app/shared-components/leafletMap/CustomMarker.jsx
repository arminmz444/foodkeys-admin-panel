import { Marker, useMap } from "react-leaflet";

export default function CustomMarker(props) {
  const map = useMap();

  return (
    <div>
      <Marker
        icon={props.icon}
        position={[33.91907336973602, 35.51552625946782]}
        eventHandlers={{
          click: (e) => {
            map.flyTo(e.latlng, 14);
          },
        }}
      ></Marker>
    </div>
  );
}

{/* <Marker position={position}>
        <Popup>
          Your selected location:
          <br />
          Lat: {position[0]}, Lng: {position[1]}
        </Popup>
      </Marker> */
}
