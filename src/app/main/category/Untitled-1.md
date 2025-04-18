

Start new chat
Projects
Chats
Recents
Drag-and-Drop Website Builder with Dynamic Content Injection
Newsletter Implementation Review and Refactoring
Dynamic Workflow Builder App
Best Wiki Tools for React and Django Projects
Capturing HTTP Traffic with tcpdump on Ubuntu
Integrating AddBundle Component with Spring Boot
Generating Fragility Curve Plots in MATLAB
Secure Spring Boot API Authorization for Microservices
Accessing Other Chat Conversations
Implementing a Spring Boot Archive System
Implementing Modular React and Spring Boot with Module Federation
Untitled
Dynamically Instantiate File Entities from Database
GrapesJS Data Parser for MUI + Tailwind React App
Voice Interaction Capabilities
Sustainable UI/UX Design
Untitled
Adding a Secondary Reseller to Django Device Model
Untitled
Greeting and Assistance Offered
Untitled
Docker Setup for React Project
Improving Position Order in Slider Code
Disabling Caching in React
Customizing Contact Search Interface
Installing Whitenoise for Django
Replacing VIN with Address in React Component
Implementing Electron Logging with Message Logs
Greeting and Assistance
Comparing 2D and 3D Seismic Fragility Curves
View all
Professional plan

M
peircezrjewett@outlook.com
M

Good morning, M

