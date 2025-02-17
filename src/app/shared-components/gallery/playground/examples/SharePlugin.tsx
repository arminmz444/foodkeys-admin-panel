import * as React from "react";

import Lightbox from "yet-another-react-lightbox";
import Share from "yet-another-react-lightbox/plugins/share";

import { LightboxButton, Paragraph, Title } from "@/components";
import slides from "@/data/slides";

export default function SharePlugin() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Title>Share Plugin</Title>

      <Paragraph>Share plugin adds sharing button to the lightbox.</Paragraph>

      {!navigator.canShare && (
        <Paragraph>
          Note: your current browser does not support the Web Share API
        </Paragraph>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        plugins={[Share]}
      />

      <LightboxButton onClick={() => setOpen(true)} />
    </>
  );
}
