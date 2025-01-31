import * as React from "react";

import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";

import { LightboxButton, Paragraph, Title } from "@/components";
import slides from "@/data/slides";

export default function DownloadPlugin() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Title>Download Plugin</Title>

      <Paragraph>
        Download plugin adds download button to the lightbox.
      </Paragraph>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        plugins={[Download]}
      />

      <LightboxButton onClick={() => setOpen(true)} />
    </>
  );
}
