/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useMaterialUIController } from "context";

const STORAGE_PREFIX = "datagrid_state_";

function DataGridProReusable({
  processRowUpdate,
  rows,
  columns,
  getRowId,
  loading = false,
  storageKey,
  pageSize = 10,
  onRowDoubleClick,
  onBulkAction,
  error,
}) {
  const apiRef = useGridApiRef();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [rowModesModel, setRowModesModel] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);
  const [gridState, setGridState] = useState(null);

  /* ---------------- Persistencia ---------------- */
  useEffect(() => {
    if (!storageKey) return;
    const saved = localStorage.getItem(STORAGE_PREFIX + storageKey);
    if (saved) {
      setGridState(JSON.parse(saved));
    }
  }, [storageKey]);

  const handleStateChange = (state) => {
    if (!storageKey) return;
    localStorage.setItem(STORAGE_PREFIX + storageKey, JSON.stringify(state));
  };

  /* ---------------- Bulk actions ---------------- */
  useEffect(() => {
    if (onBulkAction) {
      onBulkAction(selectionModel);
    }
  }, [selectionModel, onBulkAction]);

  const enhancedColumns = columns.map((col) =>
    col.field === "actions"
      ? {
          ...col,
          renderCell: (params) =>
            col.renderCell({
              params,
              apiRef,
            }),
        }
      : col
  );

  const handleProcessRowUpdateError = (err) => {
    console.error("Row update error:", err);
  };

  return (
    <Box
      height="75vh"
      sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": {
          borderBottom: darkMode ? "1px solid #384158" : "1px solid #f0f2f5",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: darkMode ? "#1f283e" : "#f8f9fa",
          borderBottom: "none",
        },
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: darkMode ? "#1f283e" : "#f8f9fa",
          borderTop: "none",
        },
      }}
    >
      <DataGrid
        onProcessRowUpdateError={(err) => handleProcessRowUpdateError(err)}
        experimentalFeatures={{ newEditingApi: true }}
        loading={loading}
        apiRef={apiRef}
        rows={rows}
        columns={enhancedColumns}
        getRowId={getRowId}
        checkboxSelection
        disableSelectionOnClick
        /* ----------- UX ----------- */
        density="standard"
        onRowDoubleClick={onRowDoubleClick}
        /* ----------- Persistencia ----------- */
        initialState={gridState}
        onStateChange={handleStateChange}
        /* ----------- Edición profesional ----------- */
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        onRowEditStop={(params, event) => {
          if (params.reason === "rowFocusOut") {
            event.defaultMuiPrevented = true;
          }
        }}
        processRowUpdate={processRowUpdate}
        /* ----------- Selección ----------- */
        onRowSelectionModelChange={(ids) => setSelectionModel(ids)}
        /* ----------- Toolbars y overlays ----------- */
        slots={{
          toolbar: GridToolbar,
          noRowsOverlay: () => (
            <Typography sx={{ p: 2 }}>No hay datos disponibles</Typography>
          ),
          noResultsOverlay: () => (
            <Typography sx={{ p: 2 }}>No se encontraron resultados</Typography>
          ),
        }}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Box>
  );
}

export default DataGridProReusable;
