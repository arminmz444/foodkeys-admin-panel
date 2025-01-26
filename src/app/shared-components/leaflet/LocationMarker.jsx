import React from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';

function LocationMarker({ position, setPosition }) {
	useMapEvents({
		click(e) {
			setPosition(e.latlng);
		}
	});

	return position ? (
		<Marker position={position}>
			<Popup>
				<div>
					<p>Selected Coordinates:</p>
					<p>Latitude: {position.lat}</p>
					<p>Longitude: {position.lng}</p>
				</div>
			</Popup>
		</Marker>
	) : (
		<div />
	);
}

export default LocationMarker;
