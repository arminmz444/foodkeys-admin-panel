// import { Button, ListItemIcon, ListItemText, Menu, MenuItem, Chip, Collapse } from "@mui/material"
// import Paper from "@mui/material/Paper"
// import { useState } from "react"
// import { BiDotsVerticalRounded, BiTimer } from "react-icons/bi"
// import { IoMdTime } from "react-icons/io"
// import Fade from "@mui/material/Fade"
// import { FiEdit2 } from "react-icons/fi"
// import { MdDeleteForever, MdPublishedWithChanges } from "react-icons/md"
// import { FaChevronDown, FaChevronUp } from "react-icons/fa"
//
// function BundleCard({ title, amount, isActive, updatedAt, features = [], description, duration }) {
//   const [anchorEl, setAnchorEl] = useState(null)
//   const [expanded, setExpanded] = useState(false)
//   const open = Boolean(anchorEl)
//
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget)
//   }
//
//   const handleClose = () => {
//     setAnchorEl(null)
//   }
//
//   const toggleExpand = () => {
//     setExpanded(!expanded)
//   }
//
//   function numberWithCommas(x) {
//     if (!x && x !== 0) return "0"
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//   }
//
//   const featuresList = Array.isArray(features)
//     ? features.filter((f) => f && f.trim())
//     : typeof features === "string"
//       ? features.split(".").filter((f) => f && f.trim())
//       : []
//
//   const MAX_DESC_LENGTH = 100
//   const isDescriptionLong = description && description.length > MAX_DESC_LENGTH
//   const truncatedDescription = isDescriptionLong ? `${description.substring(0, MAX_DESC_LENGTH)}...` : description
//
//   const showMoreButton = isDescriptionLong || featuresList.length > 3
//
//   return (
//     <Paper className="flex flex-col flex-auto p-16 sm:p-24 shadow rounded-2xl overflow-hidden transition-all duration-300">
//       <div className="flex items-start justify-between">
//         <div className="text-lg font-medium tracking-tight leading-6 truncate">{title}</div>
//         <div>
//           <Button
//             id="fade-button"
//             aria-controls={open ? "fade-menu" : undefined}
//             aria-haspopup="true"
//             aria-expanded={open ? "true" : undefined}
//             onClick={handleClick}
//             className="min-w-0 p-2"
//           >
//             <BiDotsVerticalRounded size={24} />
//           </Button>
//           <Menu
//             id="fade-menu"
//             MenuListProps={{
//               "aria-labelledby": "fade-button",
//               sx: { padding: 0 },
//             }}
//             PaperProps={{
//               sx: { overflow: "hidden" },
//             }}
//             anchorEl={anchorEl}
//             open={open}
//             onClose={handleClose}
//             TransitionComponent={Fade}
//           >
//             <MenuItem onClick={handleClose}>
//               <ListItemIcon>
//                 <FiEdit2 size={15} />
//               </ListItemIcon>
//               <ListItemText>ویرایش</ListItemText>
//             </MenuItem>
//             <MenuItem onClick={handleClose}>
//               <ListItemIcon>
//                 <MdPublishedWithChanges size={15} />
//               </ListItemIcon>
//               <ListItemText>{isActive ? "غیرفعال کردن" : "فعال کردن"}</ListItemText>
//             </MenuItem>
//             <MenuItem
//               onClick={handleClose}
//               sx={{
//                 backgroundColor: "#f87171",
//                 color: "white",
//                 "&:hover": {
//                   backgroundColor: "#ef4444",
//                 },
//                 padding: "8px 16px",
//                 marginBottom: 0,
//                 borderRadius: 0,
//               }}
//             >
//               <ListItemIcon sx={{ minWidth: "36px" }}>
//                 <MdDeleteForever color="white" size={20} />
//               </ListItemIcon>
//               <ListItemText primary="حذف" />
//             </MenuItem>
//           </Menu>
//         </div>
//       </div>
//
//       <div className="flex justify-between items-center mt-4">
//         <div className="flex flex-col">
//           <div className="text-2xl sm:text-5xl font-bold tracking-tight leading-tight">
//             {numberWithCommas(amount)} <span className="text-lg">تومان</span>
//           </div>
//           <span className="flex items-center gap-2 mt-2 text-gray-600">
//             <BiTimer size={18} />
//             {duration || "2 ماهه"}
//           </span>
//         </div>
//         <Chip
//           label={isActive ? "فعال" : "غیرفعال"}
//           color={isActive ? "success" : "error"}
//           className={`text-white font-medium px-3 py-1 ${isActive ? "bg-green-500" : "bg-red-500"}`}
//         />
//       </div>
//
//       {updatedAt && (
//         <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
//           <IoMdTime size={16} />
//           <span>آخرین بروزرسانی: {updatedAt}</span>
//         </div>
//       )}
//
//       {(description || featuresList.length > 0) && <div className="w-full h-px bg-gray-200 my-4"></div>}
//
//       {description && (
//         <div className="mt-2">
//           <h3 className="text-md font-medium mb-2">توضیحات:</h3>
//           <p className="text-gray-700 text-sm leading-relaxed">{expanded ? description : truncatedDescription}</p>
//         </div>
//       )}
//
//       {featuresList.length > 0 && (
//         <div className="mt-4">
//           <h3 className="text-md font-medium mb-2">ویژگی‌ها:</h3>
//           <Collapse in={expanded} collapsedSize={expanded ? "auto" : 120}>
//             <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 pr-2">
//               {featuresList.map((feature, index) => (
//                 <li key={index} className="leading-relaxed">
//                   {feature}
//                 </li>
//               ))}
//             </ul>
//           </Collapse>
//         </div>
//       )}
//
//       {showMoreButton && (
//         <Button
//           onClick={toggleExpand}
//           className="self-start mt-3 text-blue-600 font-medium hover:text-blue-800 transition-colors"
//           endIcon={expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
//         >
//           {expanded ? "نمایش کمتر" : "نمایش بیشتر"}
//         </Button>
//       )}
//     </Paper>
//   )
// }
//
// export default BundleCard
//


