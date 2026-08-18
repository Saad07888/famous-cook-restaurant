import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  Divider,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const { totalAmount, setCart } = useCart();

  /*
    Checkout can send order information through navigate().
    If information is not available, we use safe fallback values.
  */

  const orderData = location.state?.order || {};

  const orderItems =
    orderData.items ||
    location.state?.items ||
    [];

  const customerName =
    orderData.name ||
    location.state?.name ||
    "Customer";

  const phone =
    orderData.phone ||
    location.state?.phone ||
    "";

  const address =
    orderData.address ||
    location.state?.address ||
    "";

  const paymentMethod =
    orderData.paymentMethod ||
    location.state?.paymentMethod ||
    "Cash on Delivery";

  const subtotal =
    orderData.subtotal ??
    location.state?.subtotal ??
    totalAmount;

  const deliveryCharge =
    orderData.deliveryCharge ??
    location.state?.deliveryCharge ??
    30;

  const tax =
    orderData.tax ??
    location.state?.tax ??
    Math.round(subtotal * 0.05);

  const finalTotal =
    orderData.total ??
    location.state?.total ??
    subtotal + deliveryCharge + tax;

  /*
    Generate a simple restaurant order number.
  */

  const orderNumber =
    orderData.orderNumber ||
    location.state?.orderNumber ||
    `FC${Math.floor(100000 + Math.random() * 900000)}`;

  /*
    If no items were passed from checkout,
    show a simple fallback item.
  */

  const displayItems =
    orderItems.length > 0
      ? orderItems
      : [
          {
            name: "Your selected dishes",
            type: "Order",
            qty: 1,
            price: subtotal,
          },
        ];

  const handleContinueShopping = () => {
    navigate("/menu");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleTrackOrder = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #f8fafc 100%)",
        py: {
          xs: 3,
          md: 6,
        },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
        }}
      >
        {/* =====================================================
            SUCCESS HEADER
        ====================================================== */}

        <Box
          sx={{
            textAlign: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 86,
              height: 86,
              borderRadius: "50%",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #16a34a, #22c55e)",
              boxShadow:
                "0 15px 40px rgba(22,163,74,.25)",
              animation: "successPop .55s ease-out",
              "@keyframes successPop": {
                "0%": {
                  transform: "scale(.5)",
                  opacity: 0,
                },
                "70%": {
                  transform: "scale(1.08)",
                },
                "100%": {
                  transform: "scale(1)",
                  opacity: 1,
                },
              },
            }}
          >
            <CheckCircleIcon
              sx={{
                color: "#fff",
                fontSize: 48,
              }}
            />
          </Box>

          <Typography
            sx={{
              mt: 2.5,
              fontSize: {
                xs: 30,
                md: 40,
              },
              lineHeight: 1.05,
              fontWeight: 950,
              color: "#0f172a",
              letterSpacing: "-.04em",
            }}
          >
            Order Confirmed!
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#64748b",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Thank you for ordering from Famous Cook.
            <br />
            Your delicious meal is being prepared.
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              px: 2,
              py: 1,
              borderRadius: "12px",
              background: "#eff6ff",
              border: "1px solid #dbeafe",
            }}
          >
            <ReceiptLongOutlinedIcon
              sx={{
                color: "#2563eb",
                fontSize: 18,
              }}
            />

            <Typography
              sx={{
                color: "#1d4ed8",
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              Order #{orderNumber}
            </Typography>
          </Box>
        </Box>

        {/* =====================================================
            ESTIMATED DELIVERY
        ====================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              md: 2.5,
            },
            mb: 2,
            borderRadius: "20px",
            background:
              "linear-gradient(135deg, #eff6ff, #f0fdf4)",
            border:
              "1px solid #dbeafe",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                flexShrink: 0,
                borderRadius: "15px",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 5px 15px rgba(15,23,42,.06)",
              }}
            >
              <AccessTimeIcon
                sx={{
                  color: "#2563eb",
                  fontSize: 26,
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                ESTIMATED DELIVERY
              </Typography>

              <Typography
                sx={{
                  color: "#0f172a",
                  fontSize: 19,
                  fontWeight: 950,
                  mt: 0.2,
                }}
              >
                30–40 minutes
              </Typography>
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
                  color: "#16a34a",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                On the way soon
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* =====================================================
            ORDER STATUS
        ====================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2.5,
              md: 3,
            },
            mb: 2,
            borderRadius: "22px",
            border: "1px solid #e2e8f0",
            background: "#fff",
          }}
        >
          <Typography
            sx={{
              fontSize: 19,
              fontWeight: 950,
              color: "#0f172a",
              mb: 3,
            }}
          >
            Order Status
          </Typography>

          <Stack spacing={0}>
            {[
              {
                title: "Order Placed",
                text: "We've received your order",
                active: true,
              },
              {
                title: "Order Confirmed",
                text: "Restaurant has accepted your order",
                active: true,
              },
              {
                title: "Preparing",
                text: "Your food is being freshly prepared",
                active: false,
              },
              {
                title: "Out for Delivery",
                text: "Your order is on its way",
                active: false,
              },
              {
                title: "Delivered",
                text: "Enjoy your Famous Cook meal",
                active: false,
              },
            ].map((status, index, array) => (
              <Stack
                direction="row"
                spacing={2}
                key={status.title}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: status.active
                        ? "#16a34a"
                        : "#e2e8f0",
                      border: status.active
                        ? "4px solid #dcfce7"
                        : "4px solid #f8fafc",
                    }}
                  />

                  {index !== array.length - 1 && (
                    <Box
                      sx={{
                        width: 2,
                        height: 45,
                        background:
                          index < 1
                            ? "#86efac"
                            : "#e2e8f0",
                      }}
                    />
                  )}
                </Box>

                <Box
                  sx={{
                    pb:
                      index !== array.length - 1
                        ? 2
                        : 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: status.active
                        ? "#0f172a"
                        : "#94a3b8",
                    }}
                  >
                    {status.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "#94a3b8",
                      mt: 0.3,
                    }}
                  >
                    {status.text}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Paper>

        {/* =====================================================
            CUSTOMER DETAILS
        ====================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2.5,
              md: 3,
            },
            mb: 2,
            borderRadius: "22px",
            border: "1px solid #e2e8f0",
            background: "#fff",
          }}
        >
          <Typography
            sx={{
              fontSize: 19,
              fontWeight: 950,
              color: "#0f172a",
              mb: 2,
            }}
          >
            Delivery Details
          </Typography>

          <Stack spacing={2}>
            <Stack
              direction="row"
              spacing={1.5}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "11px",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HomeOutlinedIcon
                  fontSize="small"
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 10,
                    color: "#94a3b8",
                    fontWeight: 900,
                  }}
                >
                  CUSTOMER
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#0f172a",
                    fontWeight: 800,
                  }}
                >
                  {customerName}
                </Typography>
              </Box>
            </Stack>

            {phone && (
              <Stack
                direction="row"
                spacing={1.5}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "11px",
                    background: "#f0fdf4",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PhoneOutlinedIcon
                    fontSize="small"
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#94a3b8",
                      fontWeight: 900,
                    }}
                  >
                    PHONE
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#0f172a",
                      fontWeight: 800,
                    }}
                  >
                    {phone}
                  </Typography>
                </Box>
              </Stack>
            )}

            {address && (
              <Stack
                direction="row"
                spacing={1.5}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "11px",
                    background: "#fff7ed",
                    color: "#f97316",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HomeOutlinedIcon
                    fontSize="small"
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#94a3b8",
                      fontWeight: 900,
                    }}
                  >
                    DELIVERY ADDRESS
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#0f172a",
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    {address}
                  </Typography>
                </Box>
              </Stack>
            )}

            <Divider />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 12,
                }}
              >
                Payment Method
              </Typography>

              <Typography
                sx={{
                  color: "#0f172a",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                {paymentMethod}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* =====================================================
            ORDER SUMMARY
        ====================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2.5,
              md: 3,
            },
            mb: 3,
            borderRadius: "22px",
            border: "1px solid #e2e8f0",
            background: "#fff",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography
              sx={{
                fontSize: 19,
                fontWeight: 950,
              }}
            >
              Your Order
            </Typography>

            <ShoppingBagOutlinedIcon
              sx={{
                color: "#2563eb",
              }}
            />
          </Stack>

          <Stack spacing={1.5}>
            {displayItems.map((item, index) => {
              const quantity =
                Number(item.qty) || 1;

              const price =
                Number(item.price) || 0;

              return (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  key={`${item.name}-${index}`}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 850,
                        color: "#0f172a",
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#94a3b8",
                        mt: 0.2,
                      }}
                    >
                      {item.type &&
                      item.type !== "Order"
                        ? `${item.type} • `
                        : ""}
                      × {quantity}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 900,
                    }}
                  >
                    ₹{price * quantity}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 12,
                }}
              >
                Subtotal
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                ₹{subtotal}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 12,
                }}
              >
                Delivery
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                ₹{deliveryCharge}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 12,
                }}
              >
                Taxes
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                ₹{tax}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

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
                fontSize: 26,
                fontWeight: 950,
                color: "#16a34a",
              }}
            >
              ₹{finalTotal}
            </Typography>
          </Stack>
        </Paper>

        {/* =====================================================
            ACTION BUTTONS
        ====================================================== */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
        >
          <Button
            fullWidth
            onClick={handleTrackOrder}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              height: 54,
              borderRadius: "15px",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 950,
              textTransform: "none",
              boxShadow:
                "0 10px 25px rgba(37,99,235,.2)",
              "&:hover": {
                background: "#1d4ed8",
              },
            }}
          >
            Track My Order
          </Button>

          <Button
            fullWidth
            onClick={handleContinueShopping}
            sx={{
              height: 54,
              borderRadius: "15px",
              color: "#0f172a",
              border:
                "1px solid #cbd5e1",
              background: "#fff",
              fontWeight: 900,
              textTransform: "none",
              "&:hover": {
                background: "#f8fafc",
              },
            }}
          >
            Continue Shopping
          </Button>
        </Stack>

        <Button
          fullWidth
          onClick={handleHome}
          sx={{
            mt: 1.5,
            height: 48,
            color: "#64748b",
            fontWeight: 800,
            textTransform: "none",
          }}
        >
          Back to Home
        </Button>

        {/* =====================================================
            FOOTER MESSAGE
        ====================================================== */}

        <Box
          sx={{
            textAlign: "center",
            mt: 4,
          }}
        >
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 11,
              lineHeight: 1.7,
            }}
          >
            Thank you for choosing Famous Cook ❤️
            <br />
            We hope you enjoy every bite.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}