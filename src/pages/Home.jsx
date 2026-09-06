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
  IconButton,
  Paper,
  Skeleton,
  InputAdornment,
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
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import RiceBowlIcon from "@mui/icons-material/RiceBowl";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

import Header from "../components/Header";
import { menuService } from "../services/api";
import { useCart } from "../context/CartContext";

/* ==========================================================================
   FALLBACK MENU
   ========================================================================== */

const fallbackMenu = [
  {
    id: "fallback-tandoori",
    name: "Chicken Tandoori",
    category: "Tandoor",
    priceHalf: 190,
    priceFull: 380,
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-dal",
    name: "Dal Fry",
    category: "Gravy",
    priceHalf: 100,
    priceFull: 180,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-rice",
    name: "Veg Fried Rice",
    category: "Rice",
    priceHalf: 90,
    priceFull: 160,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-paneer",
    name: "Paneer Pakoda",
    category: "Starters",
    priceHalf: 80,
    priceFull: 140,
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1200&q=85",
  },
];

/* ==========================================================================
   CATEGORIES
   ========================================================================== */

const categories = [
  {
    name: "All",
    icon: <RestaurantMenuIcon />,
  },
  {
    name: "Starters",
    icon: <LunchDiningIcon />,
  },
  {
    name: "Tandoor",
    icon: <LocalDiningIcon />,
  },
  {
    name: "Rice",
    icon: <RiceBowlIcon />,
  },
  {
    name: "Chicken Gravy",
    icon: <RestaurantIcon />,
  },
];

/* ==========================================================================
   REAL RESTAURANT IMAGE

   Temporary remote image is used so the page works immediately.
   Later we can replace this single URL with the Cloudinary URL of the
   real Famous Cook restaurant photo.
   ========================================================================== */

const restaurantImage =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=90";

/* ==========================================================================
   FOOD CARD
   ========================================================================== */