import { Button, ListItemIcon, ListItemText, Menu, MenuItem, Chip, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import Paper from "@mui/material/Paper"
import { useState } from "react"
import { BiDotsVerticalRounded, BiTimer } from "react-icons/bi"
import { IoMdTime } from "react-icons/io"
import Fade from "@mui/material/Fade"
import { FiEdit2 } from "react-icons/fi"
import { MdDeleteForever, MdPublishedWithChanges } from "react-icons/md"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import { useDeleteBundleMutation, useActivateOrDeactivateBundleMutation } from "./store/bundleApi"
import { enqueueSnackbar } from "notistack"
import AddBundle from "./AddBundle"

function BundleCard({
                      id,
                      title,
                      amount,
                      isActive,
                      updatedAt,
                      features = [],
                      description,
                      duration,
                      timeDuration,
                      status,
                      providedAccess,
                      onBundleUpdated
                    }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const open = Boolean(anchorEl)

  // RTK Query mutations
  const [deleteBundle, { isLoading: isDeleting }] = useDeleteBundleMutation()
  const [activateOrDeactivateBundle, { isLoading: isChangingStatus }] = useActivateOrDeactivateBundleMutation()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const handleEdit = () => {
    setEditDialogOpen(true)
    handleClose()
  }

  const handleStatusChange = async () => {
    try {
      const newStatus = isActive ? "DISABLED" : "ACTIVE"
      await activateOrDeactivateBundle({
        id: id,
        status: newStatus
      }).unwrap()

      enqueueSnackbar(`پلن با موفقیت ${newStatus === 'ACTIVE' ? 'فعال' : 'غیرفعال'} شد`, {
        variant: "success",
        style: { fontSize: 'medium' }
      })

      if (onBundleUpdated && typeof onBundleUpdated === 'function') {
        onBundleUpdated()
      }
    } catch (err) {
      console.error('Error changing bundle status:', err)
      // enqueueSnackbar('خطا در تغییر وضعیت پلن', {
      //   variant: 'error',
      //   style: { fontSize: 'medium' }
      // });
    }
    handleClose()
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    handleClose()
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteBundle(id).unwrap()

      enqueueSnackbar('پلن با موفقیت حذف شد', {
        variant: 'success',
        style: { fontSize: 'medium' }
      })

      if (onBundleUpdated && typeof onBundleUpdated === 'function') {
        onBundleUpdated()
      }
    } catch (err) {
      console.error('Error deleting bundle:', err)
      enqueueSnackbar('خطا در حذف پلن', { variant: 'error' })
    }
    setDeleteDialogOpen(false)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const handleBundleEdited = () => {
    setEditDialogOpen(false)
    enqueueSnackbar('پلن با موفقیت ویرایش شد', {
      variant: 'success',
      style: { fontSize: 'medium' }
    })

    if (onBundleUpdated && typeof onBundleUpdated === 'function') {
      onBundleUpdated()
    }
  }

  function numberWithCommas(x) {
    if (!x && x !== 0) return "0"
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const featuresList = Array.isArray(features)
      ? features.filter((f) => f && f.trim())
      : typeof features === "string"
          ? features.split(".").filter((f) => f && f.trim())
          : []

  const MAX_DESC_LENGTH = 100
  const isDescriptionLong = description && description.length > MAX_DESC_LENGTH
  const truncatedDescription = isDescriptionLong ? `${description.substring(0, MAX_DESC_LENGTH)}...` : description

  const showMoreButton = isDescriptionLong || featuresList.length > 3

  // Prepare edit data
  const editData = {
    id,
    title,
    price: amount,
    timeDuration,
    status,
    description,
    features: Array.isArray(features) ? features.join(". ") : features,
    providedAccess: providedAccess || []
  }

  return (
      <>
        <Paper className="flex flex-col flex-auto p-16 sm:p-24 shadow rounded-2xl overflow-hidden transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="text-lg font-medium tracking-tight leading-6 truncate">{title}</div>
            <div>
              <Button
                  id="fade-button"
                  aria-controls={open ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  className="min-w-0 p-2"
                  disabled={isDeleting || isChangingStatus}
              >
                <BiDotsVerticalRounded size={24} />
              </Button>
              <Menu
                  id="fade-menu"
                  MenuListProps={{
                    "aria-labelledby": "fade-button",
                    sx: { padding: 0 },
                  }}
                  PaperProps={{
                    sx: { overflow: "hidden" },
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
              >
                <MenuItem onClick={handleEdit}>
                  <ListItemIcon>
                    <FiEdit2 size={15} />
                  </ListItemIcon>
                  <ListItemText>ویرایش</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleStatusChange} disabled={isChangingStatus}>
                  <ListItemIcon>
                    <MdPublishedWithChanges size={15} />
                  </ListItemIcon>
                  <ListItemText>{isActive ? "غیرفعال کردن" : "فعال کردن"}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    sx={{
                      backgroundColor: "#f87171",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#ef4444",
                      },
                      padding: "8px 16px",
                      marginBottom: 0,
                      borderRadius: 0,
                    }}
                >
                  <ListItemIcon sx={{ minWidth: "36px" }}>
                    <MdDeleteForever color="white" size={20} />
                  </ListItemIcon>
                  <ListItemText primary="حذف" />
                </MenuItem>
              </Menu>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex flex-col">
              <div className="text-2xl sm:text-5xl font-bold tracking-tight leading-tight">
                {numberWithCommas(amount)} <span className="text-lg">تومان</span>
              </div>
              <span className="flex items-center gap-2 mt-2 text-gray-600">
              <BiTimer size={18} />
                {duration || `${timeDuration} ماهه`}
            </span>
            </div>
            <Chip
                label={isActive ? "فعال" : "غیرفعال"}
                color={isActive ? "success" : "error"}
                className={`text-white font-medium px-3 py-1 ${isActive ? "bg-green-500" : "bg-red-500"}`}
            />
          </div>

          {updatedAt && (
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <IoMdTime size={16} />
                <span>آخرین بروزرسانی: {updatedAt}</span>
              </div>
          )}

          {(description || featuresList.length > 0) && <div className="w-full h-px bg-gray-200 my-4"></div>}

          {description && (
              <div className="mt-2">
                <h3 className="text-md font-medium mb-2">توضیحات:</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{expanded ? description : truncatedDescription}</p>
              </div>
          )}

          {featuresList.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">ویژگی‌ها:</h3>
                <Collapse in={expanded} collapsedSize={expanded ? "auto" : 120}>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 pr-2">
                    {featuresList.map((feature, index) => (
                        <li key={index} className="leading-relaxed">
                          {feature}
                        </li>
                    ))}
                  </ul>
                </Collapse>
              </div>
          )}

          {showMoreButton && (
              <Button
                  onClick={toggleExpand}
                  className="self-start mt-3 text-blue-600 font-medium hover:text-blue-800 transition-colors"
                  endIcon={expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              >
                {expanded ? "نمایش کمتر" : "نمایش بیشتر"}
              </Button>
          )}
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            تأیید حذف پلن
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              آیا مطمئن هستید که می‌خواهید پلن "{title}" را حذف کنید؟ این عمل قابل برگشت نیست.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={isDeleting}>
              لغو
            </Button>
            <Button
                onClick={handleDeleteConfirm}
                color="error"
                variant="contained"
                disabled={isDeleting}
            >
              {isDeleting ? "در حال حذف..." : "حذف"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        {editDialogOpen && (
            <AddBundle
                editData={editData}
                onBundleEdited={handleBundleEdited}
                onClose={() => setEditDialogOpen(false)}
            />
        )}
      </>
  )
}

export default BundleCard