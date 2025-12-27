/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import ImageKit from "imagekit-javascript";
import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import colors from "assets/theme/base/colors";

import ImageCropDialog from "./ImageCropDialog";
import { getCroppedImage } from "utils/cropImage";
import { validateImageFile, validateImageSize } from "utils/imageValidation";

const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_APP_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_APP_IMAGEKIT_URL_ENDPOINT,
  authenticationEndpoint: `${import.meta.env.VITE_APP_API_URL}/imageKit`,
});

function ImageUpload({ setUrlImage }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [openCrop, setOpenCrop] = useState(false);

  const handleSelectFile = (e) => {
    const file = e.target.files?.[0];
    const error = validateImageFile(file);

    if (error) {
      Swal.fire({
        icon: "warning",
        title: "Imagen inválida",
        text: error,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const sizeError = validateImageSize(img);
        if (sizeError) {
          Swal.fire({
            icon: "warning",
            title: "Imagen demasiado pequeña",
            text: sizeError,
          });
          return;
        }

        setRawImage(reader.result);
        setOpenCrop(true);
      };
    };

    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async (croppedAreaPixels) => {
    try {
      setLoading(true);
      setOpenCrop(false);

      const croppedFile = await getCroppedImage(rawImage, croppedAreaPixels);

      const res = await imagekit.upload({
        file: croppedFile,
        fileName: "product.png",
      });

      setUrlImage(res.url);

      Swal.fire({
        icon: "success",
        title: "Imagen subida",
        text: "La imagen se subió correctamente",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error al subir imagen",
        text: "Ocurrió un problema al procesar la imagen",
      });
    } finally {
      setLoading(false);
      setRawImage(null);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        hidden
        onChange={handleSelectFile}
      />

      <LoadingButton
        fullWidth
        variant="outlined"
        loading={loading}
        startIcon={<FileUploadIcon />}
        onClick={() => inputRef.current.click()}
        sx={{
          mt: 1,
          color: colors.info.main,
          height: "44px",
          borderColor: colors.info.main,
          "&:hover": {
            borderColor: colors.info.main,
          },
        }}
      >
        Subir imagen
      </LoadingButton>

      <ImageCropDialog
        open={openCrop}
        imageSrc={rawImage}
        onCancel={() => setOpenCrop(false)}
        onConfirm={handleCropConfirm}
      />
    </>
  );
}

export default ImageUpload;
