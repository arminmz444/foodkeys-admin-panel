import * as React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import "yet-another-react-lightbox/styles.css";

import { Link, Section, Paragraph } from "@/components";
import sitemap from "@/data/sitemap";

function Layout() {
  return (
    <Container maxWidth="lg" sx={{ textAlign: "center" }}>
      <Box component="header" sx={{ mt: 3, mb: 2 }}>
        <Link variant="h1" href="/">
          Yet Another React Lightbox
        </Link>
      </Box>

      <Divider sx={{ margin: "8px auto" }} />

      <Box component="main" sx={{ mb: 3 }}>
        <React.Suspense>
          <Outlet />
        </React.Suspense>
      </Box>
    </Container>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <>
                {sitemap.map(({ path, title, children }) => (
                  <Section
                    key={path}
                    title={title}
                    path={path}
                    items={children}
                  />
                ))}

                <Typography variant="h2" color="primary">
                  Sandbox
                </Typography>

                <Paragraph mt={2}>
                  Are you looking for a sandbox to porvide an example or
                  reproduce an issue? Here is a{" "}
                  <a
                    href="https://stackblitz.com/edit/yet-another-react-lightbox-sandbox?file=src%2FApp.tsx"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    minimal sandbox
                  </a>
                  .
                </Paragraph>
              </>
            }
          />

          {sitemap.map(({ path, title, children }) => (
            <Route key={path} path={path}>
              <Route
                index
                element={<Section title={title} path={path} items={children} />}
              />

              {children.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            </Route>
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
