// MapComponent.jsx
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

const MapComponent = forwardRef(({}, ref) => {
  const [position, setPosition] = useState([35.6892523, 51.3896004]); // e.g. Tehran

  // Provide an imperative handle so the parent can call invalidateSize().
  // We'll store the Leaflet map instance in a local ref:
  const map = useMap();

  useImperativeHandle(ref, () => ({
    invalidateSize: () => {
      map.invalidateSize();
    },
  }));

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);
    console.log("Selected Location:", { lat, lng });
  };

  // The search bar
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      autoComplete: true,
      searchLabel: "آدرس مورد نظر خود را وارد کنید",
      marker: { draggable: true },
    });
    map.addControl(searchControl);
    map.on("geosearch/showlocation", (ev) => console.log(ev));
    map.on("geosearch/marker/dragend", (ev) => console.log(ev));
    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      whenCreated={(mapInstance) => {
        // This is how we get the 'map' instance for the useImperativeHandle
      }}
      onClick={handleMapClick}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>
          Your selected location:
          <br />
          Lat: {position[0]}, Lng: {position[1]}
        </Popup>
      </Marker>
    </MapContainer>
  );
});

export default MapComponent;
