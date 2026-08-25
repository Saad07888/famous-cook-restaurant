import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";

import {
  SearchRounded,
  ReceiptLongRounded,
  VisibilityRounded,
  PhoneRounded,
  PersonRounded,
  LocationOnRounded,
  ShoppingBagRounded,
  PaymentsRounded,
  CloseRounded,
} from "@mui/icons-material";

import { orderService } from "../services/api";


/* =========================================================
   STATUS CHIP
========================================================= */

function StatusChip({ status }) {
  const styles = {
    Pending: {
      bg: "#fef3c7",
      color: "#b45309",
    },

    Cooking: {
      bg: "#dbeafe",
      color: "#1d4ed8",
    },

    Delivered: {
      bg: "#dcfce7",
      color: "#047857",
    },

    Cancelled: {
      bg: "#fee2e2",
      color: "#b91c1c",
    },
  };

  const style = styles[status] || styles.Pending;

  return (
    <Chip
      label={status || "Pending"}
      size="small"
      sx={{
        background: style.bg,
        color: style.color,
        fontWeight: 800,
        fontSize: 11,
        borderRadius: "8px",
      }}
    />
  );
}


/* =========================================================
   ADMIN ORDERS
========================================================= */

export default function AdminOrders({
  orders = [],
  onRefresh,
  onError,
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* =======================================================
     VIEW ORDER
  ======================================================= */

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
  };

  /* =======================================================
     CLOSE DIALOG
  ======================================================= */

  const closeOrderDialog = () => {
    setOpenOrderDialog(false);

    setTimeout(() => {
      setSelectedOrder(null);
    }, 200);
  };

  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  const handleStatusUpdate = async (id, status) => {
    try {
      await orderService.updateStatus(id, status);

      if (onRefresh) {
        await onRefresh();
      }

      setSelectedOrder((current) => {
        if (!current) return current;

        return {
          ...current,
          status,
        };
      });
    } catch (error) {
      console.error(error);

      if (onError) {
        onError("Unable to update order status.");
      }
    }
  };

  /* =======================================================
     FILTER ORDERS
  ======================================================= */

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        String(order.id)
          .toLowerCase()
          .includes(query) ||
        order.customerName
          ?.toLowerCase()
          .includes(query) ||
        String(order.customerPhone || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);


  /* =======================================================
     PAYMENT DISPLAY
  ======================================================= */

  const getPaymentLabel = (order) => {
    return order.paymentMethod || "Not provided";
  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Box>
      {/* HEADER */}

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: {
              xs: 26,
              md: 30,
            },
            fontWeight: 950,
            color: "#0f172a",
          }}
        >
          Orders
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            color: "#64748b",
          }}
        >
          Manage orders, customers, payments and delivery status.
        </Typography>
      </Box>


      {/* SEARCH + FILTER */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: "18px",
          border: "1px solid #e2e8f0",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={1.5}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search order, customer or phone..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded
                    sx={{
                      color: "#94a3b8",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <Select
            size="small"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            sx={{
              minWidth: {
                xs: "100%",
                md: 170,
              },
              borderRadius: "10px",
            }}
          >
            <MenuItem value="All">
              All Status
            </MenuItem>

            <MenuItem value="Pending">
              Pending
            </MenuItem>

            <MenuItem value="Cooking">
              Cooking
            </MenuItem>

            <MenuItem value="Delivered">
              Delivered
            </MenuItem>

            <MenuItem value="Cancelled">
              Cancelled
            </MenuItem>
          </Select>
        </Stack>
      </Paper>


      {/* ORDER TABLE */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: "18px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: "#f8fafc",
                }}
              >
                <TableCell sx={{ fontWeight: 900 }}>
                  ORDER
                </TableCell>

                <TableCell sx={{ fontWeight: 900 }}>
                  CUSTOMER
                </TableCell>

                <TableCell sx={{ fontWeight: 900 }}>
                  ITEMS
                </TableCell>

                <TableCell sx={{ fontWeight: 900 }}>
                  TOTAL
                </TableCell>

                <TableCell sx={{ fontWeight: 900 }}>
                  PAYMENT
                </TableCell>

                <TableCell sx={{ fontWeight: 900 }}>
                  STATUS
                </TableCell>

                <TableCell sx={{ fontWeight: 900 }}>
                  ACTION
                </TableCell>
              </TableRow>
            </TableHead>


            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  hover
                >

                  {/* ORDER */}

                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: 13,
                      }}
                    >
                      #
                      {String(order.id).padStart(
                        6,
                        "0"
                      )}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: 10,
                        mt: 0.3,
                      }}
                    >
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString(
                            "en-IN",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )
                        : "Date unavailable"}
                    </Typography>
                  </TableCell>


                  {/* CUSTOMER */}

                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: 13,
                      }}
                    >
                      {order.customerName}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      sx={{ mt: 0.3 }}
                    >
                      <PhoneRounded
                        sx={{
                          fontSize: 13,
                          color: "#94a3b8",
                        }}
                      />

                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontSize: 10.5,
                        }}
                      >
                        {order.customerPhone}
                      </Typography>
                    </Stack>
                  </TableCell>


                  {/* ITEMS */}

                  <TableCell
                    sx={{
                      maxWidth: 300,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "#475569",
                      }}
                    >
                      {(order.items || [])
                        .map(
                          (item) =>
                            `${item.qty}× ${item.name} (${item.type})`
                        )
                        .join(", ")}
                    </Typography>
                  </TableCell>


                  {/* TOTAL */}

                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 900,
                      }}
                    >
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </Typography>
                  </TableCell>


                  {/* PAYMENT */}

                  <TableCell>
                    <Chip
                      icon={<PaymentsRounded />}
                      label={getPaymentLabel(order)}
                      size="small"
                      sx={{
                        fontWeight: 750,
                        borderRadius: "8px",
                        background: "#f3e8ff",
                        color: "#7c3aed",
                        "& .MuiChip-icon": {
                          color: "#7c3aed",
                        },
                      }}
                    />
                  </TableCell>


                  {/* STATUS */}

                  <TableCell>
                    <Stack spacing={1}>
                      <StatusChip
                        status={order.status}
                      />

                      <Select
                        size="small"
                        value={
                          order.status || "Pending"
                        }
                        onChange={(event) =>
                          handleStatusUpdate(
                            order.id,
                            event.target.value
                          )
                        }
                        sx={{
                          minWidth: 120,
                          borderRadius: "10px",
                          fontSize: 11,
                        }}
                      >
                        <MenuItem value="Pending">
                          Pending
                        </MenuItem>

                        <MenuItem value="Cooking">
                          Cooking
                        </MenuItem>

                        <MenuItem value="Delivered">
                          Delivered
                        </MenuItem>

                        <MenuItem value="Cancelled">
                          Cancelled
                        </MenuItem>
                      </Select>
                    </Stack>
                  </TableCell>


                  {/* ACTION */}

                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={
                        <VisibilityRounded />
                      }
                      onClick={() =>
                        handleViewOrder(order)
                      }
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: 11,
                        borderColor: "#cbd5e1",
                        color: "#0f766e",
                        whiteSpace: "nowrap",

                        "&:hover": {
                          borderColor: "#0f766e",
                          background: "#f0fdfa",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>

                </TableRow>
              ))}


              {/* EMPTY */}

              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 7 }}
                  >
                    <ReceiptLongRounded
                      sx={{
                        fontSize: 45,
                        color: "#cbd5e1",
                      }}
                    />

                    <Typography
                      sx={{
                        mt: 1,
                        fontWeight: 850,
                      }}
                    >
                      No orders found
                    </Typography>

                    <Typography
                      color="text.secondary"
                      fontSize={12}
                      sx={{ mt: 0.5 }}
                    >
                      Try changing your search or filter.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>


      {/* =====================================================
          ORDER DETAILS DIALOG
      ===================================================== */}

      <Dialog
        open={openOrderDialog}
        onClose={closeOrderDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            overflow: "hidden",
            maxHeight: "90vh",
          },
        }}
      >
        {selectedOrder && (
          <>
            {/* HEADER */}

            <DialogTitle
              sx={{
                p: 3,
                background:
                  "linear-gradient(135deg,#0f766e,#0e7490)",
                color: "#fff",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      opacity: 0.8,
                      fontWeight: 700,
                    }}
                  >
                    ORDER DETAILS
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 26,
                      fontWeight: 950,
                      mt: 0.3,
                    }}
                  >
                    #
                    {String(
                      selectedOrder.id
                    ).padStart(6, "0")}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      opacity: 0.85,
                      mt: 0.5,
                    }}
                  >
                    {selectedOrder.createdAt
                      ? new Date(
                          selectedOrder.createdAt
                        ).toLocaleString(
                          "en-IN",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )
                      : "Order date unavailable"}
                  </Typography>
                </Box>

                <Stack
                  alignItems="flex-end"
                  spacing={1}
                >
                  <Button
                    onClick={closeOrderDialog}
                    sx={{
                      minWidth: 40,
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      color: "#fff",
                      background:
                        "rgba(255,255,255,.12)",
                      fontSize: 0,

                      "&:hover": {
                        background:
                          "rgba(255,255,255,.2)",
                      },
                    }}
                  >
                    <CloseRounded />
                  </Button>

                  <StatusChip
                    status={
                      selectedOrder.status
                    }
                  />
                </Stack>
              </Stack>
            </DialogTitle>


            <DialogContent
              sx={{
                p: {
                  xs: 2,
                  md: 3,
                },
                background: "#f8fafc",
              }}
            >

              {/* CUSTOMER + DELIVERY */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr",
                  },
                  gap: 2,
                  mb: 2,
                }}
              >

                {/* CUSTOMER */}

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "18px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "10px",
                        display: "grid",
                        placeItems: "center",
                        background: "#dbeafe",
                        color: "#2563eb",
                      }}
                    >
                      <PersonRounded />
                    </Box>

                    <Typography fontWeight={900}>
                      Customer
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: "#0f172a",
                    }}
                  >
                    {selectedOrder.customerName}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 1 }}
                  >
                    <PhoneRounded
                      sx={{
                        fontSize: 18,
                        color: "#64748b",
                      }}
                    />

                    <Typography
                      color="text.secondary"
                      fontSize={13}
                    >
                      {selectedOrder.customerPhone}
                    </Typography>
                  </Stack>
                </Paper>


                {/* DELIVERY */}

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "18px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "10px",
                        display: "grid",
                        placeItems: "center",
                        background: "#dcfce7",
                        color: "#15803d",
                      }}
                    >
                      <LocationOnRounded />
                    </Box>

                    <Typography fontWeight={900}>
                      Delivery
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 750,
                      color: "#334155",
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedOrder.address ||
                      "Address not provided"}
                  </Typography>

                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.2,
                      borderRadius: "10px",
                      background: "#f8fafc",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: "#94a3b8",
                        fontWeight: 800,
                        textTransform:
                          "uppercase",
                      }}
                    >
                      Landmark
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 750,
                        mt: 0.3,
                      }}
                    >
                      {selectedOrder.landmark ||
                        "Not provided"}
                    </Typography>
                  </Box>
                </Paper>
              </Box>


              {/* ITEMS */}

              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: "18px",
                  border:
                    "1px solid #e2e8f0",
                  mb: 2,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "10px",
                        display: "grid",
                        placeItems: "center",
                        background: "#fef3c7",
                        color: "#d97706",
                      }}
                    >
                      <ShoppingBagRounded />
                    </Box>

                    <Typography fontWeight={900}>
                      Ordered Items
                    </Typography>
                  </Stack>

                  <Typography
                    color="text.secondary"
                    fontSize={12}
                  >
                    {(selectedOrder.items || [])
                      .length}{" "}
                    item type(s)
                  </Typography>
                </Stack>

                <Stack spacing={1}>
                  {(selectedOrder.items || []).map(
                    (item, index) => (
                      <Box
                        key={`${item.name}-${index}`}
                        sx={{
                          p: 1.5,
                          borderRadius: "12px",
                          background: "#f8fafc",
                          border:
                            "1px solid #f1f5f9",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                        >
                          <Box>
                            <Typography
                              fontWeight={850}
                              fontSize={14}
                            >
                              {item.name}
                            </Typography>

                            <Typography
                              color="text.secondary"
                              fontSize={11}
                              sx={{ mt: 0.3 }}
                            >
                              {item.type} • Qty{" "}
                              {item.qty} × ₹
                              {item.price}
                            </Typography>
                          </Box>

                          <Typography
                            fontWeight={950}
                            fontSize={15}
                          >
                            ₹
                            {(
                              Number(
                                item.price || 0
                              ) *
                              Number(item.qty || 0)
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </Typography>
                        </Stack>
                      </Box>
                    )
                  )}

                  {(selectedOrder.items || [])
                    .length === 0 && (
                    <Typography color="text.secondary">
                      No item details available.
                    </Typography>
                  )}
                </Stack>
              </Paper>


              {/* PAYMENT + TOTAL */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr",
                  },
                  gap: 2,
                }}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "18px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1.5 }}
                  >
                    <PaymentsRounded
                      sx={{
                        color: "#7c3aed",
                      }}
                    />

                    <Typography fontWeight={900}>
                      Payment
                    </Typography>
                  </Stack>

                  <Typography fontWeight={800}>
                    {selectedOrder.paymentMethod ||
                      "Payment method not provided"}
                  </Typography>
                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "18px",
                    border:
                      "1px solid #e2e8f0",
                    background:
                      "linear-gradient(135deg,#ecfdf5,#f0fdfa)",
                  }}
                >
                  <Typography
                    color="text.secondary"
                    fontSize={12}
                    fontWeight={700}
                  >
                    ORDER TOTAL
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 30,
                      fontWeight: 950,
                      color: "#047857",
                      mt: 0.3,
                    }}
                  >
                    ₹
                    {Number(
                      selectedOrder.totalAmount || 0
                    ).toLocaleString("en-IN")}
                  </Typography>
                </Paper>

              </Box>
            </DialogContent>


            {/* STATUS ACTION */}

            <DialogActions
              sx={{
                p: 2.5,
                borderTop:
                  "1px solid #e2e8f0",
                background: "#ffffff",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              <Box>
                <Typography
                  fontSize={11}
                  color="text.secondary"
                >
                  Update Order Status
                </Typography>

                <Select
                  size="small"
                  value={
                    selectedOrder.status ||
                    "Pending"
                  }
                  onChange={(event) =>
                    handleStatusUpdate(
                      selectedOrder.id,
                      event.target.value
                    )
                  }
                  sx={{
                    mt: 0.5,
                    minWidth: 150,
                    borderRadius: "10px",
                  }}
                >
                  <MenuItem value="Pending">
                    Pending
                  </MenuItem>

                  <MenuItem value="Cooking">
                    Cooking
                  </MenuItem>

                  <MenuItem value="Delivered">
                    Delivered
                  </MenuItem>

                  <MenuItem value="Cancelled">
                    Cancelled
                  </MenuItem>
                </Select>
              </Box>

              <Button
                variant="contained"
                onClick={closeOrderDialog}
                sx={{
                  px: 3,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 850,
                  background:
                    "linear-gradient(135deg,#0f766e,#0e7490)",
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}