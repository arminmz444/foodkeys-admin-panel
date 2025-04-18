"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import grapesjs from "grapesjs"
import "grapesjs/dist/css/grapes.min.css"
import "grapesjs-preset-webpage"
import "grapesjs-blocks-basic"
import "grapesjs-plugin-forms"
import "grapesjs-component-countdown"
import "grapesjs-plugin-export"
import "grapesjs-tabs"
import "grapesjs-custom-code"
import "grapesjs-touch"
import "grapesjs-parser-postcss"
import "grapesjs-tooltip"
import "grapesjs-tui-image-editor"
import "grapesjs-typed"
import "grapesjs-style-bg"
import MonacoEditor from "react-monaco-editor"

// MUI components for the drawer, dialogs, etc.
import {
  Box,
  Button,
  Drawer,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  IconButton,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@mui/material"
import { PublishRounded, Close, Save, Preview, Launch } from "@mui/icons-material"

// Configuration for injection fields
const INJECTABLE_FIELDS = [
  { label: "نام شرکت", value: "companyName" },
  { label: "نام انگلیسی شرکت", value: "companyNameEn" },
  { label: "مدیر عامل", value: "ceo" },
  { label: "توضیحات", value: "description" },
  { label: "تاریخچه", value: "history" },
  { label: "لوگو", value: "logo" },
  { label: "تصویر پس‌زمینه", value: "backgroundImage" },
  { label: "آدرس دفتر", value: "officeLocation" },
  { label: "آدرس کارخانه", value: "factoryLocation" },
  { label: "تلفن‌ها", value: "tels" },
  { label: "شبکه‌های اجتماعی", value: "socialMedias" },
  { label: "محصولات", value: "products" },
  { label: "مسئولین", value: "contacts" },
]

// Available client types for publication
const CLIENT_TYPES = [
  { value: "ADMIN_PANEL_CLIENT", label: "پنل ادمین" },
  { value: "PUBLIC_PORTAL_CLIENT", label: "پورتال عمومی" },
]

// Integration types
const INTEGRATION_TYPES = [
  { value: "iframe", label: "IFrame" },
  { value: "moduleFederation", label: "Module Federation" },
]

// Field types for form builder
const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "password", label: "Password" },
  { value: "select", label: "Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Textarea" },
  { value: "email", label: "Email" },
  { value: "range", label: "Range" },
  { value: "search", label: "Search" },
  { value: "tel", label: "Tel" },
  { value: "url", label: "Url" },
  { value: "time", label: "Time" },
  { value: "datetime", label: "Datetime" },
  { value: "datetime-local", label: "Datetime-local" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
]

// Helper function to get field HTML for form builder
function getFieldHtml(type, label) {
  switch (type) {
    case "text":
      return `<input type="text" placeholder="${label}" class="border rounded px-2 py-1 w-full" />`
    case "textarea":
      return `<textarea placeholder="${label}" class="border rounded px-2 py-1 w-full"></textarea>`
    case "select":
      return `
        <select class="border rounded px-2 py-1 w-full">
          <option value="" disabled selected>انتخاب کنید</option>
          <option value="option1">گزینه 1</option>
          <option value="option2">گزینه 2</option>
        </select>
      `
    case "checkbox":
      return `
        <label class="flex items-center">
          <input type="checkbox" class="mr-2" />
          ${label}
        </label>
      `
    case "radio":
      return `
        <div>
          <label class="flex items-center mb-1">
            <input type="radio" name="radio-group" class="mr-2" />
            گزینه 1
          </label>
          <label class="flex items-center">
            <input type="radio" name="radio-group" class="mr-2" />
            گزینه 2
          </label>
        </div>
      `
    default:
      return `<input type="${type}" placeholder="${label}" class="border rounded px-2 py-1 w-full" />`
  }
}

// Helper function to get icon class for form fields
function getIconClass(type) {
  switch (type) {
    case "text":
      return "fa fa-font"
    case "password":
      return "fa fa-asterisk"
    case "select":
      return "fa fa-caret-down"
    case "checkbox":
      return "fa fa-check-square-o"
    case "radio":
      return "fa fa-dot-circle-o"
    case "number":
      return "fa fa-sort-numeric-asc"
    case "textarea":
      return "fa fa-align-left"
    case "email":
      return "fa fa-envelope"
    case "range":
      return "fa fa-sliders"
    case "search":
      return "fa fa-search"
    case "tel":
      return "fa fa-phone"
    case "url":
      return "fa fa-link"
    case "time":
    case "datetime":
    case "datetime-local":
      return "fa fa-clock-o"
    case "week":
    case "month":
      return "fa fa-calendar"
    default:
      return "fa fa-keyboard-o"
  }
}

