// import React, { useEffect, useRef } from "react";
// import EditorJS from "@editorjs/editorjs";
// import Header from "@editorjs/header";
// import List from "@editorjs/list";
// import Quote from "@editorjs/quote";
// import CodeTool from "@editorjs/code";
// import Table from "@editorjs/table";
// import Embed from "@editorjs/embed";
// import Checklist from "@editorjs/checklist";
// import InlineCode from "@editorjs/inline-code";
// import Marker from "@editorjs/marker";
// import Warning from "@editorjs/warning";
// import Delimiter from "@editorjs/delimiter";
// import ImageTool from "@editorjs/image";
// import LinkTool from "@editorjs/link";
// import Underline from "@editorjs/underline";
// // import Undo from "editorjs-undo";
// import AudioPlayer from "editorjs-audio-player";
// import AttachesTool from "@editorjs/attaches";
// import TextVariantTune from "@editorjs/text-variant-tune";
// import { Button, CardActions, CardContent, CardHeader, Paper } from "@mui/material";
// import TelegramPost from "editorjs-telegram-post";
// import RawTool from "@editorjs/raw";
// import ImageGallery from "@kiberpro/editorjs-gallery";
// import ColorPlugin from 'editorjs-text-color-plugin';
// import { Card } from "@material-ui/core";

// const EditorJSComponent = ({ onSave, initialData, editorCardClassName = "p-10" }) => {
//   const ejInstance = useRef(null);
//   const editorRef = useRef(null);

//   useEffect(() => {
//     if (!editorRef.current) return;

//     const editor = new EditorJS({
//       Color: {
//         class: ColorPlugin,
//         config: {
//           colorCollections: [
//             "#EC7878",
//             "#9C27B0",
//             "#673AB7",
//             "#3F51B5",
//             "#0070FF",
//             "#03A9F4",
//             "#00BCD4",
//             "#4CAF50",
//             "#8BC34A",
//             "#CDDC39",
//             "#FFF",
//           ],
//           defaultColor: "#FF1300",
//           type: "text",
//           customPicker: true,
//         },
//       },
//       Marker: {
//         class: ColorPlugin,
//         config: {
//           defaultColor: "#FFBF00",
//           type: "marker",
//           icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`,
//         },
//       },
//       holder: "editorjs",
//       placeholder: "Start typing here...",
//       tools: {
//         header: {
//           class: Header,
//           config: { levels: [1, 2, 3, 4, 5, 6], defaultLevel: 2 },
//         },
//         list: {
//           class: List,
//           inlineToolbar: true,
//         },
//         quote: {
//           class: Quote,
//           inlineToolbar: true,
//           config: {
//             quotePlaceholder: "Enter a quote",
//             captionPlaceholder: "Quote author",
//           },
//         },
//         gallery: {
//           class: ImageGallery,
//           // config: {
//           //   sortableJs: Sortable,
//           //   endpoints: {
//           //     byFile: "http://localhost:8008/uploadFile",
//           //   },
//           // },
//         },
//         code: CodeTool,
//         table: {
//           class: Table,
//           inlineToolbar: true,
//           config: { rows: 2, cols: 3 },
//         },
//         embed: Embed,
//         checklist: Checklist,
//         inlineCode: InlineCode,
//         marker: Marker,
//         warning: {
//           class: Warning,
//           inlineToolbar: true,
//           config: {
//             titlePlaceholder: "Warning title",
//             messagePlaceholder: "Warning message",
//           },
//         },
//         delimiter: Delimiter,
//         underline: Underline,
//         raw: RawTool,
//         telegramPost: TelegramPost,
//         attaches: {
//           class: AttachesTool,
//           config: { endpoint: "/upload" },
//         },
//         textVariantTune: TextVariantTune,
//         image: {
//           class: ImageTool,
//           config: {
//             endpoints: {
//               byFile: "https://api.imgbb.com/1/upload?key=YOUR_API_KEY", // Change this to your actual upload API or use Base64
//               byUrl: "https://api.imgur.com/3/image", // External image upload service
//             },
//             additionalRequestHeaders: {
//               Authorization: "Client-ID YOUR_CLIENT_ID", // If using external API like Imgur
//             },
//           },
//         },
//         linkTool: {
//           class: LinkTool,
//           config: {
//             endpoint: "https://your-backend.com/fetch-url-meta", // Custom backend API to fetch metadata
//           },
//         },
//         audioPlayer: AudioPlayer,
//       },
//       data: initialData || {},
//       autofocus: true,
//       // onReady: () => {
//       //   new Undo({ editor });
//       // },
//     });

//     ejInstance.current = editor;

//     return () => {
//       if (
//         ejInstance.current &&
//         typeof ejInstance.current.destroy === "function"
//       ) {
//         ejInstance.current.destroy();
//       }
//       ejInstance.current = null;
//       // ejInstance.current?.destroy();
//       // ejInstance.current = null;
//     };
//   }, []);

