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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void
  onClear?: () => void;
  sort?: string;
  onSortChange?: (v: string) => void;
};

export default function SideFilters(props: Props) {
  const {
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
  } = props;

  return (
    <Box
      sx={{
        p: 2,
        position: { md: "sticky" },
      }}
    >
      <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
        Feed Options
      </Typography>

      <RadioGroup value={viewMode} onChange={(e) => onViewModeChange(e.target.value as ViewMode)} sx={{ mb: 2 }}>
        <FormControlLabel value="popular" control={<Radio size="small" />} label={<Typography variant="body2">Explore All</Typography>} />
        <FormControlLabel value="recommended" control={<Radio size="small" />} label={<Typography variant="body2">For You</Typography>} />
      </RadioGroup>

      <Divider sx={{ my: 1 }} />

      {/* Sort Accordion */}
      <Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="body2" fontWeight={600}>Sort By</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <RadioGroup
            value={props.sort || "popular"}
            onChange={(e) => props.onSortChange?.(e.target.value)}
          >
            <FormControlLabel value="popular" control={<Radio size="small" />} label={<Typography variant="body2">Most Popular</Typography>} />
            <FormControlLabel value="newest" control={<Radio size="small" />} label={<Typography variant="body2">Newest</Typography>} />
            <FormControlLabel value="ending_soon" control={<Radio size="small" />} label={<Typography variant="body2">Ending Soon</Typography>} />
            <FormControlLabel value="updated" control={<Radio size="small" />} label={<Typography variant="body2">Recently Updated</Typography>} />
          </RadioGroup>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 1 }} />

      {/* Category Accordion */}
      <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="body2" fontWeight={600}>Category</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: 300, overflowY: 'auto', px: 0 }}>
          <List dense disablePadding>
            <ListItemButton
              selected={selectedCategory === "all"}
              onClick={() => onSelectCategory("all")}
              dense
            >
              All Categories
            </ListItemButton>
            {categories.map((c) => (
              <ListItemButton
                key={c.value}
                selected={selectedCategory === c.value}
                onClick={() => onSelectCategory(c.value)}
                dense
              >
                {c.label}
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 1 }} />

      {/* Status Accordion */}
      <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="body2" fontWeight={600}>Status & Timing</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <RadioGroup
            value={timing}
            onChange={(e) => onTimingChange(e.target.value as Timing)}
          >
            <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography variant="body2">All Status</Typography>} />
            <FormControlLabel value="draft" control={<Radio size="small" />} label={<Typography variant="body2">Draft</Typography>} />
            <FormControlLabel value="published" control={<Radio size="small" />} label={<Typography variant="body2">Published</Typography>} />
            <FormControlLabel value="archived" control={<Radio size="small" />} label={<Typography variant="body2">Archived</Typography>} />
          </RadioGroup>

          <Box mt={2}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={includeClosed}
                    onChange={(e) => onToggleClosed(e.target.checked)}
                  />
                }
                label={<Typography variant="body2">Include closed</Typography>}
              />
            </FormGroup>
          </Box>
        </AccordionDetails>
      </Accordion>

      {onClear && (
        <Button onClick={onClear} variant="outlined" size="small" fullWidth sx={{ mt: 3 }}>
          Clear All Filters
        </Button>
      )}
    </Box >
  );
}

