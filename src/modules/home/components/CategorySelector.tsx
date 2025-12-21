import { Box } from "@mui/material";

export default function CategorySelector({
  categories,
  selected,
  onToggle,
}: {
  categories: string[];
  selected: string[];
  onToggle: (cat: string) => void;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridAutoFlow: "column",   
        gridTemplateRows: "repeat(2, auto)", 
        gap: 1.5,
        mb: 5,
        overflowX: "auto",        
        pb: 1,
      }}
    >
      {["ALL", ...categories].map((cat) => {
        const active = selected.includes(cat);
        return (
          <Box
            key={cat}
            onClick={() => onToggle(cat)}
            sx={{
                px: 2.5,
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
                whiteSpace: "nowrap", 
                bgcolor: active ? "#12C998" : "#f3f3f3",
                color: active ? "#000" : "#555",
                transition: "all 0.2s ease",
                "&:hover": {
                    bgcolor: active ? "#12C998" : "#e0e0e0",
                },
            }}
          >
            {cat}
          </Box>
        );
      })}
    </Box>
  );
}
