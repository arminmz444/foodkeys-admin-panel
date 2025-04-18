import * as React from "react";

import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

import { LightboxButton, Paragraph, Title } from "@/components";
import slides from "@/data/slides";

export default function FullscreenPlugin() {
  const [open, setOpen] = React.useState(false);
  const [auto, setAuto] = React.useState(false);

  const isFullscreenEnabled = () =>
    document.fullscreenEnabled ??
    document.webkitFullscreenEnabled ??
    document.mozFullScreenEnabled ??
    document.msFullscreenEnabled;

  if (!isFullscreenEnabled()) {
    return (
      <>
        <Title>Fullscreen Plugin</Title>

        <Paragraph>
          Fullscreen plugin doesn't work in some browsers (i.e. Safari on
          iPhone) or inside iframes.
        </Paragraph>

        <Paragraph>
          Please open this demo in a separate window or try a different browser.
        </Paragraph>
      </>
    );
  }

  return (
    <>
      <Title>Fullscreen Plugin</Title>

      <Paragraph>
        Fullscreen plugin adds the "fullscreen" button in browsers that support
        fullscreen mode.
      </Paragraph>

      <LightboxButton
        onClick={() => {
          setAuto(false);
          setOpen(true);
        }}
      />

      <Paragraph>
        The fullscreen mode can be requested automatically. However, this
        doesn't work in all browsers.
      </Paragraph>

      <LightboxButton
        onClick={() => {
          setAuto(true);
          setOpen(true);
        }}
      />

      <Lightbox
        open={open}
        fullscreen={{ auto }}
        close={() => setOpen(false)}
        slides={slides}
        plugins={[Fullscreen]}
      />
    </>
  );
}
