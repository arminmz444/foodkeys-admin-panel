import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs-preset-webpage";
import "grapesjs-blocks-basic";
import "grapesjs-plugin-forms";
import "grapesjs-component-countdown";
import "grapesjs-plugin-export";
import "grapesjs-tabs";
import "grapesjs-custom-code";
import "grapesjs-touch";
import "grapesjs-parser-postcss";
import "grapesjs-tooltip";
import "grapesjs-tui-image-editor";
import "grapesjs-typed";
import "grapesjs-style-bg";

function configureBasicExtensions(editor) {
  const bm = editor.BlockManager;

  //
  // 1. TEXT SECTION
  //
  // Simple block with a heading & paragraph
  bm.add("text-section", {
    label: "Text section",
    category: "Basic",
    attributes: { class: "fa fa-align-left" }, // icon from Font Awesome
    content: `
		<section class="p-4">
		  <h2 class="text-2xl font-bold">Text Section Title</h2>
		  <p class="mt-2">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
			Vestibulum rutrum ipsum nec tincidunt posuere.
		  </p>
		</section>
	  `,
  });

  //
  // 2. MAP (dynamic)
  //
  // We define a custom component type with a "location" trait so you can
  // type an address (e.g. "New York") and it updates the embedded Google map.
  //
  editor.DomComponents.addType("custom-map", {
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "gjs-map-block" },
        // We'll nest an <iframe> that points to Google Maps
        components: `
			<iframe
			  style="width:100%; height:350px;"
			  frameborder="0"
			  src="https://maps.google.com/maps?q=New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed">
			</iframe>
		  `,
        traits: [
          {
            type: "text",
            label: "Location",
            name: "location",
            changeProp: 1,
          },
        ],
        // This 'script' runs in the browser context (the canvas)
        // to update the <iframe> whenever "location" changes
        script: function () {
          var loc = "{[ location ]}"; // GrapesJS variable
          var iframe = this.querySelector("iframe");
          if (loc) {
            var encodedLoc = encodeURIComponent(loc);
            iframe.src =
              "https://maps.google.com/maps?q=" +
              encodedLoc +
              "&t=&z=13&ie=UTF8&iwloc=&output=embed";
          }
        },
      },
    },
  });

  // Now create the actual block pointing to our custom-map component
  bm.add("map-block", {
    label: "Map",
    category: "Basic",
    attributes: { class: "fa fa-map-o" }, // map icon
    content: { type: "custom-map" },
  });

  //
  // 3. LINK BLOCK
  //
  // “Link Block” is often provided by `grapesjs-blocks-basic` as "link-block."
  // We’ll try to get it, and if it exists, re-categorize. Otherwise we define a new one.
  //
  const linkBlock = bm.get("link-block");
  if (linkBlock) {
    // Just relabel & recategorize
    linkBlock.set({
      label: "Link Block",
      category: "Basic",
      attributes: { class: "fa fa-link" },
    });
  } else {
    // If it doesn't exist, define our own
    bm.add("link-block", {
      label: "Link Block",
      category: "Basic",
      attributes: { class: "fa fa-link" },
      content: {
        type: "link",
        style: {
          display: "inline-block",
          padding: "10px",
          "min-height": "50px",
          "min-width": "100px",
          "background-color": "#ECECEC",
          "text-decoration": "none",
          color: "#333",
        },
        content: "Drag elements here or click to edit link",
        traits: [
          {
            type: "text",
            label: "URL",
            name: "href",
            changeProp: 1,
          },
          {
            type: "checkbox",
            label: "Open in new tab",
            name: "target",
            valueTrue: "_blank",
            valueFalse: "",
          },
        ],
      },
    });
  }

  //
  // 4. QUOTE
  //
  // A simple <blockquote> with a cite.
  //
  bm.add("quote-block", {
    label: "Quote",
    category: "Basic",
    attributes: { class: "fa fa-quote-right" }, // or 'fa fa-quote-left'
    content: `
		<blockquote class="border-l-4 border-gray-400 pl-4 italic text-gray-600">
		  "The only limit to our realization of tomorrow is our doubts of today."
		  <cite class="block mt-2">- Franklin D. Roosevelt</cite>
		</blockquote>
	  `,
  });
}
function configureMiniApps(editor) {
  const bm = editor.BlockManager;

  //   editor.DomComponents.addType('my-custom-type', {
  // 	model: {
  // 	  defaults: {
  // 		tagName: 'div',
  // 		// Some sample HTML content
  // 		components: '<div style="background: #eee; width: 200px; height: 100px;">Resizable box</div>',

  // 		// The key part: resizable
  // 		resizable: {
  // 		  tl: 1, // top-left
  // 		  tc: 1, // top-center
  // 		  tr: 1, // top-right
  // 		  cl: 1, // center-left
  // 		  cr: 1, // center-right
  // 		  bl: 1, // bottom-left
  // 		  bc: 1, // bottom-center
  // 		  br: 1, // bottom-right
  // 		  // Optionally define min/max dimensions in px
  // 		  minDim: 50,
  // 		  maxDim: 1000,
  // 		},
  // 	  },
  // 	},
  //   });
  editor.DomComponents.addType("e-signature", {
    model: {
      defaults: {
        tagName: "div",
        // A class for styling (optional)
        attributes: { class: "gjs-e-signature-block" },
        resizable: {
          tl: 1, // top-left
          tc: 1, // top-center
          tr: 1, // top-right
          cl: 1, // center-left
          cr: 1, // center-right
          bl: 1, // bottom-left
          bc: 1, // bottom-center
          br: 1, // bottom-right
          // Optionally define min/max dimensions in px
          minDim: 50,
          maxDim: 1000,
        },
        // The HTML structure
        components: `
          <label class="esig-label">امضای دیجیتال</label>
          <div class="esig-wrapper" style="display: flex; gap: 1rem; align-items: center;">
            <!-- Canvas container -->
            <div style="position: relative; border: 1px solid #ccc; width: 300px; height: 150px;">
              <canvas class="esig-canvas" style="width:100%; height:100%;"></canvas>
              <!-- "Sign Here" placeholder text -->
              <div class="esig-placeholder"
                   style="position:absolute; top:0; left:0; width:100%; height:100%;
                          display:flex; justify-content:center; align-items:center;
                          pointer-events:none; color:#999;">
                Sign Here
              </div>
            </div>

            <!-- Preview of the drawn signature -->
            <img class="esig-preview"
                 src=""
                 alt="Signature Preview"
                 style="border:1px solid #ccc; width:150px; height:150px; object-fit:contain;" />
          </div>

          <!-- Hidden input to store signature data URL -->
          <input type="hidden" class="esig-data" name="myesig" />

          <!-- Clear button -->
          <button type="button" class="esig-clear" style="margin-top:5px;">Clear</button>
        `,

        // Traits for label, name, placeholder, etc.
        traits: [
          {
            type: "text",
            label: "Label",
            name: "labelText",
            changeProp: 1,
            default: "امضای دیجیتال",
          },
          {
            type: "text",
            label: "Name",
            name: "fieldName",
            changeProp: 1,
            default: "myesig",
          },
          {
            type: "text",
            label: "Placeholder",
            name: "placeholderText",
            changeProp: 1,
            default: "Sign Here",
          },
          {
            type: "text",
            label: "Tooltip",
            name: "tooltipText",
            changeProp: 1,
            default: "",
          },
          {
            type: "checkbox",
            label: "Required",
            name: "required",
            changeProp: 1,
            default: false,
          },
        ],

        /**
         * The `script` runs inside the GrapesJS Canvas (iframe) context
         * and sets up the drawing logic on the canvas.
         */
        script: function () {
          // DOM references
          var labelEl = this.querySelector(".esig-label");
          var placeholderEl = this.querySelector(".esig-placeholder");
          var canvas = this.querySelector(".esig-canvas");
          var preview = this.querySelector(".esig-preview");
          var hiddenInput = this.querySelector(".esig-data");
          var clearBtn = this.querySelector(".esig-clear");

          // We retrieve trait values from placeholders
          var labelText = "{[ labelText ]}";
          var placeholderText = "{[ placeholderText ]}";
          var fieldName = "{[ fieldName ]}";

          // Update label, placeholder, name
          if (labelEl) labelEl.textContent = labelText || "امضای دیجیتال";
          if (placeholderEl)
            placeholderEl.textContent = placeholderText || "Sign Here";
          if (hiddenInput && fieldName) hiddenInput.name = fieldName;

          // Initialize basic drawing
          var ctx = canvas.getContext("2d");
          var drawing = false;

          // Start drawing
          canvas.addEventListener("mousedown", function (e) {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
          });

          // Drawing in progress
          canvas.addEventListener("mousemove", function (e) {
            if (!drawing) return;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
          });

          // Finished drawing => update hidden input + preview
          canvas.addEventListener("mouseup", function (e) {
            drawing = false;
            var dataUrl = canvas.toDataURL();
            hiddenInput.value = dataUrl;
            preview.src = dataUrl;
          });

          // Clear button
          clearBtn.addEventListener("click", function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hiddenInput.value = "";
            preview.src = "";
          });
        },
      },

      // Force re-run the script if certain traits change
      init() {
        this.on("change:labelText", () => this.trigger("change:script"));
        this.on("change:placeholderText", () => this.trigger("change:script"));
        this.on("change:fieldName", () => this.trigger("change:script"));
        // etc. for any other dynamic trait changes
      },
    },
  });

  // 2. Add the block to the "Forms" category
  editor.BlockManager.add("e-signature-block", {
    label: "E-signature",
    category: "Forms",
    attributes: { class: "fa fa-pencil-square-o" }, // icon
    content: { type: "e-signature" },
  });

  bm.add("react-form-builder", {
    label: "Form Builder App",
    category: "miniapps",
    attributes: { class: "fa fa-wpforms" },
    content: {
      type: "react-form-builder-app",
    },
  });

  // Then define a custom component type for the iframe
  editor.DomComponents.addType("react-form-builder-app", {
    model: {
      defaults: {
        tagName: "iframe",
        attributes: {
          src: "http://localhost:3000/dashboards/analytics",
          // Possibly set a min height
          style: "width: 100%; min-height: 600px; border: none;",
        },
        // This makes it not droppable
        droppable: false,
        // Some traits to let the user edit the src or size
        traits: [
          {
            type: "text",
            name: "src",
            label: "Iframe URL",
            changeProp: 1,
          },
          {
            type: "text",
            name: "height",
            label: "Height (px)",
            changeProp: 1,
          },
        ],
      },
    },
    view: {
      onRender() {
        // If user changes 'src' trait, update the iframe
        const src = this.model.get("src");
        const el = this.el;
        if (src) el.setAttribute("src", src);
        const height = this.model.get("height");
        if (height) el.style.height = `${height}px`;
      },
    },
  });
}

