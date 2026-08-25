import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Header from "../components/Header";
import { menuService } from "../services/api";
import { useCart } from "../context/CartContext";

/* =========================================================
   FALLBACK RESTAURANT MENU
   This keeps your premium 12-dish menu available even when
   the backend is empty or contains only a partial menu.
========================================================= */

const fallbackMenu = [
  {
    id: "1",
    name: "Chicken Tandoori",
    category: "Tandoor",
    priceHalf: 190,
    priceFull: 380,
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1000&q=85",
    rating: 4.9,
    bestseller: true,
    available: true,
    description:
      "Classic tandoori chicken marinated with aromatic spices and cooked to perfection.",
  },

  {
    id: "2",
    name: "Chicken Schezwan Tandoori",
    category: "Tandoor",
    priceHalf: 260,
    priceFull: 410,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=85",
    rating: 4.8,
    bestseller: false,
    available: true,
    description:
      "Juicy tandoori chicken with a spicy Schezwan twist.",
  },

  {
    id: "3",
    name: "Angara Kebab",
    category: "Tandoor",
    priceHalf: 300,
    priceFull: 300,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85",
    rating: 4.8,
    bestseller: true,
    available: true,
    description:
      "Smoky and spicy kebabs grilled in the traditional tandoor.",
  },

  {
    id: "4",
    name: "Manchurian Dry",
    category: "Starters",
    priceHalf: 120,
    priceFull: 220,
    image:
      "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1000&q=85",
    rating: 4.8,
    bestseller: true,
    available: true,
    description:
      "Crispy Manchurian bites coated in our rich house sauce.",
  },

  {
    id: "5",
    name: "Golden Dry",
    category: "Starters",
    priceHalf: 160,
    priceFull: 260,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=85",
    rating: 4.7,
    bestseller: false,
    available: true,
    description:
      "Golden fried starter with a crunchy exterior and delicious seasoning.",
  },

  {
    id: "6",
    name: "Chilly Dry",
    category: "Starters",
    priceHalf: 120,
    priceFull: 220,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=85",
    rating: 4.8,
    bestseller: true,
    available: true,
    description:
      "Crispy Indo-Chinese starter tossed with peppers and signature chilli sauce.",
  },

  {
    id: "7",
    name: "Fried Rice",
    category: "Rice",
    priceHalf: 100,
    priceFull: 160,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=85",
    rating: 4.8,
    bestseller: true,
    available: true,
    description:
      "Fragrant rice tossed with vegetables, herbs and signature seasoning.",
  },

  {
    id: "8",
    name: "Schezwan Rice",
    category: "Rice",
    priceHalf: 110,
    priceFull: 180,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=85",
    rating: 4.7,
    bestseller: false,
    available: true,
    description:
      "Spicy Schezwan rice packed with flavour and fresh vegetables.",
  },

  {
    id: "9",
    name: "Chicken Biryani",
    category: "Biryani",
    priceHalf: 200,
    priceFull: 200,
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1000&q=85",
    rating: 4.9,
    bestseller: true,
    available: true,
    description:
      "Aromatic basmati rice layered with tender chicken and traditional spices.",
  },

  {
    id: "10",
    name: "Butter Chicken",
    category: "Chicken Gravy",
    priceHalf: 220,
    priceFull: 390,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=85",
    rating: 4.9,
    bestseller: true,
    available: true,
    description:
      "Tender chicken cooked in a rich and creamy tomato-based butter gravy.",
  },

  {
    id: "11",
    name: "Chicken Handi",
    category: "Chicken Gravy",
    priceHalf: 230,
    priceFull: 400,
    image:
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1000&q=85",
    rating: 4.8,
    bestseller: false,
    available: true,
    description:
      "Traditional handi-style chicken prepared with aromatic spices.",
  },

  {
    id: "12",
    name: "Manchurian Gravy",
    category: "Chinese Gravy",
    priceHalf: 150,
    priceFull: 260,
    image:
      "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1000&q=85",
    rating: 4.8,
    bestseller: true,
    available: true,
    description:
      "Soft Manchurian bites served in rich and flavourful Chinese gravy.",
  },
];

/* =========================================================
   CATEGORY ICONS
========================================================= */

