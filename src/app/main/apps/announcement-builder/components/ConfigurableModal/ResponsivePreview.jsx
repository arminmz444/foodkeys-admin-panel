"use client"

import { useState } from "react"
import { Tabs, Tab, Button, IconButton } from "@mui/material"
import { X, Smartphone, Tablet, Monitor } from "lucide-react"
import { ConfigurableModal } from "./ConfigurableModal"
import { PreviewContent } from "./PreviewContent"

export const ResponsivePreview = ({ config, onClose, previewContentType, onPreviewContentTypeChange }) => {
  const [deviceType, setDeviceType] = useState("desktop")

  const handleChange = (event, newValue) => {
    setDeviceType(newValue)
  }

  const getDeviceStyles = () => {
    switch (deviceType) {
      case "mobile":
        return {
          width: "375px",
          height: "667px",
        }
      case "tablet":
        return {
          width: "768px",
          height: "1024px",
        }
      case "desktop":
      default:
        return {
          width: "1280px",
          height: "800px",
        }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-6xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-xl font-medium">Responsive Preview</h3>
          <IconButton onClick={onClose} size="small">
            <X className="h-5 w-5" />
          </IconButton>
        </div>

        <div className="p-4 border-b border-gray-800">
          <Tabs value={deviceType} onChange={handleChange}>
            <Tab
              value="mobile"
              label={
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span>Mobile</span>
                </div>
              }
            />
            <Tab
              value="tablet"
              label={
                <div className="flex items-center gap-2">
                  <Tablet className="h-4 w-4" />
                  <span>Tablet</span>
                </div>
              }
            />
            <Tab
              value="desktop"
              label={
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>Desktop</span>
                </div>
              }
            />
          </Tabs>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-800">
          <div
            className="bg-white rounded overflow-hidden flex items-center justify-center relative"
            style={getDeviceStyles()}
          >
            <div className="absolute inset-0 bg-gray-100">
              {/* Simulated page content */}
              <div className="p-4">
                <div className="h-8 bg-gray-200 rounded mb-4 w-full"></div>
                <div className="flex gap-4 mb-4">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-40 bg-gray-200 rounded mb-4 w-full"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Modal preview */}
              <ConfigurableModal
                config={{
                  ...config,
                  width: deviceType === "mobile" ? "90%" : config.width,
                }}
                isOpen={true}
                onClose={() => {}}
              >
                <PreviewContent previewType={previewContentType} onTypeChange={onPreviewContentTypeChange} />
              </ConfigurableModal>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-end">
          <Button variant="contained" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  )
}

