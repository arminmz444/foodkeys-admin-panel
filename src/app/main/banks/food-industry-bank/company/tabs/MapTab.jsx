import { useEffect, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Typography, TextField, Paper, Grid, Button } from "@mui/material";
import MapComponent from "app/shared-components/leafletMap/MapComponent";

function MapTab({ tabValue, myIndex = 7 }) {
  const mapRef = useRef(null);
  const methods = useFormContext();
  const { control, setValue, watch } = methods;

  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const commonName = watch("commonName");
  const fullAddress = watch("fullAddress");

  const initialPosition = latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : null;

  useEffect(() => {
    if (tabValue === myIndex && mapRef.current && mapRef.current.invalidateSize) {
      setTimeout(() => {
        if (mapRef.current && mapRef.current.invalidateSize) {
          mapRef.current.invalidateSize();
        }
      }, 300);
    }
  }, [tabValue, myIndex]);

  const handleLocationSelect = (locationData) => {
    if (locationData) {
      if (locationData.latitude !== undefined && locationData.latitude !== null) {
        setValue("latitude", locationData.latitude);
      }
      
      if (locationData.longitude !== undefined && locationData.longitude !== null) {
        setValue("longitude", locationData.longitude);
      }
      
      setValue("commonName", locationData.commonName || "");
      setValue("fullAddress", locationData.fullAddress || "");
    }
  };

  const handleManualCoordinates = (e) => {
    e.preventDefault();
    const manualLat = parseFloat(watch("manualLatitude"));
    const manualLng = parseFloat(watch("manualLongitude"));
    
    if (!isNaN(manualLat) && !isNaN(manualLng)) {
      setValue("latitude", manualLat);
      setValue("longitude", manualLng);
      
      setValue("commonName", "");
      setValue("fullAddress", "");
      
      if (mapRef.current) {
        if (mapRef.current.setView) {
          mapRef.current.setView([manualLat, manualLng], 13);
        } else if (mapRef.current._leaflet_id) {
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