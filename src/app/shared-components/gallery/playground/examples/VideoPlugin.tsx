import * as React from "react";

import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";

import { LightboxButton, Paragraph, Title } from "@/components";
import {
  CheckboxFilter,
  FlexLineBreak,
  SelectFilter,
  Settings,
} from "@/components/playground";

import slides from "@/data/slides";
import videos from "@/data/videos";

export default function VideoPlugin() {
  const [open, setOpen] = React.useState(false);

  const [controls, setControls] = React.useState(true);
  const [playsInline, setPlaysInline] = React.useState(true);
  const [autoPlay, setAutoPlay] = React.useState(false);
  const [loop, setLoop] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [disablePictureInPicture, setDisablePictureInPicture] =
    React.useState(false);
  const [disableRemotePlayback, setDisableRemotePlayback] =
    React.useState(false);
  const [controlsList, setControlsList] = React.useState<
    ("nodownload" | "nofullscreen" | "noremoteplayback")[]
  >([]);
  const [crossOrigin, setCrossOrigin] = React.useState("");
  const [preload, setPreload] = React.useState("");

  return (
    <>
      <Title>Video Plugin</Title>

      <Paragraph>Video plugin adds support for video slides.</Paragraph>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[...videos, ...slides]}
        plugins={[Video]}
        video={{
          controls,
          playsInline,
          autoPlay,
          loop,
          muted,
          disablePictureInPicture,
          disableRemotePlayback,
          controlsList: controlsList.join(" "),
          crossOrigin,
          preload,
        }}
      />

      <LightboxButton onClick={() => setOpen(true)} />

      <Paragraph>You can adjust the live demo settings below.</Paragraph>

      <Settings>
        <CheckboxFilter
          label="controls"
          checked={controls}
          onChange={(checked) => setControls(checked)}
        />
        <CheckboxFilter
          label="playsInline"
          checked={playsInline}
          onChange={(checked) => setPlaysInline(checked)}
        />
        <CheckboxFilter
          label="autoPlay"
          checked={autoPlay}
          onChange={(checked) => setAutoPlay(checked)}
        />
        <CheckboxFilter
          label="loop"
          checked={loop}
          onChange={(checked) => setLoop(checked)}
        />
        <CheckboxFilter
          label="muted"
          checked={muted}
          onChange={(checked) => setMuted(checked)}
        />
        <CheckboxFilter
          label="disablePictureInPicture"
          checked={disablePictureInPicture}
          onChange={(checked) => setDisablePictureInPicture(checked)}
        />
        <CheckboxFilter
          label="disableRemotePlayback"
          checked={disableRemotePlayback}
          onChange={(checked) => setDisableRemotePlayback(checked)}
        />
        <FlexLineBreak />
        <SelectFilter
          multiple
          label="controlsList"
          value={controlsList}
          onChange={(value) => setControlsList(value)}
          options={["nodownload", "nofullscreen", "noremoteplayback"]}
        />
        <SelectFilter
          label="crossOrigin"
          value={crossOrigin}
          onChange={(value) => setCrossOrigin(value)}
          options={["", "anonymous", "use-credentials"]}
        />
        <SelectFilter
          label="preload"
          value={preload}
          onChange={(value) => setPreload(value)}
          options={["", "none", "metadata", "auto"]}
        />
      </Settings>
    </>
  );
}
