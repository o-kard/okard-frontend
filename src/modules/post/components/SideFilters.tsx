// src/modules/explore/SideFilters.tsx
"use client";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItemButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
} from "@mui/material";

type Timing = "all" | "draft" | "published" | "archived";
type ViewMode = "popular" | "recommended"
type CategoryOption = { value: string; label: string };

type Props = {
  categories: CategoryOption[];
  selectedCategory: string;
  onSelectCategory: (v: string) => void;
  timing: Timing;
  onTimingChange: (v: Timing) => void;
  includeClosed: boolean;
  onToggleClosed: (v: boolean) => void;
  viewMode: ViewMode
  onViewModeChange: (v: ViewMode) => void
  onClear?: () => void;
};

export default function SideFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  timing,
  onTimingChange,
  includeClosed,
  onToggleClosed,
  onViewModeChange,
  viewMode,
  onClear,
}: Props) {
  return (
    <Box
      sx={{
        p: 2,
        position: { md: "sticky" },
        // width: "100%",
        // top: { md: 88 },
        // alignSelf: "start",
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        Filter Results
      </Typography>

      <Typography variant="overline" color="text.secondary">
        View Mode
      </Typography>
      <RadioGroup value={viewMode} onChange={(e) => onViewModeChange(e.target.value as ViewMode)}>
        <FormControlLabel value="popular" control={<Radio />} label="Popular Campaigns" />
        <FormControlLabel value="recommended" control={<Radio />} label="Recommended For You" />
      </RadioGroup>

      <Divider sx={{ my: 2 }} />

      <Typography variant="overline" color="text.secondary">
        Category
      </Typography>
      <List dense sx={{ mb: 2 }}>
        <ListItemButton
          selected={selectedCategory === "all"}
          onClick={() => onSelectCategory("all")}
        >
          All Categories
        </ListItemButton>
        {categories.map((c) => (
          <ListItemButton
            key={c.value}
            selected={selectedCategory === c.value}
            onClick={() => onSelectCategory(c.value)}
          >
            {c.label}
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="overline" color="text.secondary">
        Campaign timing
      </Typography>
      <RadioGroup
        value={timing}
        onChange={(e) => onTimingChange(e.target.value as Timing)}
      >
        <FormControlLabel value="all" control={<Radio />} label="All" />
        <FormControlLabel value="draft" control={<Radio />} label="Draft" />
        <FormControlLabel
          value="published"
          control={<Radio />}
          label="Published"
        />
        <FormControlLabel
          value="archived"
          control={<Radio />}
          label="Archived"
        />
      </RadioGroup>

      <FormGroup sx={{ mt: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeClosed}
              onChange={(e) => onToggleClosed(e.target.checked)}
            />
          }
          label="Include closed campaigns"
        />
      </FormGroup>

      {onClear && (
        <Button onClick={onClear} variant="text" size="small" sx={{ mt: 1 }}>
          Clear filters
        </Button>
      )}
    </Box>
  );
}