function configureFormFields(editor) {
  const bm = editor.BlockManager;

  // Each type from your FIELD_TYPES array
  const fieldTypes = [
    { type: "text", label: "Text Field", icon: "fa fa-font" },
    { type: "password", label: "Password", icon: "fa fa-asterisk" },
    { type: "select", label: "Select", icon: "fa fa-caret-down" },
    { type: "checkbox", label: "Checkbox", icon: "fa fa-check-square-o" },
    { type: "radio", label: "Radio", icon: "fa fa-dot-circle-o" },
    { type: "number", label: "Number", icon: "fa fa-sort-numeric-asc" },
    { type: "textarea", label: "Textarea", icon: "fa fa-align-left" },
    { type: "email", label: "Email", icon: "fa fa-envelope" },
    { type: "range", label: "Range", icon: "fa fa-sliders" },
    { type: "search", label: "Search", icon: "fa fa-search" },
    { type: "tel", label: "Tel", icon: "fa fa-phone" },
    { type: "url", label: "URL", icon: "fa fa-link" },
    { type: "time", label: "Time", icon: "fa fa-clock-o" },
    { type: "datetime", label: "Datetime", icon: "fa fa-clock-o" },
    { type: "datetime-local", label: "Datetime-Local", icon: "fa fa-clock-o" },
    { type: "week", label: "Week", icon: "fa fa-calendar" },
    { type: "month", label: "Month", icon: "fa fa-calendar" },
    // date is commented out in your code, so skip it
  ];

  fieldTypes.forEach((ft) => {
    bm.add(`form-field-${ft.type}`, {
      label: ft.label,
      category: "Forms",
      attributes: { class: ft.icon },
      content: {
        type: "input", // GrapesJS built-in type
        // We'll store the HTML attributes
        attributes: { type: ft.type, placeholder: ft.label },
        // Optionally add some traits so user can edit label, etc.
        traits: [
          "name",
          "placeholder",
          {
            type: "checkbox",
            name: "required",
            label: "Required",
          },
        ],
        // ...
      },
    });
  });
}

