'use client'

import React, { useState, useEffect, useRef } from 'react'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { foldGutter } from '@codemirror/language'
import { indentUnit } from '@codemirror/language'
import { EditorView } from '@codemirror/view'
import { foldable, foldEffect } from '@codemirror/language'
import { ChevronDown, Play, Pause, Maximize2, Minimize2, Code, Palette, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { html as formatHTML, css as formatCSS, js as formatJS } from 'js-beautify'

export default function Editor() {
  const [htmlCode, setHtmlCode] = useState('<h1>Hello, Devs!</h1>')
  const [cssCode, setCssCode] = useState('body { font-family: sans-serif; }')
  const [jsCode, setJsCode] = useState('console.log("Hello from JS!");')
  const [isRunning, setIsRunning] = useState(true)
  const [activeEditor, setActiveEditor] = useState('html')
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false)
  const [editorWidth, setEditorWidth] = useState('50%')
  const [previewWidth, setPreviewWidth] = useState('50%')
  const [isMobile, setIsMobile] = useState(false)
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      if (isMobileView) {
        setEditorWidth('100%')
        setPreviewWidth('100%')
      } else {
        setEditorWidth('50%')
        setPreviewWidth('50%')
      }
      adjustEditorHeight()
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const adjustEditorHeight = () => {
    if (mainContainerRef.current) {
      const viewportHeight = window.innerHeight
      const containerTop = mainContainerRef.current.getBoundingClientRect().top
      const newHeight = viewportHeight - containerTop
      mainContainerRef.current.style.height = `${newHeight}px`
      mainContainerRef.current.style.maxHeight = `${newHeight}px`
    }
  }

  useEffect(() => {
    adjustEditorHeight()
    window.addEventListener('resize', adjustEditorHeight)

    return () => {
      window.removeEventListener('resize', adjustEditorHeight)
    }
  }, [])

  const updatePreview = () => {
    const preview = document.getElementById('preview') as HTMLIFrameElement
    if (preview) {
      const previewContent = `
        <html>
          <head>
            <style>${cssCode}</style>
          </head>
          <body>
            ${htmlCode}
            <script>${jsCode}</script>
          </body>
        </html>
      `
      preview.srcdoc = previewContent
    }
  }

  useEffect(() => {
    if (isRunning) {
      updatePreview()
    }
  }, [htmlCode, cssCode, jsCode, isRunning])

  const togglePreview = () => {
    setIsRunning(!isRunning)
  }

  const formatCode = () => {
    let formattedCode = ''
    let code = ''

    switch (activeEditor) {
      case 'html':
        code = htmlCode.trim()
        formattedCode = formatHTML(code, { indent_size: 2, wrap_line_length: 80 })
        setHtmlCode(formattedCode)
        break
      case 'css':
        code = cssCode.trim()
        formattedCode = formatCSS(code, { indent_size: 2 })
        setCssCode(formattedCode)
        break
      case 'js':
        code = jsCode.trim()
        formattedCode = formatJS(code, { indent_size: 2, space_in_empty_paren: true })
        setJsCode(formattedCode)
        break
    }
  }

  const analyzeCode = () => {
    let code = ''
    switch (activeEditor) {
      case 'html':
        code = htmlCode
        break
      case 'css':
        code = cssCode
        break
      case 'js':
        code = jsCode
        break
    }

    const lines = code.split('\n').length
    const characters = code.length

    console.log(`Analysis for ${activeEditor.toUpperCase()}:`)
    console.log(`- Lines: ${lines}`)
    console.log(`- Characters: ${characters}`)
  }

  const maximizeEditor = () => {
    setEditorWidth('100%')
    setPreviewWidth('0%')
  }

  const minimizeEditor = () => {
    setEditorWidth('50%')
    setPreviewWidth('50%')
  }

  const togglePreviewMaximize = () => {
    setIsPreviewMaximized(!isPreviewMaximized)
    if (!isPreviewMaximized) {
      setEditorWidth('0%')
      setPreviewWidth('100%')
    } else {
      setEditorWidth('50%')
      setPreviewWidth('50%')
    }
  }

  const getEditorExtensions = () => {
    return [
      foldGutter(),
      indentUnit.of('    '),
      EditorView.lineWrapping,
    ]
  }

  const foldAllCode = () => {
    if (editorRef.current) {
      const { state } = editorRef.current
      const foldable = state.foldable
      if (foldable) {
        editorRef.current.dispatch({
          effects: foldable.map(range => foldEffect.of(true))
        })
      }
    }
  }

  const unfoldAllCode = () => {
    if (editorRef.current) {
      editorRef.current.dispatch({
        effects: foldEffect.of(false)
      })
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <main ref={mainContainerRef} className={`flex ${isMobile ? 'flex-col' : 'flex-row'} flex-1 overflow-hidden`} style={{ maxHeight: '100vh' }}>
        <div 
          ref={editorRef} 
          className={`flex flex-col ${isMobile ? 'h-1/2' : 'h-full'} overflow-hidden`} 
          style={{ width: editorWidth, maxHeight: '100%' }}
        >
          <Tabs defaultValue="html" className="flex flex-col h-full" onValueChange={(value) => setActiveEditor(value as 'html' | 'css' | 'js')}>
            <div className="flex justify-between items-center bg-muted px-2 py-1">
              <TabsList>
                <TabsTrigger value="html" className="flex items-center">
                  <Code className="mr-2 text-red-500" /> HTML
                </TabsTrigger>
                <TabsTrigger value="css" className="flex items-center">
                  <Palette className="mr-2 text-blue-500" /> CSS
                </TabsTrigger>
                <TabsTrigger value="js" className="flex items-center">
                  <Code2 className="mr-2 text-yellow-500" /> JS
                </TabsTrigger>
              </TabsList>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={formatCode}>Format {activeEditor.toUpperCase()}</DropdownMenuItem>
                  <DropdownMenuItem onSelect={analyzeCode}>Analyze {activeEditor.toUpperCase()}</DropdownMenuItem>
                  <DropdownMenuItem onSelect={foldAllCode}>Fold All</DropdownMenuItem>
                  <DropdownMenuItem onSelect={unfoldAllCode}>Unfold All</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-1 overflow-hidden">
              <TabsContent value="html" className="h-full">
                <CodeMirror
                  value={htmlCode}
                  height="100%"
                  extensions={[html(), ...getEditorExtensions()]}
                  onChange={(value) => setHtmlCode(value)}
                  theme="dark"
                  className="h-full overflow-auto"
                />
              </TabsContent>
              <TabsContent value="css" className="h-full">
                <CodeMirror
                  value={cssCode}
                  height="100%"
                  extensions={[css(), ...getEditorExtensions()]}
                  onChange={(value) => setCssCode(value)}
                  theme="dark"
                  className="h-full overflow-auto"
                />
              </TabsContent>
              <TabsContent value="js" className="h-full">
                <CodeMirror
                  value={jsCode}
                  height="100%"
                  extensions={[javascript(), ...getEditorExtensions()]}
                  onChange={(value) => setJsCode(value)}
                  theme="dark"
                  className="h-full overflow-auto"
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div 
          ref={previewRef} 
          className={`flex flex-col ${isMobile ? 'h-1/2' : 'h-full'} overflow-hidden`}
          style={{ width: previewWidth, maxHeight: '100%' }}
        >
          <div className="flex items-center justify-between p-2 bg-muted">
            <h2 className="text-sm font-semibold">Preview</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={togglePreview}>
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={togglePreviewMaximize}>
                {isPreviewMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <iframe
              id="preview"
              className="w-full h-full"
              title="Preview"
              sandbox="allow-scripts"
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  )
}