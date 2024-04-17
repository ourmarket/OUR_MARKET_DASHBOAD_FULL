/* eslint-disable react/prop-types */
import { MenuItem, Popover } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function MenuChart3({ open, handleCloseMenu, years, setSelectYear }) {
  const handleYear = (selectYear) => {
    setSelectYear(selectYear);
  };

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
          width: 100,
          zIndex: 20,
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
          },
        },
      }}
    >
      {years.map((year) => (
        <MenuItem key={year} onClick={() => handleYear(year)}>
          <CalendarMonthIcon sx={{ mr: 1 }} />
          {year}
        </MenuItem>
      ))}
    </Popover>
  );
}

export default MenuChart3;