function configureExtraBlocks(editor) {
  const bm = editor.BlockManager;

  // Re-label or re-category the countdown block from grapesjs-component-countdown
  const countdownBlock = bm.get("countdown");
  if (countdownBlock) {
    countdownBlock.set({
      label: "Countdown",
      category: "Extra",
      attributes: { class: "fa fa-clock-o" },
    });
  }

  // Tabs from grapesjs-tabs
  const tabsBlock = bm.get("tabs");
  if (tabsBlock) {
    tabsBlock.set({
      label: "Tabs",
      category: "Extra",
      attributes: { class: "fa fa-folder" },
    });
  }

  // Custom Code from grapesjs-custom-code
  const customCodeBlock = bm.get("custom-code");
  if (customCodeBlock) {
    customCodeBlock.set({
      label: "Custom Code",
      category: "Extra",
      attributes: { class: "fa fa-code" },
    });
  }

  // Tooltip from grapesjs-tooltip
  const tooltipBlock = bm.get("tooltip");
  if (tooltipBlock) {
    tooltipBlock.set({
      label: "Tooltip",
      category: "Extra",
      attributes: { class: "fa fa-commenting-o" },
    });
  }

  // Typed from grapesjs-typed
  const typedBlock = bm.get("typed");
  if (typedBlock) {
    typedBlock.set({
      label: "Typed",
      category: "Extra",
      attributes: { class: "fa fa-i-cursor" },
    });
  }
}

function configureArmoVideo(editor) {
  const bm = editor.BlockManager;

  // 1. Create a new component type
  editor.DomComponents.addType("armo-video", {
    model: {
      defaults: {
        tagName: "video",
        // Let the user drop it anywhere
        droppable: false,
        // We'll store the base URL in code; you can also store it in a trait if you want
        attributes: {
          controls: true,
          src: "",
        },
        traits: [
          {
            type: "text",
            name: "fileId",
            label: "File ID (UUID)",
            changeProp: 1,
          },
          {
            type: "checkbox",
            name: "autoplay",
            label: "Autoplay",
          },
          {
            type: "checkbox",
            name: "controls",
            label: "Show Controls",
          },
        ],
        // The 'script' below runs in the browser when the component is rendered
        script: function () {
          var baseUrl = "https://api.example.com/stream/";
          var fileId = "{[ fileId ]}";
          var vid = this.el;

          // If fileId changes, set the src
          if (fileId) {
            vid.src = baseUrl + fileId;
          }
          // Autoplay?
          if ("{[ autoplay ]}" === "true") {
            vid.autoplay = true;
          } else {
            vid.autoplay = false;
          }
          // Controls?
          if ("{[ controls ]}" === "true") {
            vid.controls = true;
          } else {
            vid.removeAttribute("controls");
          }
        },
      },
    },
  });

  // 2. Add a block to show in the “Extra” (or “Forms”) category
  bm.add("armo-video-block", {
    label: "Armo Video",
    category: "Extra", // or 'Forms', etc.
    attributes: { class: "fa fa-video-camera" },
    content: {
      type: "armo-video",
      style: { width: "100%", height: "300px" },
    },
  });
}

function configureLayoutBlocks(editor) {
  const bm = editor.BlockManager;

  // A Tailwind "Grid 2 columns" block
  bm.add("grid-2-cols", {
    label: "Grid (2 Columns)",
    category: "Layout",
    attributes: { class: "fa fa-th-large" },
    content: `
		<div class="grid grid-cols-2 gap-4">
		  <div class="bg-gray-100 p-4">Column 1</div>
		  <div class="bg-gray-200 p-4">Column 2</div>
		</div>
	  `,
  });

  // A Tailwind "Grid 3 columns" block
  bm.add("grid-3-cols", {
    label: "Grid (3 Columns)",
    category: "Layout",
    attributes: { class: "fa fa-th" },
    content: `
		<div class="grid grid-cols-3 gap-4">
		  <div class="bg-gray-100 p-4">Column 1</div>
		  <div class="bg-gray-200 p-4">Column 2</div>
		  <div class="bg-gray-300 p-4">Column 3</div>
		</div>
	  `,
  });

  // Define a custom Row/Column type for flexible dropping
  editor.DomComponents.addType("row-component", {
    model: {
      defaults: {
        tagName: "div",
        draggable: true,
        // By default, can drop column components inside
        droppable: ".column-component",
        attributes: { class: "flex flex-row flex-wrap" },
        // Example trait if you want to adjust row spacing, etc.
        traits: [
          {
            type: "select",
            label: "Justify Content",
            name: "justifyContent",
            options: [
              { value: "justify-start", name: "Start" },
              { value: "justify-center", name: "Center" },
              { value: "justify-end", name: "End" },
              { value: "justify-between", name: "Between" },
              { value: "justify-around", name: "Around" },
            ],
            changeProp: 1,
          },
        ],
      },
    },
    view: {
      init() {
        const comps = this.model.get("components");
        this.listenTo(
          this.model,
          "change:justifyContent",
          this.handleJustifyChange
        );
      },
      handleJustifyChange() {
        const justifyClass = this.model.get("justifyContent");
        // Remove old justify- classes, add the new one
        const el = this.el;
        el.classList.remove(
          "justify-start",
          "justify-center",
          "justify-end",
          "justify-between",
          "justify-around"
        );
        if (justifyClass) el.classList.add(justifyClass);
      },
    },
  });

  editor.DomComponents.addType("column-component", {
    model: {
      defaults: {
        tagName: "div",
        draggable: ".row-component", // can only be dragged inside row
        droppable: true, // can drop other components inside
        attributes: { class: "flex-1 p-4 bg-gray-100 m-1" },
        traits: [
          {
            type: "text",
            label: "Column BG",
            name: "backgroundColor",
            changeProp: 1,
          },
        ],
      },
    },
    view: {
      init() {
        this.listenTo(
          this.model,
          "change:backgroundColor",
          this.handleBgChange
        );
      },
      handleBgChange() {
        const color = this.model.get("backgroundColor");
        if (color) {
          this.el.style.backgroundColor = color;
        }
      },
    },
  });

  // Now define the block that spawns a row with two columns inside
  bm.add("row-with-columns", {
    label: "Row Layout",
    category: "Layout",
    attributes: { class: "fa fa-bars" },
    content: {
      type: "row-component",
      components: [
        { type: "column-component", content: "Column 1" },
        { type: "column-component", content: "Column 2" },
      ],
    },
  });
}

