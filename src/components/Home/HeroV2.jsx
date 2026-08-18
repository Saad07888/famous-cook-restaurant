import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/images/rice.jpg";

export default function HeroV2() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background:
"linear-gradient(135deg,#121212 0%,#1d1d1d 50%,#0d0d0d 100%)",
        color: "#fff",
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          width: "100%",
          mx: "auto",
          px: { xs: 3, md: 6 },

          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* LEFT */}
        <Box>
          <Typography
            sx={{
              color: "#f59e0b",
              fontWeight: 700,
              letterSpacing: 3,
              mb: 2,
            }}
          >
            PREMIUM RESTAURANT
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 42, md: 64 },
              fontWeight: 900,
              lineHeight: 1.1,
              mb: 3,
            }}
          >
            Taste that
            <br />
            people remember.
          </Typography>

          <Typography
            sx={{
              color: "#d1d5db",
              fontSize: 18,
              maxWidth: 500,
              mb: 4,
            }}
          >
            Fresh ingredients, expert chefs and lightning-fast delivery.
            Experience premium dining at your doorstep.
          </Typography>

          <Stack
  direction={{ xs: "column", sm: "row" }}
  spacing={2}
>
  <Button
    variant="contained"
    sx={{
      background: "#16a34a",
      px: 4,
      py: 1.5,
      borderRadius: 50,
      textTransform: "none",
      fontWeight: 700,
      "&:hover": {
        background: "#15803d",
      },
    }}
  >
    Order Online
  </Button>

  <Button
    variant="outlined"
    onClick={() => navigate("/menu")}
    sx={{
      color: "#fff",
      borderColor: "#fff",
      px: 4,
      py: 1.5,
      borderRadius: 50,
      textTransform: "none",
      fontWeight: 700,
      "&:hover": {
        background: "rgba(255,255,255,.08)",
        borderColor: "#FFD54F",
        color: "#FFD54F",
      },
    }}
  >
    View Menu
  </Button>
</Stack>
        </Box>

        {/* RIGHT */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={heroImage}
            alt="Food"
            sx={{
            width: "100%",
maxWidth: 600,
objectFit: "cover",
transition: "0.4s",

"&:hover": {
  transform: "scale(1.03)",
},
              borderRadius: 8,
              boxShadow: "0 30px 80px rgba(0,0,0,.4)",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}