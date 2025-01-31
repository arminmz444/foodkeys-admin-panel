import * as React from "react";
import Grid from "@mui/material/Grid";

export default function Filter({ children }: React.PropsWithChildren) {
  return (
    <Grid item xs={12} sm={6} lg={4}>
      {children}
    </Grid>
  );
}
