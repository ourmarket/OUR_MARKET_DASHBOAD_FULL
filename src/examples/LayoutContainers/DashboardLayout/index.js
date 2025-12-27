/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import { useMaterialUIController, setLayout } from "context";
import { Box } from "@mui/system";
import Footer from "examples/Footer";
import { useDispatch, useSelector } from "react-redux";
import { hideFeedback } from "reduxToolkit/uiSlice";
import MDSnackbar from "components/MDSnackbar";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  const dispatch1 = useDispatch();
  const { feedback } = useSelector((state) => state.ui);

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        pb: 2,
        position: "relative",

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      <Box sx={{ minHeight: "90vh" }}>{children}</Box>
      {feedback && feedback.open && (
        <MDSnackbar
          open={feedback.open}
          color={feedback.color}
          icon={feedback.icon}
          title={feedback.title}
          content={feedback.content}
          dateTime={feedback.dateTime}
          close={() => dispatch1(hideFeedback())}
          sx={{
            zIndex: (theme) => theme.zIndex.modal + 999999999999,
          }}
        />
      )}
      <Footer />
    </MDBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
