import * as React from "react";

export default [
  {
    path: "examples",
    title: "Examples",
    children: [
      {
        path: "basic",
        title: "Basic Example",
        Component: React.lazy(() => import("@/examples/BasicExample")),
      },
      {
        path: "playground",
        title: "Playground",
        Component: React.lazy(() => import("@/examples/Playground")),
      },
      {
        path: "custom-slides",
        title: "Custom Slides",
        Component: React.lazy(() => import("@/examples/CustomSlides")),
      },
      {
        path: "gallery",
        title: "Photo Gallery",
        Component: React.lazy(() => import("@/examples/Gallery")),
      },
      {
        path: "carousel",
        title: "Carousel",
        Component: React.lazy(() => import("@/examples/Carousel")),
      },
    ],
  },
  {
    path: "plugins",
    title: "Plugins",
    children: [
      {
        path: "captions",
        title: "Captions",
        Component: React.lazy(() => import("@/examples/CaptionsPlugin")),
      },
      {
        path: "counter",
        title: "Counter",
        Component: React.lazy(() => import("@/examples/CounterPlugin")),
      },
      {
        path: "download",
        title: "Download",
        Component: React.lazy(() => import("@/examples/DownloadPlugin")),
      },
      {
        path: "fullscreen",
        title: "Fullscreen",
        Component: React.lazy(() => import("@/examples/FullscreenPlugin")),
      },
      {
        path: "inline",
        title: "Inline",
        Component: React.lazy(() => import("@/examples/InlinePlugin")),
      },
      {
        path: "share",
        title: "Share",
        Component: React.lazy(() => import("@/examples/SharePlugin")),
      },
      {
        path: "slideshow",
        title: "Slideshow",
        Component: React.lazy(() => import("@/examples/SlideshowPlugin")),
      },
      {
        path: "thumbnails",
        title: "Thumbnails",
        Component: React.lazy(() => import("@/examples/ThumbnailsPlugin")),
      },
      {
        path: "video",
        title: "Video",
        Component: React.lazy(() => import("@/examples/VideoPlugin")),
      },
      {
        path: "zoom",
        title: "Zoom",
        Component: React.lazy(() => import("@/examples/ZoomPlugin")),
      },
    ],
  },
];
