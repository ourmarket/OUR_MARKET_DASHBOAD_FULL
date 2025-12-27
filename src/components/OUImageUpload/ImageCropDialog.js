/* eslint-disable react/prop-types */
import { useState } from "react";
import Cropper from "react-easy-crop";
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Slider, 
  Typography, 
  Box, 
  Stack,
  Divider 
} from "@mui/material";

// Componentes del tema
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

// Iconos
import CropIcon from "@mui/icons-material/Crop";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import CloseIcon from "@mui/icons-material/Close";

function ImageCropDialog({ open, imageSrc, onCancel, onConfirm }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  return (
    <Dialog 
      open={open} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: "16px", overflow: "hidden" }
      }}
    >
      {/* CABECERA */}
      <MDBox 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        p={3}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <CropIcon color="info" />
          <MDTypography variant="h6" fontWeight="medium">
            Recortar Producto
          </MDTypography>
        </Stack>
        <Typography 
          variant="caption" 
          color="text" 
          sx={{ cursor: "pointer" }} 
          onClick={onCancel}
        >
          <CloseIcon fontSize="small" />
        </Typography>
      </MDBox>
      
      <Divider sx={{ m: 0 }} />

      {/* ÁREA DE RECORTE */}
      <DialogContent sx={{ position: "relative", height: 400, p: 0, bgcolor: "#1a1a1a" }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1} // Formato cuadrado para productos
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
          showGrid={true}
        />
      </DialogContent>

      {/* CONTROLES Y ACCIONES */}
      <MDBox p={3}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Ajustar Zoom
        </MDTypography>
        
        <Stack direction="row" spacing={2} alignItems="center" mb={3} mt={1}>
          <ZoomOutIcon color="secondary" />
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e, zoomValue) => setZoom(zoomValue)}
            color="info"
          />
          <ZoomInIcon color="secondary" />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <MDButton 
            variant="text" 
            color="secondary" 
            onClick={onCancel}
            sx={{ px: 3 }}
          >
            Cancelar
          </MDButton>
          <MDButton
            variant="gradient"
            color="info"
            startIcon={<CropIcon />}
            onClick={() => onConfirm(croppedAreaPixels)}
            sx={{ px: 4 }}
          >
            Confirmar Recorte
          </MDButton>
        </Box>
      </MDBox>
    </Dialog>
  );
}

export default ImageCropDialog;