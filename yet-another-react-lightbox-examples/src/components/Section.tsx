import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { Link } from "@/components";

type SectionProps = {
  path: string;
  title: string;
  items: {
    path: string;
    title: string;
  }[];
};

export default function Section({ title, path, items }: SectionProps) {
  return (
    <Container maxWidth="md" sx={{ my: 3 }}>
      <Typography variant="h2" component={Link} href={`/${path}`}>
        {title}
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        sx={(theme) => ({
          "--tiles-columns": 1,
          "--tiles-padding": 12,
          "--tiles-spacing": 12,
          [theme.breakpoints.up("sm")]: {
            "--tiles-columns": 2,
            "--tiles-padding": 12,
            "--tiles-spacing": 12,
          },
          [theme.breakpoints.up("md")]: {
            "--tiles-columns": 3,
            "--tiles-padding": 16,
            "--tiles-spacing": 16,
          },
          gap: "calc(1px * var(--tiles-spacing))",
          mt: 2,
          mb: 3,
        })}
      >
        {items.map((item) => (
          <Paper
            key={item.title}
            variant="outlined"
            component={Link}
            href={`/${path}/${item.path}`}
            sx={{
              width:
                "calc((100% - (var(--tiles-columns) - 1) * var(--tiles-spacing) * 1px) / var(--tiles-columns))",
              padding: "calc(var(--tiles-padding) * 1px)",
              border: "1px solid rgb(229, 234, 242)",
              borderRadius: 3,
              background:
                "linear-gradient(to right top, rgba(235, 245, 255, 0.3) 40%, rgba(243, 246, 249, 0.2) 100%)",
              boxShadow:
                "inset 0 1px 2px rgb(243, 246, 249), 0 1px 2px rgba(229, 234, 242, 0.6)",
              transition:
                "border 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                textDecoration: "none",
                border: "1px solid rgb(153, 204, 255)",
                boxShadow: "0 2px 8px rgb(204, 229, 255)",
              },
            }}
          >
            <Typography variant="h3" component="div">
              {item.title}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