function configureBlocks(editor) {
  const bm = editor.BlockManager;

  //
  // --- BASIC SECTION ---
  //
  // 1 Column
  bm.add("1-column", {
    label: "1 Column",
    category: "Basic",
    attributes: { class: "fa fa-square-o" }, // icon
    content: `
		<div class="flex flex-row">
		  <div class="flex-1 p-4 bg-gray-100">Column</div>
		</div>
	  `,
  });

  // 2 Columns
  bm.add("2-columns", {
    label: "2 Columns",
    category: "Basic",
    attributes: { class: "fa fa-columns" },
    content: `
		<div class="flex flex-row">
		  <div class="w-1/2 p-4 bg-gray-100">Column 1</div>
		  <div class="w-1/2 p-4 bg-gray-200">Column 2</div>
		</div>
	  `,
  });

  // 3 Columns
  bm.add("3-columns", {
    label: "3 Columns",
    category: "Basic",
    attributes: { class: "fa fa-th-large" },
    content: `
		<div class="flex flex-row">
		  <div class="w-1/3 p-4 bg-gray-100">Column 1</div>
		  <div class="w-1/3 p-4 bg-gray-200">Column 2</div>
		  <div class="w-1/3 p-4 bg-gray-100">Column 3</div>
		</div>
	  `,
  });

  // 2 Columns 3/7
  bm.add("2-columns-3-7", {
    label: "2 Columns 3/7",
    category: "Basic",
    attributes: { class: "fa fa-columns" },
    content: `
		<div class="flex flex-row">
		  <div class="w-3/12 p-4 bg-gray-100">3/12</div>
		  <div class="w-7/12 p-4 bg-gray-200">7/12</div>
		</div>
	  `,
  });

  // Text
  bm.add("text-block", {
    label: "Text",
    category: "Basic",
    attributes: { class: "fa fa-font" },
    content: {
      type: "text",
      content: "Insert your text here...",
      style: { padding: "10px" },
    },
  });

  // Link
  bm.add("link-block", {
    label: "Link",
    category: "Basic",
    attributes: { class: "fa fa-link" },
    content: {
      type: "link",
      content: "Click here",
      style: { color: "#3b82f6", textDecoration: "underline" },
      traits: [
        {
          type: "text",
          label: "Text",
          name: "content",
          changeProp: 1,
        },
        {
          type: "text",
          label: "URL",
          name: "href",
          changeProp: 1,
        },
        {
          type: "checkbox",
          label: "Open in new tab",
          name: "targetBlank",
          changeProp: 1,
        },
      ],
    },
  });

  // Image
  bm.add("image-block", {
    label: "Image",
    category: "Basic",
    attributes: { class: "fa fa-image" },
    content: {
      type: "image",
      // By default, grapesjs-plugin-forms or gjs-blocks-basic may also add an image block,
      // but we override it or add a new one here for demonstration
      activeOnRender: 1,
      attributes: { src: "https://via.placeholder.com/350x150" },
      style: { maxWidth: "100%" },
    },
  });

  // Video
  bm.add("video-block", {
    label: "Video",
    category: "Basic",
    attributes: { class: "fa fa-youtube-play" },
    content: {
      type: "video",
      src: "https://www.youtube.com/embed/b9bRSOnqfpo",
      style: { height: "350px", width: "100%" },
      traits: [
        {
          type: "text",
          label: "Source (URL)",
          name: "src",
          changeProp: 1,
        },
        {
          type: "checkbox",
          label: "Autoplay",
          name: "autoplay",
        },
        {
          type: "checkbox",
          label: "Controls",
          name: "controls",
          valueTrue: "controls",
          valueFalse: "",
        },
      ],
    },
  });

  //
  // --- FORMS SECTION ---
  // (Often added by `grapesjs-plugin-forms`, but we can recategorize them or define new ones)
  //

  // Force re-categorize existing plugin blocks, if they exist
  const formBlock = bm.get("form");
  if (formBlock) {
    formBlock.set({
      label: "Form",
      category: "Forms",
      attributes: { class: "fa fa-list-alt" },
    });
  } else {
    // Or define our own if it doesn't exist
    bm.add("form", {
      label: "Form",
      category: "Forms",
      attributes: { class: "fa fa-list-alt" },
      content: `<form class="p-4 bg-gray-100">
		  <label>Name</label>
		  <input class="block border w-full mb-2" placeholder="Enter your name"/>
		  <button class="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
		</form>`,
    });
  }

  const inputBlock = bm.get("input");
  if (inputBlock) {
    inputBlock.set({
      label: "Input",
      category: "Forms",
      attributes: { class: "fa fa-font" },
    });
  } else {
    bm.add("input", {
      label: "Input",
      category: "Forms",
      attributes: { class: "fa fa-font" },
      content: '<input class="border p-2 w-full" placeholder="Input"/>',
    });
  }

  const textareaBlock = bm.get("textarea");
  if (textareaBlock) {
    textareaBlock.set({
      label: "Textarea",
      category: "Forms",
      attributes: { class: "fa fa-align-left" },
    });
  } else {
    bm.add("textarea", {
      label: "Textarea",
      category: "Forms",
      attributes: { class: "fa fa-align-left" },
      content: '<textarea class="border p-2 w-full" rows="3"> </textarea>',
    });
  }

  const selectBlock = bm.get("select");
  if (selectBlock) {
    selectBlock.set({
      label: "Select",
      category: "Forms",
      attributes: { class: "fa fa-caret-down" },
    });
  } else {
    bm.add("select", {
      label: "Select",
      category: "Forms",
      attributes: { class: "fa fa-caret-down" },
      content: `<select class="border p-2 w-full">
		  <option>Option 1</option>
		  <option>Option 2</option>
		</select>`,
    });
  }

  const buttonBlock = bm.get("button");
  if (buttonBlock) {
    buttonBlock.set({
      label: "Button",
      category: "Forms",
      attributes: { class: "fa fa-hand-pointer-o" },
    });
  } else {
    bm.add("button", {
      label: "Button",
      category: "Forms",
      attributes: { class: "fa fa-hand-pointer-o" },
      content:
        '<button class="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>',
    });
  }

  // Label
  bm.add("label", {
    label: "Label",
    category: "Forms",
    attributes: { class: "fa fa-tag" },
    content: '<label class="block mb-1">Label</label>',
  });

  // Checkbox
  const checkboxBlock = bm.get("checkbox");
  if (checkboxBlock) {
    checkboxBlock.set({
      label: "Checkbox",
      category: "Forms",
      attributes: { class: "fa fa-check-square-o" },
    });
  } else {
    bm.add("checkbox", {
      label: "Checkbox",
      category: "Forms",
      attributes: { class: "fa fa-check-square-o" },
      content: `<div>
		  <input type="checkbox" id="checkbox" />
		  <label for="checkbox">Check me</label>
		</div>`,
    });
  }

  // Radio
  const radioBlock = bm.get("radio");
  if (radioBlock) {
    radioBlock.set({
      label: "Radio",
      category: "Forms",
      attributes: { class: "fa fa-dot-circle-o" },
    });
  } else {
    bm.add("radio", {
      label: "Radio",
      category: "Forms",
      attributes: { class: "fa fa-dot-circle-o" },
      content: `<div>
		  <input type="radio" name="radioGroup" id="radio1" />
		  <label for="radio1">Option 1</label>
		</div>`,
    });
  }

  //
  // --- EXTRA SECTION ---
  // (Mostly from plugins: countdown, tabs, custom code, tooltip, typed)
  //

  // Countdown (from grapesjs-component-countdown plugin)
  const countdown = bm.get("countdown");
  if (countdown) {
    countdown.set({
      label: "شمارش معکوس",
      category: "Extra",
      attributes: { class: "fa fa-clock-o" },
    });
  }

  // Tabs (from grapesjs-tabs plugin)
  const tabs = bm.get("tabs");
  if (tabs) {
    tabs.set({
      label: "Tabs",
      category: "Extra",
      attributes: { class: "fa fa-folder" },
    });
  }

  // Custom Code (from grapesjs-custom-code plugin)
  const customCode = bm.get("custom-code");
  if (customCode) {
    customCode.set({
      label: "Custom Code",
      category: "Extra",
      attributes: { class: "fa fa-code" },
    });
  }

  // Tooltip (from grapesjs-tooltip plugin)
  const tooltip = bm.get("tooltip");
  if (tooltip) {
    tooltip.set({
      label: "Tooltip",
      category: "Extra",
      attributes: { class: "fa fa-commenting-o" },
    });
  }

  // Typed (from grapesjs-typed plugin)
  const typed = bm.get("typed");
  if (typed) {
    typed.set({
      label: "Typed",
      category: "Extra",
      attributes: { class: "fa fa-i-cursor" },
    });
  }

  //
  // --- ADDITIONAL MUI COMPONENTS (SpeedDial, FAB, Timeline, etc.) ---
  //
  // Because MUI is React-based, we can only embed a static HTML structure
  // or an approximation. If you want true React components, you'll need
  // a more advanced integration. Below is a quick example.

  // SpeedDial
  bm.add("mui-speed-dial", {
    label: "MUI SpeedDial",
    category: "Extra", // or "MUI Components"
    attributes: { class: "fa fa-cogs" },
    content: `
		<div class="relative h-48">
		  <!-- Approximate MUI SpeedDial style -->
		  <div class="absolute bottom-4 right-4">
			<button class="bg-blue-500 rounded-full w-14 h-14 text-white shadow-lg">
			  <i class="fa fa-plus"></i>
			</button>
			<!-- SpeedDial actions, for demonstration -->
			<div class="flex flex-col items-end space-y-2 mt-2">
			  <button class="bg-white rounded-full w-10 h-10 text-gray-800 shadow-md">
				<i class="fa fa-edit"></i>
			  </button>
			  <button class="bg-white rounded-full w-10 h-10 text-gray-800 shadow-md">
				<i class="fa fa-share"></i>
			  </button>
			</div>
		  </div>
		</div>
	  `,
  });

  // FAB
  bm.add("mui-fab", {
    label: "MUI FAB",
    category: "Extra",
    attributes: { class: "fa fa-circle" },
    content: `
		<button class="bg-pink-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
		  <i class="fa fa-plus"></i>
		</button>
	  `,
  });

  // Timeline (just an approximation)
  bm.add("mui-timeline", {
    label: "MUI Timeline",
    category: "Extra",
    attributes: { class: "fa fa-clock-o" },
    content: `
		<div class="border-l border-gray-300 ml-4">
		  <div class="mb-6 ml-6">
			<div class="absolute -left-2.5 w-5 h-5 bg-blue-500 rounded-full border-4 border-white"></div>
			<h4 class="text-md font-bold">Step 1</h4>
			<p class="text-sm">Description of step 1</p>
		  </div>
		  <div class="mb-6 ml-6">
			<div class="absolute -left-2.5 w-5 h-5 bg-blue-500 rounded-full border-4 border-white"></div>
			<h4 class="text-md font-bold">Step 2</h4>
			<p class="text-sm">Description of step 2</p>
		  </div>
		</div>
	  `,
  });
}

