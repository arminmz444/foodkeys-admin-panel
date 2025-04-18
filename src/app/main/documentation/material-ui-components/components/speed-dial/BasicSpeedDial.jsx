import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import { styled } from "@mui/material/styles";
import { Backdrop } from "@mui/material";
const defaultActions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
  { icon: <SaveIcon />, name: "Save" },
];

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: "absolute",
  "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

export default function BasicSpeedDial({
  actions = defaultActions,
  direction = "up",
  hidden = false,
  ariaLabel,
  icon,
  enableBackdrop = false,
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Box
      sx={{
        height: 320,
        position: "relative",
        transform: "translateZ(0px)",
        // zIndex: 100,
        flexGrow: 1,
      }}
    >
      {enableBackdrop ? <Backdrop open={open} /> : <></>}
      <StyledSpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
        icon={<SpeedDialIcon />}
        hidden={hidden}
        direction={direction}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
          />
        ))}
      </StyledSpeedDial>
    </Box>
  );
}
