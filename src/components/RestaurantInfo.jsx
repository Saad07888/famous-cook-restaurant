import { Box, Paper, Typography } from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const data = [
  {
    icon: <StarIcon sx={{ fontSize: 34, color: "#F59E0B" }} />,
    title: "4.8 Rating",
    subtitle: "500+ Happy Customers",
  },
  {
    icon: <DeliveryDiningIcon sx={{ fontSize: 34, color: "#16A34A" }} />,
    title: "30 Min",
    subtitle: "Fast Delivery",
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 34, color: "#2563EB" }} />,
    title: "Open Daily",
    subtitle: "6 PM - 11 PM",
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 34, color: "#EF4444" }} />,
    title: "Panvel",
    subtitle: "Navi Mumbai",
  },
];

export default function RestaurantInfo() {
  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: -4,
        px: 2,
        position: "relative",
        zIndex: 10,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          background: "#fff",
          boxShadow: "0 20px 60px rgba(0,0,0,.10)",
          overflow: "hidden",
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
          }}
        >
          {data.map((item, index) => (
            <Box
              key={item.title}
              sx={{
                p: 3,
                textAlign: "center",
                borderRight: {
                  md:
                    index !== data.length - 1
                      ? "1px solid #eee"
                      : "none",
                },
                borderBottom: {
                  xs:
                    index < 3
                      ? "1px solid #eee"
                      : "none",
                  sm:
                    index < 2
                      ? "1px solid #eee"
                      : "none",
                  md: "none",
                },
                transition: "all .3s ease",
"&:hover": {
  background: "#fafafa",
  transform: "translateY(-5px)",
},
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 1.5,
                }}
              >
                {item.icon}
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 20,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  color: "#6B7280",
                  fontSize: 14,
                  mt: .5,
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