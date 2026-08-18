import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

const stats = [
  {
    icon: "⭐",
    title: "4.8 Rating",
    subtitle: "500+ Happy Customers",
  },
  {
    icon: "🛵",
    title: "30 Min Delivery",
    subtitle: "Fast & Reliable",
  },
  {
    icon: "🕒",
    title: "Open Daily",
    subtitle: "6 PM - 11 PM",
  },
  {
    icon: "📍",
    title: "Panvel",
    subtitle: "Navi Mumbai",
  },
];

export default function RestaurantStats() {
  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: -6,
        position: "relative",
        zIndex: 10,
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: 4,
          p: 3,
          background: "#fff",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              md: "repeat(4,1fr)",
            },
            gap: 3,
          }}
        >
          {stats.map((item) => (
            <Box
              key={item.title}
              sx={{
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 34,
                  mb: 1,
                }}
              >
                {item.icon}
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  fontSize: 14,
                }}
              >
                {item.subtitle}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}