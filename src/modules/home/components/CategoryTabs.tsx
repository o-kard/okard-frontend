import { Box, Typography } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import MovieIcon from "@mui/icons-material/Movie";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ComputerIcon from "@mui/icons-material/Computer";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";

export const CATEGORIES = [
  { label: "Art", value: "art", icon: PaletteIcon },
  { label: "Comics", value: "comics", icon: AutoStoriesIcon },
  { label: "Crafts", value: "crafts", icon: ContentCutIcon },
  { label: "Dance", value: "dance", icon: SelfImprovementIcon },
  { label: "Design", value: "design", icon: DesignServicesIcon },
  { label: "Fashion", value: "fashion", icon: CheckroomIcon },
  { label: "Film & Video", value: "filmVideo", icon: MovieIcon },
  { label: "Food", value: "food", icon: RestaurantIcon },
  { label: "Games", value: "games", icon: SportsEsportsIcon },
  { label: "Journalism", value: "journalism", icon: NewspaperIcon },
  { label: "Music", value: "music", icon: MusicNoteIcon },
  { label: "Photography", value: "photography", icon: CameraAltIcon },
  { label: "Publishing", value: "publishing", icon: AutoStoriesIcon },
  { label: "Technology", value: "technology", icon: ComputerIcon },
  { label: "Theater", value: "theater", icon: TheaterComedyIcon },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CategoryTabs({ value, onChange }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 4,
        borderBottom: "1px solid #ddd",
        pb: 2,
        mb: 4,
        flexWrap: "wrap",
      }}
    >
      {CATEGORIES.map((cat) => {
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
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </Box>

            <Typography fontSize="0.75rem">
              {cat.label}
            </Typography>

            {isActive && (
              <Box
                sx={{
                  mt: 1,
                  height: 4,
                  width: 32,
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
