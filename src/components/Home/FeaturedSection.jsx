import { Box, Typography, TextField, Chip, Stack } from "@mui/material";
import FoodGrid from "./FoodGrid";

export default function FeaturedSection() {
  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        py: 8,
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography
   
        sx={{
          color: "#f59e0b",
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          fontSize: 14,
          mb: 1,
        }}
      >
        CHEF'S SPECIAL  
      </Typography>

      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          mb: 2,
        }}
      >
        Featured Dishes
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          maxWidth: 600,
          mx: "auto",
        }}
      >
        Our most loved dishes, freshly prepared every day using premium
        ingredients and authentic recipes.

      </Typography>
<TextField
  fullWidth
  placeholder="🔍 Search your favourite dish..."
  variant="outlined"
  sx={{
    mt: 5,
    maxWidth: 700,
    mx: "auto",
    display: "flex",
    "& .MuiOutlinedInput-root": {
      borderRadius: "50px",
      background: "#fff",
      boxShadow: "0 8px 30px rgba(0,0,0,.08)",
      height: 58,
    },
  }}
/>
<Stack
  direction="row"
  spacing={2}
  justifyContent="center"
  flexWrap="wrap"
  sx={{
    mt: 4,
    gap: 1,
  }}
>
  <Chip label="🍽 All" color="warning" clickable />
  <Chip label="🍛 Gravy" clickable />
  <Chip label="🍚 Rice" clickable />
  <Chip label="🍗 Starters" clickable />
</Stack>
<FoodGrid />
</Box>

  );
}