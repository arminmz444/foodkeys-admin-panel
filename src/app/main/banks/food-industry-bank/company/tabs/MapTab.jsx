// // MapTab.tsx
// import MapComponent from "app/shared-components/leafletMap/MapComp";
// import { useEffect, useRef } from "react";
// import { useFormContext } from "react-hook-form";

// function MapTab({ tabValue, myIndex }) {
//   const mapRef = useRef(null);
//   const { control } = useFormContext();

//   useEffect(() => {
//     if (tabValue === myIndex && mapRef.current) {
//       // In a tiny delay to ensure the tab is fully rendered
//       setTimeout(() => {
//         mapRef.current.invalidateSize();
//       }, 300);
//     }
//   }, [tabValue, myIndex]);

//   return (
//     <div>
//       <MapComponent mapRef={mapRef} />
//     </div>
//   );
// }

// export default MapTab;
