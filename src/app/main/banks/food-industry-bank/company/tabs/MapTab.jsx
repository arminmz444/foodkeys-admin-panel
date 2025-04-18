import { useEffect, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Typography, TextField, Paper, Grid, Button } from "@mui/material";
import MapComponent from "app/shared-components/leafletMap/MapComponent";

function MapTab({ tabValue, myIndex = 7 }) {
  const mapRef = useRef(null);
  const methods = useFormContext();
  const { control, setValue, watch } = methods;

  // Watch relevant form fields
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const commonName = watch("commonName");
  const fullAddress = watch("fullAddress");

  // Prepare initialPosition for the map if coordinates exist
  const initialPosition = latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : null;

  useEffect(() => {
    // Invalidate map size when tab becomes visible
    if (tabValue === myIndex && mapRef.current && mapRef.current.invalidateSize) {
      setTimeout(() => {
        if (mapRef.current && mapRef.current.invalidateSize) {
          mapRef.current.invalidateSize();
        }
      }, 300);
    }
  }, [tabValue, myIndex]);

  // Handle location selection from the map
  const handleLocationSelect = (locationData) => {
    if (locationData) {
      // Always update latitude and longitude if they are valid
      if (locationData.latitude !== undefined && locationData.latitude !== null) {
        setValue("latitude", locationData.latitude);
      }
      
      if (locationData.longitude !== undefined && locationData.longitude !== null) {
        setValue("longitude", locationData.longitude);
      }
      
      // Always update commonName and fullAddress fields, including clearing them
      // This is important so direct clicks on the map clear these fields
      setValue("commonName", locationData.commonName || "");
      setValue("fullAddress", locationData.fullAddress || "");
    }
  };

  // Handle manual coordinate input
  const handleManualCoordinates = (e) => {
    e.preventDefault();
    const manualLat = parseFloat(watch("manualLatitude"));
    const manualLng = parseFloat(watch("manualLongitude"));
    
    if (!isNaN(manualLat) && !isNaN(manualLng)) {
      // Update form fields
      setValue("latitude", manualLat);
      setValue("longitude", manualLng);
      
      // Clear the commonName and fullAddress since this is manual input
      setValue("commonName", "");
      setValue("fullAddress", "");
      
      // Update map position - use the appropriate method for the map ref
      if (mapRef.current) {
        // Check if it's a Leaflet map instance or MapContainer ref
        if (mapRef.current.setView) {
          mapRef.current.setView([manualLat, manualLng], 13);
        } else if (mapRef.current._leaflet_id) {
          // It's a MapContainer ref
          const leafletMap = mapRef.current;
          leafletMap.setView([manualLat, manualLng], 13);
        }
      }
    }
  };

  return (
    <div>
      <Typography variant="h6" className="mb-16">
        موقعیت شرکت روی نقشه
      </Typography>
      
      <Paper className="p-16 mb-24">
        <Typography className="mb-16">
          برای انتخاب موقعیت، می‌توانید روی نقشه کلیک کنید یا آدرس را جستجو نمایید.
        </Typography>
        
        <MapComponent 
          mapRef={mapRef} 
          onLocationSelect={handleLocationSelect}
          initialPosition={initialPosition}
        />
      </Paper>
      
      <Paper className="p-16 mb-24">
        <Typography variant="subtitle1" className="mb-16">
          مختصات انتخاب شده
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="latitude"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="عرض جغرافیایی"
                  disabled
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="longitude"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="طول جغرافیایی"
                  variant="outlined"
                  fullWidth
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="commonName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="نام مکان"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="fullAddress"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="آدرس کامل"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper className="p-16">
        <Typography variant="subtitle1" className="mb-16">
          ورود دستی مختصات
        </Typography>
        
        <Grid container spacing={2} component="form" onSubmit={handleManualCoordinates}>
          <Grid item xs={12} sm={5}>
            <Controller
              name="manualLatitude"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="عرض جغرافیایی"
                  variant="outlined"
                  fullWidth
                  placeholder="مثال: 35.6892"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={5}>
            <Controller
              name="manualLongitude"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="طول جغرافیایی"
                  variant="outlined"
                  fullWidth
                  placeholder="مثال: 51.3896"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={2} className="flex items-center">
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleManualCoordinates}
              fullWidth
            >
              اعمال
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default MapTab;