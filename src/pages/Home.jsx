import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StarIcon from "@mui/icons-material/Star";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import RiceBowlIcon from "@mui/icons-material/RiceBowl";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";

import Header from "../components/Header";
import { menuService } from "../services/api";
import { useCart } from "../context/CartContext";

/* ==========================================================================
   FALLBACK MENU

   Backend is not required for this Home page to work.

   When the API returns menu records, those records are used.
   If the backend is unavailable or returns an empty array, this realistic
   frontend menu is displayed instead.
   ========================================================================== */

const fallbackMenu = [
  {
    id: "fallback-chilly-dry",
    name: "Chilly Dry",
    category: "Starters",
    priceHalf: 120,
    priceFull: 220,
    image:
      "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-schezwan-dry",
    name: "Schezwan Dry",
    category: "Starters",
    priceHalf: 130,
    priceFull: 230,
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-tandoori-chicken",
    name: "Chicken Tandoori",
    category: "Tandoor",
    priceHalf: 190,
    priceFull: 380,
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-chicken-lahori",
    name: "Chicken Lahori",
    category: "Chicken Gravy",
    priceHalf: 220,
    priceFull: 390,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-chicken-handi",
    name: "Chicken Handi",
    category: "Chicken Gravy",
    priceHalf: 230,
    priceFull: 400,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-chicken-biryani",
    name: "Chicken Biryani",
    category: "Rice",
    priceHalf: 200,
    priceFull: 200,
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1200&q=85",
  },
];

/* ==========================================================================
   CATEGORY DATA
   ========================================================================== */

const homeCategories = [
  {
    title: "Starters",
    subtitle: "Crispy & flavourful",
    icon: <LunchDiningIcon />,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Tandoor",
    subtitle: "Charcoal perfection",
    icon: <LocalDiningIcon />,
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Rice",
    subtitle: "Aromatic & delicious",
    icon: <RiceBowlIcon />,
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Chicken Gravy",
    subtitle: "Rich & authentic",
    icon: <RestaurantIcon />,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=85",
  },
];

/* ==========================================================================
   HERO SLIDES
   ========================================================================== */

const heroSlides = [
  {
    eyebrow: "FAMOUS COOK",
    title: "Flavours worth",
    highlight: "coming back for.",
    description:
      "Authentic Indian flavours, freshly prepared dishes and a dining experience made for memorable moments.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=2000&q=90",
  },
  {
    eyebrow: "AUTHENTIC FLAVOURS",
    title: "From our kitchen",
    highlight: "to your table.",
    description:
      "Enjoy carefully prepared starters, tandoor favourites, aromatic rice and rich chicken gravies.",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=2000&q=90",
  },
  {
    eyebrow: "MADE FRESH",
    title: "Good food.",
    highlight: "Great moments.",
    description:
      "Discover the dishes our customers love, prepared fresh with quality ingredients and attention to flavour.",
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=2000&q=90",
  },
];

/* ==========================================================================
   FEATURES
   ========================================================================== */

const features = [
  {
    icon: <DeliveryDiningIcon />,
    title: "Fast Delivery",
    description:
      "Fresh food delivered quickly while keeping the taste intact.",
  },
  {
    icon: <WorkspacePremiumOutlinedIcon />,
    title: "Premium Quality",
    description:
      "Carefully selected ingredients and consistent preparation.",
  },
  {
    icon: <RestaurantIcon />,
    title: "Expert Kitchen",
    description:
      "Classic recipes prepared with attention to flavour and detail.",
  },
  {
    icon: <SecurityIcon />,
    title: "Hygienic Food",
    description:
      "Clean preparation standards from kitchen to your table.",
  },
];

/* ==========================================================================
   REVIEWS
   ========================================================================== */

const reviews = [
  {
    name: "Rahul M.",
    location: "Navi Mumbai",
    rating: 5,
    text:
      "The chicken biryani was really flavourful and the portion was satisfying. Definitely ordering again.",
  },
  {
    name: "Priya S.",
    location: "Panvel",
    rating: 5,
    text:
      "Loved the tandoori and chicken gravy. The food felt fresh and the ordering experience was very smooth.",
  },
  {
    name: "Amit P.",
    location: "Kharghar",
    rating: 4,
    text:
      "Good taste, clean presentation and a very convenient online ordering experience.",
  },
];

/* ==========================================================================
   PREMIUM FOOD CARD
   ========================================================================== */

function HomeFoodCard({ item, onAdd }) {
  const [loaded, setLoaded] = useState(false);

  const halfPrice =
    item?.priceHalf !== undefined && item?.priceHalf !== null
      ? Number(item.priceHalf)
      : null;

  const fullPrice =
    item?.priceFull !== undefined && item?.priceFull !== null
      ? Number(item.priceFull)
      : null;

  const hasTwoPrices =
    halfPrice !== null &&
    fullPrice !== null &&
    halfPrice !== fullPrice;

  const image =
    item?.image ||
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85";

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        overflow: "hidden",
        borderRadius: "25px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        transition: "all .35s ease",
        position: "relative",
        "&:hover": {
          transform: "translateY(-8px)",
          borderColor: "#bfdbfe",
          boxShadow: "0 25px 55px rgba(15,23,42,.13)",
        },
      }}
    >
      {/* IMAGE */}

      <Box
        sx={{
          position: "relative",
          height: {
            xs: 220,
            sm: 235,
          },
          overflow: "hidden",
          background: "#f1f5f9",
        }}
      >
        {!loaded && (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}

        <Box
          component="img"
          src={image}
          alt={item?.name || "Famous Cook dish"}
          onLoad={() => setLoaded(true)}
          onError={(event) => {
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85";

            setLoaded(true);
          }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            opacity: loaded ? 1 : 0,
            transition: "opacity .3s ease, transform .65s ease",
            "&:hover": {
              transform: "scale(1.07)",
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg,rgba(15,23,42,.03) 25%,rgba(15,23,42,.78) 100%)",
            pointerEvents: "none",
          }}
        />

        <Chip
          icon={
            <LocalFireDepartmentIcon
              sx={{
                color: "#f97316 !important",
                fontSize: "17px !important",
              }}
            />
          }
          label="Popular"
          size="small"
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(255,255,255,.96)",
            color: "#0f172a",
            fontWeight: 900,
            backdropFilter: "blur(12px)",
          }}
        />

        <Chip
          label={item?.category || "Special"}
          size="small"
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "rgba(15,23,42,.80)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,.18)",
            fontWeight: 700,
            backdropFilter: "blur(10px)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 14,
            left: 16,
            right: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack
            direction="row"
            spacing={0.6}
            alignItems="center"
          >
            <StarIcon
              sx={{
                fontSize: 18,
                color: "#fbbf24",
              }}
            />

            <Typography
              sx={{
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Customer favourite
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* CONTENT */}

      <Box
        sx={{
          p: 2.5,
          minHeight: 195,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 950,
            color: "#0f172a",
            lineHeight: 1.25,
            mb: 0.8,
          }}
        >
          {item?.name}
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            lineHeight: 1.65,
            color: "#64748b",
            mb: 2,
          }}
        >
          Prepared fresh with carefully selected ingredients
          for a rich and satisfying flavour.
        </Typography>

        <Divider sx={{ mb: 1.8 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                color: "#94a3b8",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: ".08em",
              }}
            >
              {hasTwoPrices ? "Half" : "Price"}
            </Typography>

            <Typography
              sx={{
                fontSize: 21,
                color: "#0f172a",
                fontWeight: 950,
              }}
            >
              ₹{halfPrice}
            </Typography>
          </Box>

          {hasTwoPrices && (
            <Box sx={{ textAlign: "right" }}>
              <Typography
                sx={{
                  fontSize: 10,
                  color: "#94a3b8",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}
              >
                Full
              </Typography>

              <Typography
                sx={{
                  fontSize: 15,
                  color: "#334155",
                  fontWeight: 800,
                }}
              >
                ₹{fullPrice}
              </Typography>
            </Box>
          )}
        </Box>

        <Button
          fullWidth
          onClick={() => onAdd(item)}
          endIcon={<AddIcon />}
          sx={{
            mt: "auto",
            minHeight: 49,
            borderRadius: "14px",
            color: "#ffffff",
            background:
              "linear-gradient(135deg,#1d4ed8,#2563eb,#3b82f6)",
            textTransform: "none",
            fontWeight: 900,
            boxShadow: "0 10px 22px rgba(37,99,235,.20)",
            transition: "all .25s ease",
            "&:hover": {
              background:
                "linear-gradient(135deg,#1e40af,#1d4ed8,#2563eb)",
              transform: "translateY(-2px)",
              boxShadow:
                "0 14px 28px rgba(37,99,235,.28)",
            },
          }}
        >
          Add to Cart
        </Button>
      </Box>
    </Paper>
  );
}