function HomeFoodCard({ item, onAdd }) {
  const [loaded, setLoaded] = useState(false);

  const halfPrice =
    item?.priceHalf !== undefined &&
    item?.priceHalf !== null
      ? Number(item.priceHalf)
      : null;

  const fullPrice =
    item?.priceFull !== undefined &&
    item?.priceFull !== null
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
        overflow: "hidden",
        height: "100%",
        borderRadius: {
          xs: "17px",
          sm: "22px",
        },
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        transition: "transform .25s ease, box-shadow .25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            "0 18px 40px rgba(15,23,42,.10)",
        },
      }}
    >
      {/* IMAGE */}

      <Box
        sx={{
          position: "relative",
          height: {
            xs: 145,
            sm: 205,
            md: 220,
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
            transition: "transform .45s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg,transparent 50%,rgba(0,0,0,.65) 100%)",
          }}
        />

        <Chip
          icon={
            <LocalFireDepartmentIcon
              sx={{
                color: "#f97316 !important",
                fontSize: {
                  xs: "14px !important",
                  sm: "17px !important",
                },
              }}
            />
          }
          label="Popular"
          size="small"
          sx={{
            position: "absolute",
            top: {
              xs: 8,
              sm: 12,
            },
            left: {
              xs: 8,
              sm: 12,
            },
            height: {
              xs: 24,
              sm: 30,
            },
            background: "#ffffff",
            color: "#0f172a",
            fontSize: {
              xs: 9,
              sm: 11,
            },
            fontWeight: 900,
          }}
        />

        <Stack
          direction="row"
          spacing={0.4}
          alignItems="center"
          sx={{
            position: "absolute",
            bottom: {
              xs: 8,
              sm: 12,
            },
            left: {
              xs: 9,
              sm: 12,
            },
          }}
        >
          <StarIcon
            sx={{
              color: "#fbbf24",
              fontSize: {
                xs: 14,
                sm: 17,
              },
            }}
          />

          <Typography
            sx={{
              color: "#ffffff",
              fontSize: {
                xs: 9,
                sm: 11,
              },
              fontWeight: 900,
            }}
          >
            Customer favourite
          </Typography>
        </Stack>
      </Box>

      {/* CONTENT */}

      <Box
        sx={{
          p: {
            xs: 1.35,
            sm: 2,
          },
        }}
      >
        <Typography
          sx={{
            color: "#0f172a",
            fontSize: {
              xs: 15,
              sm: 19,
            },
            fontWeight: 950,
            lineHeight: 1.2,
            mb: {
              xs: 0.5,
              sm: 0.8,
            },
          }}
        >
          {item?.name}
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            fontSize: {
              xs: 10.5,
              sm: 12.5,
            },
            lineHeight: 1.5,
            minHeight: {
              xs: 32,
              sm: 38,
            },
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: {
              xs: 0.8,
              sm: 1.2,
            },
          }}
        >
          Freshly prepared with selected ingredients
          for a rich and satisfying flavour.
        </Typography>

        <Divider sx={{ mb: 1 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 1.2,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: {
                  xs: 8,
                  sm: 9,
                },
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              {hasTwoPrices ? "Half" : "Price"}
            </Typography>

            <Typography
              sx={{
                color: "#0f766e",
                fontSize: {
                  xs: 17,
                  sm: 20,
                },
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
                  color: "#94a3b8",
                  fontSize: {
                    xs: 8,
                    sm: 9,
                  },
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Full
              </Typography>

              <Typography
                sx={{
                  color: "#0f172a",
                  fontSize: {
                    xs: 13,
                    sm: 15,
                  },
                  fontWeight: 900,
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
            minHeight: {
              xs: 38,
              sm: 45,
            },
            borderRadius: {
              xs: "10px",
              sm: "12px",
            },
            color: "#ffffff",
            background:
              "linear-gradient(135deg,#0f766e,#0d9488)",
            textTransform: "none",
            fontSize: {
              xs: 10,
              sm: 13,
            },
            fontWeight: 900,
            "&:hover": {
              background:
                "linear-gradient(135deg,#115e59,#0f766e)",
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
   FOOD SKELETON
   ========================================================================== */

function FoodSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        overflow: "hidden",
        borderRadius: "18px",
        border: "1px solid #e2e8f0",
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          height: {
            xs: 145,
            sm: 205,
          },
        }}
      />

      <Box sx={{ p: 1.5 }}>
        <Skeleton width="70%" height={25} />
        <Skeleton width="100%" height={18} />
        <Skeleton width="80%" height={18} />
        <Skeleton
          variant="rounded"
          width="100%"
          height={40}
          sx={{ mt: 1 }}
        />
      </Box>
    </Paper>
  );
}

/* ==========================================================================
   HOME
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
     FILTER
     ------------------------------------------------------------------------ */

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return foodItems.filter((item) => {
      const categoryMatch =
        selectedCategory === "All" ||
        String(item?.category || "")
          .toLowerCase()
          .includes(selectedCategory.toLowerCase());

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
    selectedCategory,
    search,
  ]);

  /* ------------------------------------------------------------------------
     POPULAR DISHES
     ------------------------------------------------------------------------ */

  const popularItems = useMemo(() => {
    if (search || selectedCategory !== "All") {
      return filteredItems.slice(0, 6);
    }

    return foodItems.slice(0, 6);
  }, [
    foodItems,
    filteredItems,
    search,
    selectedCategory,
  ]);

  /* ------------------------------------------------------------------------
     PRICE
     ------------------------------------------------------------------------ */

  const formatPrice = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  /* ------------------------------------------------------------------------
     ADD TO CART
     ------------------------------------------------------------------------ */

  const handleAddToCart = (item) => {
    handleAddClick(item);

    setSnackbar({
      open: true,
      message: `${item?.name || "Dish"} selected.`,
      severity: "success",
    });
  };

  /* ------------------------------------------------------------------------
     CATEGORY
     ------------------------------------------------------------------------ */

  const handleCategory = (category) => {
    setSelectedCategory(category);

    setTimeout(() => {
      document
        .getElementById("popular-dishes")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 80);
  };

  /* ------------------------------------------------------------------------
     CLOSE SNACKBAR
     ------------------------------------------------------------------------ */

  const closeSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  /* ------------------------------------------------------------------------
     PAGE
     ------------------------------------------------------------------------ */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#ffffff 0%,#f8fafc 45%,#ffffff 100%)",
        pb: totalItems > 0 ? 10 : 0,
      }}
    >
      {/* ================================================================
          HEADER
      ================================================================ */}

      <Header
        totalItems={totalItems}
        onCartClick={() => setDrawerOpen(true)}
      />

      {/* ================================================================
          RESTAURANT HERO
      ================================================================ */}

      <Box
        sx={{
          position: "relative",
          minHeight: {
            xs: 520,
            sm: 560,
            md: 600,
          },
          overflow: "hidden",
          background: "#180b0b",
        }}
      >
        <Box
          component="img"
          src="/famous-cook-restaurant.jpg"
          alt="Famous Cook Restaurant"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,rgba(15,5,5,.95) 0%,rgba(35,8,8,.78) 45%,rgba(20,5,5,.35) 100%)",
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            minHeight: {
              xs: 520,
              sm: 560,
              md: 600,
            },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              maxWidth: {
                xs: "100%",
                md: 700,
              },
              py: 5,
            }}
          >
            <Chip
              label="VEG • NON VEG"
              sx={{
                mb: 2,
                color: "#fff",
                background:
                  "rgba(153,27,27,.88)",
                border:
                  "1px solid rgba(255,255,255,.22)",
                fontWeight: 950,
                letterSpacing: ".10em",
                fontSize: {
                  xs: 9,
                  sm: 11,
                },
              }}
            />

            <Typography
              component="h1"
              sx={{
                color: "#ffffff",
                fontSize: {
                  xs: "3rem",
                  sm: "4.5rem",
                  md: "5.8rem",
                },
                lineHeight: .94,
                fontWeight: 950,
                letterSpacing: "-.06em",
                mb: 2,
              }}
            >
              Famous Cook
              <Box
                component="span"
                sx={{
                  display: "block",
                  color: "#fca5a5",
                }}
              >
                Restaurant.
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#f1f5f9",
                fontSize: {
                  xs: 15,
                  sm: 18,
                },
                lineHeight: 1.7,
                maxWidth: 580,
                mb: 3,
              }}
            >
              Freshly prepared food, authentic flavours
              and satisfying portions — made for the
              people of Panvel.
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.2}
              sx={{
                mb: 3,
              }}
            >
              <Button
                onClick={() => navigate("/menu")}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  minHeight: 52,
                  px: 3,
                  borderRadius: "13px",
                  color: "#fff",
                  background:
                    "linear-gradient(135deg,#dc2626,#b91c1c)",
                  textTransform: "none",
                  fontWeight: 950,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#b91c1c,#991b1b)",
                  },
                }}
              >
                Order Now
              </Button>

              <Button
                onClick={() =>
                  document
                    .getElementById("popular-dishes")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                endIcon={<ArrowForwardIcon />}
                sx={{
                  minHeight: 52,
                  px: 3,
                  borderRadius: "13px",
                  color: "#fff",
                  border:
                    "1px solid rgba(255,255,255,.28)",
                  background:
                    "rgba(255,255,255,.08)",
                  textTransform: "none",
                  fontWeight: 900,
                  "&:hover": {
                    background:
                      "rgba(255,255,255,.14)",
                  },
                }}
              >
                View Popular Dishes
              </Button>
            </Stack>

            <Stack
              direction="row"
              flexWrap="wrap"
              gap={2}
            >
              <Stack
                direction="row"
                spacing={0.7}
                alignItems="center"
              >
                <LocationOnIcon
                  sx={{
                    color: "#fca5a5",
                    fontSize: 18,
                  }}
                />

                <Typography
                  sx={{
                    color: "#e2e8f0",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  Panvel, Navi Mumbai
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={0.7}
                alignItems="center"
              >
                <AccessTimeIcon
                  sx={{
                    color: "#fca5a5",
                    fontSize: 18,
                  }}
                />

                <Typography
                  sx={{
                    color: "#e2e8f0",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  Daily • 6 PM – 11 PM
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ================================================================
          QUICK SEARCH
      ================================================================ */}

      <Container
        maxWidth="lg"
        sx={{
          mt: {
            xs: -3,
            sm: -4,
          },
          position: "relative",
          zIndex: 5,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 1.2,
              sm: 1.5,
            },
            borderRadius: "18px",
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            boxShadow:
              "0 15px 40px rgba(15,23,42,.10)",
          }}
        >
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
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "13px",
                background: "#f8fafc",
              },
            }}
          />
        </Paper>
      </Container>

      {/* ================================================================
          CATEGORIES
      ================================================================ */}

      <Container
        maxWidth="lg"
        sx={{
          pt: {
            xs: 4,
            sm: 5,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {categories.map((category) => {
            const active =
              selectedCategory === category.name;

            return (
              <Button
                key={category.name}
                onClick={() =>
                  handleCategory(category.name)
                }
                startIcon={category.icon}
                sx={{
                  flexShrink: 0,
                  minHeight: 46,
                  px: 2,
                  borderRadius: "13px",
                  color: active
                    ? "#ffffff"
                    : "#334155",
                  background: active
                    ? "#111827"
                    : "#ffffff",
                  border: active
                    ? "1px solid #111827"
                    : "1px solid #e2e8f0",
                  textTransform: "none",
                  fontWeight: 900,
                  "&:hover": {
                    background: active
                      ? "#111827"
                      : "#f8fafc",
                  },
                }}
              >
                {category.name}
              </Button>
            );
          })}
        </Stack>
      </Container>

      {/* ================================================================
          POPULAR DISHES
      ================================================================ */}

      <Container
        id="popular-dishes"
        maxWidth="lg"
        sx={{
          py: {
            xs: 4,
            sm: 6,
          },
          scrollMarginTop: "80px",
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
            sm: "flex-end",
          }}
          spacing={1}
          sx={{
            mb: 2.5,
          }}
        >
          <Box>
            <Stack
              direction="row"
              spacing={0.8}
              alignItems="center"
              sx={{ mb: 0.5 }}
            >
              <LocalFireDepartmentIcon
                sx={{
                  color: "#dc2626",
                }}
              />

              <Typography
                sx={{
                  color: "#991b1b",
                  fontSize: 11,
                  fontWeight: 950,
                  textTransform: "uppercase",
                  letterSpacing: ".14em",
                }}
              >
                Customer favourites
              </Typography>
            </Stack>

            <Typography
              component="h2"
              sx={{
                color: "#0f172a",
                fontSize: {
                  xs: 28,
                  sm: 38,
                },
                fontWeight: 950,
                letterSpacing: "-.04em",
              }}
            >
              Popular Dishes
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 13,
                mt: 0.5,
              }}
            >
              A few dishes customers love.
            </Typography>
          </Box>

          <Button
            onClick={() => navigate("/menu")}
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: "#991b1b",
              textTransform: "none",
              fontWeight: 950,
              px: 0,
            }}
          >
            See Full Menu
          </Button>
        </Stack>

        {menuError && (
          <Alert
            severity="info"
            sx={{
              mb: 2,
              borderRadius: "13px",
            }}
          >
            Showing available menu items. Full menu
            service can be used when the server is online.
          </Alert>
        )}

        {loadingMenu ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2,minmax(0,1fr))",
                sm: "repeat(2,minmax(0,1fr))",
                md: "repeat(3,minmax(0,1fr))",
              },
              gap: {
                xs: 1.5,
                sm: 2,
              },
            }}
          >
            {[1, 2, 3, 4].map((item) => (
              <FoodSkeleton key={item} />
            ))}
          </Box>
        ) : popularItems.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2,minmax(0,1fr))",
                sm: "repeat(2,minmax(0,1fr))",
                md: "repeat(3,minmax(0,1fr))",
              },
              gap: {
                xs: 1.5,
                sm: 2.5,
              },
            }}
          >
            {popularItems.map((item) => (
              <HomeFoodCard
                key={
                  item?._id ||
                  item?.id ||
                  item?.name
                }
                item={item}
                onAdd={handleAddToCart}
              />
            ))}
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              No dishes found
            </Typography>

            <Button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              sx={{
                mt: 1,
                textTransform: "none",
              }}
            >
              Clear Search
            </Button>
          </Paper>
        )}
      </Container>

      {/* ================================================================
          SIMPLE RESTAURANT INTRO
      ================================================================ */}

      <Box
        sx={{
          background: "#111827",
          color: "#ffffff",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            py: {
              xs: 5,
              sm: 7,
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1.15fr .85fr",
              },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#fca5a5",
                  fontSize: 11,
                  fontWeight: 950,
                  textTransform: "uppercase",
                  letterSpacing: ".16em",
                  mb: 1,
                }}
              >
                About Famous Cook
              </Typography>

              <Typography
                component="h2"
                sx={{
                  fontSize: {
                    xs: 29,
                    sm: 40,
                  },
                  lineHeight: 1.05,
                  fontWeight: 950,
                  letterSpacing: "-.04em",
                  mb: 1.5,
                }}
              >
                Simple food.
                <br />
                Proper taste.
              </Typography>

              <Typography
                sx={{
                  color: "#cbd5e1",
                  fontSize: 14,
                  lineHeight: 1.8,
                  maxWidth: 600,
                  mb: 3,
                }}
              >
                Famous Cook is a local restaurant serving
                freshly prepared vegetarian and non-vegetarian
                dishes. From starters and tandoor favourites
                to rice and rich chicken gravies, our focus is
                good food and satisfying portions.
              </Typography>

              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
              >
                <Chip
                  icon={<VerifiedIcon />}
                  label="Fresh preparation"
                  sx={{
                    color: "#dcfce7",
                    background:
                      "rgba(22,163,74,.15)",
                    fontWeight: 800,
                  }}
                />

                <Chip
                  icon={<SecurityIcon />}
                  label="Clean kitchen"
                  sx={{
                    color: "#dbeafe",
                    background:
                      "rgba(37,99,235,.15)",
                    fontWeight: 800,
                  }}
                />
              </Stack>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  sm: 3,
                },
                borderRadius: "22px",
                background:
                  "linear-gradient(145deg,#1f2937,#111827)",
                border:
                  "1px solid rgba(255,255,255,.10)",
              }}
            >
              <Stack spacing={2.3}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: "14px",
                      display: "grid",
                      placeItems: "center",
                      color: "#fca5a5",
                      background:
                        "rgba(220,38,38,.13)",
                    }}
                  >
                    <LocationOnIcon />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: "#94a3b8",
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      Visit Us
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 900,
                      }}
                    >
                      Panvel, Navi Mumbai
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: "14px",
                      display: "grid",
                      placeItems: "center",
                      color: "#fca5a5",
                      background:
                        "rgba(220,38,38,.13)",
                    }}
                  >
                    <AccessTimeIcon />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: "#94a3b8",
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      Opening
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 900,
                      }}
                    >
                      Daily • 6 PM – 11 PM
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: "14px",
                      display: "grid",
                      placeItems: "center",
                      color: "#fca5a5",
                      background:
                        "rgba(220,38,38,.13)",
                    }}
                  >
                    <DeliveryDiningIcon />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: "#94a3b8",
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      Ordering
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 900,
                      }}
                    >
                      Online delivery available
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* ================================================================
          FINAL CTA
      ================================================================ */}

      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 5,
            sm: 7,
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },
            borderRadius: "25px",
            textAlign: "center",
            border: "1px solid #fecaca",
            background:
              "linear-gradient(135deg,#fff7f7,#ffffff)",
          }}
        >
          <RestaurantIcon
            sx={{
              color: "#dc2626",
              fontSize: 38,
              mb: 1,
            }}
          />

          <Typography
            sx={{
              color: "#0f172a",
              fontSize: {
                xs: 26,
                sm: 34,
              },
              fontWeight: 950,
              letterSpacing: "-.04em",
            }}
          >
            Hungry?
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 13,
              mt: 0.5,
              mb: 2.5,
            }}
          >
            Explore the complete Famous Cook menu and
            order your favourite dishes.
          </Typography>

          <Button
            onClick={() => navigate("/menu")}
            endIcon={<ArrowForwardIcon />}
            sx={{
              minHeight: 50,
              px: 3,
              borderRadius: "13px",
              color: "#fff",
              background:
                "linear-gradient(135deg,#dc2626,#b91c1c)",
              textTransform: "none",
              fontWeight: 950,
            }}
          >
            Explore Full Menu
          </Button>
        </Paper>
      </Container>

      {/* ================================================================
          FOOTER
      ================================================================ */}

      <Box
        sx={{
          background: "#020617",
          color: "#ffffff",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            py: 5,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 4,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 950,
                }}
              >
                Famous Cook
              </Typography>

              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: 12,
                  mt: 0.5,
                }}
              >
                Premium Restaurant
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 12,
                  lineHeight: 1.7,
                  mt: 1.5,
                  maxWidth: 400,
                }}
              >
                Fresh food, authentic flavours and a simple
                online ordering experience.
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#fca5a5",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: ".14em",
                  mb: 1.2,
                }}
              >
                Contact
              </Typography>

              <Stack spacing={1}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <LocationOnIcon
                    sx={{
                      color: "#f87171",
                      fontSize: 18,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12,
                    }}
                  >
                    Panvel, Navi Mumbai
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <PhoneOutlinedIcon
                    sx={{
                      color: "#f87171",
                      fontSize: 18,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12,
                    }}
                  >
                    Restaurant Contact
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>

          <Divider
            sx={{
              my: 3,
              borderColor:
                "rgba(255,255,255,.08)",
            }}
          />

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 10,
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Famous Cook.
            All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* ================================================================
          PORTION SELECTION
      ================================================================ */}

      <Dialog
        open={portionOpen}
        onClose={() => setPortionOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "24px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 950,
            color: "#0f172a",
          }}
        >
          Choose your portion
        </DialogTitle>

        <DialogContent>
          {selectedItem && (
            <>
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 13,
                  mb: 2,
                }}
              >
                Select the portion size for{" "}
                <strong>
                  {selectedItem.name}
                </strong>
                .
              </Typography>

              <Stack spacing={1.2}>
                {Number(selectedItem.priceHalf) > 0 && (
                  <Button
                    fullWidth
                    onClick={() =>
                      addToCart("Half")
                    }
                    sx={{
                      minHeight: 68,
                      justifyContent:
                        "space-between",
                      px: 2,
                      borderRadius: "15px",
                      border:
                        "1px solid #e2e8f0",
                      color: "#0f172a",
                      background: "#fff",
                      textTransform: "none",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                    >
                      <RestaurantMenuIcon
                        sx={{
                          color: "#0f766e",
                        }}
                      />

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
                        color: "#0f766e",
                        fontWeight: 950,
                      }}
                    >
                      {formatPrice(
                        selectedItem.priceHalf
                      )}
                    </Typography>
                  </Button>
                )}

                <Button
                  fullWidth
                  onClick={() =>
                    addToCart("Full")
                  }
                  sx={{
                    minHeight: 68,
                    justifyContent:
                      "space-between",
                    px: 2,
                    borderRadius: "15px",
                    border:
                      "1px solid #fecaca",
                    color: "#0f172a",
                    background:
                      "linear-gradient(135deg,#fff7f7,#fff)",
                    textTransform: "none",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.2}
                    alignItems="center"
                  >
                    <RestaurantIcon
                      sx={{
                        color: "#dc2626",
                      }}
                    />

                    <Box
                      sx={{
                        textAlign: "left",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.6}
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
                            height: 18,
                            fontSize: 8,
                            fontWeight: 900,
                            color: "#991b1b",
                            background:
                              "#fee2e2",
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
                      color: "#dc2626",
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

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            fullWidth
            onClick={() =>
              setPortionOpen(false)
            }
            sx={{
              textTransform: "none",
              fontWeight: 800,
              color: "#64748b",
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================================================================
          CART DRAWER
      ================================================================ */}

      <Dialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: {
              xs: "24px 24px 0 0",
              sm: "24px",
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
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 23,
                  fontWeight: 950,
                  color: "#0f172a",
                }}
              >
                Your Cart
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 11,
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
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {cart.length === 0 ? (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
              }}
            >
              <ShoppingBagOutlinedIcon
                sx={{
                  fontSize: 50,
                  color: "#94a3b8",
                  mb: 1,
                }}
              />

              <Typography
                sx={{
                  fontWeight: 950,
                  fontSize: 21,
                }}
              >
                Your cart is empty
              </Typography>

              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/menu");
                }}
                sx={{
                  mt: 2,
                  textTransform: "none",
                  fontWeight: 900,
                }}
              >
                Browse Menu
              </Button>
            </Box>
          ) : (
            <Stack spacing={1.3}>
              {cart.map((item, index) => (
                <Paper
                  key={`${item.name}-${item.type}-${index}`}
                  elevation={0}
                  sx={{
                    p: 1.4,
                    borderRadius: "16px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.2}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        flexShrink: 0,
                        borderRadius: "14px",
                        display: "grid",
                        placeItems: "center",
                        color: "#0f766e",
                        background:
                          "#ccfbf1",
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
                          fontSize: 14,
                          fontWeight: 950,
                          color: "#0f172a",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#64748b",
                          fontSize: 10,
                          mt: 0.3,
                        }}
                      >
                        {item.type} •{" "}
                        {formatPrice(item.price)}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#0f766e",
                          fontSize: 13,
                          fontWeight: 950,
                          mt: 0.5,
                        }}
                      >
                        {formatPrice(
                          item.price * item.qty
                        )}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={0.2}
                      alignItems="center"
                      sx={{
                        border:
                          "1px solid #e2e8f0",
                        borderRadius: "10px",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQty(index, -1)
                        }
                      >
                        <RemoveIcon
                          sx={{ fontSize: 16 }}
                        />
                      </IconButton>

                      <Typography
                        sx={{
                          width: 20,
                          textAlign: "center",
                          fontSize: 12,
                          fontWeight: 950,
                        }}
                      >
                        {item.qty}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQty(index, 1)
                        }
                      >
                        <AddIcon
                          sx={{ fontSize: 16 }}
                        />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </DialogContent>

        {cart.length > 0 && (
          <DialogActions
            sx={{
              display: "block",
              px: 3,
              pb: 3,
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
                    fontWeight: 900,
                  }}
                >
                  {formatPrice(totalAmount)}
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
                    fontWeight: 900,
                  }}
                >
                  ₹30
                </Typography>
              </Stack>

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{
                    fontSize: 17,
                    fontWeight: 950,
                  }}
                >
                  Total
                </Typography>

                <Typography
                  sx={{
                    color: "#dc2626",
                    fontSize: 22,
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
                endIcon={<ArrowForwardIcon />}
                sx={{
                  mt: 1,
                  minHeight: 52,
                  borderRadius: "13px",
                  color: "#ffffff",
                  background:
                    "linear-gradient(135deg,#dc2626,#b91c1c)",
                  textTransform: "none",
                  fontWeight: 950,
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
                  textTransform: "none",
                  color: "#64748b",
                  fontWeight: 800,
                }}
              >
                Continue Shopping
              </Button>
            </Stack>
          </DialogActions>
        )}
      </Dialog>

      {/* ================================================================
          MOBILE CART BAR
      ================================================================ */}

      {totalItems > 0 && (
        <Box
          sx={{
            position: "fixed",
            left: {
              xs: 8,
              sm: 20,
            },
            right: {
              xs: 8,
              sm: 20,
            },
            bottom: {
              xs: 8,
              sm: 18,
            },
            zIndex: 1200,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              maxWidth: 850,
              mx: "auto",
              p: 0.8,
              borderRadius: "18px",
              background:
                "linear-gradient(135deg,#111827,#1f2937)",
              border:
                "1px solid rgba(255,255,255,.10)",
              boxShadow:
                "0 18px 45px rgba(0,0,0,.28)",
            }}
          >
            <Button
              fullWidth
              onClick={() =>
                setDrawerOpen(true)
              }
              sx={{
                minHeight: 54,
                justifyContent:
                  "space-between",
                color: "#ffffff",
                textTransform: "none",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg,#dc2626,#ef4444)",
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
                      fontSize: 9,
                      fontWeight: 800,
                    }}
                  >
                    Your order
                  </Typography>

                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 950,
                    }}
                  >
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}{" "}
                    •{" "}
                    {formatPrice(totalAmount)}
                  </Typography>
                </Box>
              </Stack>

              <ArrowForwardIcon
                sx={{
                  fontSize: 19,
                }}
              />
            </Button>
          </Paper>
        </Box>
      )}

      {/* ================================================================
          SNACKBAR
      ================================================================ */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2400}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={closeSnackbar}
          sx={{
            borderRadius: "13px",
            fontWeight: 800,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}