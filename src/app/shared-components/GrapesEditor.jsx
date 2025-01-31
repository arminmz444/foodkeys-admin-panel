import { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-webpage';
import 'grapesjs-blocks-basic';
import 'grapesjs-plugin-forms';
import 'grapesjs-component-countdown';
import 'grapesjs-plugin-export';
import 'grapesjs-tabs';
import 'grapesjs-custom-code';
import 'grapesjs-touch';
import 'grapesjs-parser-postcss';
import 'grapesjs-tooltip';
import 'grapesjs-tui-image-editor';
import 'grapesjs-typed';
import 'grapesjs-style-bg';

const templates = [
	{ name: 'Landing Page', html: '<button class="bg-black">Landing Page Content</button>' },
	{ name: 'Contact Page', html: '<div>Contact Page Content</div>' }
];

const themes = {
	light: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
	dark: 'https://cdn.jsdelivr.net/npm/dark-theme-css@1.0.0/dark.css',
};

const createPage = (name) => {
	const newPage = { id: `page-${pages.length + 1}`, name, html: '', css: '' };
	pages.push(newPage);
	console.log('Page created:', newPage);
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
		console.log('Page saved:', page);
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
					'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
					'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css'
				]
			},
			fromElement: true,
			height: '100vh',
			width: 'auto',
			assetManager: {
				// upload: '/api/upload-assets', // API endpoint for uploading
				// uploadName: 'file-manager',
				// assets: [
				// 	// Predefined assets
				// 	{ src: 'https://via.placeholder.com/350x150', name: 'Placeholder' },
				// ],
				upload: true,
				uploadName: 'files',
				uploadFile: (e) => {
					const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
					// Upload logic to your backend
				}
			},
			layout: {
				default: {
					type: 'row',
					height: '100%',
					children: [
						{
							type: 'canvasSidebarTop',
							sidebarTop: {
								leftContainer: {
									buttons: ({ items }) => [
										...items,
										{
											id: 'openTemplatesButtonId',
											size: 's',
											icon: '<svg viewBox="0 0 24 24"><path d="M20 14H6C3.8 14 2 15.8 2 18S3.8 22 6 22H20C21.1 22 22 21.1 22 20V16C22 14.9 21.1 14 20 14M6 20C4.9 20 4 19.1 4 18S4.9 16 6 16 8 16.9 8 18 7.1 20 6 20M6.3 12L13 5.3C13.8 4.5 15 4.5 15.8 5.3L18.6 8.1C19.4 8.9 19.4 10.1 18.6 10.9L17.7 12H6.3M2 13.5V4C2 2.9 2.9 2 4 2H8C9.1 2 10 2.9 10 4V5.5L2 13.5Z" /></svg>',
											onClick: ({ editor }) => {
												editor.runCommand('studio:layoutToggle', {
													id: 'my-templates-panel',
													header: false,
													placer: { type: 'dialog', title: 'Choose a template for your project', size: 'l' },
													layout: {
														type: 'panelTemplates',
														content: { itemsPerRow: 3 },
														onSelect: ({ loadTemplate, template }) => {
															// Load the selected template to the current project
															loadTemplate(template);
															// Close the dialog layout
															editor.runCommand('studio:layoutRemove', { id: 'my-templates-panel' })
														}
													}
												});
											}
										}
									]
								}
							},
							grow: true
						},
						{ type: 'sidebarRight' }
					]
				}
			},
			templates: {
				// The onLoad can be an asyncronous function, so you can fetch templates from your API
				onLoad: async () => [
					{
						id: 'template1',
						name: 'Template 1',
						data: {
							pages: [
								{
									name: 'Home',
									component: '<h1 class="title">Template 1</h1><style>.title { color: red; font-size: 10rem; text-align: center }</style>'
								}
							]
						}
					},
					{
						id: 'template2',
						name: 'Template 2',
						data: {
							pages: [
								{ component: '<h1 class="title">Template 2</h1><style>.title { color: blue; font-size: 10rem; text-align: center }</style>' }
							]
						}
					},
					{
						id: 'template3',
						name: 'Template 3',
						data: {
							pages: [
								{ component: '<h1 class="title">Template 3</h1><style>.title { color: green; font-size: 10rem; text-align: center }</style>' }
							]
						}
					},
					{
						id: 'template4',
						name: 'Template 4',
						data: {
							pages: [
								{ component: '<h1 class="title">Template 4</h1><style>.title { color: violet; font-size: 10rem; text-align: center }</style>' }
							]
						}
					},
				]
			},
			storageManager: {
				type: 'local', // Save to localStorage for now; update for backend integration
				autosave: true,
				autoload: true,
				stepsBeforeSave: 1,
				// id: 'project-', // Prefix for different projects
				// urlStore: '/api/save-project', // API to save projects
				// urlLoad: '/api/load-project',
			},
			project: {
				type: 'web',
				default: {
					pages: [
						{ name: 'Home', component: '<h1>Home page</h1>' },
						{ name: 'About', component: '<h1>About page</h1>' },
						{ name: 'Contact', component: '<h1>Contact page</h1>' },
					]
				},
			},
			assets: {
				storageType: 'self',
				onUpload: async ({ files }) => {
					const body = new FormData();
					files.forEach(file => {
						body.append('files', file);
					})
					const response = await fetch('ASSETS_UPLOAD_URL', { method: 'POST', body });
					const result = await response.json();
					// The expected result should be an array of assets, eg.
					// [{ src: 'ASSET_URL' }]
					return result;
				},
				// Provide a custom handler for deleting assets
				onDelete: async ({ assets }) => {
					const body = JSON.stringify(assets);
					await fetch('ASSETS_DELETE_URL', { method: 'DELETE', body });
				}
			},
			storage: {
				type: 'self',
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
				autosaveIntervalMs: 10000
			},
			theme: 'light',
			// plugins: [
			// 	'gjs-preset-webpage',
			// 	'grapesjs-plugin-forms',
			// 	'grapesjs-plugin-export',
			// 	'grapesjs-navbar'
			// ],
			plugins: [
				'gjs-preset-webpage',
				'grapesjs-plugin-forms',
				'grapesjs-plugin-export',
				'grapesjs-navbar',
				'grapesjs-preset-webpage',
				'grapesjs-blocks-basic',
				'grapesjs-component-countdown',
				'grapesjs-tabs',
				'grapesjs-custom-code',
				'grapesjs-touch',
				'grapesjs-parser-postcss',
				'grapesjs-tooltip',
				'grapesjs-tui-image-editor',
				'grapesjs-typed',
				'grapesjs-style-bg'
			],
			pluginsOpts: {
				'gjs-preset-webpage': {},
				'grapesjs-plugin-forms': {},
				'grapesjs-plugin-export': {},
				'grapesjs-navbar': {}
			}
		});
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
		editor.Panels.addButton('options', {
			id: 'add-page',
			className: 'fa fa-file',
			command: () => createPage(`Page ${pages.length + 1}`),
			attributes: { title: 'Add Page' },
		});

		const switchTheme = (theme) => {
			const iframe = editor.Canvas.getFrameEl();
			const doc = iframe.contentDocument || iframe.contentWindow.document;
			const link = doc.createElement('link');
			link.rel = 'stylesheet';
			link.href = themes[theme];
			doc.head.appendChild(link);
		};

