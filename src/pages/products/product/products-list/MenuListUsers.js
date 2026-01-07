/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { MenuItem, Popover } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useDeleteProductMutation } from "api/productApi";
import Swal from "sweetalert2";
import { useEffect } from "react";
import colors from "assets/theme/base/colors";

function MenuListProducts({ open, handleCloseMenu, productId }) {
  const navigate = useNavigate();

  const [deleteProduct, { isError, isSuccess }] = useDeleteProductMutation();

  const handlerDelete = () => {
    handleCloseMenu();
    Swal.fire({
      title: "¿Deseas borrar este producto?",
      text: "Se realizará un borrado lógico (quedará oculto). Por favor, indique el motivo:",
      icon: "warning",
      input: "text",
      inputPlaceholder: "Ej: Producto descatalogado, error de carga...",
      showCancelButton: true,
      confirmButtonColor: colors.info.main,
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar Borrado",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "¡Debes escribir un motivo para el historial!";
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct({ id: productId, reason: result.value }).unwrap();
        } catch (error) {
          // El error se maneja en el useEffect
        }
      }
    });
  };
  useEffect(() => {
    if (isError)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error, producto no borrado",
        showConfirmButton: false,
        timer: 2500,
      });
  }, [isError]);
  useEffect(() => {
    if (isSuccess)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Producto borrado con éxito",
        showConfirmButton: false,
        timer: 2500,
      });
  }, [isSuccess]);

  return (
    <Popover
      open={Boolean(open)}
      anchorEl={open}
      onClose={handleCloseMenu}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          p: 1,
          width: 200,
          zIndex: 20,
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
          },
        },
      }}
    >
      <MenuItem onClick={() => navigate(`/productos/detalle/${productId}`)}>
        <EditIcon sx={{ mr: 1 }} />
        Ver/Editar producto
      </MenuItem>

      <MenuItem sx={{ color: "error.main" }} onClick={handlerDelete}>
        <DeleteIcon sx={{ mr: 1 }} />
        Borrar producto
      </MenuItem>
    </Popover>
  );
}

export default MenuListProducts;
