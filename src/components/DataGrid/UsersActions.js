/* eslint-disable react/prop-types */
import { Box, Fab } from "@mui/material";
import { Save, Close, Edit } from "@mui/icons-material";
import { GridRowModes } from "@mui/x-data-grid";

function UsersActions({ params, apiRef }) {
  const rowId = params.id;
  const rowMode = apiRef.current.getRowMode(rowId);
  const isEditing = rowMode === GridRowModes.Edit;

  const handleEdit = () => {
    apiRef.current.startRowEditMode({ id: rowId });
  };

  const handleSave = () => {
    // 🔥 ESTO dispara processRowUpdate
    apiRef.current.stopRowEditMode({ id: rowId });
  };

  const handleCancel = () => {
    apiRef.current.stopRowEditMode({
      id: rowId,
      ignoreModifications: true,
    });
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {!isEditing && (
        <Fab size="small" color="primary" onClick={handleEdit}>
          <Edit />
        </Fab>
      )}

      {isEditing && (
        <>
          <Fab size="small" onClick={handleSave}>
            <Save />
          </Fab>

          <Fab size="small" color="secondary" onClick={handleCancel}>
            <Close />
          </Fab>
        </>
      )}
    </Box>
  );
}

export default UsersActions;
