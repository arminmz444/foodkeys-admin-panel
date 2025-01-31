import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

export default function Settings({ children }: React.PropsWithChildren) {
  return (
    <Paper variant="outlined" sx={{ p: 2, textAlign: "left" }}>
      <Grid container rowSpacing={2} columnSpacing={4}>
        {children}
      </Grid>
    </Paper>
  );
}
