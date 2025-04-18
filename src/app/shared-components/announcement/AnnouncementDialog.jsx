import React, { useState } from "react";
import AnnouncementModal from "./AnnouncementModal";
import FlutterDashIcon from "@mui/icons-material/FlutterDash"; // Example icon

function AnnouncementDialog() {
  const [openModal, setOpenModal] = useState(false);
  const [agreeTos, setAgreeTos] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleAccept = () => {
    console.log("User accepted with:", { agreeTos, subscribe });
    setOpenModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleOpen}
      >
        Open Modal
      </button>

      <AnnouncementModal
        open={openModal}
        onClose={handleClose}
        onAccept={handleAccept}
        icon={<FlutterDashIcon fontSize="large" className="text-blue-500" />}
        title="Google AI Studio"
        description="Google AI Studio is the fastest way to start exploring and building with Gemini.ai, our next generation family of multimodal generative AI models. Get access, get an API key, and go build."
        checkboxes={[
          {
            label:
              "I consent to the Google APIs Terms of Service and the Gemini API Additional Terms of Service and acknowledge that I have read the Google Privacy Policy",
            checked: agreeTos,
            onChange: (e) => setAgreeTos(e.target.checked),
          },
          {
            label:
              "I'd like to receive emails for model updates, offers, useful tips, invitations to research studies, and news about Google AI",
            checked: subscribe,
            onChange: (e) => setSubscribe(e.target.checked),
          },
        ]}
        acceptButtonText="I Accept"
      />
    </div>
  );
}

export default AnnouncementDialog;
