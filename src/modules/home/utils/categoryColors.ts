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

export const CATEGORY_COLORS: Record<string, { label: string; color: string; icon?: any }> = {
  all: {
    label: "ALL",
    color: "#90A4AE",
    icon: null,
  },
  art: {
    label: "Art",
    color: "#F48FB1",
    icon: PaletteIcon,
  },
  comics: {
    label: "Comics",
    color: "#B39DDB",
    icon: AutoStoriesIcon,
  },
  crafts: {
    label: "Crafts",
    color: "#FFCC80",
    icon: ContentCutIcon,
  },
  dance: {
    label: "Dance",
    color: "#CE93D8",
    icon: SelfImprovementIcon,
  },
  design: {
    label: "Design",
    color: "#80CBC4",
    icon: DesignServicesIcon,
  },
  fashion: {
    label: "Fashion",
    color: "#F8BBD0",
    icon: CheckroomIcon,
  },
  filmVideo: {
    label: "Film & Video",
    color: "#90CAF9",
    icon: MovieIcon,
  },
  food: {
    label: "Food",
    color: "#AED581",
    icon: RestaurantIcon,
  },
  games: {
    label: "Games",
    color: "#9FA8DA",
    icon: SportsEsportsIcon,
  },
  journalism: {
    label: "Journalism",
    color: "#B0BEC5",
    icon: NewspaperIcon,
  },
  music: {
    label: "Music",
    color: "#DCE775",
    icon: MusicNoteIcon,
  },
  photography: {
    label: "Photography",
    color: "#BCAAA4",
    icon: CameraAltIcon,
  },
  publishing: {
    label: "Publishing",
    color: "#FFE082",
    icon: AutoStoriesIcon,
  },
  technology: {
    label: "Technology",
    color: "#81D4FA",
    icon: ComputerIcon,
  },
  theater: {
    label: "Theater",
    color: "#FFAB91",
    icon: TheaterComedyIcon,
  },
};

export const CATEGORIES_LIST = Object.entries(CATEGORY_COLORS)
  .filter(([key]) => key !== "all")
  .map(([key, value]) => ({
    label: value.label,
    value: key,
    icon: value.icon,
    color: value.color,
  }));
