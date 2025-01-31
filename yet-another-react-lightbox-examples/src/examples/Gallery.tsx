import * as React from "react";

import Lightbox from "yet-another-react-lightbox";

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import { Paragraph, Title } from "@/components";
import slides from "@/data/slides";

export default function Gallery() {
  const [index, setIndex] = React.useState(-1);

  return (
    <>
      <Title>Gallery</Title>

      <Paragraph>
        Here is an example of a photo gallery with a lightbox. You can click any
        photo to open it in a lightbox.
      </Paragraph>

      <RowsPhotoAlbum
        photos={slides}
        targetRowHeight={150}
        onClick={({ index: current }) => setIndex(current)}
      />

      <Lightbox
        index={index}
        slides={slides}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
    </>
  );
}