// Example: Add a button for switching themes
		editor.Panels.addButton('options', {
			id: 'theme-switch',
			className: 'fa fa-adjust',
			command: () => switchTheme('dark'), // Change to 'light' for light theme
			attributes: { title: 'Switch Theme' },
		});

		editor.BlockManager.add('row', {
			label: 'Row',
			content: '<div class="row"></div>',
			category: 'Layout',
		});

		editor.BlockManager.add('column', {
			label: 'Column',
			content: '<div class="col"></div>',
			category: 'Layout',
		});

		editor.setStyle(`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
`);

		editor.StyleManager.addProperty('general', {
			name: 'Background Color',
			property: 'background-color',
			type: 'color',
		});

		editor.AssetManager.add({
			src: 'https://via.placeholder.com/150',
			name: 'Placeholder Image',
		});

		editor.AssetManager.addType('image', {
			upload: '/api/upload-assets',
			headers: { Authorization: 'Bearer token' },
		});

		editor.Commands.add('export-template', {
			run(editor) {
				const html = editor.getHtml();
				const css = editor.getCss();
				const blob = new Blob([`${html}<style>${css}</style>`], { type: 'text/html' });
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = 'template.html';
				link.click();
			},
		});

		editor.Commands.add('import-template', {
			run(editor) {
				const input = document.createElement('input');
				input.type = 'file';
				input.accept = 'text/html';
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

		editor.BlockManager.add('template-landing-page', {
			label: 'Landing Page',
			content: `
    <div class="landing-page">
      <h1>Welcome to GrapesJS</h1>
      <p>Create your page with ease.</p>
      <button class="btn">Get Started</button>
    </div>
  `,
			category: 'Templates',
		});


		editor.setStyle(`
  body.theme-dark {
    background-color: #333;
    color: #fff;
  }
`);

		editor.Panels.addPanel({
			id: 'layouts',
			el: '.layout-panel',
			buttons: [
				{
					id: 'add-row',
					command: 'add-row',
					className: 'fa fa-columns',
					attributes: { title: 'Add Row' },
				},
				{
					id: 'add-column',
					command: 'add-column',
					className: 'fa fa-columns',
					attributes: { title: 'Add Column' },
				},
			],
		});


		editor.Commands.add('add-row', {
			run(editor) {
				editor.BlockManager.add('row', {
					label: 'Row',
					content: '<div class="row"></div>',
					category: 'Layout',
				});
			},
		});


		editor.Panels.addButton('options', {
			id: 'insert-element',
			className: 'fa fa-plus',
			command: 'open-blocks',
			attributes: { title: 'Insert Element' }
		});

		// Add Import Template Button
		editor.Panels.addButton('options', {
			id: 'import-template',
			className: 'fa fa-download',
			command: 'gjs-open-import-webpage',
			attributes: { title: 'Import Template' }
		});

		// Add Export Template Button
		editor.Panels.addButton('options', {
			id: 'export-template',
			className: 'fa fa-upload',
			command: 'export-template',
			attributes: { title: 'Export Template' }
		});

		editor.BlockManager.add('button-block', {
			label: `
    <div style="display: flex; align-items: center;">
      <i class="fa fa-hand-pointer" style="margin-right: 5px;"></i>
      Button
    </div>
  `,
			content: '<button class="btn">Click Me</button>',
			category: 'Basic'
		});
		editor.DomComponents.addType('custom-button', {
			model: {
				defaults: {
					tagName: 'button',
					components: 'Click Me',
					traits: [
						{
							type: 'text',
							label: 'Button Text',
							name: 'text'
						},
						{
							type: 'color',
							label: 'Background Color',
							name: 'backgroundColor'
						}
					],
					styles: {
						backgroundColor: '#007bff',
						color: '#fff'
					}
				}
			},
			view: {
				init({ model }) {
					const updateButton = () => {
						const text = model.get('text');
						const backgroundColor = model.get('backgroundColor');
						const el = model.getEl();

						if (text) el.innerHTML = text;
						if (backgroundColor) el.style.backgroundColor = backgroundColor;
					};

					model.on('change:text', updateButton);
					model.on('change:backgroundColor', updateButton);
				}
			}
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
			id: 'views',
			el: '.panel__right',
			buttons: [
				{
					id: 'open-traits',
					active: true,
					className: 'fa fa-cog',
					command: 'open-traits',
					attributes: { title: 'Traits' }
				}
			]
		});


		editor.BlockManager.add('custom-block', {
			label: 'Custom Block',
			content: '<div class="custom-block">Custom Block Content</div>',
			category: 'Custom'
		});

		editor.BlockManager.add('tailwind-block', {
			label: 'Tailwind Block',
			content: '<div class="p-4 bg-blue-500 text-white">Hello Tailwind</div>',
			category: 'Tailwind'
		});
		editor.BlockManager.add('react-button', {
			label: 'React Button',
			content: {
				type: 'react-button',
				props: { label: 'Click Me', variant: 'primary' }
			},
			category: 'React Components'
		});

		editor.DomComponents.addType('react-button', {
			model: {
				defaults: {
					tagName: 'div',
					droppable: false,
					attributes: { 'data-react-type': 'button' }
				}
			},
			view: {
				render() {
					const { label, variant } = this.model.get('props');
					this.el.innerHTML = `<button class="${variant}">${label}</button>`;
				}
			}
		});


		templates.forEach(template => {
			editor.BlockManager.add(template.name, {
				label: template.name,
				content: template.html,
				category: 'Templates'
			});
		});
		editor.Panels.addButton('options', {
			id: 'preview',
			className: 'fa fa-eye',
			command: 'preview',
			attributes: { title: 'Preview' }
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

		editor.Panels.addButton('options', {
			id: 'insert-element',
			className: 'fa fa-plus',
			command: 'open-blocks',
			attributes: { title: 'Insert Element' }
		});

		// Add custom button to import templates
		editor.Panels.addButton('options', {
			id: 'import-template',
			className: 'fa fa-download',
			command: 'gjs-open-import-webpage',
			attributes: { title: 'Import Template' }
		});

		// Add export button to download current template
		editor.Panels.addButton('options', {
			id: 'export-template',
			className: 'fa fa-upload',
			command: 'export-template',
			attributes: { title: 'Export Template' }
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
