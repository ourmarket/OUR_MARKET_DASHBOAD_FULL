export const validateImageFile = (file) => {
  if (!file) {
    return "No se seleccionó ninguna imagen";
  }

  if (!["image/jpeg", "image/png"].includes(file.type)) {
    return "Formato inválido. Solo JPG o PNG";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "La imagen no puede superar los 5MB";
  }

  return null;
};

export const validateImageSize = (image) => {
  if (image.width < 500 || image.height < 500) {
    return "La imagen debe tener un tamaño mínimo de 500x500 px";
  }
  return null;
};