/* ==========================================================================
   SKELETON
   ========================================================================== */

function FoodSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        overflow: "hidden",
        borderRadius: "25px",
        border: "1px solid #e2e8f0",
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          height: {
            xs: 220,
            sm: 235,
          },
        }}
      />

      <Box sx={{ p: 2.5 }}>
        <Skeleton width="65%" height={30} />
        <Skeleton width="100%" height={22} />
        <Skeleton
          width="90%"
          height={22}
          sx={{ mb: 2 }}
        />

        <Skeleton width="40%" height={30} />

        <Skeleton
          variant="rounded"
          width="100%"
          height={49}
          sx={{ mt: 2 }}
        />
      </Box>
    </Paper>
  );
}

/* ==========================================================================
   HOME PAGE
   ========================================================================== */

export default function Home() {
  const navigate = useNavigate();

  const {
    cart,
    drawerOpen,
    setDrawerOpen,
    portionOpen,
    setPortionOpen,
    selectedItem,
    handleAddClick,
    addToCart,
    updateQty,
    totalItems,
    totalAmount,
  } = useCart();

  const [foodItems, setFoodItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [menuError, setMenuError] = useState(false);

  const [activeHero, setActiveHero] = useState(0);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [search, setSearch] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* ------------------------------------------------------------------------
     FETCH MENU
  ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    const fetchMenu = async () => {
      try {
        setLoadingMenu(true);
        setMenuError(false);

        const data = await menuService.getMenu();

        if (!mounted) return;

        if (Array.isArray(data) && data.length > 0) {
          setFoodItems(data);
        } else {
          setFoodItems(fallbackMenu);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);

        if (!mounted) return;

        setMenuError(true);
        setFoodItems(fallbackMenu);
      } finally {
        if (mounted) {
          setLoadingMenu(false);
        }
      }
    };

    fetchMenu();

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------
     HERO AUTO ROTATION
  ------------------------------------------------------------------------ */

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHero(
        (previous) =>
          (previous + 1) % heroSlides.length
      );
    }, 6500);

    return () => clearInterval(timer);
  }, []);

  /* ------------------------------------------------------------------------
     ACTIVE HERO
  ------------------------------------------------------------------------ */

  const activeSlide = heroSlides[activeHero];

  /* ------------------------------------------------------------------------
     FILTERED ITEMS
  ------------------------------------------------------------------------ */

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return foodItems.filter((item) => {
      const categoryMatch =
        selectedCategory === "All" ||
        String(item?.category || "").toLowerCase() ===
          selectedCategory.toLowerCase();

      const searchMatch =
        !query ||
        String(item?.name || "")
          .toLowerCase()
          .includes(query) ||
        String(item?.category || "")
          .toLowerCase()
          .includes(query);

      return categoryMatch && searchMatch;
    });
  }, [
    foodItems,
    search,
    selectedCategory,
  ]);

  /* ------------------------------------------------------------------------
     POPULAR ITEMS
  ------------------------------------------------------------------------ */

  const popularItems = useMemo(() => {
    return foodItems.slice(0, 4);
  }, [foodItems]);

  /* ------------------------------------------------------------------------
     FORMAT PRICE
  ------------------------------------------------------------------------ */

  const formatPrice = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  /* ------------------------------------------------------------------------
     SCROLL
  ------------------------------------------------------------------------ */

  const scrollToSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  /* ------------------------------------------------------------------------
     CATEGORY CLICK
  ------------------------------------------------------------------------ */

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    setTimeout(() => {
      scrollToSection("signature-dishes");
    }, 80);
  };

  /* ------------------------------------------------------------------------
     ADD TO CART
  ------------------------------------------------------------------------ */

  const handleAddToCart = (item) => {
    handleAddClick(item);

    setSnackbar({
      open: true,
      message: `${item?.name || "Dish"} added to selection.`,
      severity: "success",
    });
  };

  /* ------------------------------------------------------------------------
     CLOSE SNACKBAR
  ------------------------------------------------------------------------ */

  const handleCloseSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  /* ------------------------------------------------------------------------
     RENDER
  ------------------------------------------------------------------------ */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#ffffff 0%,#f8fafc 40%,#ffffff 100%)",
        pb: totalItems > 0 ? 10 : 0,
      }}
    >
      {/* ====================================================================
          HEADER
      ==================================================================== */}

      <Header
        totalItems={totalItems}
        onCartClick={() => setDrawerOpen(true)}
      />

      {/* ====================================================================
          HERO
      ==================================================================== */}

      <Box
        sx={{
          position: "relative",
          minHeight: {
            xs: 690,
            sm: 690,
            md: 720,
          },
          overflow: "hidden",
          background: "#020617",
        }}
      >
        {/* HERO IMAGE */}

        <Fade
          in
          key={activeHero}
          timeout={700}
        >
          <Box
            component="img"
            src={activeSlide.image}
            alt="Famous Cook restaurant food"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              opacity: 0.72,
              transform: "scale(1.02)",
            }}
          />
        </Fade>

        {/* OVERLAY */}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,rgba(2,6,23,.96) 0%,rgba(2,6,23,.85) 35%,rgba(2,6,23,.48) 70%,rgba(2,6,23,.70) 100%)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(0deg,rgba(2,6,23,.94) 0%,transparent 35%)",
          }}
        />

        {/* DECORATIVE GLOW */}

        <Box
          sx={{
            position: "absolute",
            width: 550,
            height: 550,
            borderRadius: "50%",
            right: -280,
            top: -230,
            background:
              "radial-gradient(circle,rgba(37,99,235,.30),transparent 68%)",
            pointerEvents: "none",
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            minHeight: {
              xs: 690,
              sm: 690,
              md: 720,
            },
            display: "flex",
            alignItems: "center",
            pt: {
              xs: 4,
              md: 0,
            },
            pb: 8,
          }}
        >
          <Fade
            in
            key={`content-${activeHero}`}
            timeout={650}
          >
            <Box
              sx={{
                maxWidth: 750,
              }}
            >
              {/* EYEBROW */}

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2.5 }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 2,
                    background: "#60a5fa",
                  }}
                />

                <Typography
                  sx={{
                    color: "#93c5fd",
                    fontSize: 11,
                    fontWeight: 950,
                    letterSpacing: ".20em",
                  }}
                >
                  {activeSlide.eyebrow}
                </Typography>
              </Stack>

              {/* TITLE */}

              <Typography
                component="h1"
                sx={{
                  color: "#ffffff",
                  fontSize: {
                    xs: "3.1rem",
                    sm: "4.3rem",
                    md: "5.7rem",
                  },
                  lineHeight: 0.96,
                  fontWeight: 950,
                  letterSpacing: "-.06em",
                  mb: 2.5,
                }}
              >
                {activeSlide.title}

                <Box
                  component="span"
                  sx={{
                    display: "block",
                    color: "#60a5fa",
                  }}
                >
                  {activeSlide.highlight}
                </Box>
              </Typography>

              {/* DESCRIPTION */}

              <Typography
                sx={{
                  maxWidth: 600,
                  color: "#cbd5e1",
                  fontSize: {
                    xs: 15,
                    sm: 17,
                  },
                  lineHeight: 1.75,
                  mb: 3.5,
                }}
              >
                {activeSlide.description}
              </Typography>

              {/* ACTIONS */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1.5}
                sx={{ mb: 4 }}
              >
                <Button
                  onClick={() =>
                    navigate("/menu")
                  }
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    minHeight: 56,
                    px: 3.2,
                    borderRadius: "15px",
                    color: "#ffffff",
                    background:
                      "linear-gradient(135deg,#2563eb,#3b82f6)",
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: 950,
                    boxShadow:
                      "0 16px 35px rgba(37,99,235,.30)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#1d4ed8,#2563eb)",
                      transform:
                        "translateY(-2px)",
                    },
                    transition:
                      "all .25s ease",
                  }}
                >
                  Explore Full Menu
                </Button>

                <Button
                  onClick={() =>
                    scrollToSection(
                      "signature-dishes"
                    )
                  }
                  startIcon={<RestaurantMenuIcon />}
                  sx={{
                    minHeight: 56,
                    px: 3,
                    borderRadius: "15px",
                    color: "#ffffff",
                    border:
                      "1px solid rgba(255,255,255,.20)",
                    background:
                      "rgba(255,255,255,.07)",
                    backdropFilter: "blur(10px)",
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: 900,
                    "&:hover": {
                      background:
                        "rgba(255,255,255,.12)",
                    },
                  }}
                >
                  View Signature Dishes
                </Button>
              </Stack>

              {/* HERO TRUST */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={{
                  xs: 1.5,
                  sm: 3,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <VerifiedIcon
                    sx={{
                      color: "#60a5fa",
                      fontSize: 19,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Freshly prepared
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <StarIcon
                    sx={{
                      color: "#fbbf24",
                      fontSize: 19,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Loved by local foodies
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <DeliveryDiningIcon
                    sx={{
                      color: "#60a5fa",
                      fontSize: 20,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Delivery available
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Fade>
        </Container>

        {/* SLIDER CONTROLS */}

        <Box
          sx={{
            position: "absolute",
            bottom: 32,
            left: 0,
            right: 0,
            zIndex: 3,
          }}
        >
          <Container maxWidth="lg">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack
                direction="row"
                spacing={0.8}
              >
                {heroSlides.map(
                  (slide, index) => (
                    <Box
                      key={slide.eyebrow}
                      onClick={() =>
                        setActiveHero(index)
                      }
                      sx={{
                        width:
                          index === activeHero
                            ? 36
                            : 9,
                        height: 5,
                        borderRadius: 10,
                        cursor: "pointer",
                        background:
                          index === activeHero
                            ? "#60a5fa"
                            : "rgba(255,255,255,.35)",
                        transition:
                          "all .3s ease",
                      }}
                    />
                  )
                )}
              </Stack>

              <Stack
                direction="row"
                spacing={1}
              >
                <IconButton
                  onClick={() =>
                    setActiveHero(
                      (activeHero -
                        1 +
                        heroSlides.length) %
                        heroSlides.length
                    )
                  }
                  sx={{
                    width: 42,
                    height: 42,
                    color: "#fff",
                    border:
                      "1px solid rgba(255,255,255,.18)",
                    background:
                      "rgba(255,255,255,.06)",
                    "&:hover": {
                      background:
                        "rgba(255,255,255,.12)",
                    },
                  }}
                >
                  <ArrowBackIcon
                    sx={{ fontSize: 18 }}
                  />
                </IconButton>

                <IconButton
                  onClick={() =>
                    setActiveHero(
                      (activeHero + 1) %
                        heroSlides.length
                    )
                  }
                  sx={{
                    width: 42,
                    height: 42,
                    color: "#fff",
                    border:
                      "1px solid rgba(255,255,255,.18)",
                    background:
                      "rgba(255,255,255,.06)",
                    "&:hover": {
                      background:
                        "rgba(255,255,255,.12)",
                    },
                  }}
                >
                  <ArrowForwardIcon
                    sx={{ fontSize: 18 }}
                  />
                </IconButton>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* ====================================================================
          TRUST STATS
      ==================================================================== */}

      <Box
        sx={{
          position: "relative",
          zIndex: 5,
          mt: {
            xs: 0,
            md: -5,
          },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              background:
                "rgba(255,255,255,.97)",
              backdropFilter: "blur(16px)",
              boxShadow:
                "0 20px 55px rgba(15,23,42,.10)",
            }}
          >
            <Grid container>
              {[
                {
                  icon: <StarIcon />,
                  value: "4.8/5",
                  label: "Customer rating",
                },
                {
                  icon: <RestaurantIcon />,
                  value: "Fresh",
                  label: "Made to order",
                },
                {
                  icon: <DeliveryDiningIcon />,
                  value: "30–40",
                  label: "Min delivery",
                },
                {
                  icon: <VerifiedIcon />,
                  value: "100%",
                  label: "Quality focused",
                },
              ].map((stat, index) => (
                <Grid
                  item
                  xs={6}
                  md={3}
                  key={stat.label}
                >
                  <Box
                    sx={{
                      p: {
                        xs: 2,
                        sm: 2.5,
                      },
                      textAlign: "center",
                      borderRight:
                        index % 2 === 0
                          ? {
                              xs: "1px solid #e2e8f0",
                              md: "1px solid #e2e8f0",
                            }
                          : {
                              xs: "none",
                              md: "1px solid #e2e8f0",
                            },
                      borderBottom:
                        index < 2
                          ? {
                              xs: "1px solid #e2e8f0",
                              md: "none",
                            }
                          : "none",
                    }}
                  >
                    <Box
                      sx={{
                        color: "#2563eb",
                        mb: 0.5,
                      }}
                    >
                      {stat.icon}
                    </Box>

                    <Typography
                      sx={{
                        color: "#0f172a",
                        fontSize: 18,
                        fontWeight: 950,
                      }}
                    >
                      {stat.value}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: 10.5,
                        fontWeight: 700,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* ====================================================================
          SEARCH + QUICK ORDER
      ==================================================================== */}

      <Container
        maxWidth="lg"
        sx={{
          pt: {
            xs: 5,
            md: 7,
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            borderRadius: "22px",
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            boxShadow:
              "0 12px 35px rgba(15,23,42,.05)",
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
          >
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search your favourite dish..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          color: "#64748b",
                        }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setSearch("")
                        }
                      >
                        <CloseIcon
                          sx={{
                            fontSize: 18,
                          }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "15px",
                    background: "#f8fafc",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                onClick={() =>
                  navigate("/menu")
                }
                endIcon={<ArrowForwardIcon />}
                sx={{
                  minHeight: 55,
                  borderRadius: "15px",
                  color: "#ffffff",
                  background:
                    "linear-gradient(135deg,#020617,#1e3a8a)",
                  textTransform: "none",
                  fontWeight: 900,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#0f172a,#1d4ed8)",
                  },
                }}
              >
                Browse Full Menu
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* ====================================================================
          CATEGORIES
      ==================================================================== */}

      <Box
        id="categories"
        sx={{
          pt: {
            xs: 7,
            md: 10,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                color: "#2563eb",
                fontSize: 11,
                fontWeight: 950,
                textTransform: "uppercase",
                letterSpacing: ".18em",
                mb: 1,
              }}
            >
              Explore the menu
            </Typography>

            <Typography
              component="h2"
              sx={{
                color: "#0f172a",
                fontSize: {
                  xs: 30,
                  sm: 40,
                },
                fontWeight: 950,
                letterSpacing: "-.04em",
                mb: 1,
              }}
            >
              Something delicious
              for every craving.
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 14,
                maxWidth: 620,
                lineHeight: 1.7,
              }}
            >
              Discover the flavours that make Famous
              Cook a favourite for everyday meals and
              special occasions.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {homeCategories.map(
              (category) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={category.title}
                >
                  <Paper
                    elevation={0}
                    onClick={() =>
                      handleCategoryClick(
                        category.title
                      )
                    }
                    sx={{
                      height: 225,
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "23px",
                      cursor: "pointer",
                      border:
                        "1px solid rgba(255,255,255,.12)",
                      background: "#020617",
                      transition:
                        "all .35s ease",
                      "&:hover": {
                        transform:
                          "translateY(-6px)",
                        boxShadow:
                          "0 25px 50px rgba(15,23,42,.18)",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={category.image}
                      alt={category.title}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition:
                          "transform .6s ease",
                        "&:hover": {
                          transform:
                            "scale(1.08)",
                        },
                      }}
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg,rgba(2,6,23,.10),rgba(2,6,23,.88))",
                      }}
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        left: 18,
                        right: 18,
                        bottom: 18,
                      }}
                    >
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          mb: 1.2,
                          borderRadius: "13px",
                          display: "grid",
                          placeItems: "center",
                          color: "#fff",
                          background:
                            "rgba(37,99,235,.90)",
                        }}
                      >
                        {category.icon}
                      </Box>

                      <Typography
                        sx={{
                          color: "#fff",
                          fontSize: 19,
                          fontWeight: 950,
                        }}
                      >
                        {category.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#cbd5e1",
                          fontSize: 11,
                          mt: 0.2,
                        }}
                      >
                        {category.subtitle}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </Box>

      {/* ====================================================================
          SIGNATURE DISHES
      ==================================================================== */}

      <Box
        id="signature-dishes"
        sx={{
          pt: {
            xs: 8,
            md: 11,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: {
                xs: "flex-start",
                md: "flex-end",
              },
              gap: 2,
              mb: 4,
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#2563eb",
                  fontSize: 11,
                  fontWeight: 950,
                  textTransform: "uppercase",
                  letterSpacing: ".18em",
                  mb: 1,
                }}
              >
                Chef's selection
              </Typography>

              <Typography
                component="h2"
                sx={{
                  color: "#0f172a",
                  fontSize: {
                    xs: 30,
                    sm: 40,
                  },
                  fontWeight: 950,
                  letterSpacing: "-.04em",
                  mb: 1,
                }}
              >
                Signature dishes
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 14,
                  lineHeight: 1.7,
                  maxWidth: 620,
                }}
              >
                A selection of dishes made for
                customers who know exactly what good
                food should taste like.
              </Typography>
            </Box>

            <Button
              onClick={() =>
                navigate("/menu")
              }
              endIcon={<ArrowForwardIcon />}
              sx={{
                minHeight: 46,
                px: 2,
                borderRadius: "13px",
                color: "#1d4ed8",
                background: "#eff6ff",
                textTransform: "none",
                fontWeight: 900,
                "&:hover": {
                  background: "#dbeafe",
                },
              }}
            >
              See Full Menu
            </Button>
          </Box>

          {/* SEARCH RESULT */}

          {search && (
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                mb: 3,
                borderRadius: "15px",
                border:
                  "1px solid #dbeafe",
                background: "#eff6ff",
              }}
            >
              <Typography
                sx={{
                  color: "#1e40af",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Showing results for "{search}"
                {selectedCategory !==
                  "All" &&
                  ` in ${selectedCategory}`}
              </Typography>
            </Paper>
          )}

          {/* LOADING */}

          {loadingMenu ? (
            <Grid container spacing={2.5}>
              {[1, 2, 3, 4].map(
                (item) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={item}
                  >
                    <FoodSkeleton />
                  </Grid>
                )
              )}
            </Grid>
          ) : (
            <>
              {filteredItems.length > 0 ? (
                <Grid container spacing={2.5}>
                  {filteredItems
                    .slice(0, 8)
                    .map((item) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={
                          item?._id ||
                          item?.id ||
                          item?.name
                        }
                      >
                        <HomeFoodCard
                          item={item}
                          onAdd={
                            handleAddToCart
                          }
                        />
                      </Grid>
                    ))}
                </Grid>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    textAlign: "center",
                    borderRadius: "23px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <RestaurantMenuIcon
                    sx={{
                      fontSize: 50,
                      color: "#94a3b8",
                      mb: 1,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 22,
                      fontWeight: 950,
                      color: "#0f172a",
                    }}
                  >
                    No dishes found
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 13,
                      mt: 0.5,
                      mb: 2,
                    }}
                  >
                    Try another search or explore
                    the complete menu.
                  </Typography>

                  <Button
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory(
                        "All"
                      );
                    }}
                    variant="contained"
                    sx={{
                      borderRadius: "13px",
                      textTransform: "none",
                      fontWeight: 900,
                    }}
                  >
                    Clear Filters
                  </Button>
                </Paper>
              )}
            </>
          )}

          {/* API FALLBACK NOTICE */}

          {menuError && (
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: "14px",
                border:
                  "1px solid #fde68a",
                background: "#fffbeb",
              }}
            >
              <Typography
                sx={{
                  color: "#92400e",
                  fontSize: 11,
                  lineHeight: 1.6,
                }}
              >
                Showing the restaurant demo menu
                while the menu service is unavailable.
                Your frontend is still fully usable.
              </Typography>
            </Paper>
          )}
        </Container>
      </Box>

      {/* ====================================================================
          SPECIAL OFFER
      ==================================================================== */}

      <Box
        sx={{
          pt: {
            xs: 8,
            md: 11,
          },
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              position: "relative",
              overflow: "hidden",
              minHeight: {
                xs: 370,
                md: 330,
              },
              borderRadius: "30px",
              background:
                "linear-gradient(115deg,#020617 0%,#0f172a 50%,#172554 100%)",
              border:
                "1px solid rgba(255,255,255,.08)",
              boxShadow:
                "0 25px 65px rgba(15,23,42,.16)",
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1500&q=85"
              alt="Famous Cook special offer"
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                width: {
                  xs: "100%",
                  md: "53%",
                },
                height: "100%",
                objectFit: "cover",
                opacity: {
                  xs: 0.22,
                  md: 0.72,
                },
              }}
            />

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg,#020617 0%,rgba(2,6,23,.96) 38%,rgba(2,6,23,.50) 75%,rgba(2,6,23,.55) 100%)",
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                p: {
                  xs: 3,
                  sm: 5,
                  md: 6,
                },
                maxWidth: 700,
              }}
            >
              <Chip
                icon={
                  <LocalOfferOutlinedIcon />
                }
                label="LIMITED TIME OFFER"
                sx={{
                  mb: 2,
                  color: "#dbeafe",
                  background:
                    "rgba(37,99,235,.20)",
                  border:
                    "1px solid rgba(96,165,250,.30)",
                  fontWeight: 900,
                }}
              />

              <Typography
                sx={{
                  color: "#fff",
                  fontSize: {
                    xs: 31,
                    sm: 44,
                  },
                  fontWeight: 950,
                  lineHeight: 1.05,
                  letterSpacing: "-.045em",
                  mb: 1.5,
                }}
              >
                Make your next meal
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    color: "#60a5fa",
                  }}
                >
                  extra special.
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: "#cbd5e1",
                  fontSize: 14,
                  lineHeight: 1.7,
                  maxWidth: 520,
                  mb: 3,
                }}
              >
                Explore our chef-selected dishes and
                discover a menu designed around flavour,
                freshness and satisfying portions.
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1.2}
              >
                <Button
                  onClick={() =>
                    navigate("/menu")
                  }
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    minHeight: 52,
                    px: 2.7,
                    borderRadius: "14px",
                    color: "#fff",
                    background:
                      "linear-gradient(135deg,#2563eb,#3b82f6)",
                    textTransform: "none",
                    fontWeight: 900,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#1d4ed8,#2563eb)",
                    },
                  }}
                >
                  Order Now
                </Button>

                <Button
                  onClick={() =>
                    scrollToSection(
                      "why-us"
                    )
                  }
                  sx={{
                    minHeight: 52,
                    px: 2.5,
                    borderRadius: "14px",
                    color: "#fff",
                    border:
                      "1px solid rgba(255,255,255,.18)",
                    background:
                      "rgba(255,255,255,.05)",
                    textTransform: "none",
                    fontWeight: 800,
                    "&:hover": {
                      background:
                        "rgba(255,255,255,.10)",
                    },
                  }}
                >
                  Why Famous Cook?
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* ====================================================================
          WHY CHOOSE US
      ==================================================================== */}

      <Box
        id="why-us"
        sx={{
          pt: {
            xs: 8,
            md: 11,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={{
              xs: 4,
              md: 7,
            }}
            alignItems="center"
          >
            <Grid item xs={12} md={5}>
              <Typography
                sx={{
                  color: "#2563eb",
                  fontSize: 11,
                  fontWeight: 950,
                  textTransform: "uppercase",
                  letterSpacing: ".18em",
                  mb: 1,
                }}
              >
                Why Famous Cook
              </Typography>

              <Typography
                component="h2"
                sx={{
                  color: "#0f172a",
                  fontSize: {
                    xs: 30,
                    sm: 40,
                  },
                  fontWeight: 950,
                  letterSpacing: "-.04em",
                  lineHeight: 1.08,
                  mb: 1.5,
                }}
              >
                More than a meal.
                A complete food
                experience.
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 14,
                  lineHeight: 1.8,
                  mb: 2.5,
                }}
              >
                We focus on the details that make a
                restaurant experience memorable — from
                ingredient quality to preparation,
                presentation and delivery.
              </Typography>

              <Stack spacing={1.3}>
                {[
                  "Fresh preparation",
                  "Carefully selected ingredients",
                  "Consistent taste",
                  "Convenient online ordering",
                ].map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CheckCircleIcon
                      sx={{
                        color: "#2563eb",
                        fontSize: 19,
                      }}
                    />

                    <Typography
                      sx={{
                        color: "#334155",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                {features.map(
                  (feature) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      key={feature.title}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          height: "100%",
                          p: 2.5,
                          borderRadius: "21px",
                          border:
                            "1px solid #e2e8f0",
                          background: "#fff",
                          transition:
                            "all .3s ease",
                          "&:hover": {
                            transform:
                              "translateY(-5px)",
                            borderColor:
                              "#bfdbfe",
                            boxShadow:
                              "0 18px 40px rgba(15,23,42,.08)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            mb: 2,
                            borderRadius: "15px",
                            display: "grid",
                            placeItems: "center",
                            color: "#2563eb",
                            background:
                              "linear-gradient(135deg,#eff6ff,#dbeafe)",
                          }}
                        >
                          {feature.icon}
                        </Box>

                        <Typography
                          sx={{
                            color: "#0f172a",
                            fontSize: 17,
                            fontWeight: 950,
                            mb: 0.7,
                          }}
                        >
                          {feature.title}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#64748b",
                            fontSize: 12.5,
                            lineHeight: 1.7,
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ====================================================================
          RESTAURANT EXPERIENCE
      ==================================================================== */}

      <Box
        sx={{
          pt: {
            xs: 8,
            md: 11,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={{
              xs: 3,
              md: 5,
            }}
            alignItems="stretch"
          >
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  height: {
                    xs: 330,
                    md: 430,
                  },
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "28px",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=90"
                  alt="Famous Cook restaurant experience"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg,rgba(2,6,23,.05),rgba(2,6,23,.82))",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    left: {
                      xs: 22,
                      md: 32,
                    },
                    right: {
                      xs: 22,
                      md: 32,
                    },
                    bottom: {
                      xs: 22,
                      md: 30,
                    },
                  }}
                >
                  <Chip
                    label="THE FAMOUS COOK EXPERIENCE"
                    sx={{
                      mb: 1.5,
                      color: "#dbeafe",
                      background:
                        "rgba(37,99,235,.75)",
                      fontWeight: 900,
                      fontSize: 9,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: {
                        xs: 25,
                        md: 35,
                      },
                      fontWeight: 950,
                      letterSpacing: "-.035em",
                    }}
                  >
                    Good food belongs
                    at good moments.
                  </Typography>

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12.5,
                      lineHeight: 1.7,
                      mt: 0.8,
                      maxWidth: 570,
                    }}
                  >
                    Whether you're ordering dinner,
                    meeting friends or celebrating
                    something special, Famous Cook is
                    here to make the moment taste better.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: {
                    xs: 3,
                    md: 4,
                  },
                  borderRadius: "28px",
                  color: "#fff",
                  background:
                    "linear-gradient(150deg,#020617,#0f172a 60%,#1e3a8a)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 230,
                    height: 230,
                    borderRadius: "50%",
                    right: -100,
                    top: -100,
                    background:
                      "rgba(37,99,235,.18)",
                  }}
                />

                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <RestaurantIcon
                    sx={{
                      color: "#60a5fa",
                      fontSize: 40,
                      mb: 2,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 29,
                      fontWeight: 950,
                      letterSpacing: "-.04em",
                      mb: 1,
                    }}
                  >
                    Visit us
                  </Typography>

                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: 13,
                      lineHeight: 1.7,
                      mb: 3,
                    }}
                  >
                    Come experience the Famous Cook
                    atmosphere and enjoy freshly prepared
                    food with family and friends.
                  </Typography>

                  <Stack spacing={2.2}>
                    <Stack
                      direction="row"
                      spacing={1.4}
                      alignItems="flex-start"
                    >
                      <LocationOnIcon
                        sx={{
                          color: "#60a5fa",
                          mt: 0.2,
                        }}
                      />

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          Location
                        </Typography>

                        <Typography
                          sx={{
                            color: "#94a3b8",
                            fontSize: 11,
                            mt: 0.3,
                          }}
                        >
                          Panvel, Navi Mumbai
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1.4}
                      alignItems="flex-start"
                    >
                      <AccessTimeIcon
                        sx={{
                          color: "#60a5fa",
                          mt: 0.2,
                        }}
                      />

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          Opening Hours
                        </Typography>

                        <Typography
                          sx={{
                            color: "#94a3b8",
                            fontSize: 11,
                            mt: 0.3,
                          }}
                        >
                          Daily • 6:00 PM – 11:00 PM
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1.4}
                      alignItems="flex-start"
                    >
                      <PhoneOutlinedIcon
                        sx={{
                          color: "#60a5fa",
                          mt: 0.2,
                        }}
                      />

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          Reservations & Orders
                        </Typography>

                        <Typography
                          sx={{
                            color: "#94a3b8",
                            fontSize: 11,
                            mt: 0.3,
                          }}
                        >
                          Contact the restaurant directly
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>

                  <Button
                    onClick={() =>
                      navigate("/menu")
                    }
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      mt: 4,
                      minHeight: 49,
                      px: 2.4,
                      borderRadius: "13px",
                      color: "#fff",
                      background:
                        "rgba(37,99,235,.85)",
                      textTransform: "none",
                      fontWeight: 900,
                      "&:hover": {
                        background:
                          "rgba(37,99,235,1)",
                      },
                    }}
                  >
                    Order Online
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ====================================================================
          REVIEWS
      ==================================================================== */}

      <Box
        sx={{
          pt: {
            xs: 8,
            md: 11,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              maxWidth: 700,
              mx: "auto",
              mb: 4,
            }}
          >
            <Typography
              sx={{
                color: "#2563eb",
                fontSize: 11,
                fontWeight: 950,
                textTransform: "uppercase",
                letterSpacing: ".18em",
                mb: 1,
              }}
            >
              Customer love
            </Typography>

            <Typography
              component="h2"
              sx={{
                color: "#0f172a",
                fontSize: {
                  xs: 30,
                  sm: 40,
                },
                fontWeight: 950,
                letterSpacing: "-.04em",
                mb: 1,
              }}
            >
              Made for repeat orders.
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              A restaurant is only as good as the people
              who come back. Here's what our customers
              have to say.
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {reviews.map((review) => (
              <Grid
                item
                xs={12}
                md={4}
                key={review.name}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: "23px",
                    border:
                      "1px solid #e2e8f0",
                    background: "#fff",
                    transition:
                      "all .3s ease",
                    "&:hover": {
                      transform:
                        "translateY(-5px)",
                      boxShadow:
                        "0 18px 40px rgba(15,23,42,.08)",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={0.4}
                    sx={{ mb: 2 }}
                  >
                    {Array.from({
                      length: 5,
                    }).map((_, index) => (
                      <StarIcon
                        key={index}
                        sx={{
                          fontSize: 18,
                          color:
                            index <
                            review.rating
                              ? "#fbbf24"
                              : "#e2e8f0",
                        }}
                      />
                    ))}
                  </Stack>

                  <Typography
                    sx={{
                      color: "#334155",
                      fontSize: 13.5,
                      lineHeight: 1.8,
                      mb: 2.5,
                    }}
                  >
                    “{review.text}”
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Stack
                    direction="row"
                    spacing={1.2}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "14px",
                        display: "grid",
                        placeItems: "center",
                        color: "#1d4ed8",
                        background:
                          "linear-gradient(135deg,#dbeafe,#eff6ff)",
                        fontWeight: 950,
                      }}
                    >
                      {review.name.charAt(0)}
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          color: "#0f172a",
                          fontSize: 12,
                          fontWeight: 950,
                        }}
                      >
                        {review.name}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontSize: 10,
                        }}
                      >
                        {review.location}
                      </Typography>
                    </Box>

                    <VerifiedIcon
                      sx={{
                        ml: "auto",
                        color: "#2563eb",
                        fontSize: 18,
                      }}
                    />
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ====================================================================
          FINAL CTA
      ==================================================================== */}

      <Box
        sx={{
          pt: {
            xs: 8,
            md: 11,
          },
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 3,
                sm: 5,
                md: 6,
              },
              borderRadius: "30px",
              background:
                "linear-gradient(135deg,#eff6ff,#ffffff 55%,#dbeafe)",
              border:
                "1px solid #bfdbfe",
              textAlign: "center",
              boxShadow:
                "0 20px 55px rgba(37,99,235,.08)",
            }}
          >
            <Box
              sx={{
                width: 58,
                height: 58,
                mx: "auto",
                mb: 2,
                borderRadius: "18px",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                background:
                  "linear-gradient(135deg,#1d4ed8,#3b82f6)",
                boxShadow:
                  "0 12px 28px rgba(37,99,235,.22)",
              }}
            >
              <RestaurantMenuIcon />
            </Box>

            <Typography
              sx={{
                color: "#0f172a",
                fontSize: {
                  xs: 29,
                  sm: 40,
                },
                fontWeight: 950,
                letterSpacing: "-.045em",
                mb: 1,
              }}
            >
              Hungry already?
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 600,
                mx: "auto",
                mb: 3,
              }}
            >
              Explore our complete menu, choose your
              favourite dishes and let Famous Cook take
              care of the rest.
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.2}
              justifyContent="center"
            >
              <Button
                onClick={() =>
                  navigate("/menu")
                }
                endIcon={<ArrowForwardIcon />}
                sx={{
                  minHeight: 53,
                  px: 3,
                  borderRadius: "14px",
                  color: "#fff",
                  background:
                    "linear-gradient(135deg,#1d4ed8,#3b82f6)",
                  textTransform: "none",
                  fontWeight: 950,
                  boxShadow:
                    "0 12px 28px rgba(37,99,235,.20)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#1e40af,#2563eb)",
                  },
                }}
              >
                Start Your Order
              </Button>

              <Button
                onClick={() =>
                  scrollToSection(
                    "categories"
                  )
                }
                sx={{
                  minHeight: 53,
                  px: 3,
                  borderRadius: "14px",
                  color: "#1d4ed8",
                  background: "#fff",
                  border:
                    "1px solid #bfdbfe",
                  textTransform: "none",
                  fontWeight: 900,
                  "&:hover": {
                    background: "#eff6ff",
                  },
                }}
              >
                Explore Categories
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* ====================================================================
          FOOTER
      ==================================================================== */}

      <Box
        component="footer"
        sx={{
          mt: {
            xs: 8,
            md: 11,
          },
          color: "#ffffff",
          background:
            "linear-gradient(145deg,#020617 0%,#0f172a 55%,#172554 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              py: {
                xs: 5,
                md: 7,
              },
            }}
          >
            <Grid
              container
              spacing={4}
            >
              {/* BRAND */}

              <Grid
                item
                xs={12}
                md={4}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "14px",
                      display: "grid",
                      placeItems: "center",
                      background:
                        "linear-gradient(135deg,#2563eb,#3b82f6)",
                    }}
                  >
                    <RestaurantMenuIcon />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: 950,
                      }}
                    >
                      Famous Cook
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: 10,
                      }}
                    >
                      Premium Restaurant
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: 12.5,
                    lineHeight: 1.8,
                    maxWidth: 360,
                  }}
                >
                  Fresh food, authentic flavours and a
                  premium ordering experience built around
                  what customers love.
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2.5 }}
                >
                  <IconButton
                    sx={{
                      width: 38,
                      height: 38,
                      color: "#cbd5e1",
                      border:
                        "1px solid rgba(255,255,255,.10)",
                      background:
                        "rgba(255,255,255,.04)",
                    }}
                  >
                    <InstagramIcon
                      sx={{ fontSize: 18 }}
                    />
                  </IconButton>

                  <IconButton
                    sx={{
                      width: 38,
                      height: 38,
                      color: "#cbd5e1",
                      border:
                        "1px solid rgba(255,255,255,.10)",
                      background:
                        "rgba(255,255,255,.04)",
                    }}
                  >
                    <PhoneOutlinedIcon
                      sx={{ fontSize: 18 }}
                    />
                  </IconButton>
                </Stack>
              </Grid>

              {/* EXPLORE */}

              <Grid
                item
                xs={6}
                sm={4}
                md={2}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 950,
                    mb: 2,
                  }}
                >
                  Explore
                </Typography>

                <Stack spacing={1.3}>
                  <Typography
                    onClick={() =>
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      })
                    }
                    sx={{
                      color: "#94a3b8",
                      fontSize: 12.5,
                      cursor: "pointer",
                      "&:hover": {
                        color: "#fff",
                      },
                    }}
                  >
                    Home
                  </Typography>

                  <Typography
                    onClick={() =>
                      navigate("/menu")
                    }
                    sx={{
                      color: "#94a3b8",
                      fontSize: 12.5,
                      cursor: "pointer",
                      "&:hover": {
                        color: "#fff",
                      },
                    }}
                  >
                    Menu
                  </Typography>

                  <Typography
                    onClick={() =>
                      scrollToSection(
                        "signature-dishes"
                      )
                    }
                    sx={{
                      color: "#94a3b8",
                      fontSize: 12.5,
                      cursor: "pointer",
                      "&:hover": {
                        color: "#fff",
                      },
                    }}
                  >
                    Popular Dishes
                  </Typography>

                  <Typography
                    onClick={() =>
                      scrollToSection(
                        "why-us"
                      )
                    }
                    sx={{
                      color: "#94a3b8",
                      fontSize: 12.5,
                      cursor: "pointer",
                      "&:hover": {
                        color: "#fff",
                      },
                    }}
                  >
                    Why Us
                  </Typography>
                </Stack>
              </Grid>

              {/* VISIT */}

              <Grid
                item
                xs={6}
                sm={4}
                md={3}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 950,
                    mb: 2,
                  }}
                >
                  Visit
                </Typography>

                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <LocationOnIcon
                      sx={{
                        color: "#60a5fa",
                        fontSize: 18,
                      }}
                    />

                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: 12,
                        lineHeight: 1.5,
                      }}
                    >
                      Panvel,
                      <br />
                      Navi Mumbai
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <AccessTimeIcon
                      sx={{
                        color: "#60a5fa",
                        fontSize: 18,
                      }}
                    />

                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: 12,
                        lineHeight: 1.5,
                      }}
                    >
                      Daily
                      <br />
                      6 PM – 11 PM
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <DeliveryDiningIcon
                      sx={{
                        color: "#60a5fa",
                        fontSize: 18,
                      }}
                    />

                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: 12,
                        lineHeight: 1.5,
                      }}
                    >
                      Delivery
                      <br />
                      Available
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              {/* ORDER */}

              <Grid
                item
                xs={12}
                sm={4}
                md={3}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 950,
                    mb: 2,
                  }}
                >
                  Order Online
                </Typography>

                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: 12.5,
                    lineHeight: 1.7,
                    mb: 2,
                  }}
                >
                  Browse the complete menu and order your
                  favourite dishes from Famous Cook.
                </Typography>

                <Button
                  onClick={() =>
                    navigate("/menu")
                  }
                  endIcon={
                    <ArrowForwardIcon />
                  }
                  sx={{
                    minHeight: 45,
                    color: "#fff",
                    background:
                      "linear-gradient(135deg,#1d4ed8,#2563eb)",
                    borderRadius: "12px",
                    px: 2,
                    textTransform: "none",
                    fontWeight: 900,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#1e40af,#1d4ed8)",
                    },
                  }}
                >
                  Order Now
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Divider
            sx={{
              borderColor:
                "rgba(255,255,255,.08)",
            }}
          />

          <Box
            sx={{
              py: 2.5,
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: 2,
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            <Typography
              sx={{
                color: "#64748b",
                fontSize: 11.5,
              }}
            >
              © {new Date().getFullYear()} Famous
              Cook. All rights reserved.
            </Typography>

            <Stack
              direction="row"
              spacing={2}
            >
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 11,
                }}
              >
                Fresh • Quality • Taste
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 11,
                }}
              >
                Premium Restaurant
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ====================================================================
          PORTION SELECTION DIALOG
      ==================================================================== */}

      <Dialog
        open={portionOpen}
        onClose={() =>
          setPortionOpen(false)
        }
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "25px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 3,
            pt: 3,
            pb: 1,
            fontWeight: 950,
            color: "#0f172a",
          }}
        >
          Choose your portion
        </DialogTitle>

        <DialogContent
          sx={{
            px: 3,
            pt: "12px !important",
          }}
        >
          {selectedItem && (
            <>
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 13,
                  mb: 2.5,
                }}
              >
                Select the portion size for{" "}
                <strong>
                  {selectedItem.name}
                </strong>
                .
              </Typography>

              <Stack spacing={1.3}>
                <Button
                  fullWidth
                  onClick={() =>
                    addToCart("Half")
                  }
                  sx={{
                    minHeight: 70,
                    px: 2,
                    justifyContent:
                      "space-between",
                    borderRadius: "17px",
                    border:
                      "1px solid #e2e8f0",
                    color: "#0f172a",
                    background: "#fff",
                    textTransform: "none",
                    "&:hover": {
                      borderColor:
                        "#93c5fd",
                      background:
                        "#eff6ff",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "13px",
                        display: "grid",
                        placeItems: "center",
                        color: "#2563eb",
                        background:
                          "#eff6ff",
                      }}
                    >
                      <RestaurantMenuIcon />
                    </Box>

                    <Box
                      sx={{
                        textAlign: "left",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: 14,
                        }}
                      >
                        Half Portion
                      </Typography>

                      <Typography
                        sx={{
                          color: "#64748b",
                          fontSize: 10,
                        }}
                      >
                        Perfect for one
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography
                    sx={{
                      color: "#1d4ed8",
                      fontWeight: 950,
                    }}
                  >
                    {formatPrice(
                      selectedItem.priceHalf
                    )}
                  </Typography>
                </Button>

                <Button
                  fullWidth
                  onClick={() =>
                    addToCart("Full")
                  }
                  sx={{
                    minHeight: 70,
                    px: 2,
                    justifyContent:
                      "space-between",
                    borderRadius: "17px",
                    border:
                      "1px solid #bfdbfe",
                    color: "#0f172a",
                    background:
                      "linear-gradient(135deg,#eff6ff,#fff)",
                    textTransform: "none",
                    "&:hover": {
                      borderColor:
                        "#60a5fa",
                      background:
                        "#dbeafe",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "13px",
                        display: "grid",
                        placeItems: "center",
                        color: "#fff",
                        background:
                          "linear-gradient(135deg,#1d4ed8,#3b82f6)",
                      }}
                    >
                      <RestaurantIcon />
                    </Box>

                    <Box
                      sx={{
                        textAlign: "left",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.7}
                        alignItems="center"
                      >
                        <Typography
                          sx={{
                            fontWeight: 900,
                            fontSize: 14,
                          }}
                        >
                          Full Portion
                        </Typography>

                        <Chip
                          label="Best value"
                          size="small"
                          sx={{
                            height: 20,
                            color: "#166534",
                            background:
                              "#dcfce7",
                            fontSize: 8,
                            fontWeight: 900,
                          }}
                        />
                      </Stack>

                      <Typography
                        sx={{
                          color: "#64748b",
                          fontSize: 10,
                        }}
                      >
                        Great for sharing
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography
                    sx={{
                      color: "#1d4ed8",
                      fontWeight: 950,
                    }}
                  >
                    {formatPrice(
                      selectedItem.priceFull
                    )}
                  </Typography>
                </Button>
              </Stack>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            fullWidth
            onClick={() =>
              setPortionOpen(false)
            }
            sx={{
              minHeight: 46,
              borderRadius: "13px",
              color: "#64748b",
              textTransform: "none",
              fontWeight: 800,
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* ====================================================================
          CART DRAWER
      ==================================================================== */}

      <Dialog
        open={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: {
              xs: "25px 25px 0 0",
              sm: "25px",
            },
            margin: {
              xs: 0,
              sm: 2,
            },
            alignSelf: {
              xs: "flex-end",
              sm: "center",
            },
            maxHeight: {
              xs: "94vh",
              sm: "90vh",
            },
          },
        }}
      >
        {/* CART HEADER */}

        <DialogTitle
          sx={{
            px: 3,
            pt: 3,
            pb: 1.5,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                sx={{
                  color: "#0f172a",
                  fontSize: 23,
                  fontWeight: 950,
                }}
              >
                Your Cart
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 11,
                  mt: 0.3,
                }}
              >
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "items"}{" "}
                selected
              </Typography>
            </Box>

            <IconButton
              onClick={() =>
                setDrawerOpen(false)
              }
              sx={{
                border:
                  "1px solid #e2e8f0",
                color: "#64748b",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent
          sx={{
            px: 3,
            pt: "10px !important",
          }}
        >
          {cart.length === 0 ? (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  borderRadius: "25px",
                  display: "grid",
                  placeItems: "center",
                  color: "#2563eb",
                  background:
                    "linear-gradient(135deg,#eff6ff,#dbeafe)",
                }}
              >
                <ShoppingBagOutlinedIcon
                  sx={{ fontSize: 38 }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#0f172a",
                  fontSize: 22,
                  fontWeight: 950,
                }}
              >
                Your cart is empty
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 13,
                  mt: 0.7,
                  mb: 2.5,
                }}
              >
                Add something delicious to get
                started.
              </Typography>

              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/menu");
                }}
                endIcon={
                  <ArrowForwardIcon />
                }
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  borderRadius: "13px",
                  color: "#fff",
                  background:
                    "linear-gradient(135deg,#1d4ed8,#3b82f6)",
                  textTransform: "none",
                  fontWeight: 900,
                }}
              >
                Browse Menu
              </Button>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {cart.map(
                (item, index) => (
                  <Paper
                    key={`${item.name}-${item.type}-${index}`}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: "18px",
                      border:
                        "1px solid #e2e8f0",
                      background: "#fff",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.4}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 58,
                          height: 58,
                          flexShrink: 0,
                          borderRadius: "16px",
                          display: "grid",
                          placeItems: "center",
                          color: "#2563eb",
                          background:
                            "linear-gradient(135deg,#eff6ff,#dbeafe)",
                        }}
                      >
                        <RestaurantMenuIcon />
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#0f172a",
                            fontSize: 14,
                            fontWeight: 950,
                            whiteSpace:
                              "nowrap",
                            overflow:
                              "hidden",
                            textOverflow:
                              "ellipsis",
                          }}
                        >
                          {item.name}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={0.7}
                          alignItems="center"
                          sx={{ mt: 0.3 }}
                        >
                          <Chip
                            label={item.type}
                            size="small"
                            sx={{
                              height: 20,
                              background:
                                "#f1f5f9",
                              color:
                                "#475569",
                              fontSize: 9,
                              fontWeight: 900,
                            }}
                          />

                          <Typography
                            sx={{
                              color:
                                "#64748b",
                              fontSize: 10,
                            }}
                          >
                            {formatPrice(
                              item.price
                            )}
                          </Typography>
                        </Stack>

                        <Typography
                          sx={{
                            color: "#1d4ed8",
                            fontSize: 13,
                            fontWeight: 950,
                            mt: 0.7,
                          }}
                        >
                          {formatPrice(
                            item.price *
                              item.qty
                          )}
                        </Typography>
                      </Box>

                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        sx={{
                          border:
                            "1px solid #e2e8f0",
                          borderRadius:
                            "12px",
                          p: 0.4,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQty(
                              index,
                              -1
                            )
                          }
                          sx={{
                            width: 28,
                            height: 28,
                            color:
                              "#475569",
                          }}
                        >
                          <RemoveIcon
                            sx={{
                              fontSize: 16,
                            }}
                          />
                        </IconButton>

                        <Typography
                          sx={{
                            width: 20,
                            textAlign:
                              "center",
                            color:
                              "#0f172a",
                            fontSize: 12,
                            fontWeight: 950,
                          }}
                        >
                          {item.qty}
                        </Typography>

                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQty(
                              index,
                              1
                            )
                          }
                          sx={{
                            width: 28,
                            height: 28,
                            color:
                              "#2563eb",
                          }}
                        >
                          <AddIcon
                            sx={{
                              fontSize: 16,
                            }}
                          />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                )
              )}
            </Stack>
          )}
        </DialogContent>

        {cart.length > 0 && (
          <DialogActions
            sx={{
              display: "block",
              px: 3,
              pb: 3,
              pt: 1,
            }}
          >
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1.1}>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: 13,
                  }}
                >
                  Subtotal
                </Typography>

                <Typography
                  sx={{
                    color: "#334155",
                    fontSize: 13,
                    fontWeight: 900,
                  }}
                >
                  {formatPrice(
                    totalAmount
                  )}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: 13,
                  }}
                >
                  Delivery
                </Typography>

                <Typography
                  sx={{
                    color: "#16a34a",
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  ₹30
                </Typography>
              </Stack>

              <Divider sx={{ my: 0.8 }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#0f172a",
                      fontSize: 17,
                      fontWeight: 950,
                    }}
                  >
                    Total
                  </Typography>

                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: 9,
                    }}
                  >
                    Before final checkout
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    color: "#1d4ed8",
                    fontSize: 23,
                    fontWeight: 950,
                  }}
                >
                  {formatPrice(
                    totalAmount + 30
                  )}
                </Typography>
              </Stack>

              <Button
                fullWidth
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/checkout");
                }}
                endIcon={
                  <ArrowForwardIcon />
                }
                sx={{
                  mt: 1,
                  minHeight: 55,
                  borderRadius: "15px",
                  color: "#fff",
                  background:
                    "linear-gradient(135deg,#1d4ed8,#3b82f6)",
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 950,
                  boxShadow:
                    "0 12px 28px rgba(37,99,235,.20)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#1e40af,#2563eb)",
                  },
                }}
              >
                Continue to Checkout
              </Button>

              <Button
                fullWidth
                onClick={() =>
                  setDrawerOpen(false)
                }
                sx={{
                  minHeight: 42,
                  borderRadius: "12px",
                  color: "#64748b",
                  textTransform: "none",
                  fontWeight: 800,
                }}
              >
                Continue Shopping
              </Button>
            </Stack>
          </DialogActions>
        )}
      </Dialog>

      {/* ====================================================================
          MOBILE CART BAR
      ==================================================================== */}

      {totalItems > 0 && (
        <Box
          sx={{
            position: "fixed",
            left: {
              xs: 10,
              sm: 20,
              md: 30,
            },
            right: {
              xs: 10,
              sm: 20,
              md: 30,
            },
            bottom: {
              xs: 10,
              sm: 18,
            },
            zIndex: 1200,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              maxWidth: 900,
              mx: "auto",
              p: 1,
              borderRadius: "20px",
              color: "#fff",
              background:
                "linear-gradient(135deg,#020617,#0f172a 60%,#1e3a8a)",
              border:
                "1px solid rgba(255,255,255,.10)",
              boxShadow:
                "0 20px 55px rgba(2,6,23,.30)",
            }}
          >
            <Button
              fullWidth
              onClick={() =>
                setDrawerOpen(true)
              }
              sx={{
                minHeight: 56,
                px: 1.2,
                borderRadius: "15px",
                color: "#fff",
                justifyContent:
                  "space-between",
                textTransform: "none",
                "&:hover": {
                  background:
                    "rgba(255,255,255,.05)",
                },
              }}
            >
              <Stack
                direction="row"
                spacing={1.2}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "13px",
                    background:
                      "linear-gradient(135deg,#2563eb,#60a5fa)",
                  }}
                >
                  <ShoppingBagOutlinedIcon />
                </Box>

                <Box
                  sx={{
                    textAlign: "left",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    Your order
                  </Typography>

                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 950,
                    }}
                  >
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}{" "}
                    •{" "}
                    {formatPrice(
                      totalAmount
                    )}
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction="row"
                spacing={0.6}
                alignItems="center"
              >
                <Typography
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                    color: "#bfdbfe",
                    fontSize: 11,
                    fontWeight: 900,
                  }}
                >
                  View Cart
                </Typography>

                <ArrowForwardIcon
                  sx={{
                    fontSize: 18,
                  }}
                />
              </Stack>
            </Button>
          </Paper>
        </Box>
      )}

      {/* ====================================================================
          SNACKBAR
      ==================================================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2600}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{
            borderRadius: "14px",
            fontWeight: 800,
            boxShadow:
              "0 15px 35px rgba(15,23,42,.16)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}