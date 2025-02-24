import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "node_modules/leaflet-geosearch/dist/geosearch.css";
// Fix for default marker icons in React Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
// 	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
// 	iconUrl: require("leaflet/dist/images/marker-icon.png").default,
// 	shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
// });

function MapComponent() {
	const [position, setPosition] = useState([35.6892523, 51.3896004]); // Default position (London)

	const handleMapClick = (e) => {
		const { lat, lng } = e.latlng;
		setPosition([lat, lng]); // Update the marker's position
		console.log("Selected Location:", { lat, lng }); // Log the selected location
	};
	return (
		<MapContainer
			center={position}
			zoom={13}
			style={{ height: "400px", width: "100%" }}
			onClick={handleMapClick}
			attributionControl={false}
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
			<SearchBar />
		</MapContainer>
	);
}

function SearchBar() {
	const map = useMap();

	useEffect(() => {
		const provider = new OpenStreetMapProvider();
		const searchControl = new GeoSearchControl({
			provider,
			style: "bar",
			autoComplete: true,
			searchLabel: "آدرس مورد نظر خود را وارد کنید",
			marker: {
				// optional: L.Marker    - default L.Icon.Default
				// icon: new L.Icon.Default(),
				draggable: true,
			},
		});

		map.addControl(searchControl);
		map.on("geosearch/showlocation", (data) => console.log(data));
		map.on("geosearch/marker/dragend", (data) => console.log(data));
		return () => map.removeControl(searchControl);
	}, [map]);

	return null;
}
export default MapComponent;