const categoryIcons = {
  All: "🍽️",
  Bestseller: "🔥",
  Starters: "🍗",
  Tandoor: "🔥",
  "Chicken Gravy": "🍛",
  "Mutton Gravy": "🍖",
  "Chinese Gravy": "🥘",
  Rice: "🍚",
  Biryani: "🍗",
  "Rice Non Veg": "🍗",
  Noodles: "🍜",
  Roti: "🫓",
  Soups: "🍲",
  Refreshment: "🥤",
  Beverages: "🥤",
  Desserts: "🍰",
};

/* =========================================================
   NORMALIZE API ITEM
========================================================= */

const normalizeItem = (item, index) => ({
  ...item,

  id: item._id || item.id || `food-${index}`,

  name: item.name || "Delicious Dish",

  category: item.category || "Other",

  priceHalf: Number(item.priceHalf ?? item.price ?? 0) || 0,

  priceFull: Number(item.priceFull ?? item.price ?? 0) || 0,

  image:
    item.image ||
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",

  rating: Number(item.rating || 4.7),

  bestseller: Boolean(item.bestseller),

  available: item.available !== false,

  description:
    item.description ||
    "Freshly prepared with premium ingredients and authentic flavours.",
});

/* =========================================================
   PREMIUM FOOD CARD
========================================================= */