I want a capability like your preview functionality in my NextJS main website and my React admin panel. I want the employees to use grapesJS and create a webpage, then specify fields to be injected by using a select smart text button, which shows injectable fields, and when selected, their value is like this {{field}}, so handlebars can inject variables to them in my Spring Boot backend API. The employee creates the page, and clicks on a custom  button, created in grapesJS, by me, to publish this code to my backend. By clicking on the button, a drawer opens up from left (my layout is RTL and my language is Persian, so consider these when designing and implementing), with required info like miniapp's name (autocomplete, so the user can add versions to it or create a new one with version 1.0 enforced and version, which needs to automatically get incremented, based on versioning rules and standards (major version, minor version, patch, ...). Other config like its placement, which is also an autocomplete component, which can be select a predefined component/page, which has its own relative route/url, or create a new page, with a new route, enable routing to it, configuring its name, whether to be shown in top navigation links, navigation link's icon, name, tooltip text, link (which is automatically set to the new created link and is disabled) and other necessary configurations. Then, I need you to propose a way, to handle routing like nocobase and toolpad, by changing the folder and file structure, or if there is a better approach, implement that. I want the user to have to do nothing else, just clicking on the publish button, and waiting some time until the progressbar is at 100% (tell me how to implement progressbar being updated in real-time, based on advances in the task operation and getting close to it being accomplished and done), then a modal is to appear, with a text that informs the employee, that his page is created and with a button to go to that page, which when clicked, must take the user to the main website, with exact relative path as he created and the page being exactly as he designed it (with tailwind added to grapesJS as dependency and already being installed on my nextJS app, I expect it to work without issues, if configuration is required to support that, do and implement them. also, if you could add support for more than html, css and javascript, which are what grapesJS exports and could handle react MUI or other libraries elements, that would be awesome, so try to configure it to support that too.  






Choose style
Use a project
No file chosen





pasted


New
Try Projects
Bring your docs, code, and files to collaborate with Claude and your team. Try it out


Your recent chats
View all
fk
Drag-and-Drop Website Builder with Dynamic Content Injection
16 seconds ago
Newsletter Implementation Review and Refactoring
1 hour ago
Dynamic Workflow Builder App
1 hour ago
Best Wiki Tools for React and Django Projects
7 hours ago
Capturing HTTP Traffic with tcpdump on Ubuntu
12 hours ago
fk
Integrating AddBundle Component with Spring Boot
15 hours ago

Pasted content

5.92 KB •5 lines
•
Formatting may be inconsistent from source


I want a capability like v0.dev or bolt.new's preview functionality in my NextJS main website and my React admin panel. I want the employees to use grapesJS and create a webpage, then specify fields to be injected by using a select smart text button, which shows injectable fields, and when selected, their value is like this {{field}}, so handlebars can inject variables to them in my Spring Boot backend API. The employee creates the page, and clicks on a custom  button, created in grapesJS, by me, to publish this code to my backend. By clicking on the button, a drawer opens up from left (my layout is RTL and my language is Persian, so consider these when designing and implementing), with required info like miniapp's name (autocomplete, so the user can add versions to it or create a new one with version 1.0 enforced and version, which needs to automatically get incremented, based on versioning rules and standards (major version, minor version, patch, ...). Other config like its placement, which is also an autocomplete component, which can be select a predefined component/page, which has its own relative route/url, or create a new page, with a new route, enable routing to it, configuring its name, whether to be shown in top navigation links, navigation link's icon, name, tooltip text, link (which is automatically set to the new created link and is disabled) and other necessary configurations. Then, I need you to propose a way, to handle routing like nocobase and toolpad, by changing the folder and file structure, or if there is a better approach, implement that. I want the user to have to do nothing else, just clicking on the publish button, and waiting some time until the progressbar is at 100% (tell me how to implement progressbar being updated in real-time, based on advances in the task operation and getting close to it being accomplished and done), then a modal is to appear, with a text that informs the employee, that his page is created and with a button to go to that page, which when clicked, must take the user to the main website, with exact relative path as he created and the page being exactly as he designed it (with tailwind added to grapesJS as dependency and already being installed on my nextJS app, I expect it to work without issues, if configuration is required to support that, do and implement them. also, if you could add support for more than html, css and javascript, which are what grapesJS exports and could handle react MUI or other libraries elements, that would be awesome, so try to configure it to support that too.  

I sent my current GrapesEditor.jsx, which is to be configured, my current FormBuilder.jsx which is only creating a schema, not connected to anything and the modifications I need to have, according to another chat, to which I explained my requirements too. I need you to check both its implementation in backend (Spring Boot API) and Frontend (React + MUI + tailwindcss + FUSE template) to see if it has all the requirements I asked for (check explicitly for scripts execution too, the grapesJS needs to have another custom button which opens a code editor like monaco or anything good and popular, with js configured as its language, so the employee can write custom code and have access to the elements he used in the editor (have access to its dom and work with values and  ... of them, for example get the value of one input and use a toast to show it to the viewers, by using js). The JS, after being finished, is sent to the server along other files and data, injected with the requested variables and if a variable doesn't exist an error is thrown for him to edit it and submit a new version again. Add support for react and its libraries because I want to show some of my pages inside the grapesJS editor, as templates, to be configurable and so they can change elements and text and layout and positions and ...., publish it and that page to be automatically updated with the new design (some pages are going to be dynamic and configurable like this, not all). For example, I want to have a new tab in my Company.jsx, for new dynamically added inputs, which extend the company entity. Give me this requirement's implementation as usage example, when you're done. Also, another requirement is to change this page: {{MAIN_NEXTJS_WEBSITE_BASE_URL}}/view/producers/detailes?id={{some_company_id_selected_in_publish_miniapp_drawer_form_by_employee}} to use the page employee has designed, being able to use both module federation and iframe for it. See if the code structure below (the one I got from another chat) supports this and if so, help me implement the missing features and requirements, in all three react app, Spring Boot API and nextJS website, while using MUI + tailwindcss + FUSE admin template theme for react admin app, conforming to the structure of Spring Boot API (if it's properly implemented) and using tailwindcss with nextJS. Also, implement the feature to have both the nextJS and React app, support creating new pages and route to them  automatically, without needing restarts and create a form for it in a drawer, in grapesJS editor page, which opens by clicking on another custom button on the grapesJS toolbox

I've sent you some files to know about company form (the tab I want to add) and company entity and related entities, so you can give me the two usage examples I asked for, after implementing everything: New company tab being created by the employee, with the design he chose, using both iframe and module federation (based on whichever he configured for miniapp) to show and interact with it and also, the same feature and capability, but in nextJS (main website) app and this url {{MAIN_NEXTJS_WEBSITE_BASE_URL}}/view/producers/detailes?id={{some_company_id_selected_in_publish_miniapp_drawer_form_by_employee}} . Implement fully and completely, in great details and according to standards and best practices, with performance, security and availability in mind (performance is the most important factor, then security and availability and then others)