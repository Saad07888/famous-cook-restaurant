import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { orderService } from "../services/api";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};


export default function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    totalItems,
    totalAmount,
    setCart,
    setDrawerOpen,
  } = useCart();

  // ------------------------------------------------------------
  // FORM
  // ------------------------------------------------------------

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
  });

  const [errors, setErrors] = useState({});

  // ------------------------------------------------------------
  // PAYMENT
  // ------------------------------------------------------------

const [paymentMethod, setPaymentMethod] = useState("Online Payment");

  // ------------------------------------------------------------
  // ORDER
  // ------------------------------------------------------------

  const [placingOrder, setPlacingOrder] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // ------------------------------------------------------------
  // PRICING
  // ------------------------------------------------------------

  const deliveryCharge = useMemo(() => {
  if (totalAmount <= 0) return 0;

  return totalAmount >= 300 ? 0 : 10;
}, [totalAmount]);

const taxes = 0;

  const grandTotal =
    Number(totalAmount) +
    Number(deliveryCharge) +
    Number(taxes);

  // ------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------

  const formatPrice = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const showMessage = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // ------------------------------------------------------------
  // VALIDATION
  // ------------------------------------------------------------

  const validateForm = () => {
    const nextErrors = {};

    const name = form.name.trim();
    const phone = form.phone.replace(/\D/g, "");
    const address = form.address.trim();
    const landmark = form.landmark.trim();

    if (!name) {
      nextErrors.name = "Please enter your full name.";
    } else if (name.length < 3) {
      nextErrors.name = "Name must be at least 3 characters.";
    }

    if (!phone) {
      nextErrors.phone = "Please enter your mobile number.";
    } else if (phone.length !== 10) {
      nextErrors.phone =
        "Mobile number must contain exactly 10 digits.";
    }

    if (!address) {
      nextErrors.address =
        "Please enter your delivery address.";
    } else if (address.length < 10) {
      nextErrors.address =
        "Please provide a more complete address.";
    }

    if (!landmark) {
      nextErrors.landmark =
        "Please enter a nearby landmark.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // ------------------------------------------------------------
  // PAYMENT
  // ------------------------------------------------------------

  const handlePaymentChange = (event) => {
  setPaymentMethod(event.target.value);
};

  // ------------------------------------------------------------
  // REAL RAZORPAY PAYMENT
  // ------------------------------------------------------------

  const handleRazorpayPayment = async () => {
    if (!validateForm()) {
      showMessage("Please complete all required details.", "error");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setPlacingOrder(true);

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Razorpay could not be loaded. Please check your internet connection.");
      }

      const response = await fetch(
        "http://localhost:5000/api/payments/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(grandTotal),
            customerName: form.name.trim(),
            customerPhone: form.phone.replace(/\D/g, ""),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create payment.");
      }

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        name: "Famous Cook",
        description: "Food Order",
        order_id: data.order.id,
        prefill: {
          name: form.name.trim(),
          contact: form.phone.replace(/\D/g, ""),
        },
        notes: {
          restaurant: "Famous Cook",
        },
        theme: { color: "#2563eb" },
        handler: async (paymentResponse) => {
          try {
            showMessage("Payment successful. Verifying...", "success");

            const verifyResponse = await fetch(
              "http://localhost:5000/api/payments/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.message || "Payment verification failed.");
            }

            const orderData = {
              customerName: form.name.trim(),
              customerPhone: form.phone.replace(/\D/g, ""),
              address: form.address.trim(),
              landmark: form.landmark.trim(),
              paymentMethod: "Online Payment",
              items: cart.map((item) => ({
                name: item.name,
                type: item.type,
                price: Number(item.price),
                qty: Number(item.qty),
              })),
              totalAmount: Number(grandTotal),
              status: "Pending",
            };

            await orderService.createOrder(orderData);

            const confirmationOrder = {
              orderNumber: `FC${Date.now().toString().slice(-6)}`,
              name: form.name.trim(),
              phone: form.phone.replace(/\D/g, ""),
              address: form.address.trim(),
              landmark: form.landmark.trim(),
              paymentMethod: "Online Payment",
              paymentStatus: "Paid",
              paymentId: paymentResponse.razorpay_payment_id,
              items: cart.map((item) => ({
                name: item.name,
                type: item.type,
                price: Number(item.price),
                qty: Number(item.qty),
                image: item.image,
              })),
              subtotal: Number(totalAmount),
              deliveryCharge: Number(deliveryCharge),
              tax: Number(taxes),
              total: Number(grandTotal),
            };

            
            setCart([]);
            setDrawerOpen(false);
            navigate("/order-confirmation", { state: { order: confirmationOrder } });
          } catch (error) {
            console.error("Payment verification/order error:", error);
            setPlacingOrder(false);
            showMessage(
              error.message || "Payment was received but order processing failed. Please contact Famous Cook.",
              "error"
            );
          }
        },
        modal: {
          ondismiss: () => {
            setPlacingOrder(false);
            showMessage("Payment cancelled.", "warning");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        setPlacingOrder(false);
        showMessage(
          response.error?.description || "Payment failed. Please try again.",
          "error"
        );
      });
      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      setPlacingOrder(false);
      showMessage(error.message || "Unable to start payment.", "error");
    }
  };

const handlePlaceOrder = async () => {
    if (!validateForm()) {
      showMessage(
        "Please complete all required details.",
        "error"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setPlacingOrder(true);

      const orderData = {
    customerName: form.name.trim(),

    customerPhone: form.phone.replace(/\D/g, ""),

    address: form.address.trim(),

    landmark: form.landmark.trim(),

    paymentMethod: paymentMethod,

    items: cart.map((item) => ({
        name: item.name,
        type: item.type,
        price: Number(item.price),
        qty: Number(item.qty),
    })),

    totalAmount: Number(grandTotal),

    status: "Pending",
};
      const confirmationOrder = {
        orderNumber:
          `FC${Date.now().toString().slice(-6)}`,

        name: form.name.trim(),

        phone: form.phone.replace(
          /\D/g,
          ""
        ),

        address: form.address.trim(),

        landmark: form.landmark.trim(),

        paymentMethod,

        items: cart.map((item) => ({
          name: item.name,
          type: item.type,
          price: Number(item.price),
          qty: Number(item.qty),
          image: item.image,
        })),

        subtotal: Number(totalAmount),

        deliveryCharge: Number(
          deliveryCharge
        ),

        tax: Number(taxes),

        total: Number(grandTotal),
      };

      try {
        await orderService.createOrder(
          orderData
        );
      } catch (backendError) {
        console.warn(
          "Order API unavailable.",
          backendError
        );

        showMessage(
          "Order saved in checkout mode. Backend connection should be checked.",
          "warning"
        );
      }

      // Clear cart after successful order attempt
      setCart([]);

      setDrawerOpen(false);

      /*
       * THIS IS THE IMPORTANT PART
       *
       * Customer goes to:
       *
       * /order-confirmation
       *
       * NOT /admin
       */

      navigate(
        "/order-confirmation",
        {
          state: {
            order: confirmationOrder,
          },
        }
      );
    } catch (error) {
      console.error(
        "Order placement failed:",
        error
      );

      showMessage(
        "Something went wrong while placing your order.",
        "error"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // ------------------------------------------------------------
  // EMPTY CART
  // ------------------------------------------------------------

  if (!cart || cart.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg,#f8fafc,#ffffff)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 3,
                sm: 5,
              },
              textAlign: "center",
              borderRadius: "28px",
              border:
                "1px solid #e2e8f0",
              boxShadow:
                "0 25px 60px rgba(15,23,42,.08)",
            }}
          >
            <Box
              sx={{
                width: 90,
                height: 90,
                mx: "auto",
                mb: 3,
                borderRadius: "27px",
                display: "grid",
                placeItems: "center",
                color: "#2563eb",
                background: "#eff6ff",
              }}
            >
              <ShoppingBagOutlinedIcon
                sx={{ fontSize: 42 }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 950,
                color: "#0f172a",
                mb: 1,
              }}
            >
              Your cart is empty
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                mb: 3,
              }}
            >
              Add some delicious dishes before
              continuing to checkout.
            </Typography>

            <Button
              variant="contained"
              endIcon={
                <ArrowForwardIcon />
              }
              onClick={() =>
                navigate("/menu")
              }
              sx={{
                minHeight: 52,
                px: 3,
                borderRadius: "15px",
                textTransform: "none",
                fontWeight: 900,
                background:
                  "linear-gradient(135deg,#1d4ed8,#3b82f6)",
              }}
            >
              Browse Menu
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  // ------------------------------------------------------------
  // MAIN CHECKOUT
  // ------------------------------------------------------------

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 10% 0%,rgba(37,99,235,.08),transparent 25%),radial-gradient(circle at 90% 10%,rgba(30,64,175,.07),transparent 25%),#f8fafc",
        pb: 8,
      }}
    >
      {/* ========================================================
          HEADER
      ======================================================== */}

      <Box
        sx={{
          color: "#fff",
          background:
            "linear-gradient(135deg,#020617,#0f172a 55%,#172554)",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ py: 4 }}
        >
          <Button
            startIcon={
              <ArrowBackIcon />
            }
            onClick={() =>
              navigate("/menu")
            }
            sx={{
              color: "#cbd5e1",
              mb: 2,
              textTransform: "none",
              fontWeight: 800,
            }}
          >
            Back to Menu
          </Button>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: "17px",
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
                  color: "#93c5fd",
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                }}
              >
                Famous Cook
              </Typography>

              <Typography
                component="h1"
                sx={{
                  fontSize: {
                    xs: 27,
                    sm: 34,
                  },
                  fontWeight: 950,
                }}
              >
                Secure Checkout
              </Typography>
            </Box>
          </Stack>

          <Typography
            sx={{
              color: "#94a3b8",
              mt: 1.5,
              fontSize: 13,
            }}
          >
            Complete your details, choose your
            payment method and confirm your order.
          </Typography>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{ pt: 3 }}
      >
        {/* ========================================================
            STEPS
        ======================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "19px",
            border:
              "1px solid #e2e8f0",
          }}
        >
          <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
          >
            {[
              ["1", "Details"],
              ["2", "Payment"],
              ["3", "Confirmation"],
            ].map(([number, label], index) => (
              <Stack
                key={number}
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    color:
                      index < 2
                        ? "#fff"
                        : "#94a3b8",
                    background:
                      index < 2
                        ? "linear-gradient(135deg,#2563eb,#3b82f6)"
                        : "#f1f5f9",
                    fontWeight: 900,
                  }}
                >
                  {number}
                </Box>

                <Typography
                  sx={{
                    color:
                      index < 2
                        ? "#334155"
                        : "#94a3b8",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {label}
                </Typography>

                {index < 2 && (
                  <Box
                    sx={{
                      width: 45,
                      height: 1,
                      background: "#e2e8f0",
                    }}
                  />
                )}
              </Stack>
            ))}
          </Stack>
        </Paper>

        <Grid
          container
          spacing={3}
          alignItems="flex-start"
        >
          {/* ======================================================
              LEFT
          ====================================================== */}

          <Grid item xs={12} md={7}>
            {/* CUSTOMER DETAILS */}

            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },
                borderRadius: "23px",
                border:
                  "1px solid #e2e8f0",
                mb: 3,
                boxShadow:
                  "0 12px 35px rgba(15,23,42,.045)",
              }}
            >
              <Stack
                direction="row"
                spacing={1.2}
                alignItems="center"
                mb={3}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "14px",
                    display: "grid",
                    placeItems: "center",
                    color: "#2563eb",
                    background:
                      "#eff6ff",
                  }}
                >
                  <PersonOutlineIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 19,
                      fontWeight: 950,
                    }}
                  >
                    Customer details
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 12,
                    }}
                  >
                    Tell us where we should
                    deliver your order.
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange(
                      "name"
                    )}
                    error={Boolean(
                      errors.name
                    )}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    placeholder="10 digit mobile number"
                    value={form.phone}
                    onChange={(event) => {
                      const value =
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);

                      setForm((prev) => ({
                        ...prev,
                        phone: value,
                      }));

                      if (errors.phone) {
                        setErrors((prev) => ({
                          ...prev,
                          phone: "",
                        }));
                      }
                    }}
                    error={Boolean(
                      errors.phone
                    )}
                    helperText={
                      errors.phone ||
                      "We'll use this for order updates."
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Order Type"
                    value="Delivery"
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalShippingOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Delivery Address"
                    placeholder="House / flat, building, street, area"
                    value={form.address}
                    onChange={handleChange(
                      "address"
                    )}
                    error={Boolean(
                      errors.address
                    )}
                    helperText={errors.address}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nearby Landmark"
                    placeholder="Example: Near Famous Cook / Main Road"
                    value={form.landmark}
                    onChange={handleChange(
                      "landmark"
                    )}
                    error={Boolean(
                      errors.landmark
                    )}
                    helperText={
                      errors.landmark
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* ==================================================
                PAYMENT
            ================================================== */}

            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },
                borderRadius: "23px",
                border: "1px solid #e2e8f0",
                boxShadow:
                  "0 12px 35px rgba(15,23,42,.045)",
              }}
            >
              <Stack
                direction="row"
                spacing={1.2}
                alignItems="center"
                mb={3}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "14px",
                    display: "grid",
                    placeItems: "center",
                    color: "#2563eb",
                    background: "#eff6ff",
                  }}
                >
                  <PaymentsOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 19,
                      fontWeight: 950,
                    }}
                  >
                    Payment Method
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 12,
                    }}
                  >
                    Choose your preferred way to pay.
                  </Typography>
                </Box>
              </Stack>

              <FormControl fullWidth>
                <RadioGroup
                  value={paymentMethod}
                  onChange={handlePaymentChange}
                >
                  {/* ONLINE PAYMENT */}

                  <Paper
                    elevation={0}
                    sx={{
                      mb: 1.5,
                      borderRadius: "18px",
                      border:
                        paymentMethod === "Online Payment"
                          ? "2px solid #2563eb"
                          : "1px solid #e2e8f0",
                      background:
                        paymentMethod === "Online Payment"
                          ? "linear-gradient(135deg,#f8fbff,#eef5ff)"
                          : "#fff",
                      overflow: "hidden",
                      transition: "all .2s ease",
                    }}
                  >
                    <FormControlLabel
                      value="Online Payment"
                      control={<Radio />}
                      sx={{
                        width: "100%",
                        m: 0,
                        p: 2,
                        alignItems: "flex-start",
                      }}
                      label={
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          sx={{ width: "100%" }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: "14px",
                              display: "grid",
                              placeItems: "center",
                              color: "#2563eb",
                              background: "#dbeafe",
                              flexShrink: 0,
                            }}
                          >
                            <PaymentsOutlinedIcon />
                          </Box>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              gap={1}
                            >
                              <Typography
                                sx={{
                                  fontSize: 15,
                                  fontWeight: 950,
                                  color: "#0f172a",
                                }}
                              >
                                Online Payment
                              </Typography>

                              <Chip
                                label="Recommended"
                                size="small"
                                sx={{
                                  height: 24,
                                  fontSize: 10,
                                  fontWeight: 900,
                                  color: "#15803d",
                                  background: "#dcfce7",
                                }}
                              />
                            </Stack>

                            <Typography
                              sx={{
                                mt: 0.3,
                                fontSize: 12,
                                color: "#475569",
                                fontWeight: 600,
                              }}
                            >
                              Pay securely with Razorpay
                            </Typography>

                            <Typography
                              sx={{
                                mt: 0.3,
                                fontSize: 11,
                                color: "#64748b",
                              }}
                            >
                              Cards • Netbanking • Wallets
                            </Typography>

                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                              sx={{ mt: 1.2 }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 950,
                                  color: "#1a56db",
                                }}
                              >
                                VISA
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 950,
                                  color: "#111827",
                                }}
                              >
                                ●●
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 11,
                                  fontWeight: 950,
                                  color: "#2563eb",
                                }}
                              >
                                RuPay
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 900,
                                  color: "#64748b",
                                }}
                              >
                                🏦
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 900,
                                  color: "#16a34a",
                                }}
                              >
                                💳
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      }
                    />

                    {paymentMethod === "Online Payment" && (
                      <Box sx={{ px: 2, pb: 2 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleRazorpayPayment}
                          disabled={placingOrder}
                          startIcon={
                            placingOrder ? null : (
                              <SecurityOutlinedIcon />
                            )
                          }
                          endIcon={
                            placingOrder ? (
                              <CircularProgress
                                size={18}
                                sx={{ color: "#fff" }}
                              />
                            ) : (
                              <ArrowForwardIcon />
                            )
                          }
                          sx={{
                            minHeight: 56,
                            borderRadius: "15px",
                            color: "#fff",
                            background:
                              "linear-gradient(135deg,#16a34a,#22c55e)",
                            boxShadow:
                              "0 12px 28px rgba(22,163,74,.22)",
                            textTransform: "none",
                            fontSize: 14,
                            fontWeight: 950,
                            "&:hover": {
                              background:
                                "linear-gradient(135deg,#15803d,#16a34a)",
                              boxShadow:
                                "0 14px 32px rgba(22,163,74,.28)",
                            },
                          }}
                        >
                          {placingOrder
                            ? "Processing Payment..."
                            : `Pay Securely • ${formatPrice(grandTotal)}`}
                        </Button>
                      </Box>
                    )}
                  </Paper>

                  {/* CASH ON DELIVERY */}

                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: "18px",
                      border:
                        paymentMethod === "Cash on Delivery"
                          ? "2px solid #16a34a"
                          : "1px solid #e2e8f0",
                      background:
                        paymentMethod === "Cash on Delivery"
                          ? "#f8fff9"
                          : "#fff",
                      overflow: "hidden",
                      transition: "all .2s ease",
                    }}
                  >
                    <FormControlLabel
                      value="Cash on Delivery"
                      control={<Radio />}
                      sx={{
                        width: "100%",
                        m: 0,
                        p: 2,
                        alignItems: "center",
                      }}
                      label={
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: "14px",
                              display: "grid",
                              placeItems: "center",
                              color: "#16a34a",
                              background: "#dcfce7",
                              flexShrink: 0,
                            }}
                          >
                            <PaymentsOutlinedIcon />
                          </Box>

                          <Box>
                            <Typography
                              sx={{
                                fontSize: 15,
                                fontWeight: 950,
                                color: "#0f172a",
                              }}
                            >
                              Cash on Delivery
                            </Typography>

                            <Typography
                              sx={{
                                mt: 0.3,
                                fontSize: 12,
                                color: "#64748b",
                              }}
                            >
                              Pay when your order arrives
                            </Typography>
                          </Box>
                        </Stack>
                      }
                    />

                    {paymentMethod === "Cash on Delivery" && (
                      <Box sx={{ px: 2, pb: 2 }}>
                        <Alert
                          severity="success"
                          sx={{
                            borderRadius: "14px",
                            fontSize: 11.5,
                            fontWeight: 700,
                          }}
                        >
                          Pay {formatPrice(grandTotal)} in cash when
                          your food is delivered.
                        </Alert>

                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handlePlaceOrder}
                          disabled={placingOrder}
                          endIcon={
                            placingOrder ? (
                              <CircularProgress
                                size={18}
                                sx={{ color: "#fff" }}
                              />
                            ) : (
                              <CheckCircleIcon />
                            )
                          }
                          sx={{
                            mt: 1.5,
                            minHeight: 56,
                            borderRadius: "15px",
                            color: "#fff",
                            background:
                              "linear-gradient(135deg,#16a34a,#22c55e)",
                            boxShadow:
                              "0 12px 28px rgba(22,163,74,.20)",
                            textTransform: "none",
                            fontSize: 14,
                            fontWeight: 950,
                            "&:hover": {
                              background:
                                "linear-gradient(135deg,#15803d,#16a34a)",
                            },
                          }}
                        >
                          {placingOrder
                            ? "Placing Order..."
                            : `Place Order • ${formatPrice(grandTotal)}`}
                        </Button>
                      </Box>
                    )}
                  </Paper>
                </RadioGroup>
              </FormControl>

              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  p: 1.7,
                  background: "#eff6ff",
                  borderRadius: "14px",
                  border: "1px solid #dbeafe",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                >
                  <SecurityOutlinedIcon
                    sx={{
                      color: "#16a34a",
                      fontSize: 22,
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        fontWeight: 800,
                        color: "#1e3a8a",
                      }}
                    >
                      Your payments are secure
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 10.5,
                        color: "#64748b",
                        mt: 0.2,
                      }}
                    >
                      Online payments are securely processed by Razorpay.
                      We do not store your card or UPI details.
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Paper>
          </Grid>

          {/* ======================================================
              RIGHT - ORDER SUMMARY
          ====================================================== */}

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                position: {
                  md: "sticky",
                },
                top: 90,
                borderRadius: "23px",
                overflow: "hidden",
                border:
                  "1px solid #e2e8f0",
                boxShadow:
                  "0 18px 45px rgba(15,23,42,.07)",
              }}
            >
              {/* SUMMARY HEADER */}

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
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "#93c5fd",
                        fontSize: 10,
                        fontWeight: 900,
                        textTransform:
                          "uppercase",
                      }}
                    >
                      Review order
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 21,
                        fontWeight: 950,
                      }}
                    >
                      Order Summary
                    </Typography>
                  </Box>

                  <Chip
                    label={`${totalItems} ${
                      totalItems === 1
                        ? "item"
                        : "items"
                    }`}
                    sx={{
                      color: "#dbeafe",
                      background:
                        "rgba(255,255,255,.10)",
                    }}
                  />
                </Stack>
              </Box>

              {/* ITEMS */}

              <Box
                sx={{
                  p: 2,
                  maxHeight: 330,
                  overflowY: "auto",
                }}
              >
                <Stack spacing={1}>
                  {cart.map(
                    (item, index) => (
                      <Box
                        key={`${item.name}-${item.type}-${index}`}
                        sx={{
                          display: "flex",
                          gap: 1.2,
                          alignItems:
                            "center",
                          p: 1,
                          borderRadius:
                            "14px",
                          "&:hover": {
                            background:
                              "#f8fafc",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            flexShrink: 0,
                            borderRadius:
                              "14px",
                            display: "grid",
                            placeItems:
                              "center",
                            background:
                              "#eff6ff",
                            color:
                              "#2563eb",
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
                              fontSize: 13,
                              fontWeight: 900,
                            }}
                          >
                            {item.name}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 10,
                              color:
                                "#64748b",
                            }}
                          >
                            {item.type} ×{" "}
                            {item.qty}
                          </Typography>
                        </Box>

                        <Typography
                          fontWeight={900}
                        >
                          {formatPrice(
                            Number(
                              item.price
                            ) *
                              Number(
                                item.qty
                              )
                          )}
                        </Typography>
                      </Box>
                    )
                  )}
                </Stack>
              </Box>

              <Divider />

              {/* PRICE */}

              <Box sx={{ p: 2.5 }}>
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography
                      color="text.secondary"
                    >
                      Subtotal
                    </Typography>

                    <Typography fontWeight={800}>
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
                      color="text.secondary"
                    >
                      Delivery
                    </Typography>

                    <Typography fontWeight={800}>
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
                      color="text.secondary"
                    >
                      Taxes
                    </Typography>

                    <Typography fontWeight={800}>
                      {formatPrice(taxes)}
                    </Typography>
                  </Stack>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.3,
                      background:
                        "#f8fafc",
                      borderRadius:
                        "13px",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <LocalOfferOutlinedIcon
                        sx={{
                          color:
                            "#2563eb",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 11,
                          color:
                            "#475569",
                        }}
                      >
                        Fast delivery included.
                      </Typography>
                    </Stack>
                  </Paper>

                  <Divider />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 18,
                          fontWeight: 950,
                        }}
                      >
                        Total
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 10,
                          color:
                            "#94a3b8",
                        }}
                      >
                        Final payable amount
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        color:
                          "#1d4ed8",
                        fontSize: 25,
                        fontWeight: 950,
                      }}
                    >
                      {formatPrice(
                        grandTotal
                      )}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      color:
                        "#94a3b8",
                      textAlign:
                        "center",
                      fontSize: 10.5,
                    }}
                  >
                    By placing this order,
                    you confirm that your
                    delivery details are
                    correct.
                  </Typography>
                </Stack>
              </Box>
            </Paper>

            {/* DELIVERY INFO */}

            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: 2,
                borderRadius: "18px",
                border:
                  "1px solid #e2e8f0",
              }}
            >
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                >
                  <AccessTimeIcon
                    sx={{
                      color:
                        "#2563eb",
                    }}
                  />

                  <Box>
                    <Typography
                      fontSize={12}
                      fontWeight={900}
                    >
                      Estimated delivery
                    </Typography>

                    <Typography
                      fontSize={11}
                      color="text.secondary"
                    >
                      Approximately 30–40 minutes
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                >
                  <SecurityOutlinedIcon
                    sx={{
                      color:
                        "#16a34a",
                    }}
                  />

                  <Box>
                    <Typography
                      fontSize={12}
                      fontWeight={900}
                    >
                      Safe & secure
                    </Typography>

                    <Typography
                      fontSize={11}
                      color="text.secondary"
                    >
                      Your information is handled
                      securely.
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                >
                  <ReceiptLongIcon
                    sx={{
                      color:
                        "#ea580c",
                    }}
                  />

                  <Box>
                    <Typography
                      fontSize={12}
                      fontWeight={900}
                    >
                      Clear pricing
                    </Typography>

                    <Typography
                      fontSize={11}
                      color="text.secondary"
                    >
                      No hidden charges at checkout.
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* SNACKBAR */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
          sx={{
            borderRadius: "14px",
            fontWeight: 700,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