function PremiumFoodCard({
  item,
  favorite,
  onFavorite,
  onAdd,
}) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        overflow: "hidden",
        background: "#fff",
        border: "1px solid rgba(15,23,42,0.07)",
        boxShadow: "0 8px 24px rgba(15,23,42,0.07)",
        transition:
          "transform .3s ease, box-shadow .3s ease",

        "&:hover": {
          transform: "translateY(-7px)",
          boxShadow:
            "0 18px 42px rgba(15,23,42,0.14)",
        },
      }}
    >
      {/* IMAGE */}

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
            width: "100%",
            height: {
              xs: 210,
              sm: 205,
              md: 195,
              lg: 190,
            },
            objectFit: "cover",
            transition: "transform .5s ease",

            "&:hover": {
              transform: "scale(1.06)",
            },
          }}
        />

        {/* BESTSELLER */}

        {item.bestseller && (
          <Chip
            icon={
              <LocalFireDepartmentIcon
                sx={{
                  color: "#fff !important",
                  fontSize: 17,
                }}
              />
            }
            label="Bestseller"
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              height: 30,
              borderRadius: "9px",
              color: "#fff",
              fontWeight: 800,
              background:
                "linear-gradient(135deg,#f97316,#ea580c)",
              boxShadow:
                "0 5px 15px rgba(249,115,22,.3)",
            }}
          />
        )}

        {/* FAVORITE */}

        <IconButton
          onClick={() => onFavorite(item)}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 40,
            height: 40,
            background: "rgba(255,255,255,.95)",
            color: favorite
              ? "#ef4444"
              : "#475569",
            boxShadow:
              "0 5px 15px rgba(15,23,42,.12)",

            "&:hover": {
              background: "#fff",
              transform: "scale(1.08)",
            },
          }}
        >
          {favorite ? (
            <FavoriteIcon />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>

        {/* RATING */}

        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: 12,
            display: "flex",
            alignItems: "center",
            gap: 0.4,
            px: 1,
            py: 0.45,
            borderRadius: "8px",
            background:
              "rgba(15,23,42,.82)",
            color: "#fff",
          }}
        >
          <StarIcon
            sx={{
              color: "#fbbf24",
              fontSize: 15,
            }}
          />

          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {item.rating.toFixed(1)}
          </Typography>
        </Box>
      </Box>

      {/* CONTENT */}

      <CardContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,

          "&:last-child": {
            pb: 2,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 17,
            fontWeight: 850,
            color: "#0f172a",
            lineHeight: 1.25,
            minHeight: 42,
            mb: 0.7,
          }}
        >
          {item.name}
        </Typography>

        <Typography
          sx={{
            fontSize: 12.5,
            lineHeight: 1.55,
            color: "#64748b",
            minHeight: 39,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description}
        </Typography>

        {/* PRICE */}

        <Box
          sx={{
            mt: 1.6,
            mb: 1.5,
            display: "flex",
            justifyContent:
              item.priceFull !== item.priceHalf
                ? "space-between"
                : "flex-start",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                color: "#94a3b8",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Half
            </Typography>

            <Typography
              sx={{
                fontSize: 19,
                fontWeight: 900,
                color: "#0f766e",
              }}
            >
              ₹{item.priceHalf}
            </Typography>
          </Box>

          {item.priceFull !== item.priceHalf && (
            <Box sx={{ textAlign: "right" }}>
              <Typography
                sx={{
                  fontSize: 10,
                  color: "#94a3b8",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                Full
              </Typography>

              <Typography
                sx={{
                  fontSize: 19,
                  fontWeight: 900,
                  color: "#0f172a",
                }}
              >
                ₹{item.priceFull}
              </Typography>
            </Box>
          )}
        </Box>

        {/* ADD BUTTON */}

        <Button
          fullWidth
          variant="contained"
          disabled={!item.available}
          startIcon={
            <ShoppingBagOutlinedIcon />
          }
          onClick={() => onAdd(item)}
          sx={{
            mt: "auto",
            height: 44,
            borderRadius: "12px",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 850,
            background:
              "linear-gradient(135deg,#0f766e,#0ea5a4)",
            boxShadow:
              "0 7px 18px rgba(15,118,110,.18)",

            "&:hover": {
              background:
                "linear-gradient(135deg,#115e59,#0f766e)",
              boxShadow:
                "0 10px 25px rgba(15,118,110,.28)",
            },
          }}
        >
          {item.available
            ? "Add to Cart"
            : "Unavailable"}
        </Button>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   PORTION DIALOG
========================================================= */

function PortionDialog({
  item,
  open,
  onClose,
  onConfirm,
}) {
  const [portion, setPortion] =
    useState("Half");

  const [quantity, setQuantity] =
    useState(1);

  useEffect(() => {
    if (open) {
      setPortion("Half");
      setQuantity(1);
    }
  }, [open, item]);

  if (!item) {
    return null;
  }

  const halfPrice =
    Number(item.priceHalf) || 0;

  const fullPrice =
    Number(item.priceFull) || 0;

  const selectedPrice =
    portion === "Half"
      ? halfPrice
      : fullPrice;

  const total =
    selectedPrice * quantity;

  const samePrice =
    halfPrice === fullPrice;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: {
            xs: "20px",
            sm: "26px",
          },
          overflow: "hidden",
          m: 1.5,
          boxShadow:
            "0 30px 80px rgba(15,23,42,.28)",
        },
      }}
    >
      {/* IMAGE */}

      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{
            width: "100%",
            height: {
              xs: 210,
              sm: 280,
            },
            objectFit: "cover",
            display: "block",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg,rgba(15,23,42,.05) 30%,rgba(15,23,42,.72) 100%)",
          }}
        />

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 40,
            height: 40,
            color: "#0f172a",
            background:
              "rgba(255,255,255,.94)",
            boxShadow:
              "0 5px 20px rgba(0,0,0,.18)",

            "&:hover": {
              background: "#fff",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {item.bestseller && (
          <Chip
            icon={
              <LocalFireDepartmentIcon />
            }
            label="Bestseller"
            sx={{
              position: "absolute",
              left: 18,
              bottom: 18,
              color: "#fff",
              fontWeight: 850,
              background:
                "linear-gradient(135deg,#f97316,#ea580c)",
            }}
          />
        )}
      </Box>

      <DialogContent
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        {/* TITLE */}

        <Stack spacing={1.2}>
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: 23,
                    sm: 28,
                  },
                  fontWeight: 950,
                  color: "#0f172a",
                  lineHeight: 1.1,
                }}
              >
                {item.name}
              </Typography>

              <Typography
                sx={{
                  mt: 0.6,
                  fontSize: 12,
                  color: "#64748b",
                  fontWeight: 750,
                }}
              >
                {item.category}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.4,
                px: 1,
                py: 0.6,
                borderRadius: "9px",
                background: "#fffbeb",
              }}
            >
              <StarIcon
                sx={{
                  fontSize: 17,
                  color: "#f59e0b",
                }}
              />

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 900,
                  color: "#92400e",
                }}
              >
                {item.rating.toFixed(1)}
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: 13.5,
              color: "#64748b",
              lineHeight: 1.65,
            }}
          >
            {item.description}
          </Typography>

          <Divider sx={{ my: 0.8 }} />

          {/* PORTION */}

          <Box>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              Choose your portion
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: 11.5,
                color: "#94a3b8",
              }}
            >
              Select the quantity you want
              to order.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                samePrice
                  ? "1fr"
                  : "1fr 1fr",
              gap: 1.2,
            }}
          >
            {/* HALF */}

            <Button
              onClick={() =>
                setPortion("Half")
              }
              sx={{
                minHeight: 86,
                p: 1.5,
                borderRadius: "15px",
                textAlign: "left",
                alignItems:
                  "flex-start",
                justifyContent:
                  "space-between",
                textTransform: "none",
                border:
                  portion === "Half"
                    ? "2px solid #0f766e"
                    : "1px solid #e2e8f0",
                background:
                  portion === "Half"
                    ? "#f0fdfa"
                    : "#fff",
                color: "#0f172a",

                "&:hover": {
                  background: "#f0fdfa",
                  borderColor: "#0f766e",
                },
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 850,
                    color: "#64748b",
                    textTransform:
                      "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  Half Portion
                </Typography>

                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: 22,
                    fontWeight: 950,
                    color: "#0f766e",
                  }}
                >
                  ₹{halfPrice}
                </Typography>
              </Box>

              {portion === "Half" && (
                <CheckCircleIcon
                  sx={{
                    color: "#0f766e",
                    fontSize: 22,
                  }}
                />
              )}
            </Button>

            {/* FULL */}

            {!samePrice && (
              <Button
                onClick={() =>
                  setPortion("Full")
                }
                sx={{
                  minHeight: 86,
                  p: 1.5,
                  borderRadius: "15px",
                  textAlign: "left",
                  alignItems:
                    "flex-start",
                  justifyContent:
                    "space-between",
                  textTransform: "none",
                  border:
                    portion === "Full"
                      ? "2px solid #1e3a8a"
                      : "1px solid #e2e8f0",
                  background:
                    portion === "Full"
                      ? "#eff6ff"
                      : "#fff",
                  color: "#0f172a",

                  "&:hover": {
                    background: "#eff6ff",
                    borderColor: "#1e3a8a",
                  },
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 850,
                      color: "#64748b",
                      textTransform:
                        "uppercase",
                      letterSpacing: ".06em",
                    }}
                  >
                    Full Portion
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.4,
                      fontSize: 22,
                      fontWeight: 950,
                      color: "#1e3a8a",
                    }}
                  >
                    ₹{fullPrice}
                  </Typography>
                </Box>

                {portion === "Full" && (
                  <CheckCircleIcon
                    sx={{
                      color: "#1e3a8a",
                      fontSize: 22,
                    }}
                  />
                )}
              </Button>
            )}
          </Box>

          {/* QUANTITY */}

          <Box
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              p: 1.2,
              borderRadius: "14px",
              background: "#f8fafc",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 850,
                  color: "#0f172a",
                }}
              >
                Quantity
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#94a3b8",
                  mt: 0.2,
                }}
              >
                How many would you like?
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 0.5,
                borderRadius: "12px",
                background: "#fff",
                border:
                  "1px solid #e2e8f0",
              }}
            >
              <IconButton
                size="small"
                disabled={quantity <= 1}
                onClick={() =>
                  setQuantity(
                    (value) =>
                      Math.max(
                        1,
                        value - 1
                      )
                  )
                }
              >
                <RemoveIcon fontSize="small" />
              </IconButton>

              <Typography
                sx={{
                  minWidth: 25,
                  textAlign: "center",
                  fontWeight: 900,
                }}
              >
                {quantity}
              </Typography>

              <IconButton
                size="small"
                onClick={() =>
                  setQuantity(
                    (value) =>
                      Math.min(
                        20,
                        value + 1
                      )
                  )
                }
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* ADD */}

          <Button
            fullWidth
            variant="contained"
            onClick={() =>
              onConfirm(
                portion,
                quantity
              )
            }
            startIcon={
              <ShoppingBagOutlinedIcon />
            }
            sx={{
              mt: 0.5,
              height: 52,
              borderRadius: "14px",
              textTransform: "none",
              fontSize: 15,
              fontWeight: 900,
              justifyContent:
                "space-between",
              px: 2.2,
              background:
                "linear-gradient(135deg,#0f766e,#0ea5a4)",
              boxShadow:
                "0 10px 25px rgba(15,118,110,.25)",

              "&:hover": {
                background:
                  "linear-gradient(135deg,#115e59,#0f766e)",
              },
            }}
          >
            <Box
              component="span"
              sx={{
                flexGrow: 1,
                textAlign: "left",
              }}
            >
              Add to Cart
            </Box>

            <Box
              component="span"
              sx={{
                fontWeight: 950,
              }}
            >
              ₹{total}
            </Box>
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   MAIN MENU
========================================================= */