const EnhancedGrapesJSEditor4 = ({ companyId, onSave }) => {
  const editorRef = useRef(null)
  const editorInstance = useRef(null)
  const [isPublishDrawerOpen, setIsPublishDrawerOpen] = useState(false)
  const [isScriptEditorOpen, setIsScriptEditorOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [scriptContent, setScriptContent] = useState("")
  const [publishProgress, setPublishProgress] = useState(0)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState("")
  const [selectedFieldValue, setSelectedFieldValue] = useState(null)
  const [miniappMetadata, setMiniappMetadata] = useState({
    name: "",
    version: "1.0.0",
    description: "",
    clientType: "ADMIN_PANEL_CLIENT",
    routePath: "",
    integrationType: "iframe",
    access: [],
    showInNavigation: true,
    navigationIcon: "Dashboard",
    navigationTooltip: "",
    targetCompanyId: companyId || null,
  })

  const [availableRoles, setAvailableRoles] = useState([
    { name: "ROLE_ADMIN", displayName: "ادمین" },
    { name: "ROLE_EMPLOYEE", displayName: "کارمند" },
    { name: "ROLE_USER", displayName: "کاربر عادی" },
  ])

  const [existingMiniapps, setExistingMiniapps] = useState([])
  const [tabValue, setTabValue] = useState(0)

  // Load existing miniapps for autocomplete
  useEffect(() => {
    const fetchMiniapps = async () => {
      try {
        const response = await axios.get("/api/miniapps")
        if (response.status === 200) {
          setExistingMiniapps(response.data)
        }
      } catch (error) {
        console.error("Error fetching miniapps:", error)
      }
    }

    fetchMiniapps()

    // Also fetch available roles
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/api/auth/roles")
        if (response.status === 200) {
          setAvailableRoles(response.data)
        }
      } catch (error) {
        console.error("Error fetching roles:", error)
      }
    }

    fetchRoles()
  }, [])

  // Initialize GrapesJS
  useEffect(() => {
    if (!editorRef.current) return

    const initEditor = () => {
      // Initialize GrapesJS editor
      editorInstance.current = grapesjs.init({
        container: editorRef.current,
        canvas: {
          styles: [
            "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
            "https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css",
          ],
        },
        height: "90vh",
        width: "auto",
        storageManager: false,
        panels: {
          defaults: [
            {
              id: "panel-devices",
              el: ".panel-devices-container",
              buttons: [
                {
                  id: "device-desktop",
                  label: "دسکتاپ",
                  command: "set-device-desktop",
                  active: true,
                  togglable: false,
                },
                {
                  id: "device-tablet",
                  label: "تبلت",
                  command: "set-device-tablet",
                  togglable: false,
                },
                {
                  id: "device-mobile",
                  label: "موبایل",
                  command: "set-device-mobile",
                  togglable: false,
                },
              ],
            },
            {
              id: "panel-custom-actions",
              el: ".panel-custom-actions-container",
              buttons: [
                {
                  id: "open-script-editor",
                  className: "fa fa-code",
                  command: "open-script-editor",
                  attributes: { title: "ویرایشگر اسکریپت" },
                },
                {
                  id: "insert-template-var",
                  className: "fa fa-database",
                  command: "open-variables-selector",
                  attributes: { title: "درج متغیر" },
                },
                {
                  id: "publish-page",
                  className: "fa fa-cloud-upload",
                  command: "open-publish-drawer",
                  attributes: { title: "انتشار صفحه" },
                },
              ],
            },
          ],
        },
        plugins: [
          "gjs-preset-webpage",
          "grapesjs-blocks-basic",
          "grapesjs-plugin-forms",
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
          "grapesjs-blocks-basic": {},
        },
        blockManager: {
          appendTo: ".blocks-container",
        },
        styleManager: {
          appendTo: ".styles-container",
        },
        layerManager: {
          appendTo: ".layers-container",
        },
      })

      // Add device commands
      editorInstance.current.Commands.add("set-device-desktop", {
        run: (editor) => editor.setDevice("Desktop"),
      })

      editorInstance.current.Commands.add("set-device-tablet", {
        run: (editor) => editor.setDevice("Tablet"),
      })

      editorInstance.current.Commands.add("set-device-mobile", {
        run: (editor) => editor.setDevice("Mobile"),
      })

      // Add custom commands
      editorInstance.current.Commands.add("open-script-editor", {
        run: () => setIsScriptEditorOpen(true),
      })

      editorInstance.current.Commands.add("open-variables-selector", {
        run: () => {
          const selectedComponent = editorInstance.current.getSelected()
          if (selectedComponent) {
            // Show a dialog to select a variable
            const fieldName = prompt("انتخاب فیلد برای درج", "")
            if (fieldName) {
              const selected = INJECTABLE_FIELDS.find((f) => f.label === fieldName || f.value === fieldName)
              if (selected) {
                const template = `{{${selected.value}}}`
                // Insert at cursor position or append to content
                if (selectedComponent.is("text")) {
                  const content = selectedComponent.get("content") || ""
                  selectedComponent.set("content", content + template)
                } else {
                  // Add as a new text component inside the selected container
                  const text = editorInstance.current.DomComponents.addComponent({
                    type: "text",
                    content: template,
                  })
                  selectedComponent.append(text)
                }
              }
            }
          } else {
            alert("لطفا ابتدا یک المان را انتخاب کنید")
          }
        },
      })

      editorInstance.current.Commands.add("open-publish-drawer", {
        run: () => setIsPublishDrawerOpen(true),
      })

      // Configure all the custom blocks and extensions
      configureBasicExtensions(editorInstance.current)
      configureFormFields(editorInstance.current)
      configureMiniApps(editorInstance.current)
      configureExtraBlocks(editorInstance.current)
      configureArmoVideo(editorInstance.current)
      configureLayoutBlocks(editorInstance.current)
      configureBlocks(editorInstance.current)

      // Configure new blocks
      configureTailwindBlocks(editorInstance.current)
      configureTemplateVariableBlocks(editorInstance.current)
      configureFormBuilderTemplate(editorInstance.current)

      // Load existing content if editing an existing miniapp
      if (companyId) {
        loadExistingMiniapp(companyId)
      }
    }

    initEditor()

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy()
        editorInstance.current = null
      }
    }
  }, [companyId])

  // Load existing miniapp data
  const loadExistingMiniapp = async (id) => {
    try {
      const response = await axios.get(`/api/miniapps/${id}`)
      if (response.status === 200) {
        const miniapp = response.data

        // Set metadata
        setMiniappMetadata({
          name: miniapp.name || "",
          version: miniapp.version || "1.0.0",
          description: miniapp.description || "",
          clientType: miniapp.clientType || "ADMIN_PANEL_CLIENT",
          routePath: miniapp.routePath || "",
          integrationType: miniapp.integrationType || "iframe",
          access: miniapp.access || [],
          showInNavigation: miniapp.showInNavigation !== false,
          navigationIcon: miniapp.navigationIcon || "Dashboard",
          navigationTooltip: miniapp.navigationTooltip || "",
          targetCompanyId: miniapp.targetCompanyId || companyId,
        })

        // Load HTML content
        if (miniapp.html && editorInstance.current) {
          editorInstance.current.setComponents(miniapp.html)
        }

        // Load CSS content
        if (miniapp.css && editorInstance.current) {
          editorInstance.current.setStyle(miniapp.css)
        }

        // Load JS content
        if (miniapp.js) {
          setScriptContent(miniapp.js)
        }
      }
    } catch (error) {
      console.error("Error loading miniapp:", error)
    }
  }

  // Handle publishing the miniapp
  const handlePublish = async () => {
    if (!editorInstance.current) return

    setIsPublishing(true)
    setPublishProgress(10)

    try {
      // Get HTML, CSS, and JS content
      const html = editorInstance.current.getHtml()
      const css = editorInstance.current.getCss()
      const js = scriptContent

      setPublishProgress(30)

      // Prepare data for API
      const miniappData = {
        ...miniappMetadata,
        html,
        css,
        js,
      }

      setPublishProgress(50)

      // Send to API
      const response = await axios.post("/api/miniapps", miniappData)

      setPublishProgress(80)

      if (response.status === 200 || response.status === 201) {
        setPublishSuccess(true)
        setPublishedUrl(response.data.url || "")

        // Call onSave callback if provided
        if (onSave) {
          onSave(response.data)
        }
      } else {
        setPublishSuccess(false)
      }

      setPublishProgress(100)
    } catch (error) {
      console.error("Error publishing miniapp:", error)
      setPublishSuccess(false)
      setPublishProgress(100)
    } finally {
      setIsPublishing(false)
    }
  }

  // Handle tab change in the publish drawer
  const handleTabChange = (event, newValue,) => {
    setTabValue(newValue)
  }

  // ORIGINAL CONFIGURATION FUNCTIONS

  function configureBasicExtensions(editor) {
    const bm = editor.BlockManager

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
    })

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
            var loc = "{[ location ]}" // GrapesJS variable
            var iframe = this.querySelector("iframe")
            if (loc) {
              var encodedLoc = encodeURIComponent(loc)
              iframe.src = "https://maps.google.com/maps?q=" + encodedLoc + "&t=&z=13&ie=UTF8&iwloc=&output=embed"
            }
          },
        },
      },
    })

    // Now create the actual block pointing to our custom-map component
    bm.add("map-block", {
      label: "Map",
      category: "Basic",
      attributes: { class: "fa fa-map-o" }, // map icon
      content: { type: "custom-map" },
    })

    //
    // 3. LINK BLOCK
    //
    // "Link Block" is often provided by `grapesjs-blocks-basic` as "link-block."
    // We'll try to get it, and if it exists, re-categorize. Otherwise we define a new one.
    //
    const linkBlock = bm.get("link-block")
    if (linkBlock) {
      // Just relabel & recategorize
      linkBlock.set({
        label: "Link Block",
        category: "Basic",
        attributes: { class: "fa fa-link" },
      })
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
      })
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
    })
  }

  function configureMiniApps(editor) {
    const bm = editor.BlockManager

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
                   src="/placeholder.svg"
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
            var labelEl = this.querySelector(".esig-label")
            var placeholderEl = this.querySelector(".esig-placeholder")
            var canvas = this.querySelector(".esig-canvas")
            var preview = this.querySelector(".esig-preview")
            var hiddenInput = this.querySelector(".esig-data")
            var clearBtn = this.querySelector(".esig-clear")

            // We retrieve trait values from placeholders
            var labelText = "{[ labelText ]}"
            var placeholderText = "{[ placeholderText ]}"
            var fieldName = "{[ fieldName ]}"

            // Update label, placeholder, name
            if (labelEl) labelEl.textContent = labelText || "امضای دیجیتال"
            if (placeholderEl) placeholderEl.textContent = placeholderText || "Sign Here"
            if (hiddenInput && fieldName) hiddenInput.name = fieldName

            // Initialize basic drawing
            var ctx = canvas.getContext("2d")
            var drawing = false

            // Start drawing
            canvas.addEventListener("mousedown", (e) => {
              drawing = true
              ctx.beginPath()
              ctx.moveTo(e.offsetX, e.offsetY)
            })

            // Drawing in progress
            canvas.addEventListener("mousemove", (e) => {
              if (!drawing) return
              ctx.lineTo(e.offsetX, e.offsetY)
              ctx.stroke()
            })

            // Finished drawing => update hidden input + preview
            canvas.addEventListener("mouseup", (e) => {
              drawing = false
              var dataUrl = canvas.toDataURL()
              hiddenInput.value = dataUrl
              preview.src = dataUrl
            })

            // Clear button
            clearBtn.addEventListener("click", () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height)
              hiddenInput.value = ""
              preview.src = ""
            })
          },
        },

        // Force re-run the script if certain traits change
        init() {
          this.on("change:labelText", () => this.trigger("change:script"))
          this.on("change:placeholderText", () => this.trigger("change:script"))
          this.on("change:fieldName", () => this.trigger("change:script"))
          // etc. for any other dynamic trait changes
        },
      },
    })

    // 2. Add the block to the "Forms" category
    editor.BlockManager.add("e-signature-block", {
      label: "E-signature",
      category: "Forms",
      attributes: { class: "fa fa-pencil-square-o" }, // icon
      content: { type: "e-signature" },
    })

    bm.add("react-form-builder", {
      label: "Form Builder App",
      category: "miniapps",
      attributes: { class: "fa fa-wpforms" },
      content: {
        type: "react-form-builder-app",
      },
    })

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
          const src = this.model.get("src")
          const el = this.el
          if (src) el.setAttribute("src", src)
          const height = this.model.get("height")
          if (height) el.style.height = `${height}px`
        },
      },
    })
  }

  function configureFormFields(editor) {
    const bm = editor.BlockManager

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
    ]

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
      })
    })
  }

  function configureExtraBlocks(editor) {
    const bm = editor.BlockManager

    // Re-label or re-category the countdown block from grapesjs-component-countdown
    const countdownBlock = bm.get("countdown")
    if (countdownBlock) {
      countdownBlock.set({
        label: "Countdown",
        category: "Extra",
        attributes: { class: "fa fa-clock-o" },
      })
    }

    // Tabs from grapesjs-tabs
    const tabsBlock = bm.get("tabs")
    if (tabsBlock) {
      tabsBlock.set({
        label: "Tabs",
        category: "Extra",
        attributes: { class: "fa fa-folder" },
      })
    }

    // Custom Code from grapesjs-custom-code
    const customCodeBlock = bm.get("custom-code")
    if (customCodeBlock) {
      customCodeBlock.set({
        label: "Custom Code",
        category: "Extra",
        attributes: { class: "fa fa-code" },
      })
    }

    // Tooltip from grapesjs-tooltip
    const tooltipBlock = bm.get("tooltip")
    if (tooltipBlock) {
      tooltipBlock.set({
        label: "Tooltip",
        category: "Extra",
        attributes: { class: "fa fa-commenting-o" },
      })
    }

    // Typed from grapesjs-typed
    const typedBlock = bm.get("typed")
    if (typedBlock) {
      typedBlock.set({
        label: "Typed",
        category: "Extra",
        attributes: { class: "fa fa-i-cursor" },
      })
    }
  }

  function configureArmoVideo(editor) {
    const bm = editor.BlockManager

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
            var baseUrl = "https://api.example.com/stream/"
            var fileId = "{[ fileId ]}"
            var vid = this.el

            // If fileId changes, set the src
            if (fileId) {
              vid.src = baseUrl + fileId
            }
            // Autoplay?
            if ("{[ autoplay ]}" === "true") {
              vid.autoplay = true
            } else {
              vid.autoplay = false
            }
            // Controls?
            if ("{[ controls ]}" === "true") {
              vid.controls = true
            } else {
              vid.removeAttribute("controls")
            }
          },
        },
      },
    })

    // 2. Add a block to show in the "Extra" (or "Forms") category
    bm.add("armo-video-block", {
      label: "Armo Video",
      category: "Extra", // or 'Forms', etc.
      attributes: { class: "fa fa-video-camera" },
      content: {
        type: "armo-video",
        style: { width: "100%", height: "300px" },
      },
    })
  }

  function configureLayoutBlocks(editor) {
    const bm = editor.BlockManager

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
    })

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
    })

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
          const comps = this.model.get("components")
          this.listenTo(this.model, "change:justifyContent", this.handleJustifyChange)
        },
        handleJustifyChange() {
          const justifyClass = this.model.get("justifyContent")
          // Remove old justify- classes, add the new one
          const el = this.el
          el.classList.remove("justify-start", "justify-center", "justify-end", "justify-between", "justify-around")
          if (justifyClass) el.classList.add(justifyClass)
        },
      },
    })

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
          this.listenTo(this.model, "change:backgroundColor", this.handleBgChange)
        },
        handleBgChange() {
          const color = this.model.get("backgroundColor")
          if (color) {
            this.el.style.backgroundColor = color
          }
        },
      },
    })

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
    })
  }

  function configureBlocks(editor) {
    const bm = editor.BlockManager

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
    })

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
    })

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
    })

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
    })

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
    })

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
    })

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
    })

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
    })

    //
    // --- FORMS SECTION ---
    // (Often added by `grapesjs-plugin-forms`, but we can recategorize them or define new ones)
    //

    // Force re-categorize existing plugin blocks, if they exist
    const formBlock = bm.get("form")
    if (formBlock) {
      formBlock.set({
        label: "Form",
        category: "Forms",
        attributes: { class: "fa fa-list-alt" },
      })
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
      })
    }

    const inputBlock = bm.get("input")
    if (inputBlock) {
      inputBlock.set({
        label: "Input",
        category: "Forms",
        attributes: { class: "fa fa-font" },
      })
    } else {
      bm.add("input", {
        label: "Input",
        category: "Forms",
        attributes: { class: "fa fa-font" },
        content: '<input class="border p-2 w-full" placeholder="Input"/>',
      })
    }

    const textareaBlock = bm.get("textarea")
    if (textareaBlock) {
      textareaBlock.set({
        label: "Textarea",
        category: "Forms",
        attributes: { class: "fa fa-align-left" },
      })
    } else {
      bm.add("textarea", {
        label: "Textarea",
        category: "Forms",
        attributes: { class: "fa fa-align-left" },
        content: '<textarea class="border p-2 w-full" rows="3"> </textarea>',
      })
    }

    const selectBlock = bm.get("select")
    if (selectBlock) {
      selectBlock.set({
        label: "Select",
        category: "Forms",
        attributes: { class: "fa fa-caret-down" },
      })
    } else {
      bm.add("select", {
        label: "Select",
        category: "Forms",
        attributes: { class: "fa fa-caret-down" },
        content: `<select class="border p-2 w-full">
          <option>Option 1</option>
          <option>Option 2</option>
        </select>`,
      })
    }

    const buttonBlock = bm.get("button")
    if (buttonBlock) {
      buttonBlock.set({
        label: "Button",
        category: "Forms",
        attributes: { class: "fa fa-hand-pointer-o" },
      })
    } else {
      bm.add("button", {
        label: "Button",
        category: "Forms",
        attributes: { class: "fa fa-hand-pointer-o" },
        content: '<button class="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>',
      })
    }

    // Label
    bm.add("label", {
      label: "Label",
      category: "Forms",
      attributes: { class: "fa fa-tag" },
      content: '<label class="block mb-1">Label</label>',
    })

    // Checkbox
    const checkboxBlock = bm.get("checkbox")
    if (checkboxBlock) {
      checkboxBlock.set({
        label: "Checkbox",
        category: "Forms",
        attributes: { class: "fa fa-check-square-o" },
      })
    } else {
      bm.add("checkbox", {
        label: "Checkbox",
        category: "Forms",
        attributes: { class: "fa fa-check-square-o" },
        content: `<div>
          <input type="checkbox" id="checkbox" />
          <label for="checkbox">Check me</label>
        </div>`,
      })
    }

    // Radio
    const radioBlock = bm.get("radio")
    if (radioBlock) {
      radioBlock.set({
        label: "Radio",
        category: "Forms",
        attributes: { class: "fa fa-dot-circle-o" },
      })
    } else {
      bm.add("radio", {
        label: "Radio",
        category: "Forms",
        attributes: { class: "fa fa-dot-circle-o" },
        content: `<div>
          <input type="radio" name="radioGroup" id="radio1" />
          <label for="radio1">Option 1</label>
        </div>`,
      })
    }

    //
    // --- EXTRA SECTION ---
    // (Mostly from plugins: countdown, tabs, custom code, tooltip, typed)
    //

    // Countdown (from grapesjs-component-countdown plugin)
    const countdown = bm.get("countdown")
    if (countdown) {
      countdown.set({
        label: "شمارش معکوس",
        category: "Extra",
        attributes: { class: "fa fa-clock-o" },
      })
    }

    // Tabs (from grapesjs-tabs plugin)
    const tabs = bm.get("tabs")
    if (tabs) {
      tabs.set({
        label: "Tabs",
        category: "Extra",
        attributes: { class: "fa fa-folder" },
      })
    }

    // Custom Code (from grapesjs-custom-code plugin)
    const customCode = bm.get("custom-code")
    if (customCode) {
      customCode.set({
        label: "Custom Code",
        category: "Extra",
        attributes: { class: "fa fa-code" },
      })
    }

    // Tooltip (from grapesjs-tooltip plugin)
    const tooltip = bm.get("tooltip")
    if (tooltip) {
      tooltip.set({
        label: "Tooltip",
        category: "Extra",
        attributes: { class: "fa fa-commenting-o" },
      })
    }

    // Typed (from grapesjs-typed plugin)
    const typed = bm.get("typed")
    if (typed) {
      typed.set({
        label: "Typed",
        category: "Extra",
        attributes: { class: "fa fa-i-cursor" },
      })
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
    })

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
    })

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
            <p class="text-gray-700">Description of step 1</p>
          </div>
          <div class="mb-6 ml-6">
            <div class="absolute -left-2.5 w-5 h-5 bg-blue-500 rounded-full border-4 border-white"></div>
            <h4 class="text-md font-bold">Step 2</h4>
            <p class="text-gray-700">Description of step 2</p>
          </div>
        </div>
      `,
    })
  }

  // NEW CONFIGURATION FUNCTIONS

  // Configure Tailwind blocks
  const configureTailwindBlocks = (editor) => {
    const blockManager = editor.BlockManager

    // Add some Tailwind-styled blocks
    blockManager.add("tailwind-card", {
      label: "کارت",
      category: "تیلویند",
      content: `
        <div class="bg-white rounded-lg shadow-md p-6 m-4">
          <h2 class="text-xl font-bold mb-4">عنوان کارت</h2>
          <p class="text-gray-700 mb-4">توضیحات کارت در اینجا</p>
          <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            دکمه
          </button>
        </div>
      `,
      attributes: { class: "fa fa-credit-card" },
    })

    blockManager.add("tailwind-hero", {
      label: "هیرو",
      category: "تیلویند",
      content: `
        <div class="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-12 text-center">
          <h1 class="text-4xl font-bold mb-4">عنوان صفحه</h1>
          <p class="text-xl mb-6">توضیحات مختصر در مورد سایت یا محصول شما</p>
          <button class="bg-white text-blue-500 px-6 py-3 rounded-full font-bold hover:bg-blue-100">
            شروع کنید
          </button>
        </div>
      `,
      attributes: { class: "fa fa-star" },
    })

    blockManager.add("tailwind-features", {
      label: "ویژگی‌ها",
      category: "تیلویند",
      content: `
        <div class="flex flex-wrap justify-center p-4">
          <div class="w-full md:w-1/3 p-4">
            <div class="border rounded-lg p-6 h-full">
              <div class="text-3xl text-blue-500 mb-4">
                <i class="fa fa-bolt"></i>
              </div>
              <h3 class="text-xl font-bold mb-2">ویژگی اول</h3>
              <p class="text-gray-600">توضیحات ویژگی اول در اینجا</p>
            </div>
          </div>
          <div class="w-full md:w-1/3 p-4">
            <div class="border rounded-lg p-6 h-full">
              <div class="text-3xl text-blue-500 mb-4">
                <i class="fa fa-shield"></i>
              </div>
              <h3 class="text-xl font-bold mb-2">ویژگی دوم</h3>
              <p class="text-gray-600">توضیحات ویژگی دوم در اینجا</p>
            </div>
          </div>
          <div class="w-full md:w-1/3 p-4">
            <div class="border rounded-lg p-6 h-full">
              <div class="text-3xl text-blue-500 mb-4">
                <i class="fa fa-cog"></i>
              </div>
              <h3 class="text-xl font-bold mb-2">ویژگی سوم</h3>
              <p class="text-gray-600">توضیحات ویژگی سوم در اینجا</p>
            </div>
          </div>
        </div>
      `,
      attributes: { class: "fa fa-th-large" },
    })

    blockManager.add("tailwind-rtl-container", {
      label: "کانتینر RTL",
      category: "تیلویند",
      content: `
        <div dir="rtl" class="w-full p-6">
          <h2 class="text-2xl font-bold mb-4">عنوان فارسی</h2>
          <p class="mb-4">این یک متن به زبان فارسی است که از راست به چپ نوشته می‌شود.</p>
          <div class="flex flex-row-reverse space-x-reverse space-x-4">
            <button class="bg-blue-500 text-white px-4 py-2 rounded">دکمه اول</button>
            <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded">دکمه دوم</button>
          </div>
        </div>
      `,
      attributes: { class: "fa fa-align-right" },
    })
  }

  // Configure blocks for template variables
  const configureTemplateVariableBlocks = (editor) => {
    const blockManager = editor.BlockManager

    // Add variable template blocks
    blockManager.add("template-variable", {
      label: "متغیر قالب",
      category: "متغیرها",
      content: {
        type: "text",
        content: "{{companyName}}",
      },
      attributes: { class: "fa fa-database" },
    })

    // Company info block with multiple variables
    blockManager.add("company-info-block", {
      label: "بلوک اطلاعات شرکت",
      category: "متغیرها",
      content: `
        <div class="bg-white shadow-md rounded p-6 my-4">
          <h2 class="text-2xl font-bold mb-4">{{companyName}}</h2>
          <p class="text-gray-700 mb-2"><strong>نام انگلیسی:</strong> {{companyNameEn}}</p>
          <p class="text-gray-700 mb-2"><strong>مدیرعامل:</strong> {{ceo}}</p>
          <div class="mt-4">
            <p class="text-gray-700"><strong>توضیحات:</strong></p>
            <p class="text-gray-600">{{description}}</p>
          </div>
        </div>
      `,
      attributes: { class: "fa fa-building" },
    })

    // Company products block
    blockManager.add("company-products-block", {
      label: "بلوک محصولات",
      category: "متغیرها",
      content: `
        <div class="bg-white shadow-md rounded p-6 my-4">
          <h2 class="text-2xl font-bold mb-4">محصولات</h2>
          <div>{{products}}</div>
        </div>
      `,
      attributes: { class: "fa fa-cubes" },
    })

    // Contact information block
    blockManager.add("company-contact-block", {
      label: "بلوک اطلاعات تماس",
      category: "متغیرها",
      content: `
        <div class="bg-white shadow-md rounded p-6 my-4">
          <h2 class="text-2xl font-bold mb-4">اطلاعات تماس</h2>
          <p class="text-gray-700 mb-2"><strong>آدرس دفتر:</strong> {{officeLocation}}</p>
          <p class="text-gray-700 mb-2"><strong>آدرس کارخانه:</strong> {{factoryLocation}}</p>
          <p class="text-gray-700 mb-2"><strong>تلفن‌ها:</strong> {{tels}}</p>
        </div>
      `,
      attributes: { class: "fa fa-address-card" },
    })
  }

  // Configure Form Builder Template
  const configureFormBuilderTemplate = (editor) => {
    const blockManager = editor.BlockManager

    // Create custom form builder component type
    editor.DomComponents.addType("form-builder", {
      model: {
        defaults: {
          tagName: "div",
          droppable: true,
          attributes: { class: "form-builder-container" },
          components: `
            <div dir="rtl" class="bg-gray-100 p-6 rounded-lg">
              <h2 class="text-2xl font-bold mb-4">فرم ساز</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Form Fields will be added here -->
                <div class="form-field-container p-4 border border-dashed border-gray-400 min-h-24 rounded">
                  <div class="text-center text-gray-500">فیلدها را اینجا رها کنید</div>
                </div>
                
                <!-- Preview section -->
                <div class="bg-white p-4 rounded shadow">
                  <h3 class="text-lg font-semibold mb-2">پیش‌نمایش فرم</h3>
                  <div class="form-preview min-h-24">
                    <p class="text-gray-500 text-center">پیش‌نمایش فرم در اینجا نمایش داده می‌شود</p>
                  </div>
                  <button type="button" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">ذخیره فرم</button>
                </div>
              </div>
            </div>
          `,
          script: function () {
            // This script runs in the iframe context
            const container = this.querySelector(".form-field-container")
            const preview = this.querySelector(".form-preview")

            // Handle form field add
            const addField = (type, label) => {
              const field = document.createElement("div")
              field.className = "form-field mb-4 p-3 bg-white rounded shadow flex justify-between items-center"

              let fieldContent = ""
              switch (type) {
                case "text":
                  fieldContent = `<input type="text" placeholder="${label}" class="border rounded px-2 py-1 w-full" />`
                  break
                case "textarea":
                  fieldContent = `<textarea placeholder="${label}" class="border rounded px-2 py-1 w-full"></textarea>`
                  break
                case "select":
                  fieldContent = `
                    <select class="border rounded px-2 py-1 w-full">
                      <option value="" disabled selected>انتخاب کنید</option>
                      <option value="option1">گزینه 1</option>
                      <option value="option2">گزینه 2</option>
                    </select>
                  `
                  break
                case "checkbox":
                  fieldContent = `
                    <label class="flex items-center">
                      <input type="checkbox" class="mr-2" />
                      ${label}
                    </label>
                  `
                  break
                default:
                  fieldContent = `<input type="${type}" placeholder="${label}" class="border rounded px-2 py-1 w-full" />`
              }

              field.innerHTML = `
                <div class="flex-1 mr-2">
                  <label class="block mb-1 font-medium">${label}</label>
                  ${fieldContent}
                </div>
                <div class="field-controls">
                  <button type="button" class="text-red-500 delete-field">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              `

              // Attach delete event
              const deleteBtn = field.querySelector(".delete-field")
              if (deleteBtn) {
                deleteBtn.addEventListener("click", () => {
                  field.remove()
                  updatePreview()
                })
              }

              container.appendChild(field)
              updatePreview()
            }

            // Update the preview section
            const updatePreview = () => {
              const fields = container.querySelectorAll(".form-field")

              if (fields.length === 0) {
                preview.innerHTML = '<p class="text-gray-500 text-center">پیش‌نمایش فرم در اینجا نمایش داده می‌شود</p>'
                return
              }

              let previewHtml = '<form class="preview-form">'

              fields.forEach((field) => {
                const label = field.querySelector("label").textContent
                const inputElement = field.querySelector("input, textarea, select")

                if (inputElement) {
                  const inputType = inputElement.type || "text"

                  if (inputType === "checkbox") {
                    previewHtml += `
                      <div class="mb-3">
                        <label class="flex items-center">
                          <input type="checkbox" class="mr-2" />
                          ${label}
                        </label>
                      </div>
                    `
                  } else if (inputElement.tagName.toLowerCase() === "textarea") {
                    previewHtml += `
                      <div class="mb-3">
                        <label class="block mb-1 font-medium">${label}</label>
                        <textarea class="border rounded px-2 py-1 w-full" placeholder="${label}"></textarea>
                      </div>
                    `
                  } else if (inputElement.tagName.toLowerCase() === "select") {
                    previewHtml += `
                      <div class="mb-3">
                        <label class="block mb-1 font-medium">${label}</label>
                        <select class="border rounded px-2 py-1 w-full">
                          <option value="" disabled selected>انتخاب کنید</option>
                          <option value="option1">گزینه 1</option>
                          <option value="option2">گزینه 2</option>
                        </select>
                      </div>
                    `
                  } else {
                    previewHtml += `
                      <div class="mb-3">
                        <label class="block mb-1 font-medium">${label}</label>
                        <input type="${inputType}" class="border rounded px-2 py-1 w-full" placeholder="${label}" />
                      </div>
                    `
                  }
                }
              })

              previewHtml += `
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded mt-4">ارسال</button>
              </form>`

              preview.innerHTML = previewHtml
            }

            // Create some example fields initially
            setTimeout(() => {
              addField("text", "نام")
              addField("email", "ایمیل")
              addField("textarea", "پیام")
            }, 500)
          },
        },
      },
    })

    // Add Form Builder block
    blockManager.add("form-builder-block", {
      label: "فرم ساز",
      category: "فرم‌ها",
      content: { type: "form-builder" },
      attributes: { class: "fa fa-wpforms" },
    })

    // Create individual form field blocks
    FIELD_TYPES.forEach((fieldType) => {
      editor.DomComponents.addType(`form-field-${fieldType.value}`, {
        model: {
          defaults: {
            tagName: "div",
            draggable: ".form-field-container",
            attributes: {
              class: "form-field mb-4 p-3 bg-white rounded shadow flex justify-between items-center",
              "data-field-type": fieldType.value,
            },
            components: `
              <div class="flex-1 mr-2">
                <label class="block mb-1 font-medium">${fieldType.label}</label>
                ${getFieldHtml(fieldType.value, fieldType.label)}
              </div>
              <div class="field-controls">
                <button type="button" class="text-red-500 delete-field">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            `,
            traits: [
              {
                type: "text",
                label: "Field Label",
                name: "fieldLabel",
                changeProp: 1,
              },
              {
                type: "text",
                label: "Field Name",
                name: "fieldName",
                changeProp: 1,
              },
              {
                type: "checkbox",
                label: "Required",
                name: "required",
                changeProp: 1,
              },
            ],
          },
          init() {
            this.on("change:fieldLabel", this.updateLabel)
            this.on("change:required", this.updateRequired)
          },
          updateLabel() {
            const label = this.get("fieldLabel")
            if (label) {
              const labelEl = this.view.el.querySelector("label")
              if (labelEl) {
                labelEl.textContent = label
              }
            }
          },
          updateRequired() {
            const required = this.get("required")
            const input = this.view.el.querySelector("input, textarea, select")
            if (input) {
              if (required) {
                input.setAttribute("required", "required")
              } else {
                input.removeAttribute("required")
              }
            }
          },
        },
      })

      // Add the field block
      blockManager.add(`form-field-${fieldType.value}`, {
        label: fieldType.label,
        category: "Form Fields",
        attributes: { class: getIconClass(fieldType.value) },
        content: { type: `form-field-${fieldType.value}` },
      })
    })

    // Add the complete Form Builder from the FormBuilder.jsx component
    blockManager.add("complete-form-builder", {
      label: "فرم ساز کامل",
      category: "فرم‌ها",
      attributes: { class: "fa fa-tasks" },
      content: `
        <div dir="rtl" class="bg-[#0c1a2a] text-white p-6 rounded-lg">
          <div class="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- LEFT PANEL: LAYOUT (چیدمان) -->
            <div>
              <h2 class="text-2xl font-bold mb-2">چیدمان (Layout)</h2>
              <p class="text-sm mb-4">
                می‌توانید از سازنده ورودی برای اضافه کردن فیلدها استفاده کنید (You
                can start adding fields with Input Creator)
              </p>
              <div class="bg-[#142337] p-4 rounded shadow">
                <div class="fields-container min-h-40">
                  <!-- Fields will be listed here -->
                  <div class="text-center text-gray-400 p-4">
                    فیلدهای ایجاد شده اینجا نمایش داده می‌شوند
                  </div>
                </div>
                <!-- Bottom buttons -->
                <div class="flex justify-between mt-4">
                  <button
                    class="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded reset-button"
                  >
                    بازنشانی (RESET)
                  </button>
                  <button
                    class="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded delete-all-button"
                  >
                    حذف همه (DELETE ALL)
                  </button>
                </div>
              </div>
            </div>

            <!-- RIGHT PANEL: INPUT CREATOR (سازنده ورودی) -->
            <div>
              <h2 class="text-2xl font-bold mb-2">
                سازنده ورودی (Input Creator)
              </h2>
              <p class="text-sm mb-4">
                این فرم به شما اجازه می‌دهد ورودی‌ها را بسازید و ویرایش کنید. (This
                form allows you to create and update inputs)
              </p>
              <div class="bg-[#142337] p-4 rounded shadow field-creator">
                <div class="mb-2">
                  <label class="block text-sm mb-1">نام (Name):</label>
                  <input
                    type="text"
                    name="name"
                    class="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1 field-name"
                    style="direction: rtl"
                  />
                </div>
                <div class="mb-2">
                  <label class="block text-sm mb-1">نوع (Type):</label>
                  <select
                    name="type"
                    class="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1 field-type"
                    style="direction: rtl"
                  >
                    ${FIELD_TYPES.map((ft) => `<option value="${ft.value}">${ft.label}</option>`).join("")}
                  </select>
                </div>
                <div class="mb-2">
                  <label class="block text-sm mb-1">برچسب (Label):</label>
                  <input
                    type="text"
                    name="label"
                    class="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1 field-label"
                    style="direction: rtl"
                  />
                </div>
                <!-- Options for select/radio -->
                <div class="field-options hidden mb-2">
                  <label class="block text-sm mb-1">
                    گزینه‌ها (Options) (جداشده با ویرگول):
                  </label>
                  <input
                    type="text"
                    name="options"
                    class="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1 field-options-input"
                    style="direction: rtl"
                  />
                </div>
                <div class="mb-2">
                  <label class="inline-flex items-center text-sm">
                    <input
                      type="checkbox"
                      name="showValidation"
                      class="mr-2 field-show-validation"
                    />
                    نمایش اعتبارسنجی (Show validation)
                  </label>
                </div>
                <div class="validation-options hidden">
                  <div class="mb-2">
                    <label class="inline-flex items-center text-sm">
                      <input
                        type="checkbox"
                        name="required"
                        class="mr-2 field-required"
                      />
                      ضروری (Required)
                    </label>
                  </div>
                  <div class="mb-2">
                    <label class="block text-sm mb-1">حداکثر (Max)</label>
                    <input
                      type="number"
                      name="max"
                      class="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1 field-max"
                      style="direction: rtl"
                    />
                  </div>
                  <div class="mb-2">
                    <label class="block text-sm mb-1">حداقل (Min)</label>
                    <input
                      type="number"
                      name="min"
                      class="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1 field-min"
                      style="direction: rtl"
                    />
                  </div>
                  <div class="mb-2">
                    <label class="block text-sm mb-1">
                      حداکثر طول (MaxLength)
                    </label>
                    <input
                      type="number"
                      name="maxLength"
                      class="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1 field-max-length"
                      style="direction: rtl"
                    />
                  </div>
                  <div class="mb-2">
                    <label class="block text-sm mb-1">
                      الگو (Pattern) (RegEx)
                    </label>
                    <input
                      type="text"
                      name="pattern"
                      class="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1 field-pattern"
                      style="direction: rtl"
                    />
                  </div>
                </div>
                <div class="flex items-center space-x-2 space-x-reverse mt-4">
                  <button
                    class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded font-semibold create-field-button"
                  >
                    ساخت فیلد (CREATE)
                  </button>
                  <span class="text-gray-400">یا (or)</span>
                  <button
                    class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded font-semibold generate-form-button"
                  >
                    ساخت فرم (GENERATE FORM)
                  </button>
                </div>
              </div>
              <div class="generated-form-container mt-6 hidden">
                <h3 class="text-xl font-bold mb-4">فرم ساخته‌شده (Generated Form)</h3>
                <form class="generated-form">
                  <!-- Generated form will be shown here -->
                </form>
              </div>
            </div>
          </div>
        </div>
      `,
      script: function () {
        // Store fields
        let fields = []
        let editingIndex = null

        // DOM references
        const fieldsContainer = this.querySelector(".fields-container")
        const fieldNameInput = this.querySelector(".field-name")
        const fieldTypeSelect = this.querySelector(".field-type")
        const fieldLabelInput = this.querySelector(".field-label")
        const fieldOptionsContainer = this.querySelector(".field-options")
        const fieldOptionsInput = this.querySelector(".field-options-input")
        const fieldShowValidation = this.querySelector(".field-show-validation")
        const validationOptions = this.querySelector(".validation-options")
        const fieldRequired = this.querySelector(".field-required")
        const fieldMax = this.querySelector(".field-max")
        const fieldMin = this.querySelector(".field-min")
        const fieldMaxLength = this.querySelector(".field-max-length")
        const fieldPattern = this.querySelector(".field-pattern")
        const createFieldButton = this.querySelector(".create-field-button")
        const resetButton = this.querySelector(".reset-button")
        const deleteAllButton = this.querySelector(".delete-all-button")
        const generateFormButton = this.querySelector(".generate-form-button")
        const generatedFormContainer = this.querySelector(".generated-form-container")
        const generatedForm = this.querySelector(".generated-form")

        // Create empty field object
        const createEmptyField = () => ({
          id: Date.now(),
          name: "",
          label: "",
          type: "text",
          showValidation: false,
          required: false,
          min: "",
          max: "",
          maxLength: "",
          pattern: "",
          options: [],
        })

        // Show/hide options based on field type
        fieldTypeSelect.addEventListener("change", function () {
          const type = this.value
          if (type === "select" || type === "radio") {
            fieldOptionsContainer.classList.remove("hidden")
          } else {
            fieldOptionsContainer.classList.add("hidden")
          }
        })

        // Show/hide validation options
        fieldShowValidation.addEventListener("change", function () {
          if (this.checked) {
            validationOptions.classList.remove("hidden")
          } else {
            validationOptions.classList.add("hidden")
          }
        })

        // Reset form inputs
        const resetForm = () => {
          const emptyField = createEmptyField()
          fieldNameInput.value = emptyField.name
          fieldTypeSelect.value = emptyField.type
          fieldLabelInput.value = emptyField.label
          fieldOptionsInput.value = ""
          fieldShowValidation.checked = emptyField.showValidation
          fieldRequired.checked = emptyField.required
          fieldMax.value = emptyField.max
          fieldMin.value = emptyField.min
          fieldMaxLength.value = emptyField.maxLength
          fieldPattern.value = emptyField.pattern

          // Hide options that should be hidden by default
          fieldOptionsContainer.classList.add("hidden")
          validationOptions.classList.add("hidden")

          // Reset editing state
          editingIndex = null
        }

        // Create field
        createFieldButton.addEventListener("click", () => {
          const name = fieldNameInput.value.trim()
          if (!name) {
            alert("لطفاً نام فیلد را وارد کنید (Please provide a field name).")
            return
          }

          const newField = {
            id: Date.now(),
            name: name,
            label: fieldLabelInput.value.trim(),
            type: fieldTypeSelect.value,
            showValidation: fieldShowValidation.checked,
            required: fieldRequired.checked,
            min: fieldMin.value,
            max: fieldMax.value,
            maxLength: fieldMaxLength.value,
            pattern: fieldPattern.value,
            options: fieldOptionsInput.value ? fieldOptionsInput.value.split(",").map((opt) => opt.trim()) : [],
          }

          if (editingIndex !== null) {
            // Update existing field
            fields[editingIndex] = newField
          } else {
            // Add new field
            fields.push(newField)
          }

          // Reset form and update display
          resetForm()
          renderFields()
        })

        // Reset all
        resetButton.addEventListener("click", () => {
          fields = []
          resetForm()
          renderFields()
          generatedFormContainer.classList.add("hidden")
        })

        // Delete all fields
        deleteAllButton.addEventListener("click", () => {
          if (confirm("حذف همه فیلدها؟ (Delete all fields?)")) {
            fields = []
            renderFields()
          }
        })

        // Generate form
        generateFormButton.addEventListener("click", () => {
          renderGeneratedForm()
          generatedFormContainer.classList.remove("hidden")
        })

        // Render fields list
        const renderFields = () => {
          if (fields.length === 0) {
            fieldsContainer.innerHTML = `
              <div class="text-center text-gray-400 p-4">
                فیلدهای ایجاد شده اینجا نمایش داده می‌شوند
              </div>
            `
            return
          }

          fieldsContainer.innerHTML = ""

          fields.forEach((field, index) => {
            const fieldElement = document.createElement("div")
            fieldElement.className = "mb-2 border border-gray-600 rounded"

            // Header with field name and buttons
            const header = document.createElement("div")
            header.className = "flex justify-between items-center px-3 py-2 bg-[#1f2b3b] cursor-move"
            header.innerHTML = `
              <span class="font-semibold">${field.label || field.name}</span>
              <div class="flex space-x-2 space-x-reverse">
                <button class="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded edit-button" data-index="${index}">
                  ویرایش (EDIT)
                </button>
                <button class="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded delete-button" data-index="${index}">
                  حذف (DELETE)
                </button>
              </div>
            `

            fieldElement.appendChild(header)
            fieldsContainer.appendChild(fieldElement)

            // Add event listeners
            const editButton = header.querySelector(".edit-button")
            const deleteButton = header.querySelector(".delete-button")

            editButton.addEventListener("click", function () {
              const idx = Number.parseInt(this.dataset.index)
              editingIndex = idx
              const field = fields[idx]

              // Fill form with field data
              fieldNameInput.value = field.name
              fieldTypeSelect.value = field.type
              fieldLabelInput.value = field.label
              fieldOptionsInput.value = field.options.join(",")
              fieldShowValidation.checked = field.showValidation
              fieldRequired.checked = field.required
              fieldMax.value = field.max
              fieldMin.value = field.min
              fieldMaxLength.value = field.maxLength
              fieldPattern.value = field.pattern

              // Show/hide optional sections
              if (field.type === "select" || field.type === "radio") {
                fieldOptionsContainer.classList.remove("hidden")
              } else {
                fieldOptionsContainer.classList.add("hidden")
              }

              if (field.showValidation) {
                validationOptions.classList.remove("hidden")
              } else {
                validationOptions.classList.add("hidden")
              }
            })

            deleteButton.addEventListener("click", function () {
              const idx = Number.parseInt(this.dataset.index)
              if (confirm("آیا مطمئن هستید که می‌خواهید این فیلد را حذف کنید؟ (Are you sure?)")) {
                fields.splice(idx, 1)
                renderFields()

                if (editingIndex === idx) {
                  resetForm()
                }
              }
            })
          })
        }

        // Render generated form
        const renderGeneratedForm = () => {
          generatedForm.innerHTML = ""

          fields.forEach((field) => {
            const fieldContainer = document.createElement("div")
            fieldContainer.className = "mb-4"

            let inputHtml = ""
            const validationAttrs = field.showValidation ? `${field.required ? "required" : ""}` : ""

            switch (field.type) {
              case "select":
                inputHtml = `
                  <label class="block mb-1 font-semibold">${field.label || field.name}</label>
                  <select
                    name="${field.name}"
                    class="w-full bg-[#142337] text-white border border-gray-600 rounded px-2 py-1"
                    ${validationAttrs}
                    style="direction: rtl"
                  >
                    <option value="" disabled selected>لطفاً یک گزینه انتخاب کنید (Select an option)</option>
                    ${field.options.map((opt) => `<option value="${opt}">${opt}</option>`).join("")}
                  </select>
                `
                break
              case "radio":
                inputHtml = `
                  <p class="block mb-1 font-semibold">${field.label || field.name}</p>
                  ${field.options
                    .map(
                      (opt, i) => `
                    <label class="ml-4">
                      <input
                        type="radio"
                        name="${field.name}"
                        value="${opt}"
                        class="ml-1"
                        ${validationAttrs}
                        style="cursor: pointer"
                      />
                      ${opt}
                    </label>
                  `,
                    )
                    .join("")}
                `
                break
              case "checkbox":
                inputHtml = `
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="${field.name}"
                      class="ml-2"
                      ${validationAttrs}
                      style="cursor: pointer"
                    />
                    ${field.label || field.name}
                  </label>
                `
                break
              case "textarea":
                inputHtml = `
                  <label class="block mb-1 font-semibold">${field.label || field.name}</label>
                  <textarea
                    name="${field.name}"
                    class="w-full bg-[#142337] text-white border border-gray-600 rounded px-2 py-1 h-24"
                    ${validationAttrs}
                    style="direction: rtl"
                  ></textarea>
                `
                break
              default:
                inputHtml = `
                  <label class="block mb-1 font-semibold">${field.label || field.name}</label>
                  <input
                    type="${field.type}"
                    name="${field.name}"
                    class="w-full bg-[#142337] text-white border border-gray-600 rounded px-2 py-1"
                    ${validationAttrs}
                    style="direction: rtl"
                  />
                `
            }

            fieldContainer.innerHTML = inputHtml
            generatedForm.appendChild(fieldContainer)
          })

          // Add submit button
          const submitButton = document.createElement("button")
          submitButton.type = "button" // We'll use button type to prevent form submission
          submitButton.className = "bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded mt-2"
          submitButton.textContent = "ارسال (Submit)"
          submitButton.addEventListener("click", () => {
            alert("فرم تکمیل شد!")
          })

          generatedForm.appendChild(submitButton)
        }

        // Initialize with empty form
        resetForm()
      },
    })
  }

  // Render the editor UI
  return (
    <div className="enhanced-grapesjs-editor">
      {/* Editor toolbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          borderBottom: "1px solid #ddd",
        }}
      >
        <div className="panel-devices-container" style={{ display: "flex", gap: "8px" }}></div>
        <div className="panel-custom-actions-container" style={{ display: "flex", gap: "8px" }}></div>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={() => {
              if (editorInstance.current) {
                const html = editorInstance.current.getHtml()
                const css = editorInstance.current.getCss()
                const js = scriptContent

                if (onSave) {
                  onSave({ html, css, js })
                }
              }
            }}
          >
            ذخیره
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Preview />}
            onClick={() => setIsPreviewModalOpen(true)}
            sx={{ ml: 1 }}
          >
            پیش‌نمایش
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<PublishRounded />}
            onClick={() => setIsPublishDrawerOpen(true)}
            sx={{ ml: 1 }}
          >
            انتشار
          </Button>
        </Box>
      </Box>

      {/* Main editor area */}
      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        {/* Left sidebar - Blocks */}
        <Box sx={{ width: "240px", borderRight: "1px solid #ddd", overflow: "auto" }}>
          <Typography variant="subtitle1" sx={{ p: 2, fontWeight: "bold" }}>
            بلوک‌ها
          </Typography>
          <div className="blocks-container"></div>
        </Box>

        {/* Center - Canvas */}
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <div ref={editorRef} style={{ height: "100%" }}></div>
        </Box>

        {/* Right sidebar - Styles, Layers */}
        <Box sx={{ width: "280px", borderLeft: "1px solid #ddd", overflow: "auto" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="استایل‌ها" />
            <Tab label="لایه‌ها" />
          </Tabs>
          {tabValue === 0 && <div className="styles-container"></div>}
          {tabValue === 1 && <div className="layers-container"></div>}
        </Box>
      </Box>

      {/* Script Editor Dialog */}
      <Dialog open={isScriptEditorOpen} onClose={() => setIsScriptEditorOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>
          ویرایشگر اسکریپت
          <IconButton
            aria-label="close"
            onClick={() => setIsScriptEditorOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: "60vh" }}>
            <MonacoEditor
              language="javascript"
              theme="vs-dark"
              value={scriptContent}
              onChange={(value) => setScriptContent(value)}
              options={{
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: "line",
                automaticLayout: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsScriptEditorOpen(false)}>لغو</Button>
          <Button variant="contained" color="primary" onClick={() => setIsScriptEditorOpen(false)}>
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>
          پیش‌نمایش
          <IconButton
            aria-label="close"
            onClick={() => setIsPreviewModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editorInstance.current && (
            <Box sx={{ height: "70vh", overflow: "auto" }}>
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        ${editorInstance.current.getCss()}
                        body { margin: 0; }
                      </style>
                      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                      <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
                    </head>
                    <body>
                      ${editorInstance.current.getHtml()}
                      <script>
                        ${scriptContent}
                      </script>
                    </body>
                  </html>
                `}
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Publish Drawer */}
      <Drawer
        anchor="right"
        open={isPublishDrawerOpen}
        onClose={() => setIsPublishDrawerOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: "400px" } }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">انتشار مینی‌اپ</Typography>
            <IconButton onClick={() => setIsPublishDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="اطلاعات پایه" />
            <Tab label="دسترسی‌ها" />
            <Tab label="تنظیمات پیشرفته" />
          </Tabs>

          {tabValue === 0 && (
            <Box>
              <TextField
                label="نام مینی‌اپ"
                fullWidth
                margin="normal"
                value={miniappMetadata.name}
                onChange={(e) => setMiniappMetadata({ ...miniappMetadata, name: e.target.value })}
              />
              <TextField
                label="نسخه"
                fullWidth
                margin="normal"
                value={miniappMetadata.version}
                onChange={(e) => setMiniappMetadata({ ...miniappMetadata, version: e.target.value })}
              />
              <TextField
                label="توضیحات"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={miniappMetadata.description}
                onChange={(e) => setMiniappMetadata({ ...miniappMetadata, description: e.target.value })}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>نوع کلاینت</InputLabel>
                <Select
                  value={miniappMetadata.clientType}
                  label="نوع کلاینت"
                  onChange={(e) => setMiniappMetadata({ ...miniappMetadata, clientType: e.target.value })}
                >
                  {CLIENT_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="مسیر روت"
                fullWidth
                margin="normal"
                value={miniappMetadata.routePath}
                onChange={(e) => setMiniappMetadata({ ...miniappMetadata, routePath: e.target.value })}
              />
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                دسترسی‌های مورد نیاز
              </Typography>
              <List>
                {availableRoles.map((role) => (
                  <ListItem key={role.name}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={miniappMetadata.access.includes(role.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMiniappMetadata({
                              ...miniappMetadata,
                              access: [...miniappMetadata.access, role.name],
                            })
                          } else {
                            setMiniappMetadata({
                              ...miniappMetadata,
                              access: miniappMetadata.access.filter((a) => a !== role.name),
                            })
                          }
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={role.displayName} secondary={role.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <FormControl fullWidth margin="normal">
                <InputLabel>نوع یکپارچه‌سازی</InputLabel>
                <Select
                  value={miniappMetadata.integrationType}
                  label="نوع یکپارچه‌سازی"
                  onChange={(e) => setMiniappMetadata({ ...miniappMetadata, integrationType: e.target.value })}
                >
                  {INTEGRATION_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={miniappMetadata.showInNavigation}
                    onChange={(e) => setMiniappMetadata({ ...miniappMetadata, showInNavigation: e.target.checked })}
                  />
                }
                label="نمایش در منوی اصلی"
                sx={{ my: 2 }}
              />
              <TextField
                label="آیکون منو"
                fullWidth
                margin="normal"
                value={miniappMetadata.navigationIcon}
                onChange={(e) => setMiniappMetadata({ ...miniappMetadata, navigationIcon: e.target.value })}
              />
              <TextField
                label="توضیح کوتاه منو"
                fullWidth
                margin="normal"
                value={miniappMetadata.navigationTooltip}
                onChange={(e) => setMiniappMetadata({ ...miniappMetadata, navigationTooltip: e.target.value })}
              />
            </Box>
          )}

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<PublishRounded />}
              onClick={handlePublish}
              disabled={isPublishing || !miniappMetadata.name || !miniappMetadata.routePath}
            >
              انتشار مینی‌اپ
            </Button>

            {isPublishing && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={publishProgress} />
                <Typography variant="caption" sx={{ mt: 1, display: "block", textAlign: "center" }}>
                  در حال انتشار... {publishProgress}%
                </Typography>
              </Box>
            )}

            {publishSuccess && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "success.light", borderRadius: 1 }}>
                <Typography variant="body2" color="success.contrastText">
                  مینی‌اپ با موفقیت منتشر شد!
                </Typography>
                {publishedUrl && (
                  <Button
                    startIcon={<Launch />}
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => window.open(publishedUrl, "_blank")}
                  >
                    مشاهده مینی‌اپ
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </div>
  )
}

export default EnhancedGrapesJSEditor4

