import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
// 	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
// 	iconUrl: require("leaflet/dist/images/marker-icon.png").default,
// 	shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
// });

function MapComponent() {
	const [position, setPosition] = useState([51.505, -0.09]); // Default position (London)

	const handleMapClick = (e) => {
		setPosition([e.latlng.lat, e.latlng.lng]);
	};

	return (
		<MapContainer
			center={position}
			zoom={13}
			style={{ height: "400px", width: "100%" }}
			onClick={handleMapClick}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<Marker position={position}>
				<Popup>
					Your selected location: <br />
					Latitude: {position[0]}, Longitude: {position[1]}
				</Popup>
			</Marker>
		</MapContainer>
	);
}

export default MapComponent;
