import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import FuseUtils from "@fuse/utils";

function NewServiceItem({ onDraftCreated }) {
  const handleNewService = () => {
    const draftId = `draft-${FuseUtils.generateGUID()}`;
    const newDraft = {
      id: draftId,
      name: "",
      ranking: 0,
      subCategoryId: null,
      description: "",
      serviceData: {},
      serviceAdditionalData: {},
      updatedAt: new Date().toISOString(),
      isDraft: true,
      icon: "heroicons-outline:plus",
    };

    const existingDrafts =
      JSON.parse(localStorage.getItem("draftServices")) || [];
    const updatedDrafts = [...existingDrafts, newDraft];
    localStorage.setItem("draftServices", JSON.stringify(updatedDrafts));

    if (onDraftCreated) {
      onDraftCreated();
    }
  };

  return (
    <Box
      sx={{ borderColor: "divider" }}
      className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer border-2 border-gray-300 border-dashed hover:bg-hover transition-colors duration-150 ease-in-out"
      onClick={handleNewService}
      onKeyDown={handleNewService}
      role="button"
      tabIndex={0}
    >
      <FuseSvgIcon size={48} color="disabled">
        heroicons-outline:plus
      </FuseSvgIcon>
      <p className="mt-2 text-gray-600">ایجاد سرویس جدید (پیش‌نویس)</p>
    </Box>
  );
}

export default NewServiceItem;
