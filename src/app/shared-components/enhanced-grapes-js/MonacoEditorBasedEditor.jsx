"use client"

import { useEffect, useRef, useState } from "react"
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material"
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  Preview as PreviewIcon,
  Close as CloseIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Laptop as LaptopIcon,
  Desktop as DesktopIcon,
} from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import { publishTemplate, getAvailablePlacements, getInjectableVariables } from "../../store/miniAppSlice"
import VariableSelector from "./VariableSelector"
import PlacementSelector from "./PlacementSelector"
import VersionSelector from "./VersionSelector"
import MonacoEditor from "@monaco-editor/react"
import * as monaco from "monaco-editor"

const MonacoEditorBasedEditor = ({ initialContent = "", onSave, templateId = null }) => {
  const htmlEditorRef = useRef(null)
  const cssEditorRef = useRef(null)
  const jsEditorRef = useRef(null)

  const [tabValue, setTabValue] = useState(0)
  const [htmlValue, setHtmlValue] = useState("")
  const [cssValue, setCssValue] = useState("")
  const [jsValue, setJsValue] = useState("")
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateVersion, setTemplateVersion] = useState("1.0.0")
  const [selectedPlacement, setSelectedPlacement] = useState(null)
  const [newPageName, setNewPageName] = useState("")
  const [showInNav, setShowInNav] = useState(false)
  const [navIcon, setNavIcon] = useState("")
  const [navTooltip, setNavTooltip] = useState("")
  const [renderMethod, setRenderMethod] = useState("iframe")
  const [previewDevice, setPreviewDevice] = useState("desktop")
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const { availablePlacements, injectableVariables } = useSelector((state) => state.miniApp)

  // Initialize content
  useEffect(() => {
    // Fetch available placements
    dispatch(getAvailablePlacements())

    // Load initial content if provided
    if (initialContent) {
      try {
        const parsedContent = JSON.parse(initialContent)

        if (parsedContent.html) {
          setHtmlValue(parsedContent.html)
        }

        if (parsedContent.css) {
          setCssValue(parsedContent.css)
        }

        if (parsedContent.js) {
          setJsValue(parsedContent.js)
        }
      } catch (error) {
        console.error("Error parsing initial content:", error)
      }
    } else {
      // Set default HTML template
      setHtmlValue(`<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">عنوان صفحه</h1>
  <p class="text-gray-600 mb-6">توضیحات صفحه در اینجا قرار می‌گیرد.</p>
  
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold mb-4">بخش اصلی</h2>
    <p>محتوای اصلی صفحه در اینجا قرار می‌گیرد.</p>
  </div>
</div>`)

      // Set default CSS
      setCssValue(`body {
  direction: rtl;
  font-family: 'Vazirmatn', sans-serif;
  background-color: #f9fafb;
}

.container {
  max-width: 1200px;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: bold;
}`)

      // Set default JS
      setJsValue(`document.addEventListener('DOMContentLoaded', function() {
  console.log('صفحه بارگذاری شد');
  
  // دسترسی به متغیرهای تزریق شده
  if (window.context) {
    console.log('Context:', window.context);
  }
});`)
    }
  }, [dispatch, initialContent])

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Handle save
  const handleSave = () => {
    const templateData = {
      templateId,
      html: htmlValue,
      css: cssValue,
      js: jsValue,
      components: JSON.stringify({
        html: htmlValue,
        css: cssValue,
        js: jsValue,
      }),
    }

    if (onSave) {
      onSave(templateData)
    }
  }

  // Handle publish dialog open
  const handlePublishDialogOpen = () => {
    setPublishDialogOpen(true)
  }

  // Handle publish dialog close
  const handlePublishDialogClose = () => {
    setPublishDialogOpen(false)
  }

  // Handle publish
  const handlePublish = () => {
    setLoading(true)

    const publishData = {
      templateId,
      name: templateName,
      version: templateVersion,
      html: htmlValue,
      css: cssValue,
      js: jsValue,
      components: JSON.stringify({
        html: htmlValue,
        css: cssValue,
        js: jsValue,
      }),
      placement: selectedPlacement?.id || "new",
      renderMethod,
      newPageName: selectedPlacement?.id === "new" ? newPageName : null,
      showInNav: selectedPlacement?.id === "new" ? showInNav : false,
      navIcon: selectedPlacement?.id === "new" && showInNav ? navIcon : null,
      navTooltip: selectedPlacement?.id === "new" && showInNav ? navTooltip : null,
    }

    dispatch(publishTemplate(publishData))
      .then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          handlePublishDialogClose()
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  // Handle preview dialog open
  const handlePreviewDialogOpen = () => {
    setPreviewDialogOpen(true)
  }

  // Handle preview dialog close
  const handlePreviewDialogClose = () => {
    setPreviewDialogOpen(false)
  }

  // Handle placement change
  const handlePlacementChange = (placement) => {
    setSelectedPlacement(placement)

    // Fetch injectable variables for the selected placement
    if (placement) {
      dispatch(getInjectableVariables(placement.id))
    }
  }

  // Get preview width based on device
  const getPreviewWidth = () => {
    switch (previewDevice) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      case "laptop":
        return "1024px"
      case "desktop":
      default:
        return "100%"
    }
  }

  // Handle variable insertion
  const handleInsertVariable = (variable) => {
    if (tabValue === 0) {
      // Insert into HTML editor
      if (htmlEditorRef.current) {
        const editor = htmlEditorRef.current
        const selection = editor.getSelection()
        const range = new monaco.Range(
          selection.startLineNumber,
          selection.startColumn,
          selection.endLineNumber,
          selection.endColumn,
        )

        const op = {
          range: range,
          text: `{{${variable.name}}}`,
          forceMoveMarkers: true,
        }

        editor.executeEdits("my-source", [op])
        editor.focus()
      }
    } else if (tabValue === 1) {
      // Insert into CSS editor
      if (cssEditorRef.current) {
        const editor = cssEditorRef.current
        const selection = editor.getSelection()
        const range = new monaco.Range(
          selection.startLineNumber,
          selection.startColumn,
          selection.endLineNumber,
          selection.endColumn,
        )

        const op = {
          range: range,
          text: `var(--${variable.name})`,
          forceMoveMarkers: true,
        }

        editor.executeEdits("my-source", [op])
        editor.focus()
      }
    } else if (tabValue === 2) {
      // Insert into JS editor
      if (jsEditorRef.current) {
        const editor = jsEditorRef.current
        const selection = editor.getSelection()
        const range = new monaco.Range(
          selection.startLineNumber,
          selection.startColumn,
          selection.endLineNumber,
          selection.endColumn,
        )

        const op = {
          range: range,
          text: `window.context.${variable.name}`,
          forceMoveMarkers: true,
        }

        editor.executeEdits("my-source", [op])
        editor.focus()
      }
    }
  }

  // Add HTML code snippet
  const addHtmlSnippet = (snippet) => {
    if (htmlEditorRef.current) {
      const editor = htmlEditorRef.current
      const selection = editor.getSelection()
      const range = new monaco.Range(
        selection.startLineNumber,
        selection.startColumn,
        selection.endLineNumber,
        selection.endColumn,
      )

      const op = {
        range: range,
        text: snippet,
        forceMoveMarkers: true,
      }

      editor.executeEdits("my-source", [op])
      editor.focus()
    }
  }

  // HTML snippets
  const htmlSnippets = [
    {
      name: "سربرگ",
      code: `<div class="bg-white py-8">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold mb-4">عنوان بخش</h2>
    <p class="text-gray-600">توضیحات بخش در اینجا قرار می‌گیرد.</p>
  </div>
</div>`,
    },
    {
      name: "فرم",
      code: `<div class="bg-gray-100 py-8">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold mb-6 text-center">عنوان فرم</h2>
    <form class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
          نام
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="نام خود را وارد کنید">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          ایمیل
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="ایمیل خود را وارد کنید">
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="message">
          پیام
        </label>
        <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="پیام خود را وارد کنید"></textarea>
      </div>
      <div class="flex items-center justify-between">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          ارسال
        </button>
      </div>
    </form>
  </div>
</div>`,
    },
    {
      name: "کارت‌ها",
      code: `<div class="bg-white py-8">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold mb-6 text-center">عنوان بخش</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold mb-2">عنوان کارت ۱</h3>
        <p class="text-gray-600 mb-4">توضیحات کارت در اینجا قرار می‌گیرد.</p>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">مشاهده</button>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold mb-2">عنوان کارت ۲</h3>
        <p class="text-gray-600 mb-4">توضیحات کارت در اینجا قرار می‌گیرد.</p>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">مشاهده</button>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold mb-2">عنوان کارت ۳</h3>
        <p class="text-gray-600 mb-4">توضیحات کارت در اینجا قرار می‌گیرد.</p>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">مشاهده</button>
      </div>
    </div>
  </div>
</div>`,
    },
  ]

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="editor tabs">
          <Tab label="HTML" />
          <Tab label="CSS" />
          <Tab label="JS" />
        </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1, display: "flex" }}>
        {/* Left sidebar for variables and snippets */}
        <Box sx={{ width: 250, borderRight: 1, borderColor: "divider", p: 2 }}>
          {tabValue === 0 && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                قطعات آماده HTML
              </Typography>
              <Box sx={{ mb: 3 }}>
                {htmlSnippets.map((snippet, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ mb: 1, justifyContent: "flex-start" }}
                    onClick={() => addHtmlSnippet(snippet.code)}
                  >
                    {snippet.name}
                  </Button>
                ))}
              </Box>

              <VariableSelector variables={injectableVariables} onSelectVariable={handleInsertVariable} />
            </>
          )}

          {tabValue === 1 && (
            <VariableSelector variables={injectableVariables} onSelectVariable={handleInsertVariable} />
          )}

          {tabValue === 2 && (
            <VariableSelector variables={injectableVariables} onSelectVariable={handleInsertVariable} />
          )}
        </Box>

        {/* Main editor area */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {/* HTML Editor */}
          <Box sx={{ display: tabValue === 0 ? "block" : "none", height: "100%" }}>
            <MonacoEditor
              height="100%"
              language="html"
              theme="vs-dark"
              value={htmlValue}
              onChange={setHtmlValue}
              onMount={(editor) => {
                htmlEditorRef.current = editor
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                fixedOverflowWidgets: true,
              }}
            />
          </Box>

          {/* CSS Editor */}
          <Box sx={{ display: tabValue === 1 ? "block" : "none", height: "100%" }}>
            <MonacoEditor
              height="100%"
              language="css"
              theme="vs-dark"
              value={cssValue}
              onChange={setCssValue}
              onMount={(editor) => {
                cssEditorRef.current = editor
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                fixedOverflowWidgets: true,
              }}
            />
          </Box>

          {/* JS Editor */}
          <Box sx={{ display: tabValue === 2 ? "block" : "none", height: "100%" }}>
            <MonacoEditor
              height="100%"
              language="javascript"
              theme="vs-dark"
              value={jsValue}
              onChange={setJsValue}
              onMount={(editor) => {
                jsEditorRef.current = editor
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                fixedOverflowWidgets: true,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box sx={{ p: 1, borderTop: 1, borderColor: "divider", display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave} sx={{ ml: 1 }}>
          ذخیره
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PublishIcon />}
          onClick={handlePublishDialogOpen}
          sx={{ ml: 1 }}
        >
          انتشار
        </Button>
        <Button variant="outlined" startIcon={<PreviewIcon />} onClick={handlePreviewDialogOpen} sx={{ ml: 1 }}>
          پیش‌نمایش
        </Button>
      </Box>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onClose={handlePreviewDialogClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">پیش‌نمایش</Typography>
            <Box>
              <Tooltip title="موبایل">
                <IconButton
                  color={previewDevice === "mobile" ? "primary" : "default"}
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <SmartphoneIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="تبلت">
                <IconButton
                  color={previewDevice === "tablet" ? "primary" : "default"}
                  onClick={() => setPreviewDevice("tablet")}
                >
                  <TabletIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="لپ‌تاپ">
                <IconButton
                  color={previewDevice === "laptop" ? "primary" : "default"}
                  onClick={() => setPreviewDevice("laptop")}
                >
                  <LaptopIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="دسکتاپ">
                <IconButton
                  color={previewDevice === "desktop" ? "primary" : "default"}
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <DesktopIcon />
                </IconButton>
              </Tooltip>
              <IconButton onClick={handlePreviewDialogClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                width: getPreviewWidth(),
                maxWidth: "100%",
                border: "1px solid #ddd",
                borderRadius: "4px",
                height: "70vh",
                overflow: "auto",
              }}
            >
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        body {
                          direction: rtl;
                          font-family: 'Vazirmatn', sans-serif;
                        }
                        ${cssValue}
                      </style>
                      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                      <link href="https://cdn.jsdelivr.net/npm/vazirmatn@33.0.3/Vazirmatn-font-face.css" rel="stylesheet">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body>
                      ${htmlValue}
                      <script>
                        // Sample context for preview
                        window.context = {
                          company: {
                            name: 'شرکت نمونه',
                            id: '123',
                            address: 'تهران، خیابان ولیعصر',
                            phone: '021-12345678',
                            email: 'info@example.com'
                          },
                          user: {
                            fullName: 'کاربر نمونه',
                            id: '456',
                            email: 'user@example.com'
                          },
                          producer: {
                            name: 'تولیدکننده نمونه',
                            id: '789',
                            products: [
                              { id: '1', name: 'محصول 1', description: 'توضیحات محصول 1', price: 100000 },
                              { id: '2', name: 'محصول 2', description: 'توضیحات محصول 2', price: 200000 },
                              { id: '3', name: 'محصول 3', description: 'توضیحات محصول 3', price: 300000 }
                            ]
                          }
                        };
                        
                        ${jsValue}
                      </script>
                    </body>
                  </html>
                `}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Preview"
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onClose={handlePublishDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>انتشار قالب</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="نام قالب"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                fullWidth
                required
                margin="normal"
              />

              <VersionSelector value={templateVersion} onChange={setTemplateVersion} versions={[]} />

              <PlacementSelector
                value={selectedPlacement}
                onChange={handlePlacementChange}
                placements={availablePlacements}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>روش رندر</InputLabel>
                <Select value={renderMethod} onChange={(e) => setRenderMethod(e.target.value)} label="روش رندر">
                  <MenuItem value="iframe">iframe</MenuItem>
                  <MenuItem value="federation">Module Federation</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              {selectedPlacement?.id === "new" && (
                <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    تنظیمات صفحه جدید
                  </Typography>

                  <TextField
                    label="نام صفحه"
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                  />

                  <FormControl fullWidth margin="normal">
                    <InputLabel>نمایش در منو</InputLabel>
                    <Select
                      value={showInNav ? "yes" : "no"}
                      onChange={(e) => setShowInNav(e.target.value === "yes")}
                      label="نمایش در منو"
                    >
                      <MenuItem value="yes">بله</MenuItem>
                      <MenuItem value="no">خیر</MenuItem>
                    </Select>
                  </FormControl>

                  {showInNav && (
                    <>
                      <TextField
                        label="آیکون منو"
                        value={navIcon}
                        onChange={(e) => setNavIcon(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="نام آیکون (مثال: dashboard)"
                      />

                      <TextField
                        label="توضیحات منو"
                        value={navTooltip}
                        onChange={(e) => setNavTooltip(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="متن نمایشی هنگام هاور روی آیکون"
                      />
                    </>
                  )}
                </Paper>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePublishDialogClose} disabled={loading}>
            انصراف
          </Button>
          <Button
            onClick={handlePublish}
            variant="contained"
            color="primary"
            disabled={
              loading ||
              !templateName ||
              !templateVersion ||
              !selectedPlacement ||
              (selectedPlacement?.id === "new" && !newPageName)
            }
          >
            {loading ? <CircularProgress size={24} /> : "انتشار"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MonacoEditorBasedEditor

