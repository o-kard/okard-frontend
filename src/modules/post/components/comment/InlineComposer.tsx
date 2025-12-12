import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

type InlineComposerProps = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  submitting?: boolean;
  autoFocus?: boolean;
};

export default function InlineComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "Write a comment…",
  submitting,
  autoFocus,
}: InlineComposerProps) {
  const disabled = submitting || !value.trim();
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      alignItems={{ sm: "center" }}
    >
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onKeyDown={(e) => {
          if (!e.shiftKey && e.key === "Enter" && !disabled) {
            onSubmit();
          }
        }}
      />
      <Button
        variant="contained"
        endIcon={submitting ? <CircularProgress size={16} /> : <SendIcon />}
        disabled={disabled}
        onClick={onSubmit}
        sx={{ fontWeight: 800 }}
      >
        Send
      </Button>
    </Stack>
  );
}