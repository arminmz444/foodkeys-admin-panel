import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Inline from "yet-another-react-lightbox/plugins/inline";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { Paragraph, Title } from "@/components";
import slides from "@/data/slides";

const inline = {
  style: {
    width: "100%",
    maxWidth: "900px",
    aspectRatio: "3 / 2",
    margin: "0 auto",
  },
};

export default function InlinePlugin() {
  return (
    <>
      <Title>Inline Plugin</Title>

      <Paragraph>
        The Inline plugin transforms the lightbox into an image carousel that
        renders inline on the webpage.
      </Paragraph>

      <Paragraph>Image carousel:</Paragraph>

      <Lightbox slides={slides} inline={inline} plugins={[Inline]} />

      <br />

      <Paragraph>
        Image carousel with <code>imageFit: "cover"</code>:
      </Paragraph>

      <Lightbox
        slides={slides}
        inline={inline}
        carousel={{
          spacing: 0,
          padding: 0,
          imageFit: "cover",
        }}
        plugins={[Inline]}
      />

      <br />

      <Paragraph>
        Image carousel with Fullscreen, Slideshow, Thumbnails and Zoom plugins:
      </Paragraph>

      <Lightbox
        slides={slides}
        inline={inline}
        plugins={[Inline, Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </>
  );
}
