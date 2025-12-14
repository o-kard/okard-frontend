"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Box,
  Typography,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EventIcon from "@mui/icons-material/Event";
import CategoryIcon from "@mui/icons-material/Category";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

type PredictResultDialogProps = {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  result: Record<string, any> | null;
};

export default function PredictResultDialog({
  open,
  onClose,
  loading,
  result,
}: PredictResultDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            height: "50vh",
            border: "2px solid black",
            borderRadius: "16px",
            boxShadow: 4,
          },
        },
      }}
    >
      <DialogTitle variant="h4" fontWeight="bold">
        Insight & Prediction
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#000",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={6}>
            <CircularProgress />
            <Typography mt={2}>Processing your prediction...</Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" justifyContent="space-between" flex={1}>
            <Divider sx={{ borderBottom: "2px solid #eee" }} />
            {[
              { key: "success_cls", label: "Success or Fail", icon: <CheckCircleOutlineIcon /> },
              { key: "risk_level", label: "Risk Level", icon: <ErrorOutlineIcon /> },
              { key: "days_to_state_change", label: "State Change In", icon: <EventIcon /> },
              // { key: "recommend_category", label: "Category", icon: <CategoryIcon /> },
              { key: "goal_eval", label: "Goal Evaluation", icon: <TrackChangesIcon /> },
              { key: "stretch_potential_cls", label: "Pledge Stretch Potential", icon: <CompareArrowsIcon /> },
            ].map((item) => {
              const val = result?.[item.key];
              const label = val?.label ?? "-";
              const confidence = val?.confidence;
              return (
                <Box
                  key={item.key}
                  display="flex"
                  alignItems="center"
                  py={2.5}
                  sx={{ borderBottom: "2px solid #eee" }}
                >
                  {/* icon + label */}
                  <Box display="flex" alignItems="center" gap={1} flex={1.2}>
                    {item.icon}
                    <Typography fontWeight={500}>{item.label}</Typography>
                  </Box>

                  {/* PREDICT */}
                  <Box flex={0.6} display="flex" justifyContent="center">
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="teal"
                      sx={{ letterSpacing: 1 }}
                    >
                      PREDICT
                    </Typography>
                  </Box>

                  {/* Result */}
                  <Box flex={1} textAlign="right">
                    <Typography fontWeight="bold">{label}</Typography>
                  </Box> 

                  {/* Confidence */}
                  {/* <Box flex={0.6} textAlign="right">
                    {confidence !== undefined && (
                      <Typography variant="body2" color="text.secondary">
                        {(confidence * 100).toFixed(1)}%
                      </Typography>
                    )}
                  </Box> */}
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
