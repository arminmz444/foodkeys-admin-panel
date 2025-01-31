import Typography, { TypographyProps } from "@mui/material/Typography";

export default function Paragraph({ children, ...rest }: TypographyProps) {
  return (
    <Typography paragraph {...rest}>
      {children}
    </Typography>
  );
}