//   const handleSave = async () => {
//     const outputData = await ejInstance.current.save();
//     console.log("Saved Data:", outputData);
//     if (onSave) onSave(outputData);
//   };

//   return (
//     <div className="bg-white">
//       <div
//         dir="rtl"
//         id="editorjs"
//         ref={editorRef}
//         style={{
//           border: "1px solid #ddd",
//           padding: "10px",
//           borderRadius: "5px",
//         }}
//       />

//     <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSave}
//         className="top-10 left-10 p-10 cursor-pointer"
//       >
//         ذخیره اطلاعات
//       </Button>
//       </div>
//   );
// };

// export default EditorJSComponent;
import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import Table from "@editorjs/table";
import Embed from "@editorjs/embed";
import Checklist from "@editorjs/checklist";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import Warning from "@editorjs/warning";
import Delimiter from "@editorjs/delimiter";
import ImageTool from "@editorjs/image";
import LinkTool from "@editorjs/link";
import Underline from "@editorjs/underline";
import AudioPlayer from "editorjs-audio-player";
import AttachesTool from "@editorjs/attaches";
import TextVariantTune from "@editorjs/text-variant-tune";
import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import TelegramPost from "editorjs-telegram-post";
import RawTool from "@editorjs/raw";
import ImageGallery from "@kiberpro/editorjs-gallery";
import ColorPlugin from 'editorjs-text-color-plugin';

const EditorJSComponent = ({ 
  onSave, 
  initialData = {}, 
  editorCardClassName = "p-10",
  loading = false,
  buttonText = "ذخیره اطلاعات"
}) => {
  const ejInstance = useRef(null);
  const editorRef = useRef(null);
  const [editorData, setEditorData] = useState(initialData);

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize editor with initial data 
    const initEditor = async () => {
      if (ejInstance.current) {
        await ejInstance.current.destroy();
        ejInstance.current = null;
      }

      const editor = new EditorJS({
        holder: "editorjs",
        placeholder: "شروع به نوشتن کنید...",
        tools: {
          header: {
            class: Header,
            config: { levels: [1, 2, 3, 4, 5, 6], defaultLevel: 2 },
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "نقل قول را وارد کنید",
              captionPlaceholder: "نویسنده نقل قول",
            },
          },
          gallery: ImageGallery,
          code: CodeTool,
          table: {
            class: Table,
            inlineToolbar: true,
            config: { rows: 2, cols: 3 },
          },
          embed: Embed,
          checklist: Checklist,
          inlineCode: InlineCode,
          marker: {
            class: ColorPlugin,
            config: {
              defaultColor: "#FFBF00",
              type: "marker",
            },
          },
          warning: {
            class: Warning,
            inlineToolbar: true,
            config: {
              titlePlaceholder: "عنوان هشدار",
              messagePlaceholder: "پیام هشدار",
            },
          },
          delimiter: Delimiter,
          underline: Underline,
          raw: RawTool,
          telegramPost: TelegramPost,
          attaches: {
            class: AttachesTool,
            config: { endpoint: "/upload" },
          },
          textVariantTune: TextVariantTune,
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "/api/v1/upload/image", // Update with your actual endpoint
                byUrl: "/api/v1/upload/url",
              },
            },
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/v1/fetch-url-meta", // Update with your actual endpoint
            },
          },
          audioPlayer: AudioPlayer,
          Color: {
            class: ColorPlugin,
            config: {
              colorCollections: [
                "#EC7878",
                "#9C27B0",
                "#673AB7",
                "#3F51B5",
                "#0070FF",
                "#03A9F4",
                "#00BCD4",
                "#4CAF50",
                "#8BC34A",
                "#CDDC39",
                "#FFF",
              ],
              defaultColor: "#FF1300",
              type: "text",
              customPicker: true,
            },
          },
        },
        data: initialData,
        autofocus: true,
      });

      ejInstance.current = editor;
    };

    initEditor();

    return () => {
      if (ejInstance.current && typeof ejInstance.current.destroy === "function") {
        ejInstance.current.destroy();
      }
      ejInstance.current = null;
    };
  }, []);

  // Update editor data when initialData changes
  useEffect(() => {
    if (ejInstance.current && initialData && Object.keys(initialData).length > 0) {
      ejInstance.current.render(initialData);
    }
  }, [initialData]);

  const handleSave = async () => {
    try {
      if (!ejInstance.current) return;
      
      const outputData = await ejInstance.current.save();
      console.log("Saved Editor Data:", outputData);
      
      if (onSave) {
        onSave(outputData);
      }
    } catch (error) {
      console.error("Error saving editor data:", error);
    }
  };

  return (
    <Card className={editorCardClassName}>
      <CardContent>
        <div className="bg-white">
          <div
            dir="rtl"
            id="editorjs"
            ref={editorRef}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "5px",
              minHeight: "200px",
            }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            className="mt-8"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditorJSComponent;