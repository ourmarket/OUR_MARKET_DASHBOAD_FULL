/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { MenuItem, Popover } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useDeleteCashierSessionMutation } from "api/apiCashierSession";

function MenuTable({ open, handleCloseMenu, sessionId }) {
  const navigate = useNavigate();

  const [deleteSession, { isError, isSuccess }] =
    useDeleteCashierSessionMutation();

  const handlerDelete = () => {
    handleCloseMenu();
    Swal.fire({
      title: "Deseas borrar esta sesión de caja?",
      text: "Atención, estos cambios son irreversibles",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteSession(sessionId).unwrap();
      }
    });
  };

  useEffect(() => {
    if (isError)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error, sesión de caja no borrada",
        showConfirmButton: false,
        timer: 2500,
      });
  }, [isError]);
  useEffect(() => {
    if (isSuccess)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Sesión de caja borrada con éxito",
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
          width: 170,
          zIndex: 20,
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
          },
        },
      }}
    >
      <MenuItem onClick={() => navigate(`/ventas/${sessionId}`)}>
        <EditIcon sx={{ mr: 1 }} />
        Ver sesión
      </MenuItem>
      {/*   <MenuItem onClick={() => navigate(`/ventas`)}>
        <EditIcon sx={{ mr: 1 }} />
        Ver cajero
      </MenuItem> */}
      <MenuItem sx={{ color: "error.main" }} onClick={handlerDelete}>
        <DeleteIcon sx={{ mr: 1 }} />
        Borrar sesión
      </MenuItem>
    </Popover>
  );
}

export default MenuTable;
