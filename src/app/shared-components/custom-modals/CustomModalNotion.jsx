import React from "react";

function CustomModalNotion() {
  return (
    <div
      className="autolayout-col autolayout-fill-width"
      style={{ gap: 0 }}
    >
      <div
        style={{
          paddingLeft: 24,
          paddingRight: 26,
          width: 424,
        }}
      >
        <div
          style={{
            height: 294,
            overflowY: "hidden",
            maskImage:
              "linear-gradient(rgba(0, 0, 0, 0) 24px, rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 265px)",
          }}
        >
          {/* Row container */}
          <div
            className="autolayout-row autolayout-fill-width autolayout-fill-height autolayout-center"
            style={{ gap: 0 }}
          >
            {/* Image container */}
            <div
              style={{
                alignContent: "center",
                paddingLeft: 2,
                opacity: 1,
              }}
            >
              {/* Notice <img /> is self-closing */}
              <img
                src="/_assets/experimental/d96dbdbbe0581121.gif"
                alt="Notion AI logo"
                style={{
                  pointerEvents: "none",
                  width: 72,
                  height: 72,
                  boxShadow:
                    "rgba(0,0,0,0.16) 0px 4px 12px -2px, rgba(255,255,255,0.094) 0px 0px 0px 1px",
                  borderRadius: 100,
                  flexGrow: 0,
                }}
              />
            </div>

            {/* The “sliding” div of items */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginLeft: 24,
                overflowY: "hidden",
                opacity: 1,
                transform: "translateY(-479.266px) translateZ(0px)",
              }}
            >
              {/* Example of each “bubble” */}
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  padding: "8px 16px 8px 12px",
                  borderRadius: 18,
                  backgroundColor: "rgba(255, 255, 255, 0.055)",
                  color: "rgb(225, 225, 225)",
                  fontSize: 14,
                  flexWrap: "nowrap",
                  fontWeight: 500,
                  gap: 8,
                  width: "fit-content",
                }}
              >
                <svg
                  aria-hidden="true"
                  role="graphics-symbol"
                  viewBox="0 0 16 16"
                  className="find"
                  style={{
                    width: 16,
                    height: 16,
                    display: "block",
                    fill: "inherit",
                    flexShrink: 0,
                    marginTop: 2,
                    color: "rgba(35, 131, 226, 0.57)",
                  }}
                >
                  <path d="M1.25293 6.82031C1.25293 3.75098 3.74805 1.25586 6.81738 1.25586C9.88672 1.25586 12.3818 3.75098 12.3818 6.82031C12.3818 8.0166 11.9922 9.12402 11.3428 10.0195L14.4668 13.1504C14.6514 13.3418 14.7471 13.5947 14.7471 13.8682C14.7471 14.4355 14.3301 14.873 13.749 14.873C13.4824 14.873 13.2158 14.7842 13.0244 14.5859L9.87988 11.4414C9.00488 12.0361 7.95898 12.3848 6.81738 12.3848C3.74805 12.3848 1.25293 9.88965 1.25293 6.82031ZM2.70215 6.82031C2.70215 9.08984 4.54102 10.9355 6.81738 10.9355C9.08691 10.9355 10.9326 9.08984 10.9326 6.82031C10.9326 4.55078 9.08691 2.70508 6.81738 2.70508C4.54102 2.70508 2.70215 4.55078 2.70215 6.82031Z" />
                </svg>
                Ask a question
              </div>

              {/* Repeat for each bubble item, etc. */}
              ...
            </div>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 25,
            fontWeight: 700,
            paddingBottom: 8,
          }}
        >
          Meet the new Notion AI
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "rgb(127, 127, 127)",
          }}
        >
          One AI tool that does it all. Search, generate, analyze, and
          chat—right inside Notion.
        </div>

        <div
          className="autolayout-row autolayout-fill-width autolayout-center autolayout-space"
          style={{
            paddingTop: 8,
            paddingBottom: 24,
            marginTop: 20,
          }}
        >
          {/* Learn more link */}
          <div
            style={{
              color: "rgba(255, 255, 255, 0.443)",
              fontSize: 12,
              textDecoration: "underline",
            }}
          >
            <a
              href="https://www.notion.so/help/guides/everything-you-can-do-with-notion-ai"
              target="_blank"
              rel="noopener noreferrer"
              role="link"
              style={{
                display: "flex",
                color: "inherit",
                textDecoration: "none",
                userSelect: "none",
                transition: "background 20ms ease-in",
                cursor: "pointer",
                width: "max-content",
                marginLeft: -4,
                alignItems: "center",
                paddingLeft: 4,
                paddingRight: 4,
              }}
            >
              Learn more
              <svg
                aria-hidden="true"
                role="graphics-symbol"
                viewBox="0 0 17 16"
                className="externalLink"
                style={{
                  width: 14,
                  height: 14,
                  display: "block",
                  fill: "inherit",
                  flexShrink: 0,
                  marginTop: 2,
                  marginLeft: 4,
                }}
              >
                <path d="M4.94922 13.498C4.31641 13.498 3.83789 13.3359 3.51367 13.0117C3.18945 12.6914 3.02734 12.2188 3.02734 11.5938V4.46289C3.02734 3.83398 3.18945 3.35938 3.51367 3.03906C3.83789 2.71875 4.31641 2.55859 4.94922 2.55859H12.0449C12.6777 2.55859 13.1562 2.71875 13.4805 3.03906C13.8047 3.35938 13.9668 3.83398 13.9668 4.46289V11.5938C13.9668 12.2188 13.8047 12.6914 13.4805 13.0117C13.1562 13.3359 12.6777 13.498 12.0449 13.498H4.94922ZM5.01953 12.3438H11.9746C12.2441 12.3438 12.4512 12.2734 12.5957 12.1328C12.7402 11.9922 12.8125 11.7793 12.8125 11.4941V4.55664C12.8125 4.27539 12.7402 4.06445 12.5957 3.92383C12.4512 3.7832 12.2441 3.71289 11.9746 3.71289H5.01953C4.74609 3.71289 4.53711 3.7832 4.39258 3.92383C4.25195 4.06445 4.18164 4.27539 4.18164 4.55664V11.4941C4.18164 11.7793 4.25195 11.9922 4.39258 12.1328C4.53711 12.2734 4.74609 12.3438 5.01953 12.3438ZM10.334 9.54297C10.1855 9.54297 10.0664 9.49609 9.97656 9.40234C9.89062 9.30859 9.84766 9.17969 9.84766 9.01562V8.08398L9.93555 7.24609L9.15039 8.10156L7.09961 10.1465C6.99023 10.2559 6.85742 10.3105 6.70117 10.3105C6.55273 10.3105 6.42969 10.2637 6.33203 10.1699C6.23828 10.0762 6.19141 9.95117 6.19141 9.79492C6.19141 9.6582 6.24609 9.53516 6.35547 9.42578L8.41211 7.36914L9.2793 6.57227L8.47656 6.66602H7.48633C7.32617 6.66602 7.19727 6.62305 7.09961 6.53711C7.00586 6.45117 6.95898 6.33203 6.95898 6.17969C6.95898 6.03516 7.00586 5.91992 7.09961 5.83398C7.19727 5.74414 7.32422 5.69922 7.48047 5.69922H10.2227C10.4062 5.69922 10.5508 5.74609 10.6562 5.83984C10.7617 5.93359 10.8145 6.08398 10.8145 6.29102V9.00977C10.8145 9.16602 10.7695 9.29492 10.6797 9.39648C10.5938 9.49414 10.4785 9.54297 10.334 9.54297Z" />
              </svg>
            </a>
          </div>

          {/* Buttons area */}
          <div
            className="autolayout-row autolayout-center-right"
            style={{ gap: 12 }}
          >
            <div
              role="button"
              tabIndex={0}
              style={{
                userSelect: "none",
                transition: "background 20ms ease-in",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                height: 36,
                paddingRight: 12,
                paddingLeft: 12,
                borderRadius: 8,
                whiteSpace: "nowrap",
                fontSize: 14,
                justifyContent: "center",
                flexShrink: 0,
                background: "rgb(50, 50, 50)",
                color: "white",
                fill: "white",
                lineHeight: 1.2,
                fontWeight: 500,
              }}
            >
              Try it
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomModalNotion;
