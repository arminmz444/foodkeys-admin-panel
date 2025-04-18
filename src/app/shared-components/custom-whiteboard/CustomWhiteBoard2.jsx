import { Excalidraw } from "@excalidraw/excalidraw";
import "./App.css";
// import initialData from "./initialData";
const uiOptions = {
  fontSize: 1000, 
};

const initialData = {
  scrollToContent: true,
//   // appState: {
//     // currentItemFontSize: 1000, 
//     // currentItemFontFamily: 1,
//     // currentItemFontColor: "#000000",
//     // currentItemFontWeight: "bold",
//     // currentItemFontStyle: "normal",
//     // currentItemFontDecoration: "none",
//     // currentItemFontAlignment: "left",
//     // currentItemFontLineHeight: 1.5,
//     // currentItemFontLetterSpacing: 0,
//   // },
//   ...initialData,
};

import { Box } from "@mui/material";
export default function CustomWhiteBoard2() {
  return (
    <Box>
      <div className="font-sans font-ser ms-6 me-1" style={{ height: "100vh", width: "100%" }}>
        <Excalidraw className="custom-whiteboard-styles" uiOptions={uiOptions} initialData={initialData} renderTopRightUI={() => <div>تخته هوشمند</div>} />
      </div>
    </Box>
  );
}