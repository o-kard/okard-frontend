import { Box, Typography } from "@mui/material";
import { CATEGORIES_LIST } from "../utils/categoryColors";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CategoryTabs({ value, onChange }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        gap: { xs: 1, md: 0.5 },
        borderBottom: "1px solid #ddd",
        pb: 2,
        mb: 4,
        flexWrap: "nowrap",
        overflowX: "auto",
        px: { xs: 0.5, md: 0 },
        // Minimal Scrollbar Styling
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#e0e0e0",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "#bdbdbd",
          }
        },
        // Firefox
        scrollbarWidth: "thin",
        scrollbarColor: "#e0e0e0 transparent",
      }}
    >
      {CATEGORIES_LIST.map((cat) => {
        const Icon = cat.icon;
        const isActive = value === cat.value;

        return (
          <Box
            key={cat.value}
            onClick={() => onChange(cat.value)}
            sx={{
              textAlign: "center",
              cursor: "pointer",
              color: isActive ? "#f06292" : "#000",
              userSelect: "none",
              transition: "color 0.18s ease",
              minWidth: 70, // Allow width to adjust based on content
              px: 0.5,
              "&:hover": {
                color: "rgba(240,98,146,0.6)",
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1,
              }}
            >
              <Icon sx={{ fontSize: 24 }} />
            </Box>

            <Typography fontSize="0.75rem" sx={{ whiteSpace: "nowrap" }}>
              {cat.label}
            </Typography>

            {isActive && (
              <Box
                sx={{
                  mt: 1,
                  height: 4,
                  width: 48,
                  mx: "auto",
                  borderRadius: 2,
                  background:
                    "linear-gradient(to right, #f06292, #ff9a9e)",
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}
