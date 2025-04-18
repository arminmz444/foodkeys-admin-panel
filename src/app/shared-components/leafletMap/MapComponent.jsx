import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "node_modules/leaflet-geosearch/dist/geosearch.css";

// Custom CSS to override the default geosearch styles
const CustomMapStyles = () => {
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = `
      /* Override geosearch input styles */
      .leaflet-control-geosearch form input.glass {
        font-family: 'sans', 'yekan', 'Inter var', 'Roboto', 'Helvetica', 'Arial', 'sans-serif';
        font-size: 14px !important;
        padding: 10px 15px !important;
        height: 44px !important;
        border-radius: 4px !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        width: 100% !important;
        max-width: 360px !important;
        transition: all 0.2s ease-in-out;
      }
      
      /* Focused state */
      .leaflet-control-geosearch form input.glass:focus {
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15) !important;
        border-color: #3f51b5 !important;
      }
      
      /* Results list styling */
      .leaflet-control-geosearch form .results {
        font-family: 'sans', 'yekan', 'Inter var', 'Roboto', 'Helvetica', 'Arial', 'sans-serif';
        margin-top: 5px !important;
        border-radius: 4px !important;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2) !important;
      }
      
      .leaflet-control-geosearch form .results > * {
        padding: 10px 15px !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
        transition: background-color 0.2s;
      }
      
      .leaflet-control-geosearch form .results > *:hover {
        background-color: #f0f0f0 !important;
      }
      
      /* Reset button styling */
      .leaflet-control-geosearch form a.reset {
        right: 10px !important;
        top: 12px !important;
        height: 20px !important;
        width: 20px !important;
        line-height: 20px !important;
      }
      
      /* Container sizing */
      .leaflet-control-geosearch {
        width: 100% !important;
        max-width: 360px !important;
        margin-top: 10px !important;
        margin-left: 10px !important;
      }
    `;
    
    // Append to document head
    document.head.appendChild(styleElement);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return null;
};

function MapComponent({ mapRef, onLocationSelect, initialPosition }) {
  // Use provided initialPosition or default to Tehran coordinates
  const [position, setPosition] = useState(
    initialPosition || [35.6892523, 51.3896004]
  );
  // Track whether the current marker is from search (needs to be overridden on click)
  const [isFromSearch, setIsFromSearch] = useState(false);

  useEffect(() => {
    // If initialPosition changes, update the marker position
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);
    
    // Mark that this position is from a direct click, not a search
    setIsFromSearch(false);
    
    // Notify parent component about the location change
    // Clear the commonName and fullAddress since this is a manual click
    if (onLocationSelect) {
      onLocationSelect({
        latitude: lat,
        longitude: lng,
        commonName: "", // Clear the name since this is a direct click
        fullAddress: ""  // Clear the address since this is a direct click
      });
    }
  };

  return (
    <MapContainer
      ref={mapRef}
      center={position}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      attributionControl={false}
    >
      <CustomMapStyles />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          موقعیت انتخاب شده: <br />
          عرض جغرافیایی: {position[0]}, طول جغرافیایی: {position[1]}
        </Popup>
      </Marker>
      <SearchBar onLocationSelect={onLocationSelect} setPosition={setPosition} />
      <MapClickHandler onMapClick={handleMapClick} />
    </MapContainer>
  );
}

// This component handles click events on the map
function MapClickHandler({ onMapClick }) {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e) => {
      if (onMapClick) onMapClick(e);
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);
  
  return null;
}

function SearchBar({ onLocationSelect, setPosition }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    
    // Configure search control
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      autoComplete: true,
      searchLabel: "آدرس مورد نظر خود را وارد کنید",
      showMarker: false, // Don't add a separate marker, we'll handle it
      showPopup: false, // Don't show a popup
      marker: {
        draggable: false, // To avoid multiple markers
      },
      popupFormat: ({ result }) => result.label, // Format popup content
      maxMarkers: 1, // Maximum number of markers
      retainZoomLevel: false, // Zoom to found location
    });

    map.addControl(searchControl);
    
    // Handle search results - fixed event handler
    const handleSearchResult = (event) => {
      try {
        // Ensure the location data has lat and lng
        const { x, y, label } = event.location;
        
        // Sometimes data comes as x/y instead of lat/lng
        const lat = event.location.lat !== undefined ? event.location.lat : y;
        const lng = event.location.lng !== undefined ? event.location.lng : x;
        
        // Verify we have valid coordinates
        if (lat !== undefined && lng !== undefined) {
          // Update marker position
          setPosition([lat, lng]);
          
          // Center map on the location
          map.setView([lat, lng], 13);
          
          // Send location data to parent component
          if (onLocationSelect) {
            onLocationSelect({
              latitude: lat,
              longitude: lng,
              commonName: label || "",
              fullAddress: label || ""
            });
          }
          
          // Any additional markers from the search will be removed when our main marker is updated
        } else {
          console.error("Invalid location data:", event.location);
        }
      } catch (error) {
        console.error("Error handling search result:", error);
      }
    };
    
    map.on("geosearch/showlocation", handleSearchResult);
    
    return () => {
      map.off("geosearch/showlocation", handleSearchResult);
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelect, setPosition]);

  return null;
}

export default MapComponent;