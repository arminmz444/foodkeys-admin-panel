import { useState } from "react";
// import MockFileManager from '../MockFileManager.jsx';
import Flmngr from "@flmngr/flmngr-react";
import Button from "@mui/material/Button";

// import { DataGridPro } from '@mui/x-data-grid-pro';

/**
 * The files page.
 */
function showSelectedImageWithPreview(files) {
  let elImages = document.getElementById("images");
  elImages.innerHTML = "";

  // As far we requested just one file, it is the only item of the array
  let file = files[0];
  let filePreview = file.formats.find((file) => file.format === "preview");
  let urlPreview = Flmngr.getNoCacheUrl(filePreview.url);
  let urlOriginal = Flmngr.getNoCacheUrl(file.url);

  // Add preview image
  let elTextPreview = document.createElement("p");
  elTextPreview.textContent = "Preview image";
  elImages.appendChild(elTextPreview);

  let elImgPreview = document.createElement("img");

  elImgPreview.src = urlPreview;
  elImgPreview.alt = "Image preview selected in Flmngr";
  elImgPreview.setAttribute("data-src-original", urlOriginal);
  elImages.appendChild(elImgPreview);
  attachLightBoxToImage(elImgPreview);

  // Add image original
  let elText = document.createElement("p");
  elText.textContent = "Original image";
  elImages.appendChild(elText);

  let elImg = document.createElement("img");
  elImg.src = urlOriginal;
  elImg.alt = "Image selected in Flmngr";
  elImages.appendChild(elImg);

  document.getElementById("hint").style.display = "block";
}

function attachLightBoxToImage(elImg) {
  new Luminous(elImg, {
    showCloseButton: true,
    sourceAttribute: "data-src-original",
  });
}
function Files() {
  const [selectedImage, setSelectedImage] = useState("");
  const [files, setFiles] = useState([
    {
      name: "Documents",
      isDirectory: true,
      path: "/Documents",
      updatedAt: "2024-09-09T10:30:00Z",
    },
    {
      name: "Pictures",
      isDirectory: true,
      path: "/Pictures",
      updatedAt: "2024-09-09T11:00:00Z",
    },
    {
      name: "Pic.png",
      isDirectory: false,
      path: "/Pictures/Pic.png",
      updatedAt: "2024-09-08T16:45:00Z",
      size: 2048,
    },
  ]);
  return (
    <>
    <div>
      <Button
        loading
        loadingIndicator="در حال بارگذاری ..."
        className="mt-24 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
        // className="bg-green-500	 mt-24"
        // onClick={() => {
        // 	Flmngr.open({
        // 		apiKey: 'FLMNFLMN',
        // 		urlFileManager: 'http://127.0.0.1:3000/flmngr',
        // 		urlFiles: 'http://127.0.0.1:3000/flmngr/files',
        // 		isMultiple: false,
        // 		isShowStockImages: false,
        // 		acceptExtensions: [
        // 			'png',
        // 			'jpg',
        // 			'jpeg',
        // 			'gif',
        // 			'webp',
        // 			'txt',
        // 			'pdf',
        // 			'zip',
        // 			'rar',
        // 			'doc',
        // 			'docx',
        // 			'xls',
        // 			'xlsx',
        // 			'mp3',
        // 			'mp4',
        // 			'mkv'
        // 		],
        // 		onFinish: (files) => {
        // 			console.log('User picked:');
        // 			console.log(files);
        // 			setSelectedImage(files.length > 0 ? files[0] : '');
        // 		}
        // 	});
        // }}
        onClick={() => {
          Flmngr.open({
            apiKey: "FLMNFLMN",
            urlFileManager: "http://127.0.0.1:3001/flmngr", //"https://fm.n1ed.com/fileManager", // https://fm.flmngr.com/fileManager
            urlFiles: "http://127.0.0.1:3001/flmngr/files", // "https://fm.n1ed.com/files", // https://fm.flmngr.com/files
            // acceptExtensions: ["png", "jpg", "jpeg", "gif", "webp"],
            isShowStockImages: true,
            imageFormats: [
              // define image formats
              {
                id: "preview",
                title: "Preview",
                suffix: "-preview",
                maxWidth: 250,
                maxHeight: 250,
              },
            ],
            createImageFormats: ["preview"],
            acceptExtensions: ["png", "jpeg", "jpg", "webp"],
            isMultiple: false,
            onFinish: (files) => {
              let file = files[0];
              console.log("Original image: " + file.url);
              let filePreview = file.formats.find((f) => {
                return f.format === "preview";
              });
              console.log("Preview image: " + filePreview.url);
              setSelectedImage(filePreview.url)
              Flmngr.upload({
                filesOrLinks: files,
                dirUploads: "/",
                onFinish: (urls) => {
                  console.log("Files uploaded. Their URLs are:");
                  console.log(urls);
                },
              });
            },
            // onFinish: (files) => {
            //   console.log("User picked:");
            //   console.log(files);

            //   setSelectedImage(Flmngr.getNoCacheUrl(urlNew));
            // },
          });
        }}
      >
        باز کردن برنامه مدیریت عکس‌ها
      </Button>

      {/* <Button
        className="bg-green-500	 mt-24"
        onClick={() => {
          Flmngr.editAndUpload({
            apiKey: "FLMNFLMN", // "FLMN24RR1234123412341234", // default free key
            urlFileManager: "https://fm.n1ed.com/fileManager", // "http://127.0.0.1:3000/flmngr", // demo server
            urlFiles: "https://fm.n1ed.com/files", // "http://127.0.0.1:3000/flmngr/files", // demo file storage
            url: selectedImage,
            onSave: function (urlNew) {
              setSelectedImage(Flmngr.getNoCacheUrl(urlNew));
            },
          });
        }}
      >
        Edit image
      </Button> */}
      <Button
        onClick={() => {
          Flmngr.edit({
            apiKey: "FLMNFLMN",
            urlFileManager: "http://127.0.0.1:3001/flmngr", //"https://fm.n1ed.com/fileManager", // https://fm.flmngr.com/fileManager
            urlFiles: "http://127.0.0.1:3001/flmngr/files", // "https://fm.n1ed.com/files", // https://fm.flmngr.com/files

            url: selectedImage,
            onSave: (onExport, onClose) => {
              onExport("new_name", "jpg", 95, (imageBlob) => {
                let reader = new FileReader();
                reader.onloadend = () => {
                  var base64 = reader.result;

                  this.setState(
                    {
                      urlImage: base64,
                    },
                    () => {
                      onClose();
                    }
                  );
                };
                reader.readAsDataURL(imageBlob);
              });
            },
            onFail: function (error) {
              alert(error);
            },
          });
        }}
      >
        ویرایش تصویر
      </Button>'
      <h2 className="h5 mt-5">عکس انتخاب شده</h2>

      <p id="hint" style={{ display: "none" }} className="hint">
        <b>نکته</b>: پیش‌نمایش قابل کلیک است.
      </p>

      <div id="images">تصویری انتخاب نشده است.</div>
    </div>
    <div>
    	{/* <h1>Admin Panel</h1> */}
    	{/* <MockFileManager onFileSelect={(path) => setSelectedImage(path)} /> */}
    	{selectedImage && (
    		<div>
    			<h3>Selected File:</h3>
    			<img
						src={{selectedImage}}
						alt="post"
						className="rounded-8"
					/>
    		</div>
    	)}
    </div>
    </>
  );
}

export default Files;
