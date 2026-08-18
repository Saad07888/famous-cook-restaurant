import { useState } from "react";

import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Button,
  Drawer,
  Divider,
  Stack,
  Dialog,
  DialogContent,
  Chip,
  Paper,
  Badge,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

import logo from "../assets/images/famous-cook-logo.png";

import { useCart } from "../context/CartContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    cart,
    drawerOpen,
    setDrawerOpen,
    portionOpen,
    setPortionOpen,
    selectedItem,
    addToCart,
    updateQty,
    totalItems,
    totalAmount,
  } = useCart();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [snackbarOpen, setSnackbarOpen] =
    useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Offers", path: "#" },
    { name: "About", path: "#" },
    { name: "Contact", path: "#" },
  ];

  /* ================================================================
     HELPERS
  ================================================================ */

  const formatPrice = (value) => {
    const number = Number(value || 0);

    return `₹${number.toLocaleString("en-IN")}`;
  };

  const deliveryCharge =
    totalAmount > 0 ? 30 : 0;

  const taxes =
    totalAmount > 0
      ? Math.round(totalAmount * 0.05)
      : 0;

  const grandTotal =
    totalAmount + deliveryCharge + taxes;

  /* ================================================================
     SEARCH
  ================================================================ */

  const handleSearch = (event) => {
    event.preventDefault();

    const value = searchValue.trim();

    navigate(
      value
        ? `/menu?search=${encodeURIComponent(value)}`
        : "/menu"
    );

    setSearchOpen(false);
    setSearchValue("");
  };

  /* ================================================================
     CART
  ================================================================ */

  const handleCartClick = () => {
    setDrawerOpen(true);
  };

  const handleContinueShopping = () => {
    setDrawerOpen(false);
    navigate("/menu");
  };

  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      return;
    }

    setDrawerOpen(false);
    navigate("/checkout");
  };

  /* ================================================================
     PORTION
  ================================================================ */

  const getPortionPrice = (type) => {
    if (!selectedItem) {
      return 0;
    }

    return type === "Half"
      ? selectedItem.priceHalf
      : selectedItem.priceFull;
  };

  /* ================================================================
     NAVIGATION
  ================================================================ */

  const handleNavClick = (item) => {
    if (item.path !== "#") {
      navigate(item.path);
    }
  };

  return (
    <>
      {/* ============================================================
          HEADER
      ============================================================ */}

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background:
            "linear-gradient(90deg,#020617 0%,#0f172a 55%,#111827 100%)",
          borderBottom:
            "1px solid rgba(255,255,255,.08)",
          zIndex: 1200,
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1400,
            width: "100%",
            mx: "auto",
            minHeight: {
              xs: 68,
              md: 76,
            },
            px: {
              xs: 1.5,
              sm: 2.5,
              md: 4,
            },
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* LOGO */}

          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: {
                xs: 1,
                sm: 1.4,
              },
              textDecoration: "none",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: {
                  xs: 45,
                  sm: 52,
                  md: 56,
                },
                height: {
                  xs: 45,
                  sm: 52,
                  md: 56,
                },
                flexShrink: 0,
                borderRadius: {
                  xs: "12px",
                  sm: "15px",
                },
                overflow: "hidden",
                background: "#0f172a",
                border:
                  "1px solid rgba(255,255,255,.12)",
                boxShadow:
                  "0 8px 25px rgba(0,0,0,.25)",
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Famous Cook"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 950,
                  fontSize: {
                    sm: 19,
                    md: 21,
                  },
                  lineHeight: 1.1,
                }}
              >
                Famous Cook
              </Typography>

              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: 11,
                  mt: 0.3,
                  fontWeight: 600,
                }}
              >
                Premium Restaurant
              </Typography>
            </Box>
          </Box>

          {/* NAVIGATION */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {navItems.map((item) => {
              const active =
                location.pathname === item.path;

              return (
                <Button
                  key={item.name}
                  onClick={() =>
                    handleNavClick(item)
                  }
                  sx={{
                    position: "relative",
                    minHeight: 44,
                    px: 2,
                    borderRadius: "12px",
                    color: active
                      ? "#60a5fa"
                      : "#e2e8f0",
                    fontWeight: 800,
                    fontSize: 13,
                    textTransform: "none",
                    "&:hover": {
                      color: "#60a5fa",
                      background:
                        "rgba(255,255,255,.06)",
                    },
                    "&::after": active
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 3,
                          left: "50%",
                          transform:
                            "translateX(-50%)",
                          width: 20,
                          height: 2,
                          borderRadius: 10,
                          background:
                            "#3b82f6",
                        }
                      : {},
                  }}
                >
                  {item.name}
                </Button>
              );
            })}
          </Box>

          {/* RIGHT */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: {
                xs: 0.7,
                sm: 1,
              },
            }}
          >
            <IconButton
              onClick={() =>
                setSearchOpen((prev) => !prev)
              }
              aria-label="Search menu"
              sx={{
                width: {
                  xs: 40,
                  sm: 44,
                },
                height: {
                  xs: 40,
                  sm: 44,
                },
                color: "#fff",
                border:
                  "1px solid rgba(255,255,255,.14)",
                background:
                  searchOpen
                    ? "rgba(59,130,246,.18)"
                    : "rgba(255,255,255,.03)",
                "&:hover": {
                  background:
                    "rgba(59,130,246,.18)",
                },
              }}
            >
              <SearchIcon fontSize="small" />
            </IconButton>

            <Button
              onClick={handleCartClick}
              variant="contained"
              startIcon={
                <Badge
                  badgeContent={totalItems}
                  color="error"
                  invisible={totalItems === 0}
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: 9,
                      minWidth: 17,
                      height: 17,
                      fontWeight: 900,
                    },
                  }}
                >
                  <ShoppingCartIcon
                    sx={{
                      fontSize: 20,
                    }}
                  />
                </Badge>
              }
              sx={{
                minHeight: {
                  xs: 40,
                  sm: 44,
                },
                px: {
                  xs: 1.5,
                  sm: 2,
                  md: 2.3,
                },
                borderRadius: "13px",
                color: "#fff",
                background:
                  "linear-gradient(135deg,#2563eb,#3b82f6)",
                boxShadow:
                  "0 8px 22px rgba(37,99,235,.25)",
                fontWeight: 900,
                fontSize: {
                  xs: 12,
                  sm: 13,
                },
                textTransform: "none",
                "&:hover": {
                  background:
                    "linear-gradient(135deg,#1d4ed8,#2563eb)",
                  transform: "translateY(-1px)",
                },
                transition: "all .25s ease",
              }}
            >
              <Box
                component="span"
                sx={{
                  display: {
                    xs: "none",
                    sm: "inline",
                  },
                  ml: 0.8,
                }}
              >
                Cart
              </Box>

              <Box
                component="span"
                sx={{
                  ml: 0.6,
                }}
              >
                ({totalItems})
              </Box>
            </Button>
          </Box>
        </Toolbar>

        {/* MOBILE SEARCH */}

        {searchOpen && (
          <Box
            sx={{
              display: {
                xs: "block",
                md: "none",
              },
              px: 1.5,
              pb: 1.5,
            }}
          >
            <Box
              component="form"
              onSubmit={handleSearch}
            >
              <TextField
                fullWidth
                autoFocus
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(
                    event.target.value
                  )
                }
                placeholder="Search your favourite dish..."
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          color: "#94a3b8",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    background:
                      "rgba(255,255,255,.06)",
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor:
                        "rgba(255,255,255,.12)",
                    },
                  },
                  "& input::placeholder": {
                    color: "#94a3b8",
                    opacity: 1,
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </AppBar>

      {/* ================================================================
          DESKTOP SEARCH
      ================================================================ */}

      {searchOpen && (
        <Box
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            position: "fixed",
            top: 76,
            right: {
              md: 30,
              lg: 60,
            },
            width: 360,
            zIndex: 1199,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 1,
              borderRadius: "17px",
              border:
                "1px solid rgba(15,23,42,.08)",
              boxShadow:
                "0 20px 50px rgba(15,23,42,.16)",
              background: "#fff",
            }}
          >
            <Box
              component="form"
              onSubmit={handleSearch}
            >
              <TextField
                fullWidth
                autoFocus
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(
                    event.target.value
                  )
                }
                placeholder="Search dishes..."
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          color: "#2563eb",
                        }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: searchValue ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setSearchValue("")
                        }
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "#e2e8f0",
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Box>
      )}

      {/* ================================================================
          PORTION DIALOG
      ================================================================ */}

      <Dialog
        open={Boolean(portionOpen)}
        onClose={() =>
          setPortionOpen(false)
        }
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "26px",
            overflow: "hidden",
            border:
              "1px solid rgba(15,23,42,.08)",
            boxShadow:
              "0 30px 80px rgba(15,23,42,.25)",
          },
        }}
      >
        <Box
          sx={{
            p: 2.5,
            color: "#fff",
            background:
              "linear-gradient(135deg,#020617,#1e3a8a)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                sx={{
                  color: "#93c5fd",
                  fontSize: 10,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: ".15em",
                }}
              >
                Choose portion
              </Typography>

              <Typography
                sx={{
                  fontSize: 23,
                  fontWeight: 950,
                  lineHeight: 1.15,
                  mt: 0.4,
                }}
              >
                {selectedItem?.name ||
                  "Select your portion"}
              </Typography>
            </Box>

            <IconButton
              onClick={() =>
                setPortionOpen(false)
              }
              sx={{
                color: "#fff",
                background:
                  "rgba(255,255,255,.08)",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        <DialogContent
          sx={{
            p: 2.5,
            background: "#f8fafc",
          }}
        >
          <Typography
            sx={{
              color: "#64748b",
              fontSize: 13,
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            Choose the portion that works best for
            your order.
          </Typography>

          <Stack spacing={1.5}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: "17px",
                border:
                  "1px solid #e2e8f0",
                background: "#fff",
                "&:hover": {
                  borderColor: "#93c5fd",
                  background: "#eff6ff",
                },
              }}
            >
              <Button
                fullWidth
                onClick={() => addToCart("Half")}
                sx={{
                  minHeight: 58,
                  justifyContent:
                    "space-between",
                  color: "#0f172a",
                  textTransform: "none",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.3}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 43,
                      height: 43,
                      borderRadius: "13px",
                      display: "grid",
                      placeItems: "center",
                      color: "#2563eb",
                      background: "#eff6ff",
                    }}
                  >
                    <LocalDiningIcon />
                  </Box>

                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      sx={{
                        fontWeight: 950,
                        fontSize: 15,
                      }}
                    >
                      Half Portion
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: 11,
                      }}
                    >
                      Perfect for one
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  sx={{
                    color: "#2563eb",
                    fontSize: 17,
                    fontWeight: 950,
                  }}
                >
                  {formatPrice(
                    getPortionPrice("Half")
                  )}
                </Typography>
              </Button>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: "17px",
                border:
                  "1px solid #e2e8f0",
                background: "#fff",
                "&:hover": {
                  borderColor: "#93c5fd",
                  background: "#eff6ff",
                },
              }}
            >
              <Button
                fullWidth
                onClick={() => addToCart("Full")}
                sx={{
                  minHeight: 58,
                  justifyContent:
                    "space-between",
                  color: "#0f172a",
                  textTransform: "none",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.3}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 43,
                      height: 43,
                      borderRadius: "13px",
                      display: "grid",
                      placeItems: "center",
                      color: "#2563eb",
                      background: "#eff6ff",
                    }}
                  >
                    <RestaurantMenuIcon />
                  </Box>

                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      sx={{
                        fontWeight: 950,
                        fontSize: 15,
                      }}
                    >
                      Full Portion
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: 11,
                      }}
                    >
                      Perfect for sharing
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  sx={{
                    color: "#2563eb",
                    fontSize: 17,
                    fontWeight: 950,
                  }}
                >
                  {formatPrice(
                    getPortionPrice("Full")
                  )}
                </Typography>
              </Button>
            </Paper>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ================================================================
          CART DRAWER
      ================================================================ */}

      <Drawer
        anchor="right"
        open={Boolean(drawerOpen)}
        onClose={() =>
          setDrawerOpen(false)
        }
        PaperProps={{
          sx: {
            width: {
              xs: "100%",
              sm: 430,
              md: 470,
            },
            background: "#f8fafc",
          },
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 2.5,
            },
            py: 2,
            color: "#fff",
            background:
              "linear-gradient(135deg,#020617 0%,#0f172a 55%,#1e3a8a 100%)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              spacing={1.4}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: "14px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(135deg,#2563eb,#60a5fa)",
                }}
              >
                <ShoppingBagOutlinedIcon />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 10,
                    color: "#93c5fd",
                    fontWeight: 900,
                    textTransform:
                      "uppercase",
                    letterSpacing: ".14em",
                  }}
                >
                  Your order
                </Typography>

                <Typography
                  sx={{
                    fontSize: 21,
                    fontWeight: 950,
                  }}
                >
                  My Cart
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={() =>
                setDrawerOpen(false)
              }
              sx={{
                color: "#fff",
                background:
                  "rgba(255,255,255,.08)",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <Typography
            sx={{
              mt: 1.5,
              color: "#cbd5e1",
              fontSize: 12,
            }}
          >
            {totalItems === 0
              ? "Your cart is waiting for something delicious."
              : `${totalItems} ${
                  totalItems === 1
                    ? "item"
                    : "items"
                } ready to order`}
          </Typography>
        </Box>

        {/* EMPTY */}

        {cart.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent:
                "center",
              alignItems: "center",
              px: 3,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 92,
                height: 92,
                borderRadius: "28px",
                display: "grid",
                placeItems: "center",
                color: "#2563eb",
                background: "#eff6ff",
                mb: 2.5,
              }}
            >
              <ShoppingBagOutlinedIcon
                sx={{
                  fontSize: 43,
                }}
              />
            </Box>

            <Typography
              sx={{
                color: "#0f172a",
                fontSize: 24,
                fontWeight: 950,
                mb: 1,
              }}
            >
              Your cart is empty
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 13,
                lineHeight: 1.7,
                maxWidth: 310,
                mb: 3,
              }}
            >
              Looks like you haven't added anything
              yet. Explore our menu and discover
              something delicious.
            </Typography>

            <Button
              variant="contained"
              onClick={
                handleContinueShopping
              }
              endIcon={<ArrowForwardIcon />}
              sx={{
                minHeight: 50,
                px: 3,
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 900,
                background:
                  "linear-gradient(135deg,#1d4ed8,#3b82f6)",
              }}
            >
              Explore Menu
            </Button>
          </Box>
        ) : (
          <>
            {/* ITEMS */}

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                px: {
                  xs: 1.5,
                  sm: 2,
                },
                py: 2,
              }}
            >
              <Stack spacing={1.5}>
                {cart.map((item, index) => (
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
                      spacing={1.5}
                    >
                      <Box
                        sx={{
                          width: 68,
                          height: 68,
                          flexShrink: 0,
                          borderRadius: "16px",
                          display: "grid",
                          placeItems: "center",
                          color: "#2563eb",
                          background:
                            "linear-gradient(135deg,#eff6ff,#dbeafe)",
                        }}
                      >
                        <LocalDiningIcon
                          sx={{
                            fontSize: 30,
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={1}
                        >
                          <Box>
                            <Typography
                              sx={{
                                color: "#0f172a",
                                fontSize: 15,
                                fontWeight: 900,
                              }}
                            >
                              {item.name}
                            </Typography>

                            <Chip
                              label={item.type}
                              size="small"
                              sx={{
                                mt: 0.5,
                                height: 23,
                                background:
                                  "#eff6ff",
                                color: "#1d4ed8",
                                fontSize: 10,
                                fontWeight: 900,
                              }}
                            />
                          </Box>

                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQty(
                                index,
                                -item.qty
                              )
                            }
                            sx={{
                              color: "#94a3b8",
                              "&:hover": {
                                color: "#dc2626",
                                background:
                                  "#fef2f2",
                              },
                            }}
                          >
                            <DeleteOutlineIcon
                              sx={{
                                fontSize: 18,
                              }}
                            />
                          </IconButton>
                        </Stack>

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            mt: 1.3,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#0f172a",
                              fontSize: 16,
                              fontWeight: 950,
                            }}
                          >
                            {formatPrice(
                              item.price *
                                item.qty
                            )}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems:
                                "center",
                              borderRadius:
                                "11px",
                              border:
                                "1px solid #e2e8f0",
                              overflow: "hidden",
                              background:
                                "#f8fafc",
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
                                width: 31,
                                height: 31,
                                borderRadius: 0,
                              }}
                            >
                              <RemoveIcon
                                sx={{
                                  fontSize: 15,
                                }}
                              />
                            </IconButton>

                            <Typography
                              sx={{
                                minWidth: 28,
                                textAlign:
                                  "center",
                                fontSize: 13,
                                fontWeight: 900,
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
                                width: 31,
                                height: 31,
                                borderRadius: 0,
                                color:
                                  "#2563eb",
                              }}
                            >
                              <AddIcon
                                sx={{
                                  fontSize: 15,
                                }}
                              />
                            </IconButton>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>

              <Button
                fullWidth
                startIcon={<AddIcon />}
                onClick={
                  handleContinueShopping
                }
                sx={{
                  mt: 2,
                  minHeight: 45,
                  borderRadius: "13px",
                  border:
                    "1px dashed #bfdbfe",
                  color: "#2563eb",
                  textTransform: "none",
                  fontWeight: 900,
                }}
              >
                Add more items
              </Button>

              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 2 }}
              >
                <Box
                  sx={{
                    flex: 1,
                    p: 1.2,
                    borderRadius: "13px",
                    background: "#f8fafc",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <LocalShippingOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color: "#2563eb",
                      mb: 0.5,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#334155",
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  >
                    Fast delivery
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    p: 1.2,
                    borderRadius: "13px",
                    background: "#f8fafc",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <SecurityOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color: "#16a34a",
                      mb: 0.5,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#334155",
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  >
                    Secure ordering
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* SUMMARY */}

            <Box
              sx={{
                p: {
                  xs: 2,
                  sm: 2.5,
                },
                background: "#fff",
                borderTop:
                  "1px solid #e2e8f0",
              }}
            >
              <Stack spacing={1}>
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
                      fontWeight: 800,
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
                      fontWeight: 800,
                    }}
                  >
                    {formatPrice(
                      deliveryCharge
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
                    Taxes
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {formatPrice(taxes)}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 0.7 }} />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      color: "#0f172a",
                      fontSize: 16,
                      fontWeight: 950,
                    }}
                  >
                    Total
                  </Typography>

                  <Typography
                    sx={{
                      color: "#1d4ed8",
                      fontSize: 22,
                      fontWeight: 950,
                    }}
                  >
                    {formatPrice(grandTotal)}
                  </Typography>
                </Stack>

                <Button
                  fullWidth
                  onClick={handleCheckout}
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
                    fontWeight: 950,
                    fontSize: 14,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#1e40af,#2563eb)",
                    },
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Drawer>

      {/* ================================================================
          SNACKBAR
      ================================================================ */}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbarOpen(false)
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() =>
            setSnackbarOpen(false)
          }
          severity="info"
          sx={{
            borderRadius: "14px",
            fontWeight: 700,
          }}
        >
          Your cart is ready for checkout.
        </Alert>
      </Snackbar>
    </>
  );
}