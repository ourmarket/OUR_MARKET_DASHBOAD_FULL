/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { MenuItem, Popover } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useDeleteClientSimpleMutation } from "api/clientsApi";

function MenuClients({ open, handleCloseMenu, menuId }) {
  const navigate = useNavigate();

  const [deleteClient, { isError, isSuccess }] =
    useDeleteClientSimpleMutation();

  const handlerDelete = () => {
    handleCloseMenu();
    Swal.fire({
      title: "Deseas borrar este cliente?",
      text: "También borraras el usuario y todas las direcciones asociadas",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteClient(menuId).unwrap();
      }
    });
  };

  useEffect(() => {
    if (isError)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error, Cliente no borrado",
        showConfirmButton: false,
        timer: 2500,
      });
  }, [isError]);
  useEffect(() => {
    if (isSuccess)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cliente borrado con éxito",
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
      <MenuItem onClick={() => navigate(`/clientes/detalle/${menuId}`)}>
        <EditIcon sx={{ mr: 1 }} />
        Ver cliente
      </MenuItem>
      <MenuItem onClick={() => navigate(`/clientes/editar/${menuId}`)}>
        <EditIcon sx={{ mr: 1 }} />
        Editar cliente
      </MenuItem>

      <MenuItem sx={{ color: "error.main" }} onClick={handlerDelete}>
        <DeleteIcon sx={{ mr: 1 }} />
        Borrar cliente
      </MenuItem>
    </Popover>
  );
}

export default MenuClients;
