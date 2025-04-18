import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import {
  Button,
  TextField,
  FormControl,
  FormHelperText,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { fileToBase64, FileUtils } from "@/utils/file-utils";

// Define the form schema with zod
const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
  banner: z.string().optional(),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        content: z.string(), // Base64 content
        size: z.number(),
      })
    )
    .optional(),
});

function ServiceForm({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      banner: "",
      attachments: [],
    },
  });

  const attachments = watch("attachments") || [];

  const handleBannerChange = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Preview the image
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);

      // Convert to base64
      const base64 = await fileToBase64(file);
      setValue("banner", base64);
    } catch (error) {
      console.error("Error processing banner:", error);
      setNotification({
        open: true,
        message: "Failed to process banner image",
        severity: "error",
      });
    }
  };

  const handleAttachmentsChange = async (event) => {
    try {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      // Convert files to base64
      const base64Files = await Promise.all(
        files.map(async (file) => {
          const base64 = await fileToBase64(file);
          return {
            filename: file.name,
            contentType: file.type,
            content: base64,
            size: file.size,
          };
        })
      );

      // Add to existing attachments
      setValue("attachments", [...attachments, ...base64Files]);
    } catch (error) {
      console.error("Error processing attachments:", error);
      setNotification({
        open: true,
        message: "Failed to process attachment files",
        severity: "error",
      });
    }
  };

  const removeAttachment = (index) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setValue("attachments", updatedAttachments);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Send the data to the server
      const response = await axios.post("/service", data);

      // Reset the form
      reset();
      setBannerPreview(null);

      // Show success notification
      setNotification({
        open: true,
        message: "Service created successfully",
        severity: "success",
      });

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("Error creating service:", error);

      // Show error notification
      setNotification({
        open: true,
        message: "Failed to create service",
        severity: "error",
      });

      // Call the error callback if provided
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create New Service
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Service Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Banner Image
              </Typography>

              <input
                accept="image/*"
                style={{ display: "none" }}
                id="banner-upload"
                type="file"
                onChange={handleBannerChange}
              />

              <label htmlFor="banner-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Banner
                </Button>
              </label>

              {bannerPreview && (
                <Box sx={{ mt: 2 }}>
                  <Card>
                    <CardContent>
                      <img
                        src={bannerPreview}
                        alt="Banner Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          objectFit: "contain",
                        }}
                      />
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Attachments
              </Typography>

              <input
                accept="*/*"
                style={{ display: "none" }}
                id="attachments-upload"
                type="file"
                multiple
                onChange={handleAttachmentsChange}
              />

              <label htmlFor="attachments-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Attachments
                </Button>
              </label>

              {attachments.length > 0 && (
                <List sx={{ mt: 2 }}>
                  {attachments.map((file, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={file.filename}
                        secondary={FileUtils.formatFileSize(file.size)}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => removeAttachment(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Create Service"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
      >
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default ServiceForm;
