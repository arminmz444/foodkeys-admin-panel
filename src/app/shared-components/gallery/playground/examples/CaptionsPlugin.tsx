import * as React from "react";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";

import { LightboxButton, Paragraph, Title } from "@/components";
import {
  CheckboxFilter,
  SelectFilter,
  Settings,
  SliderFilter,
} from "@/components/playground";
import slides from "@/data/slides";

export default function CaptionsPlugin() {
  const [open, setOpen] = React.useState(false);
  const [showToggle, setShowToggle] = React.useState(false);
  const [descriptionMaxLines, setDescriptionMaxLines] = React.useState(3);
  const [descriptionTextAlign, setDescriptionTextAlign] = React.useState<
    "start" | "end" | "center"
  >("start");

  return (
    <>
      <Title>Captions Plugin</Title>

      <Paragraph>
        Captions plugin allows you to add titles and descriptions to your
        slides.
      </Paragraph>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[
          {
            ...slides[2],
            title: "Flamingo",
            description: "Vicko Mozara\n\nVeliki zali, Dubravica, Croatia",
          },
          {
            ...slides[3],
            title: "Starfish on a sand beach",
            description: "Pedro Lastra\n\nKey West, Florida, United States",
          },
          {
            ...slides[6],
            title:
              "The last night of a two week stay on the North Shore of Oahu, Hawaii",
            description:
              "Sean Oulashin\n\nNorth Shore, Waialua, Hawaii, United States",
          },
        ]}
        plugins={[Captions]}
        captions={{ showToggle, descriptionTextAlign, descriptionMaxLines }}
      />

      <LightboxButton onClick={() => setOpen(true)} />

      <Paragraph>You can adjust the live demo settings below.</Paragraph>

      <Settings>
        <SelectFilter
          label="descriptionTextAlign"
          options={["start", "end", "center"]}
          value={descriptionTextAlign}
          onChange={(value) => setDescriptionTextAlign(value)}
        />
        <SliderFilter
          label="descriptionMaxLines"
          min={1}
          max={5}
          value={descriptionMaxLines}
          onChange={(value) => setDescriptionMaxLines(value)}
        />
        <CheckboxFilter
          label="showToggle"
          checked={showToggle}
          onChange={(value) => setShowToggle(value)}
        />
      </Settings>
    </>
  );
}
