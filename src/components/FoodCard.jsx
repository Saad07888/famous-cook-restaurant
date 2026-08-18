import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export default function FoodCard({ item, onAdd }) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          image={item.image}
          alt={item.name}
          sx={{
            aspectRatio: "4/3",
            objectFit: "cover",
            transition: "transform .5s ease",
            "&:hover": {
              transform: "scale(1.08)",
            },
          }}
        />

        <Chip
          label="⭐ Bestseller"
          size="small"
          icon={<StarIcon />}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "white",
            fontWeight: 700,
          }}
        />
      </Box>

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Typography
          fontWeight={700}
          fontSize={20}
          gutterBottom
        >
          {item.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            minHeight: 42,
            mb: 2,
          }}
        >
          Freshly prepared with premium ingredients.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              color: "#16A34A",
              fontSize: 18,
            }}
          >
            ₹{item.priceHalf}
          </Typography>

          <Typography
            sx={{
              color: "#666",
              fontSize: 14,
            }}
          >
            Full ₹{item.priceFull}
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{
            mt: "auto",
            height: 54,
            borderRadius: 50,
            fontWeight: 700,
            fontSize: 16,
            textTransform: "none",
            background: "#16A34A",
            transition: "all .3s ease",
            "&:hover": {
              background: "#15803D",
              transform: "scale(1.03)",
            },
          }}
          onClick={() => onAdd(item)}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}