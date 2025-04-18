"use client"

import { useEffect, useRef, useState } from "react"
import "grapesjs/dist/css/grapes.min.css"
import grapesjs from "grapesjs"
import gjsPresetWebpage from "grapesjs-preset-webpage"
import gjsBlocksBasic from "grapesjs-blocks-basic"
import gjsTailwind from "grapesjs-tailwind"
// import { useDispatch, useSelector } from "react-redux"
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
	DesktopWindows as DesktopIcon,
} from "@mui/icons-material"
// import {
//   publishTemplate,
//   getAvailablePlacements,
//   getInjectableVariables,
//   getTemplateVersions,
// } from "../../store/miniAppSlice"
import VariableSelector from "./enhanced-grapes-js/VariableSelector"
import PlacementSelector from "./enhanced-grapes-js/PlacementSelector"
import VersionSelector from "./enhanced-grapes-js/VersionSelector"

const EnhancedGrapesJSEditor1 = ({ initialContent = "", onSave, templateId = null }) => {
	const editorRef = useRef(null)
	const grapesJsRef = useRef(null)
	const cssEditorRef = useRef(null)
	const jsEditorRef = useRef(null)

	const [tabValue, setTabValue] = useState(0)
	const [cssValue, setCssValue] = useState("")
	const [jsValue, setJsValue] = useState("")
	const [htmlValue, setHtmlValue] = useState("")
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
	const injectableVariables = []
	const availablePlacements = []
	// const dispatch = useDispatch()
	// const { availablePlacements, injectableVariables } = useSelector(
	// (state) => state.miniApp || { availablePlacements: [], injectableVariables: [] },
	// )
	// const { htmlSnippets } = useSelector((state) => state.template || { htmlSnippets: [] })
	const htmlSnippets = []
	// Initialize GrapesJS
	useEffect(() => {
		if (!editorRef.current) return

		// Fetch available placements
		// dispatch(getAvailablePlacements())

		// If we have a templateId, fetch template versions
		// if (templateId) {
		//   dispatch(getTemplateVersions(templateId))
		// }

		// Initialize GrapesJS editor
		const editor = grapesjs.init({
			container: editorRef.current,
			height: "70vh",
			width: "auto",
			storageManager: false,
			panels: { defaults: [] },
			deviceManager: {
				devices: [
					{
						name: "Desktop",
						width: "",
					},
					{
						name: "Tablet",
						width: "768px",
						widthMedia: "992px",
					},
					{
						name: "Mobile",
						width: "320px",
						widthMedia: "480px",
					},
				],
			},
			plugins: [gjsPresetWebpage, gjsBlocksBasic, gjsTailwind],
			pluginsOpts: {
				gjsTailwind: {
					/* Tailwind options */
				},
			},
			canvas: {
				styles: [
					"https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
					"https://cdn.jsdelivr.net/npm/vazirmatn@33.0.3/Vazirmatn-font-face.css",
				],
			},
			styleManager: {
				sectors: [
					{
						name: "Dimension",
						open: false,
						properties: ["width", "height", "min-width", "min-height", "max-width", "max-height", "padding", "margin"],
					},
					{
						name: "Typography",
						open: false,
						properties: [
							"font-family",
							"font-size",
							"font-weight",
							"letter-spacing",
							"color",
							"line-height",
							"text-align",
							"text-decoration",
							"text-shadow",
						],
					},
					{
						name: "Decorations",
						open: false,
						properties: ["background-color", "border", "border-radius", "box-shadow"],
					},
					{
						name: "Extra",
						open: false,
						properties: ["opacity", "transition", "transform"],
					},
				],
			},
		})

		// Add custom RTL button
		editor.Panels.addButton("options", {
			id: "toggle-rtl",
			className: "fa fa-align-right",
			command: "toggle-rtl",
			attributes: { title: "Toggle RTL" },
		})

		// Add RTL command
		editor.Commands.add("toggle-rtl", {
			run(editor) {
				const wrapper = editor.getWrapper()
				const direction = wrapper.getStyle().direction === "rtl" ? "ltr" : "rtl"
				wrapper.setStyle({ direction })
			},
			stop() {},
		})

		// Set RTL by default
		const wrapper = editor.getWrapper()
		wrapper.setStyle({ direction: "rtl" })

		// Add custom blocks
		addCustomBlocks(editor)

		// Load initial content if provided
		if (initialContent) {
			try {
				const parsedContent = JSON.parse(initialContent)

				if (parsedContent.html) {
					editor.setComponents(parsedContent.html)
					setHtmlValue(parsedContent.html)
				}

				// Extract CSS and JS from the template
				if (parsedContent.css) {
					setCssValue(parsedContent.css)
				}

				if (parsedContent.js) {
					setJsValue(parsedContent.js)
				}
			} catch (error) {
				console.error("Error parsing initial content:", error)
			}
		}

		// Store the editor instance
		grapesJsRef.current = editor

		// Update HTML when editor content changes
		editor.on("component:update", () => {
			setHtmlValue(editor.getHtml())
		})

		// Initial HTML value
		setHtmlValue(editor.getHtml())

		// Cleanup
		return () => {
			editor.destroy()
		}
	}, [initialContent, templateId]) // dispatch,

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

		// dispatch(publishTemplate(publishData))
		//   .then((result) => {
		//     if (result.meta.requestStatus === "fulfilled") {
		//       handlePublishDialogClose()
		//     }
		//     setLoading(false)
		//   })
		//   .catch(() => {
		//     setLoading(false)
		//   })
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
		// if (placement) {
		//   dispatch(getInjectableVariables(placement.id))
		// }
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
			if (grapesJsRef.current) {
				const editor = grapesJsRef.current
				const selected = editor.getSelected()

				if (selected) {
					// If a component is selected, insert the variable into its content
					const content = selected.get("content") || ""
					selected.set("content", content + `{{${variable.name}}}`)
				} else {
					// If no component is selected, add a new text component with the variable
					editor.addComponents(`<div>{{${variable.name}}}</div>`)
				}
			}
		} else if (tabValue === 1) {
			// Insert into CSS editor
			if (cssEditorRef.current) {
				const currentValue = cssValue
				const cursorPosition = cssEditorRef.current.selectionStart

				const newValue =
					currentValue.substring(0, cursorPosition) + `var(--${variable.name})` + currentValue.substring(cursorPosition)

				setCssValue(newValue)
			}
		} else if (tabValue === 2) {
			// Insert into JS editor
			if (jsEditorRef.current) {
				const currentValue = jsValue
				const cursorPosition = jsEditorRef.current.selectionStart

				const newValue =
					currentValue.substring(0, cursorPosition) +
					`window.context.${variable.name}` +
					currentValue.substring(cursorPosition)

				setJsValue(newValue)
			}
		}
	}

	const addHtmlSnippet = (code) => {
		if (grapesJsRef.current) {
			const editor = grapesJsRef.current
			editor.addComponents(code)
		}
	}

	// Add custom blocks to the editor
	const addCustomBlocks = (editor) => {
		// Basic Sections
		editor.BlockManager.add("section-header", {
			label: "سربرگ",
			category: "بخش‌ها",
			content: `
      <section class="bg-white py-8">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold mb-4">عنوان بخش</h2>
          <p class="text-gray-600">توضیحات بخش در اینجا قرار می‌گیرد.</p>
        </div>
      </section>
    `,
			attributes: { class: "fa fa-header" },
		})

		editor.BlockManager.add("section-form", {
			label: "فرم",
			category: "بخش‌ها",
			content: `
      <section class="bg-gray-100 py-8">
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
      </section>
    `,
			attributes: { class: "fa fa-wpforms" },
		})

		editor.BlockManager.add("section-cards", {
			label: "کارت‌ها",
			category: "بخش‌ها",
			content: `
      <section class="bg-white py-8">
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
      </section>
    `,
			attributes: { class: "fa fa-th-large" },
		})

		// Advanced Components
		editor.BlockManager.add("carousel", {
			label: "اسلایدر",
			category: "پیشرفته",
			content: `
      <div class="relative w-full" data-gjs-type="carousel" data-interval="3000">
        <div class="overflow-hidden relative h-64 rounded">
          <div class="whitespace-nowrap transition-transform duration-500 ease-in-out transform translate-x-0" data-gjs-type="carousel-slides">
            <div class="inline-block w-full h-64 bg-gray-200 text-center p-8">
              <h3 class="text-2xl font-bold">اسلاید ۱</h3>
              <p class="mt-4">توضیحات اسلاید اول</p>
            </div>
            <div class="inline-block w-full h-64 bg-gray-300 text-center p-8">
              <h3 class="text-2xl font-bold">اسلاید ۲</h3>
              <p class="mt-4">توضیحات اسلاید دوم</p>
            </div>
            <div class="inline-block w-full h-64 bg-gray-400 text-center p-8">
              <h3 class="text-2xl font-bold">اسلاید ۳</h3>
              <p class="mt-4">توضیحات اسلاید سوم</p>
            </div>
          </div>
          <button class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 ml-4 hover:bg-opacity-75" data-gjs-type="carousel-prev">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 mr-4 hover:bg-opacity-75" data-gjs-type="carousel-next">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div class="flex justify-center mt-4" data-gjs-type="carousel-indicators">
          <button class="h-3 w-3 rounded-full bg-gray-500 mx-1 focus:outline-none hover:bg-gray-700 active"></button>
          <button class="h-3 w-3 rounded-full bg-gray-300 mx-1 focus:outline-none hover:bg-gray-700"></button>
          <button class="h-3 w-3 rounded-full bg-gray-300 mx-1 focus:outline-none hover:bg-gray-700"></button>
        </div>
      </div>
      <script>
        // Carousel functionality will be added via JS
        setTimeout(() => {
          const carousel = document.querySelector('[data-gjs-type="carousel"]');
          if (carousel) {
            const slides = carousel.querySelector('[data-gjs-type="carousel-slides"]');
            const prevBtn = carousel.querySelector('[data-gjs-type="carousel-prev"]');
            const nextBtn = carousel.querySelector('[data-gjs-type="carousel-next"]');
            const indicators = carousel.querySelectorAll('[data-gjs-type="carousel-indicators"] button');

            let currentSlide = 0;
            const slideCount = slides.children.length;

            const updateSlides = () => {
              slides.style.transform = \`translateX(\${-100 * currentSlide}%)\`;

              // Update indicators
              indicators.forEach((indicator, index) => {
                if (index === currentSlide) {
                  indicator.classList.add('bg-gray-500');
                  indicator.classList.remove('bg-gray-300');
                } else {
                  indicator.classList.add('bg-gray-300');
                  indicator.classList.remove('bg-gray-500');
                }
              });
            };

            const nextSlide = () => {
              currentSlide = (currentSlide + 1) % slideCount;
              updateSlides();
            };

            const prevSlide = () => {
              currentSlide = (currentSlide - 1 + slideCount) % slideCount;
              updateSlides();
            };

            // Add event listeners
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);

            // Add indicator clicks
            indicators.forEach((indicator, index) => {
              indicator.addEventListener('click', () => {
                currentSlide = index;
                updateSlides();
              });
            });

            // Auto-play
            const interval = carousel.getAttribute('data-interval');
            if (interval) {
              setInterval(nextSlide, parseInt(interval));
            }
          }
        }, 1000);
      </script>
    `,
			attributes: { class: "fa fa-sliders" },
		})

		editor.BlockManager.add("tabs", {
			label: "تب‌ها",
			category: "پیشرفته",
			content: `
      <div class="w-full" data-gjs-type="tabs">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px" data-gjs-type="tabs-nav">
            <button class="py-2 px-4 border-b-2 border-blue-500 text-blue-600 font-medium" data-tab="tab1">تب اول</button>
            <button class="py-2 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium" data-tab="tab2">تب دوم</button>
            <button class="py-2 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium" data-tab="tab3">تب سوم</button>
          </nav>
        </div>
        <div class="py-4" data-gjs-type="tabs-content">
          <div class="block" data-tab-content="tab1">
            <h3 class="text-lg font-medium mb-2">محتوای تب اول</h3>
            <p>این محتوای تب اول است. شما می‌توانید هر نوع محتوایی را در اینجا قرار دهید.</p>
          </div>
          <div class="hidden" data-tab-content="tab2">
            <h3 class="text-lg font-medium mb-2">محتوای تب دوم</h3>
            <p>این محتوای تب دوم است. شما می‌توانید هر نوع محتوایی را در اینجا قرار دهید.</p>
          </div>
          <div class="hidden" data-tab-content="tab3">
            <h3 class="text-lg font-medium mb-2">محتوای تب سوم</h3>
            <p>این محتوای تب سوم است. شما می‌توانید هر نوع محتوایی را در اینجا قرار دهید.</p>
          </div>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const tabs = document.querySelector('[data-gjs-type="tabs"]');
          if (tabs) {
            const tabButtons = tabs.querySelectorAll('[data-gjs-type="tabs-nav"] button');
            const tabContents = tabs.querySelectorAll('[data-gjs-type="tabs-content"] [data-tab-content]');

            tabButtons.forEach(button => {
              button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');

                // Update active tab button
                tabButtons.forEach(btn => {
                  if (btn.getAttribute('data-tab') === tabId) {
                    btn.classList.add('border-blue-500', 'text-blue-600');
                    btn.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                  } else {
                    btn.classList.remove('border-blue-500', 'text-blue-600');
                    btn.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                  }
                });

                // Show active tab content
                tabContents.forEach(content => {
                  if (content.getAttribute('data-tab-content') === tabId) {
                    content.classList.remove('hidden');
                    content.classList.add('block');
                  } else {
                    content.classList.add('hidden');
                    content.classList.remove('block');
                  }
                });
              });
            });
          }
        }, 1000);
      </script>
    `,
			attributes: { class: "fa fa-folder" },
		})

		// Food Bank Templates
		editor.BlockManager.add("food-bank-header", {
			label: "هدر بانک غذا",
			category: "قالب‌های بانک غذا",
			content: `
      <header class="bg-white shadow-md py-4">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <img src="/placeholder.svg?height=40&width=40" alt="لوگو" class="h-10 w-10 mr-3">
              <h1 class="text-xl font-bold text-gray-800">بانک غذا</h1>
            </div>
            <nav>
              <ul class="flex space-x-6 space-x-reverse">
                <li><a href="#" class="text-gray-600 hover:text-blue-500">صفحه اصلی</a></li>
                <li><a href="#" class="text-gray-600 hover:text-blue-500">محصولات</a></li>
                <li><a href="#" class="text-gray-600 hover:text-blue-500">درباره ما</a></li>
                <li><a href="#" class="text-gray-600 hover:text-blue-500">تماس با ما</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    `,
			attributes: { class: "fa fa-header" },
		})

		editor.BlockManager.add("food-bank-hero", {
			label: "بنر اصلی بانک غذا",
			category: "قالب‌های بانک غذا",
			content: `
      <section class="relative bg-blue-600 text-white py-16">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row items-center">
            <div class="md:w-1/2 mb-8 md:mb-0">
              <h2 class="text-4xl font-bold mb-4">بانک غذای سالم و ارگانیک</h2>
              <p class="text-xl mb-6">محصولات ارگانیک و سالم را با بهترین کیفیت از ما بخواهید</p>
              <div class="flex space-x-4 space-x-reverse">
                <button class="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium">مشاهده محصولات</button>
                <button class="border border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium">درباره ما</button>
              </div>
            </div>
            <div class="md:w-1/2">
              <img src="/placeholder.svg?height=300&width=500" alt="تصویر بنر" class="rounded-lg shadow-lg">
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-16 bg-white" style="clip-path: polygon(0 100%, 100% 100%, 100% 0);"></div>
      </section>
    `,
			attributes: { class: "fa fa-star" },
		})

		editor.BlockManager.add("food-bank-products", {
			label: "محصولات بانک غذا",
			category: "قالب‌های بانک غذا",
			content: `
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">محصولات ویژه</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <img src="/placeholder.svg?height=200&width=300" alt="محصول ۱" class="w-full h-48 object-cover">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">محصول ارگانیک ۱</h3>
                <p class="text-gray-600 mb-4">توضیحات کوتاه محصول در اینجا قرار می‌گیرد.</p>
                <div class="flex justify-between items-center">
                  <span class="text-blue-600 font-bold">۱۲۰,۰۰۰ تومان</span>
                  <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">افزودن به سبد</button>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <img src="/placeholder.svg?height=200&width=300" alt="محصول ۲" class="w-full h-48 object-cover">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">محصول ارگانیک ۲</h3>
                <p class="text-gray-600 mb-4">توضیحات کوتاه محصول در اینجا قرار می‌گیرد.</p>
                <div class="flex justify-between items-center">
                  <span class="text-blue-600 font-bold">۱۵۰,۰۰۰ تومان</span>
                  <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">افزودن به سبد</button>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <img src="/placeholder.svg?height=200&width=300" alt="محصول ۳" class="w-full h-48 object-cover">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">محصول ارگانیک ۳</h3>
                <p class="text-gray-600 mb-4">توضیحات کوتاه محصول در اینجا قرار می‌گیرد.</p>
                <div class="flex justify-between items-center">
                  <span class="text-blue-600 font-bold">۹۰,۰۰۰ تومان</span>
                  <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">افزودن به سبد</button>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <img src="/placeholder.svg?height=200&width=300" alt="محصول ۴" class="w-full h-48 object-cover">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">محصول ارگانیک ۴</h3>
                <p class="text-gray-600 mb-4">توضیحات کوتاه محصول در اینجا قرار می‌گیرد.</p>
                <div class="flex justify-between items-center">
                  <span class="text-blue-600 font-bold">۱۸۰,۰۰۰ تومان</span>
                  <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">افزودن به سبد</button>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-10">
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">مشاهده همه محصولات</button>
          </div>
        </div>
      </section>
    `,
			attributes: { class: "fa fa-shopping-cart" },
		})

		editor.BlockManager.add("food-bank-features", {
			label: "ویژگی‌های بانک غذا",
			category: "قالب‌های بانک غذا",
			content: `
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">چرا ما را انتخاب کنید؟</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div class="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">محصولات ارگانیک</h3>
              <p class="text-gray-600">تمامی محصولات ما به صورت ارگانیک و بدون استفاده از مواد شیمیایی تولید می‌شوند.</p>
            </div>
            <div class="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div class="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">تحویل سریع</h3>
              <p class="text-gray-600">محصولات شما در کوتاه‌ترین زمان ممکن به دست شما می‌رسند تا از تازگی آن‌ها مطمئن شوید.</p>
            </div>
            <div class="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div class="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">پرداخت امن</h3>
              <p class="text-gray-600">پرداخت‌های شما با استفاده از درگاه‌های امن و معتبر انجام می‌شود تا خیالتان راحت باشد.</p>
            </div>
          </div>
        </div>
      </section>
    `,
			attributes: { class: "fa fa-check-circle" },
		})

		editor.BlockManager.add("food-bank-testimonials", {
			label: "نظرات مشتریان بانک غذا",
			category: "قالب‌های بانک غذا",
			content: `
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">نظرات مشتریان ما</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="flex items-center mb-4">
                <img src="/placeholder.svg?height=50&width=50" alt="تصویر کاربر" class="w-12 h-12 rounded-full mr-4">
                <div>
                  <h4 class="font-semibold">علی محمدی</h4>
                  <div class="flex text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <p class="text-gray-600">محصولات بسیار با کیفیت و تازه هستند. من همیشه از این فروشگاه خرید می‌کنم و تا به حال ناامید نشده‌ام.</p>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center mb-4">
                  <img src="/placeholder.svg?height=50&width=50" alt="تصویر کاربر" class="w-12 h-12 rounded-full mr-4">
                  <div>
                    <h4 class="font-semibold">مریم حسینی</h4>
                    <div class="flex text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p class="text-gray-600">سرعت ارسال عالی است و بسته‌بندی محصولات بسیار خوب انجام می‌شود. قیمت‌ها هم منصفانه است.</p>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center mb-4">
                  <img src="/placeholder.svg?height=50&width=50" alt="تصویر کاربر" class="w-12 h-12 rounded-full mr-4">
                  <div>
                    <h4 class="font-semibold">رضا کریمی</h4>
                    <div class="flex text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p class="text-gray-600">کیفیت محصولات عالی است و طعم واقعی میوه‌ها و سبزیجات را می‌توان حس کرد. پشتیبانی هم بسیار خوب است.</p>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center mb-4">
                  <img src="/placeholder.svg?height=50&width=50" alt="تصویر کاربر" class="w-12 h-12 rounded-full mr-4">
                  <div>
                    <h4 class="font-semibold">رضا کریمی</h4>
                    <div class="flex text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p class="text-gray-600">کیفیت محصولات عالی است و طعم واقعی میوه‌ها و سبزیجات را می‌توان حس کرد. پشتیبانی هم بسیار خوب است.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
			attributes: { class: "fa fa-comments" },
		})

		editor.BlockManager.add("food-bank-contact", {
			label: "تماس با ما بانک غذا",
			category: "قالب‌های بانک غذا",
			content: `
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">تماس با ما</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-semibold mb-4">اطلاعات تماس</h3>
              <div class="space-y-4">
                <div class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mt-1 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h4 class="font-medium text-gray-800">آدرس:</h4>
                    <p class="text-gray-600">تهران، خیابان ولیعصر، کوچه بهار، پلاک ۱۲</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mt-1 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <h4 class="font-medium text-gray-800">تلفن:</h4>
                    <p class="text-gray-600">۰۲۱-۱۲۳۴۵۶۷۸</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mt-1 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h4 class="font-medium text-gray-800">ایمیل:</h4>
                    <p class="text-gray-600">info@foodbank.com</p>
                  </div>
                </div>
              </div>
              <div class="mt-8">
                <h3 class="text-xl font-semibold mb-4">ساعات کاری</h3>
                <ul class="space-y-2 text-gray-600">
                  <li>شنبه تا چهارشنبه: ۹ صبح تا ۶ عصر</li>
                  <li>پنج‌شنبه: ۹ صبح تا ۱ بعد از ظهر</li>
                  <li>جمعه: تعطیل</li>
                </ul>
              </div>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-4">فرم تماس</h3>
              <form class="space-y-4">
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                    نام و نام خانوادگی
                  </label>
                  <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="نام و نام خانوادگی خود را وارد کنید">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                    ایمیل
                  </label>
                  <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="ایمیل خود را وارد کنید">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="subject">
                    موضوع
                  </label>
                  <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="subject" type="text" placeholder="موضوع پیام خود را وارد کنید">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="message">
                    پیام
                  </label>
                  <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32" id="message" placeholder="پیام خود را وارد کنید"></textarea>
                </div>
                <div>
                  <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
                    ارسال پیام
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    `,
			attributes: { class: "fa fa-envelope" },
		})

		editor.BlockManager.add("food-bank-footer", {
			label: "فوتر بانک غذا",
			category: "قالب‌های بانک غذا",
			content: `
      <footer class="bg-gray-800 text-white py-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 class="text-xl font-bold mb-4">بانک غذا</h3>
              <p class="text-gray-400 mb-4">ارائه دهنده محصولات ارگانیک و سالم با بهترین کیفیت و قیمت مناسب.</p>
              <div class="flex space-x-4 space-x-reverse">
                <a href="#" class="text-gray-400 hover:text-white">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-white">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-white">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4">دسترسی سریع</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white">صفحه اصلی</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">محصولات</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">درباره ما</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">تماس با ما</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">وبلاگ</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4">دسته‌بندی محصولات</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white">میوه‌های تازه</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">سبزیجات</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">لبنیات</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">خشکبار</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">محصولات پروتئینی</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4">خبرنامه</h3>
              <p class="text-gray-400 mb-4">برای اطلاع از آخرین محصولات و تخفیف‌ها در خبرنامه ما عضو شوید.</p>
              <form class="flex">
                <input type="email" placeholder="ایمیل خود را وارد کنید" class="px-4 py-2 w-full rounded-r-none rounded-l-lg focus:outline-none text-gray-900">
                <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-l-none rounded-r-lg">عضویت</button>
              </form>
            </div>
          </div>
          <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; ۱۴۰۲ بانک غذا. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    `,
			attributes: { class: "fa fa-copyright" },
		})

		// Full Page Templates
		editor.BlockManager.add("food-bank-full-page", {
			label: "صفحه کامل بانک غذا",
			category: "صفحات کامل",
			content: `
      <div class="food-bank-page">
        <!-- Header -->
        <header class="bg-white shadow-md py-4">
          <div class="container mx-auto px-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <img src="/placeholder.svg?height=40&width=40" alt="لوگو" class="h-10 w-10 mr-3">
                <h1 class="text-xl font-bold text-gray-800">بانک غذا</h1>
              </div>
              <nav>
                <ul class="flex space-x-6 space-x-reverse">
                  <li><a href="#" class="text-gray-600 hover:text-blue-500">صفحه اصلی</a></li>
                  <li><a href="#" class="text-gray-600 hover:text-blue-500">محصولات</a></li>
                  <li><a href="#" class="text-gray-600 hover:text-blue-500">درباره ما</a></li>
                  <li><a href="#" class="text-gray-600 hover:text-blue-500">تماس با ما</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <!-- Hero Section -->
        <section class="relative bg-blue-600 text-white py-16">
          <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center">
              <div class="md:w-1/2 mb-8 md:mb-0">
                <h2 class="text-4xl font-bold mb-4">بانک غذای سالم و ارگانیک</h2>
                <p class="text-xl mb-6">محصولات ارگانیک و سالم را با بهترین کیفیت از ما بخواهید</p>
                <div class="flex space-x-4 space-x-reverse">
                  <button class="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium">مشاهده محصولات</button>
                  <button class="border border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium">درباره ما</button>
                </div>
              </div>
              <div class="md:w-1/2">
                <img src="/placeholder.svg?height=300&width=500" alt="تصویر بنر" class="rounded-lg shadow-lg">
              </div>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 h-16 bg-white" style="clip-path: polygon(0 100%, 100% 100%, 100% 0);"></div>
        </section>

        <!-- Features Section -->
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">چرا ما را انتخاب کنید؟</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div class="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">محصولات ارگانیک</h3>
                <p class="text-gray-600">تمامی محصولات ما به صورت ارگانیک و بدون استفاده از مواد شیمیایی تولید می‌شوند.</p>
              </div>
              <div class="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div class="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">تحویل سریع</h3>
                <p class="text-gray-600">محصولات شما در کوتاه‌ترین زمان ممکن به دست شما می‌رسند تا از تازگی آن‌ها مطمئن شوید.</p>
              </div>
              <div class="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div class="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">پرداخت امن</h3>
                <p class="text-gray-600">پرداخت‌های شما با استفاده از درگاه‌های امن و معتبر انجام می‌شود تا خیالتان راحت باشد.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Products Section -->
        <section class="py-16 bg-gray-50">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">محصولات ویژه</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <img src="/placeholder.svg?height=200&width=300" alt="محصول ۱" class="w-full h-48 object-cover">
                <div class="p-4">
                  <h3 class="text-lg font-semibold mb-2">محصول ارگانیک ۱</h3>
                  <p class="text-gray-600 mb-4">توضیحات کوتاه محصول در اینجا قرار می‌گیرد.</p>
                  <div class="flex justify-between items-center">
                    <span class="text-blue-600 font-bold">۱۲۰,۰۰۰ تومان</span>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">افزودن به سبد</button>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <img src="/placeholder.svg?height=200&width=300" alt="محصول ۲" class="w-full h-48 object-cover">
                <div class="p-4">
                  <h3 class="text-lg font-semibold mb-2">محصول ارگانیک ۲</h3>
                  <p class="text-gray-600 mb-4">توضیحات کوتاه محصول در اینجا قرار می‌گیرد.</p>
                  <div class="flex justify-between items-center">
                    <span class="text-blue-600 font-bold">۱۵۰,۰۰۰ تومان</span>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">افزودن به سبد</button>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <img src="/placeholder.svg?height=200&width=300" alt="محصول ۳" class="w-full h-48 object-cover">
                <div class="p-4">
                  <h3 class="text-lg font-semibold mb-2">محصول ارگانیک ۳</h3>
                  <p class="text-gray-600 mb-4">توضیحات کوتاه محصول در اینجا قرار می‌گیرد.</p>
                  <div class="flex justify-between items-center">
                    <span class="text-blue-600 font-bold">۹۰,۰۰۰ تومان</span>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">افزودن به سبد</button>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <img src="/placeholder.svg?height=200&width=300" alt="محصول ۴" class="w-full h-48 object-cover">
                <div class="p-4">
                  <h3 class="text-lg font-semibold mb-2">محصول ارگانیک ۴</h3>
                  <p class="text-gray-600 mb-4">توضیحات کوتاه محصول در اینجا قرار می‌گیرد.</p>
                  <div class="flex justify-between items-center">
                    <span class="text-blue-600 font-bold">۱۸۰,۰۰۰ تومان</span>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">افزودن به سبد</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-10">
              <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">مشاهده همه محصولات</button>
            </div>
          </div>
        </section>

        <!-- Testimonials Section -->
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">نظرات مشتریان ما</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="bg-gray-50 p-6 rounded-lg shadow-md">
                <div class="flex items-center mb-4">
                  <img src="/placeholder.svg?height=50&width=50" alt="تصویر کاربر" class="w-12 h-12 rounded-full mr-4">
                  <div>
                    <h4 class="font-semibold">علی محمدی</h4>
                    <div class="flex text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <p class="text-gray-600">محصولات بسیار با کیفیت و تازه هستند. من همیشه از این فروشگاه خرید می‌کنم و تا به حال ناامید نشده‌ام.</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                  <div class="flex items-center mb-4">
                    <img src="/placeholder.svg?height=50&width=50" alt="تصویر کاربر" class="w-12 h-12 rounded-full mr-4">
                    <div>
                      <h4 class="font-semibold">مریم حسینی</h4>
                      <div class="flex text-yellow-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p class="text-gray-600">سرعت ارسال عالی است و بسته‌بندی محصولات بسیار خوب انجام می‌شود. قیمت‌ها هم منصفانه است.</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                  <div class="flex items-center mb-4">
                    <img src="/placeholder.svg?height=50&width=50" alt="تصویر کاربر" class="w-12 h-12 rounded-full mr-4">
                    <div>
                      <h4 class="font-semibold">رضا کریمی</h4>
                      <div class="flex text-yellow-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p class="text-gray-600">کیفیت محصولات عالی است و طعم واقعی میوه‌ها و سبزیجات را می‌توان حس کرد. پشتیبانی هم بسیار خوب است.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact Section -->
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">تماس با ما</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-xl font-semibold mb-4">اطلاعات تماس</h3>
                <div class="space-y-4">
                  <div class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mt-1 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h4 class="font-medium text-gray-800">آدرس:</h4>
                      <p class="text-gray-600">تهران، خیابان ولیعصر، کوچه بهار، پلاک ۱۲</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mt-1 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <h4 class="font-medium text-gray-800">تلفن:</h4>
                      <p class="text-gray-600">۰۲۱-۱۲۳۴۵۶۷۸</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mt-1 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h4 class="font-medium text-gray-800">ایمیل:</h4>
                      <p class="text-gray-600">info@foodbank.com</p>
                    </div>
                  </div>
                </div>
                <div class="mt-8">
                  <h3 class="text-xl font-semibold mb-4">ساعات کاری</h3>
                  <ul class="space-y-2 text-gray-600">
                    <li>شنبه تا چهارشنبه: ۹ صبح تا ۶ عصر</li>
                    <li>پنج‌شنبه: ۹ صبح تا ۱ بعد از ظهر</li>
                    <li>جمعه: تعطیل</li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-4">فرم تماس</h3>
                <form class="space-y-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                      نام و نام خانوادگی
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="نام و نام خانوادگی خود را وارد کنید">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                      ایمیل
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="ایمیل خود را وارد کنید">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="subject">
                      موضوع
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="subject" type="text" placeholder="موضوع پیام خود را وارد کنید">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="message">
                      پیام
                    </label>
                    <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32" id="message" placeholder="پیام خود را وارد کنید"></textarea>
                  </div>
                  <div>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
                      ارسال پیام
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-12">
          <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 class="text-xl font-bold mb-4">بانک غذا</h3>
                <p class="text-gray-400 mb-4">ارائه دهنده محصولات ارگانیک و سالم با بهترین کیفیت و قیمت مناسب.</p>
                <div class="flex space-x-4 space-x-reverse">
                  <a href="#" class="text-gray-400 hover:text-white">
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-white">
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-white">
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-4">دسترسی سریع</h3>
                <ul class="space-y-2">
                  <li><a href="#" class="text-gray-400 hover:text-white">صفحه اصلی</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white">محصولات</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white">درباره ما</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white">تماس با ما</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white">وبلاگ</a></li>
                </ul>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-4">دسته‌بندی محصولات</h3>
                <ul class="space-y-2">
                  <li><a href="#" class="text-gray-400 hover:text-white">میوه‌های تازه</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white">سبزیجات</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white">لبنیات</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white">خشکبار</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white">محصولات پروتئینی</a></li>
                </ul>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-4">خبرنامه</h3>
                <p class="text-gray-400 mb-4">برای اطلاع از آخرین محصولات و تخفیف‌ها در خبرنامه ما عضو شوید.</p>
                <form class="flex">
                  <input type="email" placeholder="ایمیل خود را وارد کنید" class="px-4 py-2 w-full rounded-r-none rounded-l-lg focus:outline-none text-gray-900">
                  <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-l-none rounded-r-lg">عضویت</button>
                </form>
              </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; ۱۴۰۲ بانک غذا. تمامی حقوق محفوظ است.</p>
            </div>
          </div>
        </footer>
      </div>
    `,
			attributes: { class: "fa fa-copyright" },
		})
	}

	return (
		<Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
				<Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="editor tabs">
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
								{htmlSnippets &&
									htmlSnippets.map((snippet, index) => (
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
					{/* HTML Editor (GrapesJS) */}
					<Box sx={{ display: tabValue === 0 ? "block" : "none", height: "100%" }}>
						<div ref={editorRef} style={{ height: "100%" }}></div>
					</Box>

					{/* CSS Editor */}
					<Box sx={{ display: tabValue === 1 ? "block" : "none", height: "100%" }}>
            <textarea
				ref={cssEditorRef}
				value={cssValue}
				onChange={(e) => setCssValue(e.target.value)}
				style={{
					width: "100%",
					height: "100%",
					padding: "10px",
					fontFamily: "monospace",
					fontSize: "14px",
					border: "none",
					resize: "none",
					backgroundColor: "#1e1e1e",
					color: "#d4d4d4",
				}}
			/>
					</Box>

					{/* JS Editor */}
					<Box sx={{ display: tabValue === 2 ? "block" : "none", height: "100%" }}>
            <textarea
				ref={jsEditorRef}
				value={jsValue}
				onChange={(e) => setJsValue(e.target.value)}
				style={{
					width: "100%",
					height: "100%",
					padding: "10px",
					fontFamily: "monospace",
					fontSize: "14px",
					border: "none",
					resize: "none",
					backgroundColor: "#1e1e1e",
					color: "#d4d4d4",
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

							<VersionSelector
								value={templateVersion}
								onChange={setTemplateVersion}
								// versions={useSelector((state) => state.miniApp.templateVersions)}
							/>

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

export default EnhancedGrapesJSEditor1