const templates = [
  {
    name: "Landing Page",
    html: '<button class="bg-black">Landing Page Content</button>',
  },
  { name: "Contact Page", html: "<div>Contact Page Content</div>" },
];

const themes = {
  light:
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css",
  dark: "https://cdn.jsdelivr.net/npm/dark-theme-css@1.0.0/dark.css",
};

const createPage = (name) => {
  const newPage = { id: `page-${pages.length + 1}`, name, html: "", css: "" };
  pages.push(newPage);
  console.log("Page created:", newPage);
};

const switchPage = async (pageId) => {
  const page = pages.find((p) => p.id === pageId);
  if (page) {
    editor.setComponents(page.html);
    editor.setStyle(page.css);
  }
};

const savePage = (pageId) => {
  const page = pages.find((p) => p.id === pageId);
  if (page) {
    page.html = editor.getHtml();
    page.css = editor.getCss();
    console.log("Page saved:", page);
  }
};

function GrapesEditor() {
  const [pages, setPages] = useState([]);
  const editorRef = useRef(null);

  useEffect(() => {
    const switchProject = async (projectId) => {
      editor.StorageManager.setParams({ projectId });
      await editor.load();
    };
    const editor = grapesjs.init({
      container: editorRef.current,
      canvas: {
        styles: [
          "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
          "https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css",
        ],
      },
      fromElement: true,
      height: "100vh",
      width: "auto",
      assetManager: {
        // upload: '/api/upload-assets', // API endpoint for uploading
        // uploadName: 'file-manager',
        // assets: [
        // 	// Predefined assets
        // 	{ src: 'https://via.placeholder.com/350x150', name: 'Placeholder' },
        // ],
        upload: true,
        uploadName: "files",
        uploadFile: (e) => {
          const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
          // Upload logic to your backend
        },
      },
      layout: {
        default: {
          type: "row",
          height: "100%",
          children: [
            {
              type: "canvasSidebarTop",
              sidebarTop: {
                leftContainer: {
                  buttons: ({ items }) => [
                    ...items,
                    {
                      id: "openTemplatesButtonId",
                      size: "s",
                      icon: '<svg viewBox="0 0 24 24"><path d="M20 14H6C3.8 14 2 15.8 2 18S3.8 22 6 22H20C21.1 22 22 21.1 22 20V16C22 14.9 21.1 14 20 14M6 20C4.9 20 4 19.1 4 18S4.9 16 6 16 8 16.9 8 18 7.1 20 6 20M6.3 12L13 5.3C13.8 4.5 15 4.5 15.8 5.3L18.6 8.1C19.4 8.9 19.4 10.1 18.6 10.9L17.7 12H6.3M2 13.5V4C2 2.9 2.9 2 4 2H8C9.1 2 10 2.9 10 4V5.5L2 13.5Z" /></svg>',
                      onClick: ({ editor }) => {
                        editor.runCommand("studio:layoutToggle", {
                          id: "my-templates-panel",
                          header: false,
                          placer: {
                            type: "dialog",
                            title: "Choose a template for your project",
                            size: "l",
                          },
                          layout: {
                            type: "panelTemplates",
                            content: { itemsPerRow: 3 },
                            onSelect: ({ loadTemplate, template }) => {
                              // Load the selected template to the current project
                              loadTemplate(template);
                              // Close the dialog layout
                              editor.runCommand("studio:layoutRemove", {
                                id: "my-templates-panel",
                              });
                            },
                          },
                        });
                      },
                    },
                  ],
                },
              },
              grow: true,
            },
            { type: "sidebarRight" },
          ],
        },
      },
      templates: {
        // The onLoad can be an asyncronous function, so you can fetch templates from your API
        onLoad: async () => [
          {
            id: "template1",
            name: "Template 1",
            data: {
              pages: [
                {
                  name: "Home",
                  component:
                    '<h1 class="title">Template 1</h1><style>.title { color: red; font-size: 10rem; text-align: center }</style>',
                },
              ],
            },
          },
          {
            id: "template2",
            name: "Template 2",
            data: {
              pages: [
                {
                  component:
                    '<h1 class="title">Template 2</h1><style>.title { color: blue; font-size: 10rem; text-align: center }</style>',
                },
              ],
            },
          },
          {
            id: "template3",
            name: "Template 3",
            data: {
              pages: [
                {
                  component:
                    '<h1 class="title">Template 3</h1><style>.title { color: green; font-size: 10rem; text-align: center }</style>',
                },
              ],
            },
          },
          {
            id: "template4",
            name: "Template 4",
            data: {
              pages: [
                {
                  component:
                    '<h1 class="title">Template 4</h1><style>.title { color: violet; font-size: 10rem; text-align: center }</style>',
                },
              ],
            },
          },
        ],
      },
      storageManager: {
        type: "local", // Save to localStorage for now; update for backend integration
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
        // id: 'project-', // Prefix for different projects
        // urlStore: '/api/save-project', // API to save projects
        // urlLoad: '/api/load-project',
      },
      project: {
        type: "web",
        default: {
          pages: [
            { name: "Home", component: "<h1>Home page</h1>" },
            { name: "About", component: "<h1>About page</h1>" },
            { name: "Contact", component: "<h1>Contact page</h1>" },
          ],
        },
      },
      assets: {
        storageType: "self",
        onUpload: async ({ files }) => {
          const body = new FormData();
          files.forEach((file) => {
            body.append("files", file);
          });
          const response = await fetch("ASSETS_UPLOAD_URL", {
            method: "POST",
            body,
          });
          const result = await response.json();
          // The expected result should be an array of assets, eg.
          // [{ src: 'ASSET_URL' }]
          return result;
        },
        // Provide a custom handler for deleting assets
        onDelete: async ({ assets }) => {
          const body = JSON.stringify(assets);
          await fetch("ASSETS_DELETE_URL", { method: "DELETE", body });
        },
      },
      storage: {
        type: "self",
        // Provide a custom handler for saving the project data.
        onSave: async ({ project }) => {
          throw new Error('Implement your "onSave"!');
          // const body = new FormData();
          // body.append('project', JSON.stringify(project));
          // await fetch('PROJECT_SAVE_URL', { method: 'POST', body });
        },
        // Provide a custom handler for loading project data.
        onLoad: async () => {
          throw new Error('Implement your "onLoad"!');
          // const response = await fetch('PROJECT_LOAD_URL');
          // const project = await response.json();
          // // The project JSON is expected to be returned inside an object.
          // return { project };
        },
        autosaveChanges: 100,
        autosaveIntervalMs: 10000,
      },
      theme: "light",
      // plugins: [
      // 	'gjs-preset-webpage',
      // 	'grapesjs-plugin-forms',
      // 	'grapesjs-plugin-export',
      // 	'grapesjs-navbar'
      // ],
      plugins: [
        "gjs-preset-webpage",
        "grapesjs-plugin-forms",
        "grapesjs-plugin-export",
        "grapesjs-navbar",
        "grapesjs-preset-webpage",
        "grapesjs-blocks-basic",
        "grapesjs-component-countdown",
        "grapesjs-tabs",
        "grapesjs-custom-code",
        "grapesjs-touch",
        "grapesjs-parser-postcss",
        "grapesjs-tooltip",
        "grapesjs-tui-image-editor",
        "grapesjs-typed",
        "grapesjs-style-bg",
      ],
      pluginsOpts: {
        "gjs-preset-webpage": {},
        "grapesjs-plugin-forms": {},
        "grapesjs-plugin-export": {},
        "grapesjs-navbar": {},
      },
    });

    configureBlocks(editor);
    configureBasicExtensions(editor);
    configureFormFields(editor);
    configureMiniApps(editor);
    return () => editor && editor.destroy();

    //
    // editor.DomComponents.addType('custom-button', {
    // 	model: {
    // 		defaults: {
    // 			tagName: 'button',
    // 			attributes: { class: 'btn' },
    // 			components: 'Click Me',
    // 			traits: [
    // 				{
    // 					type: 'text',
    // 					label: 'Button Text',
    // 					name: 'text', // This will map to the content of the button
    // 				},
    // 				{
    // 					type: 'color',
    // 					label: 'Background Color',
    // 					name: 'backgroundColor', // Maps to the style
    // 				},
    // 			],
    // 			styles: {
    // 				backgroundColor: '#007bff',
    // 				color: '#fff',
    // 			},
    // 		},
    // 	},
    // 	view: {
    // 		onRender() {
    // 			const model = this.model;
    // 			const text = model.get('traits')['text'];
    // 			const backgroundColor = model.get('traits')['backgroundColor'];
    // 			this.el.innerHTML = text || this.el.innerHTML;
    // 			this.el.style.backgroundColor = backgroundColor || this.el.style.backgroundColor;
    // 			this.listenTo(this.model, 'change:backgroundColor', () => {
    // 				this.el.style.backgroundColor = this.model.get('backgroundColor');
    // 			});
    // 		},
    // 	},
    // });

    // Example: Add a page button
    editor.Panels.addButton("options", {
      id: "add-page",
      className: "fa fa-file",
      command: () => createPage(`Page ${pages.length + 1}`),
      attributes: { title: "Add Page" },
    });

    const switchTheme = (theme) => {
      const iframe = editor.Canvas.getFrameEl();
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = themes[theme];
      doc.head.appendChild(link);
    };

    // Example: Add a button for switching themes
    editor.Panels.addButton("options", {
      id: "theme-switch",
      className: "fa fa-adjust",
      command: () => switchTheme("dark"), // Change to 'light' for light theme
      attributes: { title: "Switch Theme" },
    });

    editor.BlockManager.add("row", {
      label: "Row",
      content: '<div class="row"></div>',
      category: "Layout",
    });

    editor.BlockManager.add("column", {
      label: "Column",
      content: '<div class="col"></div>',
      category: "Layout",
    });

    editor.setStyle(`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
`);

    editor.StyleManager.addProperty("general", {
      name: "Background Color",
      property: "background-color",
      type: "color",
    });

    editor.AssetManager.add({
      src: "https://via.placeholder.com/150",
      name: "Placeholder Image",
    });

    editor.AssetManager.addType("image", {
      upload: "/api/upload-assets",
      headers: { Authorization: "Bearer token" },
    });

    editor.Commands.add("export-template", {
      run(editor) {
        const html = editor.getHtml();
        const css = editor.getCss();
        const blob = new Blob([`${html}<style>${css}</style>`], {
          type: "text/html",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "template.html";
        link.click();
      },
    });

    editor.Commands.add("import-template", {
      run(editor) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "text/html";
        input.onchange = (e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
            editor.setComponents(event.target.result);
          };
          reader.readAsText(file);
        };
        input.click();
      },
    });

    editor.setStyle(`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  .btn {
    padding: 10px 20px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
  }
`);

    editor.BlockManager.add("template-landing-page", {
      label: "Landing Page",
      content: `
    <div class="landing-page">
      <h1>Welcome to GrapesJS</h1>
      <p>Create your page with ease.</p>
      <button class="btn">Get Started</button>
    </div>
  `,
      category: "Templates",
    });

    editor.setStyle(`
  body.theme-dark {
    background-color: #333;
    color: #fff;
  }
`);

    editor.Panels.addPanel({
      id: "layouts",
      el: ".layout-panel",
      buttons: [
        {
          id: "add-row",
          command: "add-row",
          className: "fa fa-columns",
          attributes: { title: "Add Row" },
        },
        {
          id: "add-column",
          command: "add-column",
          className: "fa fa-columns",
          attributes: { title: "Add Column" },
        },
      ],
    });

    editor.Commands.add("add-row", {
      run(editor) {
        editor.BlockManager.add("row", {
          label: "Row",
          content: '<div class="row"></div>',
          category: "Layout",
        });
      },
    });

    editor.Panels.addButton("options", {
      id: "insert-element",
      className: "fa fa-plus",
      command: "open-blocks",
      attributes: { title: "Insert Element" },
    });

    // Add Import Template Button
    editor.Panels.addButton("options", {
      id: "import-template",
      className: "fa fa-download",
      command: "gjs-open-import-webpage",
      attributes: { title: "Import Template" },
    });

    // Add Export Template Button
    editor.Panels.addButton("options", {
      id: "export-template",
      className: "fa fa-upload",
      command: "export-template",
      attributes: { title: "Export Template" },
    });

    editor.BlockManager.add("button-block", {
      label: `
    <div style="display: flex; align-items: center;">
      <i class="fa fa-hand-pointer" style="margin-right: 5px;"></i>
      Button
    </div>
  `,
      content: '<button class="btn">Click Me</button>',
      category: "Basic",
    });
    editor.DomComponents.addType("custom-button", {
      model: {
        defaults: {
          tagName: "button",
          components: "Click Me",
          traits: [
            {
              type: "text",
              label: "Button Text",
              name: "text",
            },
            {
              type: "color",
              label: "Background Color",
              name: "backgroundColor",
            },
          ],
          styles: {
            backgroundColor: "#007bff",
            color: "#fff",
          },
        },
      },
      view: {
        init({ model }) {
          const updateButton = () => {
            const text = model.get("text");
            const backgroundColor = model.get("backgroundColor");
            const el = model.getEl();

            if (text) el.innerHTML = text;
            if (backgroundColor) el.style.backgroundColor = backgroundColor;
          };

          model.on("change:text", updateButton);
          model.on("change:backgroundColor", updateButton);
        },
      },
    });

    // editor.DomComponents.addType('image-block', {
    // 	model: {
    // 		defaults: {
    // 			tagName: 'img',
    // 			attributes: { src: 'https://via.placeholder.com/150' },
    // 			traits: [
    // 				{
    // 					type: 'text',
    // 					label: 'Image URL',
    // 					name: 'src',
    // 					changeProp: 1,
    // 				},
    // 				{
    // 					type: 'file',
    // 					label: 'Upload Image',
    // 					name: 'file',
    // 					changeProp: 1,
    // 				},
    // 			],
    // 		},
    // 	},
    // 	view: {
    // 		onRender() {
    // 			this.listenTo(this.model, 'change:src', () => {
    // 				this.el.src = this.model.get('src');
    // 			});
    // 			this.listenTo(this.model, 'change:file', async () => {
    // 				const file = this.model.get('file');
    // 				const formData = new FormData();
    // 				formData.append('file', file);
    //
    // 				const response = await axios.post('/api/upload-image', formData, {
    // 					headers: { 'Content-Type': 'multipart/form-data' },
    // 				});
    //
    // 				this.model.set('src', response.data.url); // Assuming the backend returns the image URL
    // 			});
    //
    // 		},
    // 	},
    // });

    editor.Panels.addPanel({
      id: "views",
      el: ".panel__right",
      buttons: [
        {
          id: "open-traits",
          active: true,
          className: "fa fa-cog",
          command: "open-traits",
          attributes: { title: "Traits" },
        },
      ],
    });

    editor.BlockManager.add("custom-block", {
      label: "Custom Block",
      content: '<div class="custom-block">Custom Block Content</div>',
      category: "Custom",
    });

    editor.BlockManager.add("tailwind-block", {
      label: "Tailwind Block",
      content: '<div class="p-4 bg-blue-500 text-white">Hello Tailwind</div>',
      category: "Tailwind",
    });
    editor.BlockManager.add("react-button", {
      label: "React Button",
      content: {
        type: "react-button",
        props: { label: "Click Me", variant: "primary" },
      },
      category: "React Components",
    });

    editor.DomComponents.addType("react-button", {
      model: {
        defaults: {
          tagName: "div",
          droppable: false,
          attributes: { "data-react-type": "button" },
        },
      },
      view: {
        render() {
          const { label, variant } = this.model.get("props");
          this.el.innerHTML = `<button class="${variant}">${label}</button>`;
        },
      },
    });

    templates.forEach((template) => {
      editor.BlockManager.add(template.name, {
        label: template.name,
        content: template.html,
        category: "Templates",
      });
    });
    editor.Panels.addButton("options", {
      id: "preview",
      className: "fa fa-eye",
      command: "preview",
      attributes: { title: "Preview" },
    });

    // const html = editor.getHtml();
    // const css = editor.getCss();
    // const json = editor.getComponents();
    // const savePage = async () => {
    // 	const html = editor.getHtml();
    // 	const css = editor.getCss();
    //
    // 	try {
    // 		const response = await axios.post('/api/save-page', {
    // 			html,
    // 			css,
    // 			components: editor.getComponents(),
    // 			styles: editor.getStyle(),
    // 		});
    // 		console.log('Page saved:', response.data);
    // 	} catch (error) {
    // 		console.error('Error saving page:', error);
    // 	}
    // };
    // const loadPage = async () => {
    // 	try {
    // 		const response = await axios.get('/api/get-page?id=123');
    // 		const { html, css, components, styles } = response.data;
    //
    // 		editor.setComponents(components);
    // 		editor.setStyle(styles);
    // 		editor.addStyle(css); // Optional if styles are separate
    // 	} catch (error) {
    // 		console.error('Error loading page:', error);
    // 	}
    // };

    editor.Panels.addButton("options", {
      id: "insert-element",
      className: "fa fa-plus",
      command: "open-blocks",
      attributes: { title: "Insert Element" },
    });

    // Add custom button to import templates
    editor.Panels.addButton("options", {
      id: "import-template",
      className: "fa fa-download",
      command: "gjs-open-import-webpage",
      attributes: { title: "Import Template" },
    });

    // Add export button to download current template
    editor.Panels.addButton("options", {
      id: "export-template",
      className: "fa fa-upload",
      command: "export-template",
      attributes: { title: "Export Template" },
    });
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  // const onEditor = (editor: Editor) => {
  // 	console.log('Editor loaded', { editor });
  // };
  // {/*<GjsEditor*/}
  // {/*	// Pass the core GrapesJS library to the wrapper (required).*/}
  // {/*	// You can also pass the CDN url (eg. "https://unpkg.com/grapesjs")*/}
  // {/*	grapesjs={grapesjs}*/}
  // {/*	// Load the GrapesJS CSS file asynchronously from URL.*/}
  // {/*	// This is an optional prop, you can always import the CSS directly in your JS if you wish.*/}
  // {/*	grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"*/}
  // {/*	// GrapesJS init options*/}
  // {/*	options={{*/}
  // {/*		height: '100vh',*/}
  // {/*		storageManager: false,*/}
  //
  // {/*	}}*/}
  // {/*	// onEditor={onEditor}*/}
  // {/*/>*/}
  // return (<>
  //
  // 	<GjsEditor
  // 	grapesjs={grapesjs}
  // 	grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
  // 	// onEditor={onEditor}
  // 	options={{
  // 		height: '100vh',
  // 		storageManager: false,
  // 	}}
  // >
  // 	<div>
  // 		// ... use your UI components
  // 		<Canvas /> // place the GrapesJS canvas where you wish
  // 		// ...
  // 	</div>
  // </GjsEditor>
  // <div ref={editorRef} /></>);
  return <div ref={editorRef} />;
}

export default GrapesEditor;
