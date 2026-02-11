import { Chip, Box } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

interface CreatorBadgeProps {
    variant?: "full" | "icon";
}

export default function CreatorBadge({ variant = "full" }: CreatorBadgeProps) {
    if (variant === "icon") {
        return (
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #12c998 30%, #f070a1 90%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            >
                <VerifiedIcon sx={{ color: "white", fontSize: 20 }} />
            </Box>
        );
    }

    return (
        <Chip
            icon={<VerifiedIcon />}
            label="Creator"
            sx={{
                background: "linear-gradient(45deg, #12c998 30%, #f070a1 90%)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.9rem",
                px: 1,
                "& .MuiChip-icon": {
                    color: "white",
                },
            }}
        />
    );
}
