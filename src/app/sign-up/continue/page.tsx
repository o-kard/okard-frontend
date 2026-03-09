import { SignUp } from "@clerk/nextjs";
import { Box } from "@mui/material";

export default function SignUpContinuePage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <SignUp routing="path" path="/sign-up" />
    </Box>
  );
}
