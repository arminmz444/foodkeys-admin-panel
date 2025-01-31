import Box from "@mui/material/Box";
import Button, { ButtonProps } from "@mui/material/Button";

export type LightboxButtonProps = Pick<ButtonProps, "onClick">;

export default function LightboxButton({ onClick }: LightboxButtonProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Button variant="contained" onClick={onClick}>
        Open Lightbox
      </Button>
    </Box>
  );
}
