/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { MenuItem, Popover } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useDeleteNegocioMutation } from "api/apiNegocio";
import VisibilityIcon from "@mui/icons-material/Visibility";

function MenuListNegocios({ open, handleCloseMenu, negocioId }) {
  const navigate = useNavigate();

  const [deleteNegocio, { isError, isSuccess }] = useDeleteNegocioMutation()

  const handlerDelete = () => {
    handleCloseMenu();
    Swal.fire({
      title: "Deseas borrar este Negocio?",
      text: "Este cambio no se puede revertir",
      icon: "danger",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteNegocio(negocioId).unwrap();
      }
    });
  };

  useEffect(() => {
    if (isError)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error, negocio no borrado",
        showConfirmButton: false,
        timer: 2500,
      });
  }, [isError]);
  useEffect(() => {
    if (isSuccess)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Negocio borrado con éxito",
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
          width: 160,
          zIndex: 20,
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
          },
        },
      }}
    >
      <MenuItem onClick={() => navigate(`/negocios/detalle/${negocioId}`)}>
        <VisibilityIcon sx={{ mr: 1 }} />
        Ver negocio
      </MenuItem>
      <MenuItem onClick={() => navigate(`/negocios/editar/${negocioId}`)}>
        <EditIcon sx={{ mr: 1 }} />
        Editar negocio
      </MenuItem>

      <MenuItem sx={{ color: "error.main" }} onClick={handlerDelete}>
        <DeleteIcon sx={{ mr: 1 }} />
        Borrar negocio
      </MenuItem>
    </Popover>
  );
}

export default MenuListNegocios;
