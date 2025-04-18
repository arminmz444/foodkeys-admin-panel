"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Slider,
  IconButton,
} from "@mui/material"
import { FileIcon, FolderIcon, BeakerIcon, X } from "lucide-react"
import { ModalPosition, ModalAnimation, ModalTrigger } from "./types"
import { ConfigurableModal } from "./ConfigurableModal"
import { PreviewContent } from "./PreviewContent"
import { ResponsivePreview } from "./ResponsivePreview"

export const AdminConfigPanel = ({
  initialConfig = {},
  onSave,
  availableClients = [
    {
      id: "user-panel",
      name: "User Panel",
      paths: ["/dashboard", "/profile", "/settings"],
    },
    {
      id: "admin-panel",
      name: "Admin Panel",
      paths: ["/admin/dashboard", "/admin/users", "/admin/settings"],
    },
    {
      id: "main-website",
      name: "Main Website",
      paths: ["/", "/about", "/contact", "/pricing"],
    },
  ],
}) => {
  const [config, setConfig] = useState({
    // Default values
    position: ModalPosition.CENTER,
    animation: ModalAnimation.FADE,
    animationDuration: 0.3,
    showOverlay: true,
    overlayColor: "rgba(0, 0, 0, 0.5)",
    blurOverlay: false,
    showHeader: true,
    showFooter: true,
    primaryButtonText: "Next",
    secondaryButtonText: "Skip",
    showStepIndicator: true,
    closeOnClickOutside: true,
    closeOnEsc: true,
    showCloseButton: true,
    autoClose: false,
    autoCloseDelay: 5000,
    trigger: ModalTrigger.MANUAL,
    backgroundColor: "#1a2e69",
    textColor: "#ffffff",
    borderRadius: "0.5rem",
    shadow: true,
    width: "500px",
    ...initialConfig,
  })

  const [selectedClient, setSelectedClient] = useState(config.client || "")
  const [selectedPath, setSelectedPath] = useState(config.targetPath || "")
  const [previewIcon, setPreviewIcon] = useState("folder")
  const [isPreviewActive, setIsPreviewActive] = useState(false)
  const [previewContentType, setPreviewContentType] = useState("welcome")
  const [livePreviewMode, setLivePreviewMode] = useState(false)
  const [responsivePreviewActive, setResponsivePreviewActive] = useState(false)
  const [tabValue, setTabValue] = useState("appearance")

  const handleChange = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    const finalConfig = {
      ...config,
      client: selectedClient,
      targetPath: selectedPath,
    }
    onSave?.(finalConfig)
  }

  const getIconPreview = () => {
    switch (previewIcon) {
      case "file":
        return <FileIcon size={24} className="text-black" />
      case "folder":
        return <FolderIcon size={24} className="text-black" />
      case "beaker":
        return <BeakerIcon size={24} className="text-black" />
      default:
        return <FolderIcon size={24} className="text-black" />
    }
  }

  const togglePreview = () => {
    setIsPreviewActive((prev) => !prev)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <>
      <Card className="w-full max-w-4xl">
        <CardHeader title="Modal Configuration" />
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} className="mb-4">
            <Tab label="Appearance" value="appearance" />
            <Tab label="Behavior" value="behavior" />
            <Tab label="Content" value="content" />
            <Tab label="Animation" value="animation" />
            <Tab label="Targeting" value="targeting" />
          </Tabs>

          <Box sx={{ pt: 2 }}>
            {tabValue === "appearance" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Typography variant="subtitle2">Background Color</Typography>
                    <TextField
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => handleChange("backgroundColor", e.target.value)}
                      fullWidth
                      margin="dense"
                    />
                  </div>

                  <div>
                    <Typography variant="subtitle2">Text Color</Typography>
                    <TextField
                      type="color"
                      value={config.textColor}
                      onChange={(e) => handleChange("textColor", e.target.value)}
                      fullWidth
                      margin="dense"
                    />
                  </div>

                  <div>
                    <Typography variant="subtitle2">Border Radius</Typography>
                    <TextField
                      type="text"
                      value={config.borderRadius}
                      onChange={(e) => handleChange("borderRadius", e.target.value)}
                      fullWidth
                      margin="dense"
                    />
                  </div>

                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.shadow || false}
                          onChange={(e) => handleChange("shadow", e.target.checked)}
                        />
                      }
                      label="Show Shadow"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Typography variant="subtitle2">Width</Typography>
                    <TextField
                      type="text"
                      value={config.width}
                      onChange={(e) => handleChange("width", e.target.value)}
                      fullWidth
                      margin="dense"
                    />
                  </div>

                  <div>
                    <Typography variant="subtitle2">Max Width</Typography>
                    <TextField
                      type="text"
                      value={config.maxWidth}
                      onChange={(e) => handleChange("maxWidth", e.target.value)}
                      fullWidth
                      margin="dense"
                    />
                  </div>

                  <div>
                    <Typography variant="subtitle2">Min Height</Typography>
                    <TextField
                      type="text"
                      value={config.minHeight}
                      onChange={(e) => handleChange("minHeight", e.target.value)}
                      fullWidth
                      margin="dense"
                    />
                  </div>

                  <div>
                    <Typography variant="subtitle2">Max Height</Typography>
                    <TextField
                      type="text"
                      value={config.maxHeight}
                      onChange={(e) => handleChange("maxHeight", e.target.value)}
                      fullWidth
                      margin="dense"
                    />
                  </div>
                </div>
              </div>
            )}

            {tabValue === "behavior" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <FormControl fullWidth margin="dense">
                      <InputLabel>Position</InputLabel>
                      <Select
                        value={config.position}
                        onChange={(e) => handleChange("position", e.target.value)}
                        label="Position"
                      >
                        {Object.values(ModalPosition).map((pos) => (
                          <MenuItem key={pos} value={pos}>
                            {pos}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.closeOnClickOutside || false}
                          onChange={(e) => handleChange("closeOnClickOutside", e.target.checked)}
                        />
                      }
                      label="Close on Click Outside"
                    />
                  </div>

                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.closeOnEsc || false}
                          onChange={(e) => handleChange("closeOnEsc", e.target.checked)}
                        />
                      }
                      label="Close on ESC Key"
                    />
                  </div>

                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.preventClose || false}
                          onChange={(e) => handleChange("preventClose", e.target.checked)}
                        />
                      }
                      label="Prevent Close"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.showCloseButton || false}
                          onChange={(e) => handleChange("showCloseButton", e.target.checked)}
                        />
                      }
                      label="Show Close Button"
                    />
                  </div>

                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.autoClose || false}
                          onChange={(e) => handleChange("autoClose", e.target.checked)}
                        />
                      }
                      label="Auto Close"
                    />
                  </div>

                  {config.autoClose && (
                    <div>
                      <Typography variant="subtitle2">Auto Close Delay (ms)</Typography>
                      <TextField
                        type="number"
                        value={config.autoCloseDelay}
                        onChange={(e) => handleChange("autoCloseDelay", Number.parseInt(e.target.value))}
                        fullWidth
                        margin="dense"
                      />
                    </div>
                  )}

                  <div>
                    <FormControl fullWidth margin="dense">
                      <InputLabel>Trigger</InputLabel>
                      <Select
                        value={config.trigger}
                        onChange={(e) => handleChange("trigger", e.target.value)}
                        label="Trigger"
                      >
                        {Object.values(ModalTrigger).map((trigger) => (
                          <MenuItem key={trigger} value={trigger}>
                            {trigger}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            )}

            {tabValue === "content" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.showHeader || false}
                          onChange={(e) => handleChange("showHeader", e.target.checked)}
                        />
                      }
                      label="Show Header"
                    />
                  </div>

                  {config.showHeader && (
                    <>
                      <div>
                        <Typography variant="subtitle2">Title</Typography>
                        <TextField
                          type="text"
                          value={config.title}
                          onChange={(e) => handleChange("title", e.target.value)}
                          fullWidth
                          margin="dense"
                        />
                      </div>

                      <div>
                        <FormControl fullWidth margin="dense">
                          <InputLabel>Icon</InputLabel>
                          <Select value={previewIcon} onChange={(e) => setPreviewIcon(e.target.value)} label="Icon">
                            <MenuItem value="file">File</MenuItem>
                            <MenuItem value="folder">Folder</MenuItem>
                            <MenuItem value="beaker">Beaker</MenuItem>
                          </Select>
                        </FormControl>
                      </div>

                      <div>
                        <Typography variant="subtitle2">Icon Background</Typography>
                        <TextField
                          type="color"
                          value={config.iconBackground || "#ffffff"}
                          onChange={(e) => handleChange("iconBackground", e.target.value)}
                          fullWidth
                          margin="dense"
                        />
                      </div>

                      <div>
                        <Typography variant="subtitle2">Icon Size</Typography>
                        <Slider
                          min={16}
                          max={48}
                          step={1}
                          value={config.iconSize || 24}
                          onChange={(e, value) => handleChange("iconSize", value)}
                          valueLabelDisplay="auto"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.showFooter || false}
                          onChange={(e) => handleChange("showFooter", e.target.checked)}
                        />
                      }
                      label="Show Footer"
                    />
                  </div>

                  {config.showFooter && (
                    <>
                      <div>
                        <Typography variant="subtitle2">Primary Button Text</Typography>
                        <TextField
                          type="text"
                          value={config.primaryButtonText}
                          onChange={(e) => handleChange("primaryButtonText", e.target.value)}
                          fullWidth
                          margin="dense"
                        />
                      </div>

                      <div>
                        <Typography variant="subtitle2">Secondary Button Text</Typography>
                        <TextField
                          type="text"
                          value={config.secondaryButtonText}
                          onChange={(e) => handleChange("secondaryButtonText", e.target.value)}
                          fullWidth
                          margin="dense"
                        />
                      </div>

                      <div>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={config.showStepIndicator || false}
                              onChange={(e) => handleChange("showStepIndicator", e.target.checked)}
                            />
                          }
                          label="Show Step Indicator"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {tabValue === "animation" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <FormControl fullWidth margin="dense">
                      <InputLabel>Animation Type</InputLabel>
                      <Select
                        value={config.animation}
                        onChange={(e) => handleChange("animation", e.target.value)}
                        label="Animation Type"
                      >
                        {Object.values(ModalAnimation).map((anim) => (
                          <MenuItem key={anim} value={anim}>
                            {anim}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div>
                    <Typography variant="subtitle2">Animation Duration (seconds)</Typography>
                    <Slider
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={config.animationDuration || 0.3}
                      onChange={(e, value) => handleChange("animationDuration", value)}
                      valueLabelDisplay="auto"
                    />
                    <Typography variant="caption" className="text-center block mt-1">
                      {config.animationDuration || 0.3}s
                    </Typography>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.showOverlay || false}
                          onChange={(e) => handleChange("showOverlay", e.target.checked)}
                        />
                      }
                      label="Show Overlay"
                    />
                  </div>

                  {config.showOverlay && (
                    <>
                      <div>
                        <Typography variant="subtitle2">Overlay Color</Typography>
                        <TextField
                          type="color"
                          value={
                            config.overlayColor
                              ?.replace("rgba(", "")
                              .replace(")", "")
                              .split(",")
                              .slice(0, 3)
                              .join(",") || "#000000"
                          }
                          onChange={(e) => {
                            const hex = e.target.value
                            const r = Number.parseInt(hex.slice(1, 3), 16)
                            const g = Number.parseInt(hex.slice(3, 5), 16)
                            const b = Number.parseInt(hex.slice(5, 7), 16)
                            handleChange("overlayColor", `rgba(${r}, ${g}, ${b}, 0.5)`)
                          }}
                          fullWidth
                          margin="dense"
                        />
                      </div>

                      <div>
                        <Typography variant="subtitle2">Overlay Opacity</Typography>
                        <Slider
                          min={0}
                          max={1}
                          step={0.1}
                          value={Number.parseFloat(config.overlayColor?.split(",")[3]?.replace(")", "") || "0.5")}
                          onChange={(e, value) => {
                            const currentColor = config.overlayColor || "rgba(0, 0, 0, 0.5)"
                            const rgbPart = currentColor.substring(0, currentColor.lastIndexOf(","))
                            handleChange("overlayColor", `${rgbPart}, ${value})`)
                          }}
                          valueLabelDisplay="auto"
                        />
                      </div>

                      <div>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={config.blurOverlay || false}
                              onChange={(e) => handleChange("blurOverlay", e.target.checked)}
                            />
                          }
                          label="Blur Overlay"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {tabValue === "targeting" && (
              <div className="space-y-4">
                <div>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Target Client</InputLabel>
                    <Select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      label="Target Client"
                    >
                      {availableClients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {selectedClient && (
                  <div>
                    <FormControl fullWidth margin="dense">
                      <InputLabel>Target Path</InputLabel>
                      <Select
                        value={selectedPath}
                        onChange={(e) => setSelectedPath(e.target.value)}
                        label="Target Path"
                      >
                        {availableClients
                          .find((client) => client.id === selectedClient)
                          ?.paths.map((path) => (
                            <MenuItem key={path} value={path}>
                              {path}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
              </div>
            )}
          </Box>

          <div className="mt-6 flex flex-wrap justify-end gap-4">
            <div className="flex items-center mr-auto">
              <FormControlLabel
                control={<Switch checked={livePreviewMode} onChange={(e) => setLivePreviewMode(e.target.checked)} />}
                label="Live Preview"
              />
            </div>
            <Button variant="outlined" onClick={() => setResponsivePreviewActive(true)} className="mr-2">
              Responsive Preview
            </Button>
            <Button variant="outlined" onClick={togglePreview} className="mr-2">
              {isPreviewActive ? "Close Preview" : "Quick Preview"}
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview components */}
      {isPreviewActive && (
        <ConfigurableModal
          config={{
            ...config,
            client: selectedClient,
            targetPath: selectedPath,
            icon: getIconPreview(),
          }}
          isOpen={true}
          onClose={() => setIsPreviewActive(false)}
        >
          <PreviewContent previewType={previewContentType} onTypeChange={setPreviewContentType} />
        </ConfigurableModal>
      )}

      {livePreviewMode && !isPreviewActive && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-gray-800 p-3 rounded-lg shadow-lg mb-2 text-white text-sm flex items-center justify-between">
            <span>Live Preview Mode</span>
            <IconButton size="small" className="ml-2" onClick={() => setLivePreviewMode(false)}>
              <X className="h-4 w-4 text-white" />
            </IconButton>
          </div>
          <div className="scale-50 origin-bottom-right">
            <ConfigurableModal
              config={{
                ...config,
                client: selectedClient,
                targetPath: selectedPath,
                icon: getIconPreview(),
                width: "500px", // Force a reasonable size for the preview
              }}
              isOpen={true}
              onClose={() => {}}
            >
              <PreviewContent previewType={previewContentType} onTypeChange={setPreviewContentType} />
            </ConfigurableModal>
          </div>
        </div>
      )}

      {responsivePreviewActive && (
        <ResponsivePreview
          config={{
            ...config,
            client: selectedClient,
            targetPath: selectedPath,
            icon: getIconPreview(),
          }}
          onClose={() => setResponsivePreviewActive(false)}
          previewContentType={previewContentType}
          onPreviewContentTypeChange={setPreviewContentType}
        />
      )}
    </>
  )
}

