import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ViewMenuCTA() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        mt: 8,
        p: 6,
        borderRadius: 5,
        textAlign: "center",
        background: "linear-gradient(135deg, #16a34a, #22c55e)",
        color: "#fff",
        boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={800}
        gutterBottom
      >
        🍽️ Want to Explore More?
      </Typography>

      <Typography
        sx={{
          maxWidth: 600,
          mx: "auto",
          mb: 4,
          opacity: 0.95,
        }}
      >
        Explore our complete menu with delicious gravies, rice,
        starters and many more dishes prepared fresh every day.
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate("/menu")}
        sx={{
          bgcolor: "#fff",
          color: "#16a34a",
          px: 5,
          py: 1.5,
          borderRadius: "30px",
          fontWeight: 700,
          fontSize: 18,
          textTransform: "none",
          "&:hover": {
            bgcolor: "#f3f4f6",
          },
        }}
      >
        🍽️ View Full Menu
      </Button>
    </Box>
  );
}