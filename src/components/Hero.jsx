import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import banner from "../assets/images/rice.jpg";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: { xs: 500, md: 580 },
        backgroundImage: `linear-gradient(rgba(0,0,0,.65), rgba(0,0,0,.65)), url(${banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
          px: { xs: 3, md: 5 },
          color: "#fff",
        }}
      >
        <Typography
          sx={{
            color: "#F59E0B",
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            mb: 2,
            fontSize: 14,
          }}
        >
          Premium Restaurant
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 42, md: 70 },
            fontWeight: 900,
            lineHeight: 1.05,
            maxWidth: 700,
            mb: 3,
            textShadow: "0 6px 25px rgba(0,0,0,.45)",
          }}
        >
          Taste That
          <br />
          People Remember.
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 18, md: 22 },
            color: "#E5E7EB",
            maxWidth: 620,
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Fresh ingredients, expert chefs and lightning-fast delivery.
          Experience premium dining with authentic flavours.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 5 }}
        >
          <Button
            variant="contained"
            sx={{
              background: "#16A34A",
              px: 5,
              py: 1.6,
              borderRadius: 50,
              textTransform: "none",
              fontWeight: 700,
              fontSize: 16,
              "&:hover": {
                background: "#15803D",
              },
            }}
          >
            🍽 Order Online
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/menu")}
            sx={{
              color: "#fff",
              borderColor: "#fff",
              px: 5,
              py: 1.6,
              borderRadius: 50,
              textTransform: "none",
              fontWeight: 700,
              fontSize: 16,
              "&:hover": {
                background: "rgba(255,255,255,.08)",
                borderColor: "#F59E0B",
                color: "#F59E0B",
              },
            }}
          >
            📖 View Menu
          </Button>
        </Stack>

        <Stack
          direction="row"
          spacing={4}
          flexWrap="wrap"
          sx={{
            color: "#F3F4F6",
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          <Typography>⭐ 4.8 Rating</Typography>
          <Typography>🚚 30 Min Delivery</Typography>
          <Typography>🍽 Freshly Cooked</Typography>
        </Stack>
      </Box>
    </Box>
  );
}