export default function Menu() {
  const {
    addToCart,
    totalItems,
    totalAmount,
    setDrawerOpen,
  } = useCart();

  const [foodItems, setFoodItems] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [favorites, setFavorites] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            "famous-cook-favorites"
          );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    });

  const [portionItem, setPortionItem] =
    useState(null);

  const [
    portionDialogOpen,
    setPortionDialogOpen,
  ] = useState(false);

  /* =======================================================
     LOAD MENU
  ======================================================= */

  useEffect(() => {
  let mounted = true;

  const loadMenu = async () => {
    try {
      setLoading(true);

      const data = await menuService.getMenu();

      if (!mounted) return;

      const apiItems = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : [];

      const normalizedApiItems = apiItems.map(
        (item, index) => {
          const normalized = normalizeItem(
            item,
            index
          );

          // Fix category spelling from database
          if (
            normalized.category
              .trim()
              .toLowerCase() === "chichen gravy"
          ) {
            normalized.category = "Chicken Gravy";
          }

          return normalized;
        }
      );

      /*
       * Combine fallback menu + live database menu.
       *
       * Database items are kept.
       * If the same dish already exists in fallback,
       * the database version is used.
       */

      const allItems = [
        ...fallbackMenu,
        ...normalizedApiItems,
      ];

      // Remove duplicate dishes by name
      const uniqueItems = Array.from(
        new Map(
          allItems.map((item) => [
            item.name.trim().toLowerCase(),
            item,
          ])
        ).values()
      );

      setFoodItems(uniqueItems);

      setError(
        normalizedApiItems.length > 0
          ? ""
          : "Showing our restaurant menu while the live menu is being updated."
      );
    } catch (err) {
      console.error(
        "Menu API error:",
        err
      );

      if (!mounted) return;

      setFoodItems(fallbackMenu);

      setError(
        "Showing our restaurant menu while the live menu is unavailable."
      );
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  loadMenu();

  return () => {
    mounted = false;
  };
}, []);

  /* =======================================================
     SAVE FAVORITES
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      "famous-cook-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const preferredOrder = [
      "All",
      "Bestseller",
      "Starters",
      "Tandoor",
      "Chicken Gravy",
      "Mutton Gravy",
      "Chinese Gravy",
      "Rice",
      "Biryani",
      "Rice Non Veg",
      "Noodles",
      "Roti",
      "Soups",
      "Refreshment",
      "Beverages",
      "Desserts",
    ];

    const existingCategories = [
      ...new Set(
        foodItems
          .map((item) =>
            String(
              item.category || ""
            ).trim()
          )
          .filter(Boolean)
      ),
    ];

    const orderedCategories =
      preferredOrder.filter(
        (category) =>
          category === "All" ||
          category ===
            "Bestseller" ||
          existingCategories.includes(
            category
          )
      );

    const additionalCategories =
      existingCategories
        .filter(
          (category) =>
            !preferredOrder.includes(
              category
            )
        )
        .sort((a, b) =>
          a.localeCompare(b)
        );

    return [
      ...orderedCategories,
      ...additionalCategories,
    ];
  }, [foodItems]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredItems = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return foodItems.filter((item) => {
      const categoryMatch =
        selectedCategory === "All"
          ? true
          : selectedCategory ===
            "Bestseller"
          ? item.bestseller
          : item.category ===
            selectedCategory;

      const searchMatch =
        !query ||
        item.name
          .toLowerCase()
          .includes(query) ||
        item.category
          .toLowerCase()
          .includes(query);

      return (
        categoryMatch &&
        searchMatch
      );
    });
  }, [
    foodItems,
    search,
    selectedCategory,
  ]);

  /* =======================================================
     MOST LOVED
  ======================================================= */

  const popularItems = useMemo(() => {
    return foodItems
      .filter(
        (item) => item.bestseller
      )
      .slice(0, 4);
  }, [foodItems]);

  /* =======================================================
     FAVORITES
  ======================================================= */

  const toggleFavorite = (item) => {
    setFavorites((previous) => {
      if (
        previous.includes(item.id)
      ) {
        return previous.filter(
          (id) => id !== item.id
        );
      }

      return [
        ...previous,
        item.id,
      ];
    });
  };

  /* =======================================================
     PORTION DIALOG
  ======================================================= */

  const openPortionDialog = (item) => {
    if (!item?.available) return;

    setPortionItem(item);
    setPortionDialogOpen(true);
  };

  const closePortionDialog = () => {
    setPortionDialogOpen(false);

    setTimeout(() => {
      setPortionItem(null);
    }, 180);
  };

  /*
   * IMPORTANT:
   *
   * Pass portionItem directly to CartContext.
   *
   * This prevents the previously selected dish
   * from being added when the customer selects
   * another dish.
   */

  const confirmPortion = (
    type,
    quantity
  ) => {
    if (!portionItem) return;

    for (
      let index = 0;
      index < quantity;
      index += 1
    ) {
      addToCart(
        type,
        portionItem
      );
    }

    closePortionDialog();
  };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
  };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#f8fafc 0%,#ffffff 35%,#f8fafc 100%)",
      }}
    >
      {/* HEADER */}

      <Header
        totalItems={totalItems}
        onCartClick={() =>
          setDrawerOpen(true)
        }
      />

      {/* ===================================================
          PREMIUM HERO
      =================================================== */}

      <Box
        sx={{
          background:
            "linear-gradient(135deg,#0b1224 0%,#172554 52%,#064e3b 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            right: -160,
            top: -220,
            background:
              "rgba(20,184,166,.13)",
            filter: "blur(5px)",
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
          }}
        >
          <Box
            sx={{
              maxWidth: 1250,
              mx: "auto",
              py: {
                xs: 4,
                md: 5,
              },
            }}
          >
            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                md: "center",
              }}
              spacing={4}
            >
              <Box>
                <Chip
                  icon={
                    <RestaurantIcon />
                  }
                  label="FAMOUS COOK • PREMIUM RESTAURANT"
                  sx={{
                    mb: 1.5,
                    color: "#bfdbfe",
                    background:
                      "rgba(255,255,255,.08)",
                    border:
                      "1px solid rgba(255,255,255,.1)",
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: ".05em",
                  }}
                />

                <Typography
                  component="h1"
                  sx={{
                    fontSize: {
                      xs: 34,
                      sm: 42,
                      md: 50,
                    },
                    fontWeight: 950,
                    lineHeight: 1.05,
                    letterSpacing:
                      "-.04em",
                  }}
                >
                  Discover Your
                  <br />
                  Favourite Taste.
                </Typography>

                <Typography
                  sx={{
                    mt: 1.5,
                    maxWidth: 620,
                    color: "#cbd5e1",
                    fontSize: {
                      xs: 14,
                      md: 16,
                    },
                    lineHeight: 1.7,
                  }}
                >
                  Authentic flavours,
                  freshly prepared
                  dishes and Famous
                  Cook favourites —
                  all in one place.
                </Typography>
              </Box>

              {/* RESTAURANT INFO */}

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  width: {
                    xs: "100%",
                    md: 260,
                  },
                  borderRadius: "20px",
                  background:
                    "rgba(255,255,255,.08)",
                  border:
                    "1px solid rgba(255,255,255,.12)",
                  backdropFilter:
                    "blur(14px)",
                }}
              >
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 9,
                        height: 9,
                        borderRadius:
                          "50%",
                        background:
                          "#22c55e",
                        boxShadow:
                          "0 0 0 5px rgba(34,197,94,.12)",
                      }}
                    />

                    <Typography
                      sx={{
                        fontWeight: 850,
                        fontSize: 14,
                      }}
                    >
                      Open now
                    </Typography>
                  </Stack>

                  <Divider
                    sx={{
                      borderColor:
                        "rgba(255,255,255,.1)",
                    }}
                  />

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <StarIcon
                      sx={{
                        color:
                          "#fbbf24",
                        fontSize: 19,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 13,
                        color:
                          "#e2e8f0",
                      }}
                    >
                      4.8 restaurant
                      rating
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <AccessTimeIcon
                      sx={{
                        color:
                          "#93c5fd",
                        fontSize: 19,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 13,
                        color:
                          "#e2e8f0",
                      }}
                    >
                      Freshly prepared
                      dishes
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 2,
            md: 3,
          },
        }}
      >
        <Box
          sx={{
            maxWidth: 1250,
            mx: "auto",
          }}
        >
          {/* SEARCH */}

          <Paper
            elevation={0}
            sx={{
              mt: {
                xs: -2,
                md: -3,
              },
              position: "relative",
              zIndex: 2,
              p: 1,
              borderRadius: "20px",
              border:
                "1px solid #e2e8f0",
              boxShadow:
                "0 15px 40px rgba(15,23,42,.10)",
              background: "#fff",
            }}
          >
            <TextField
              fullWidth
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search your favourite dish..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color:
                          "#64748b",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    borderRadius:
                      "15px",
                    background:
                      "#f8fafc",
                    height: 54,

                    "& fieldset": {
                      borderColor:
                        "#e2e8f0",
                    },

                    "&:hover fieldset":
                      {
                        borderColor:
                          "#cbd5e1",
                      },

                    "&.Mui-focused fieldset":
                      {
                        borderColor:
                          "#0f766e",
                      },
                  },
              }}
            />
          </Paper>

          {/* CATEGORIES */}

          <Paper
            elevation={0}
            sx={{
              mt: 2,
              p: 1,
              borderRadius: "18px",
              border:
                "1px solid #e2e8f0",
              background: "#fff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                overflowX: "auto",
                py: 0.2,

                "&::-webkit-scrollbar": {
                  display: "none",
                },

                scrollbarWidth: "none",
              }}
            >
              {categories.map(
                (category) => {
                  const active =
                    selectedCategory ===
                    category;

                  return (
                    <Button
                      key={category}
                      onClick={() =>
                        setSelectedCategory(
                          category
                        )
                      }
                      startIcon={
                        <span>
                          {categoryIcons[
                            category
                          ] || "🍴"}
                        </span>
                      }
                      sx={{
                        flexShrink: 0,
                        minHeight: 42,
                        px: 2,
                        borderRadius:
                          "12px",
                        textTransform:
                          "none",
                        fontWeight: 800,
                        color: active
                          ? "#fff"
                          : "#475569",
                        background:
                          active
                            ? "linear-gradient(135deg,#0f172a,#1e3a8a)"
                            : "#fff",
                        border: active
                          ? "none"
                          : "1px solid #e2e8f0",

                        "&:hover": {
                          background:
                            active
                              ? "linear-gradient(135deg,#0f172a,#1e3a8a)"
                              : "#f8fafc",
                        },
                      }}
                    >
                      {category}
                    </Button>
                  );
                }
              )}
            </Box>
          </Paper>

          {/* API MESSAGE */}

          {error && (
            <Alert
              severity="info"
              sx={{
                mt: 2,
                borderRadius: "12px",
              }}
            >
              {error}
            </Alert>
          )}

          {/* LOADING */}

          {loading ? (
            <Box
              sx={{
                minHeight: 450,
                display: "grid",
                placeItems: "center",
              }}
            >
              <Stack
                alignItems="center"
                spacing={2}
              >
                <CircularProgress
                  sx={{
                    color: "#0f766e",
                  }}
                />

                <Typography
                  sx={{
                    color:
                      "#64748b",
                  }}
                >
                  Preparing your
                  menu...
                </Typography>
              </Stack>
            </Box>
          ) : (
            <>
              {/* =================================================
                  MOST LOVED
              ================================================= */}

              {!search &&
                selectedCategory ===
                  "All" &&
                popularItems.length >
                  0 && (
                  <Box sx={{ mt: 4 }}>
                    <Stack
                      direction="row"
                      spacing={0.7}
                      alignItems="center"
                      sx={{
                        mb: 0.5,
                      }}
                    >
                      <LocalFireDepartmentIcon
                        sx={{
                          color:
                            "#f97316",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: {
                            xs: 23,
                            md: 28,
                          },
                          fontWeight: 950,
                          color:
                            "#0f172a",
                        }}
                      >
                        Most Loved
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        mb: 2,
                        color:
                          "#64748b",
                        fontSize: 13,
                      }}
                    >
                      Our customers'
                      favourite
                      dishes.
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          {
                            xs: "1fr",
                            sm: "repeat(2,minmax(0,1fr))",
                            md: "repeat(3,minmax(0,1fr))",
                            lg: "repeat(4,minmax(0,1fr))",
                          },
                        gap: {
                          xs: 2,
                          sm: 2,
                          md: 2.5,
                        },
                        alignItems:
                          "stretch",
                      }}
                    >
                      {popularItems.map(
                        (item) => (
                          <PremiumFoodCard
                            key={`popular-${item.id}`}
                            item={item}
                            favorite={favorites.includes(
                              item.id
                            )}
                            onFavorite={
                              toggleFavorite
                            }
                            onAdd={
                              openPortionDialog
                            }
                          />
                        )
                      )}
                    </Box>
                  </Box>
                )}

              {/* =================================================
                  FULL MENU
              ================================================= */}

              <Box
                sx={{
                  mt: 5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-end",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: {
                          xs: 24,
                          md: 29,
                        },
                        fontWeight: 950,
                        color:
                          "#0f172a",
                        letterSpacing:
                          "-.025em",
                      }}
                    >
                      {selectedCategory ===
                      "All"
                        ? "Our Full Menu"
                        : selectedCategory}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.4,
                        color:
                          "#64748b",
                        fontSize: 13,
                      }}
                    >
                      {
                        filteredItems.length
                      }{" "}
                      {filteredItems.length ===
                      1
                        ? "dish"
                        : "dishes"}{" "}
                      available
                    </Typography>
                  </Box>

                  {search && (
                    <Button
                      onClick={
                        clearFilters
                      }
                      sx={{
                        textTransform:
                          "none",
                        fontWeight: 800,
                        color:
                          "#0f766e",
                      }}
                    >
                      Clear search
                    </Button>
                  )}
                </Box>

                {/* PERFECT GRID */}

                {filteredItems.length >
                0 ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        {
                          xs: "1fr",
                          sm: "repeat(2,minmax(0,1fr))",
                          md: "repeat(3,minmax(0,1fr))",
                          lg: "repeat(4,minmax(0,1fr))",
                        },
                      gap: {
                        xs: 2,
                        sm: 2,
                        md: 2.5,
                      },
                      alignItems:
                        "stretch",
                    }}
                  >
                    {filteredItems.map(
                      (item) => (
                        <PremiumFoodCard
                          key={item.id}
                          item={item}
                          favorite={favorites.includes(
                            item.id
                          )}
                          onFavorite={
                            toggleFavorite
                          }
                          onAdd={
                            openPortionDialog
                          }
                        />
                      )
                    )}
                  </Box>
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      py: 8,
                      textAlign:
                        "center",
                      borderRadius:
                        "20px",
                      border:
                        "1px solid #e2e8f0",
                    }}
                  >
                    <SearchIcon
                      sx={{
                        fontSize: 50,
                        color:
                          "#cbd5e1",
                      }}
                    />

                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: 21,
                        fontWeight: 900,
                      }}
                    >
                      No dishes found
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        color:
                          "#64748b",
                      }}
                    >
                      Try another dish
                      or category.
                    </Typography>

                    <Button
                      onClick={
                        clearFilters
                      }
                      sx={{
                        mt: 2,
                        textTransform:
                          "none",
                        fontWeight: 800,
                      }}
                    >
                      View Full Menu
                    </Button>
                  </Paper>
                )}
              </Box>

              {/* =================================================
                  BOTTOM CTA
              ================================================= */}

              <Paper
                elevation={0}
                sx={{
                  mt: 5,
                  p: {
                    xs: 2.5,
                    md: 3.5,
                  },
                  borderRadius:
                    "22px",
                  color: "#fff",
                  background:
                    "linear-gradient(135deg,#0f172a,#172554,#0f766e)",
                }}
              >
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  justifyContent="space-between"
                  alignItems={{
                    xs: "flex-start",
                    sm: "center",
                  }}
                  spacing={2}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: {
                          xs: 21,
                          md: 26,
                        },
                        fontWeight: 950,
                      }}
                    >
                      Ready to order?
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        color:
                          "#cbd5e1",
                        fontSize: 13,
                      }}
                    >
                      Fresh food.
                      Authentic
                      taste.
                      Delivered
                      with care.
                    </Typography>
                  </Box>

                  {totalItems > 0 && (
                    <Button
                      variant="contained"
                      startIcon={
                        <ShoppingBagOutlinedIcon />
                      }
                      onClick={() =>
                        setDrawerOpen(
                          true
                        )
                      }
                      sx={{
                        minWidth: 180,
                        height: 46,
                        borderRadius:
                          "12px",
                        textTransform:
                          "none",
                        fontWeight: 850,
                        color:
                          "#0f172a",
                        background:
                          "#fff",

                        "&:hover": {
                          background:
                            "#f8fafc",
                        },
                      }}
                    >
                      View Cart • ₹
                      {totalAmount}
                    </Button>
                  )}
                </Stack>
              </Paper>
            </>
          )}
        </Box>
      </Container>

      {/* PORTION DIALOG */}

      <PortionDialog
        item={portionItem}
        open={portionDialogOpen}
        onClose={
          closePortionDialog
        }
        onConfirm={confirmPortion}
      />
    </Box>
  );
}