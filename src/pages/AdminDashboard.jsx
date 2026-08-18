import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
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
  useMediaQuery,
} from "@mui/material";

import {
  DashboardRounded,
  RestaurantMenuRounded,
  ReceiptLongRounded,
  AnalyticsRounded,
  PeopleRounded,
  SettingsRounded,
  LogoutRounded,
  MenuRounded,
  AddRounded,
  EditRounded,
  DeleteOutlineRounded,
  SearchRounded,
  TrendingUpRounded,
  ShoppingBagRounded,
  AccessTimeRounded,
  CheckCircleRounded,
  LocalFireDepartmentRounded,
  CloseRounded,
  MoreHorizRounded,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";

import {
  menuService,
  orderService,
  authService,
} from "../services/api";

import { useNavigate } from "react-router-dom";

/* =========================================================
   CONSTANTS
========================================================= */

const drawerWidth = 250;

const initialForm = {
  name: "",
  category: "",
  priceHalf: "",
  priceFull: "",
  image: "",
};

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}) {
  return (
    <Button
      fullWidth
      onClick={onClick}
      startIcon={icon}
      sx={{
        justifyContent: "flex-start",
        px: 1.7,
        py: 1.25,
        mb: 0.5,
        borderRadius: "12px",
        textTransform: "none",
        fontWeight: active ? 800 : 650,
        fontSize: 14,
        color: active
          ? "#ffffff"
          : "#94a3b8",
        background: active
          ? "linear-gradient(135deg,#0f766e,#0e7490)"
          : "transparent",

        "& .MuiButton-startIcon": {
          color: active
            ? "#ffffff"
            : "#64748b",
        },

        "&:hover": {
          background: active
            ? "linear-gradient(135deg,#0f766e,#0e7490)"
            : "rgba(255,255,255,.06)",
          color: "#ffffff",
        },
      }}
    >
      {label}
    </Button>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: "18px",
        border:
          "1px solid #e2e8f0",
        background: "#ffffff",
        boxShadow:
          "0 8px 25px rgba(15,23,42,.055)",
      }}
    >
      <CardContent sx={{ p: 2.2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              sx={{
                color: "#64748b",
                fontSize: 12,
                fontWeight: 750,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                mt: 0.6,
                color: "#0f172a",
                fontSize: 27,
                fontWeight: 950,
                lineHeight: 1.1,
              }}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography
                sx={{
                  mt: 0.7,
                  color: "#94a3b8",
                  fontSize: 11.5,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "14px",
              display: "grid",
              placeItems: "center",
              background: iconBg,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   STATUS CHIP
========================================================= */

function StatusChip({ status }) {
  const normalized =
    String(status || "")
      .toLowerCase();

  let background = "#f1f5f9";
  let color = "#475569";

  if (
    normalized === "pending"
  ) {
    background = "#fef3c7";
    color = "#92400e";
  }

  if (
    normalized === "cooking" ||
    normalized === "preparing"
  ) {
    background = "#dbeafe";
    color = "#1d4ed8";
  }

  if (
    normalized === "delivered" ||
    normalized === "completed" ||
    normalized === "ready"
  ) {
    background = "#dcfce7";
    color = "#166534";
  }

  if (
    normalized === "cancelled"
  ) {
    background = "#fee2e2";
    color = "#991b1b";
  }

  return (
    <Chip
      label={status || "Unknown"}
      size="small"
      sx={{
        borderRadius: "8px",
        background,
        color,
        fontWeight: 850,
        fontSize: 11,
        border: "none",
      }}
    />
  );
}

/* =========================================================
   MAIN ADMIN DASHBOARD
========================================================= */

export default function AdminDashboard() {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [activePage, setActivePage] =
    useState("dashboard");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [menuItems, setMenuItems] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [
    openItemDialog,
    setOpenItemDialog,
  ] = useState(false);

  const [editingItem, setEditingItem] =
    useState(null);

  const [formData, setFormData] =
    useState(initialForm);

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH DATA
  ======================================================= */

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [menu, ords] =
        await Promise.all([
          menuService.getMenu(),
          orderService.getOrders(),
        ]);

      setMenuItems(
        Array.isArray(menu)
          ? menu
          : []
      );

      setOrders(
        Array.isArray(ords)
          ? ords
          : []
      );
    } catch (err) {
      console.error(err);

      if (
        err.response?.status === 401
      ) {
        navigate("/login");
        return;
      }

      setError(
        "Unable to load admin data. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  /* =======================================================
     ORDER STATUS
  ======================================================= */

  const handleStatusUpdate = async (
    id,
    status
  ) => {
    try {
      await orderService.updateStatus(
        id,
        status
      );

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to update order status."
      );
    }
  };

  /* =======================================================
     OPEN ADD ITEM
  ======================================================= */

  const openAddItem = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setOpenItemDialog(true);
  };

  /* =======================================================
     OPEN EDIT ITEM
  ======================================================= */

  const openEditItem = (item) => {
    setEditingItem(item);

    setFormData({
      name: item.name || "",
      category: item.category || "",
      priceHalf:
        item.priceHalf ?? "",
      priceFull:
        item.priceFull ?? "",
      image: item.image || "",
    });

    setOpenItemDialog(true);
  };

  /* =======================================================
     SAVE ITEM
  ======================================================= */

  const handleSaveItem = async () => {
    try {
      if (!formData.name.trim()) {
        setError(
          "Please enter a dish name."
        );
        return;
      }

      if (!formData.category.trim()) {
        setError(
          "Please enter a category."
        );
        return;
      }

      if (editingItem) {
        await menuService.updateItem(
          editingItem.id,
          formData
        );
      } else {
        await menuService.createItem(
          formData
        );
      }

      setOpenItemDialog(false);
      setEditingItem(null);
      setFormData(initialForm);
      setError("");

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to save menu item."
      );
    }
  };

  /* =======================================================
     DELETE ITEM
  ======================================================= */

  const handleDeleteItem = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this dish?"
      );

    if (!confirmed) return;

    try {
      await menuService.deleteItem(
        id
      );

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to delete menu item."
      );
    }
  };

  /* =======================================================
     FILTERED MENU
  ======================================================= */

  const categories = useMemo(() => {
    const values = [
      ...new Set(
        menuItems
          .map(
            (item) =>
              item.category
          )
          .filter(Boolean)
      ),
    ];

    return [
      "All",
      ...values,
    ];
  }, [menuItems]);

  const filteredMenu =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return menuItems.filter(
        (item) => {
          const categoryMatch =
            categoryFilter ===
            "All" ||
            item.category ===
              categoryFilter;

          const searchMatch =
            !query ||
            String(
              item.name || ""
            )
              .toLowerCase()
              .includes(query);

          return (
            categoryMatch &&
            searchMatch
          );
        }
      );
    }, [
      menuItems,
      search,
      categoryFilter,
    ]);

  /* =======================================================
     ORDER STATS
  ======================================================= */

  const pendingOrders =
    orders.filter(
      (order) =>
        String(
          order.status || ""
        ).toLowerCase() ===
        "pending"
    ).length;

  const cookingOrders =
    orders.filter(
      (order) =>
        ["cooking", "preparing"].includes(
          String(
            order.status || ""
          ).toLowerCase()
        )
    ).length;

  const completedOrders =
    orders.filter(
      (order) =>
        [
          "delivered",
          "completed",
        ].includes(
          String(
            order.status || ""
          ).toLowerCase()
        )
    ).length;

  const revenue =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.totalAmount || 0
        ),
      0
    );

  /* =======================================================
     SIDEBAR
  ======================================================= */

  const navigation = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <DashboardRounded />,
    },
    {
      key: "menu",
      label: "Menu Management",
      icon: (
        <RestaurantMenuRounded />
      ),
    },
    {
      key: "orders",
      label: "Orders",
      icon: <ReceiptLongRounded />,
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: <AnalyticsRounded />,
    },
    {
      key: "customers",
      label: "Customers",
      icon: <PeopleRounded />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingsRounded />,
    },
  ];

  const handleNavigation = (
    page
  ) => {
    setActivePage(page);

    if (isMobile) {
      setMobileOpen(false);
    }
  };

  /* =======================================================
     SIDEBAR CONTENT
  ======================================================= */

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg,#0b1220 0%,#0f172a 100%)",
        color: "#fff",
      }}
    >
      {/* BRAND */}

      <Box
        sx={{
          px: 2.3,
          py: 2.5,
        }}
      >
        <Stack
          direction="row"
          spacing={1.3}
          alignItems="center"
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "13px",
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(135deg,#14b8a6,#0f766e)",
              boxShadow:
                "0 8px 20px rgba(20,184,166,.25)",
            }}
          >
            <RestaurantMenuRounded />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 950,
                lineHeight: 1.1,
              }}
            >
              Famous Cook
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                color: "#64748b",
                fontSize: 10,
                fontWeight: 750,
              }}
            >
              RESTAURANT ADMIN
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,.07)",
        }}
      />

      {/* NAVIGATION */}

      <Box
        sx={{
          px: 1.2,
          py: 2,
          flexGrow: 1,
        }}
      >
        <Typography
          sx={{
            px: 1.5,
            mb: 1,
            color: "#475569",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: ".08em",
          }}
        >
          MAIN MENU
        </Typography>

        {navigation.map(
          (item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={
                activePage ===
                item.key
              }
              onClick={() =>
                handleNavigation(
                  item.key
                )
              }
            />
          )
        )}
      </Box>

      {/* LOGOUT */}

      <Box
        sx={{
          px: 1.2,
          pb: 2,
        }}
      >
        <Divider
          sx={{
            mb: 1.5,
            borderColor:
              "rgba(255,255,255,.07)",
          }}
        />

        <SidebarItem
          icon={<LogoutRounded />}
          label="Logout"
          onClick={handleLogout}
        />
      </Box>
    </Box>
  );

  /* =======================================================
     DASHBOARD VIEW
  ======================================================= */

  const dashboardView = (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: {
              xs: 25,
              md: 31,
            },
            fontWeight: 950,
            color: "#0f172a",
            letterSpacing:
              "-.03em",
          }}
        >
          Good evening, Admin 👋
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            color: "#64748b",
            fontSize: 14,
          }}
        >
          Here's what's happening
          at Famous Cook today.
        </Typography>
      </Box>

      {/* STATS */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            lg: "repeat(4,1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          title="Total Orders"
          value={orders.length}
          subtitle="All received orders"
          icon={
            <ShoppingBagRounded
              sx={{
                color: "#2563eb",
              }}
            />
          }
          iconBg="#eff6ff"
        />

        <StatCard
          title="Today's Revenue"
          value={`₹${revenue.toLocaleString(
            "en-IN"
          )}`}
          subtitle="From current orders"
          icon={
            <TrendingUpRounded
              sx={{
                color: "#16a34a",
              }}
            />
          }
          iconBg="#f0fdf4"
        />

        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          subtitle="Waiting for action"
          icon={
            <AccessTimeRounded
              sx={{
                color: "#d97706",
              }}
            />
          }
          iconBg="#fffbeb"
        />

        <StatCard
          title="Completed"
          value={completedOrders}
          subtitle={`${cookingOrders} currently preparing`}
          icon={
            <CheckCircleRounded
              sx={{
                color: "#0f766e",
              }}
            />
          }
          iconBg="#f0fdfa"
        />
      </Box>

      {/* RECENT ORDERS */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: "18px",
          border:
            "1px solid #e2e8f0",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: 17,
                color: "#0f172a",
              }}
            >
              Recent Orders
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                color: "#94a3b8",
                fontSize: 11.5,
              }}
            >
              Latest restaurant
              activity
            </Typography>
          </Box>

          <Button
            onClick={() =>
              handleNavigation(
                "orders"
              )
            }
            sx={{
              textTransform:
                "none",
              fontWeight: 800,
              color: "#0f766e",
            }}
          >
            View all
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "#f8fafc",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 850,
                    color: "#64748b",
                    fontSize: 11,
                  }}
                >
                  ORDER
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 850,
                    color: "#64748b",
                    fontSize: 11,
                  }}
                >
                  CUSTOMER
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 850,
                    color: "#64748b",
                    fontSize: 11,
                  }}
                >
                  TOTAL
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 850,
                    color: "#64748b",
                    fontSize: 11,
                  }}
                >
                  STATUS
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders
                .slice(0, 6)
                .map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 850,
                          fontSize: 13,
                        }}
                      >
                        #
                        {String(
                          order.id
                        ).padStart(
                          6,
                          "0"
                        )}
                      </Typography>
                    </TableCell>

                 <TableCell sx={{ minWidth: 250 }}>
  <Stack spacing={0.5}>
    {/* Customer Name */}
    <Typography
      sx={{
        fontWeight: 850,
        fontSize: 13,
        color: "#0f172a",
      }}
    >
      {order.customerName || "Unknown Customer"}
    </Typography>

    {/* Phone */}
    <Typography
      sx={{
        color: "#64748b",
        fontSize: 11.5,
        fontWeight: 600,
      }}
    >
      📞 {order.customerPhone || "No phone"}
    </Typography>

    {/* Address */}
    {order.address && (
      <Typography
        sx={{
          color: "#475569",
          fontSize: 11.5,
          lineHeight: 1.4,
          mt: 0.3,
        }}
      >
        📍 {order.address}
      </Typography>
    )}

    {/* Landmark */}
    {order.landmark && (
      <Typography
        sx={{
          color: "#64748b",
          fontSize: 11,
          lineHeight: 1.4,
        }}
      >
        🏷️ Near {order.landmark}
      </Typography>
    )}

    {/* Payment */}
    {order.paymentMethod && (
      <Chip
        label={String(order.paymentMethod).toUpperCase()}
        size="small"
        sx={{
          width: "fit-content",
          mt: 0.5,
          height: 22,
          borderRadius: "7px",
          background: "#ecfdf5",
          color: "#047857",
          fontWeight: 800,
          fontSize: 9.5,
        }}
      />
    )}
  </Stack>
</TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 900,
                        }}
                      >
                        ₹
                        {
                          order.totalAmount
                        }
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <StatusChip
                        status={
                          order.status
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}

              {orders.length ===
                0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{
                      py: 6,
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          "#94a3b8",
                      }}
                    >
                      No orders yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );

  /* =======================================================
     ORDERS VIEW
  ======================================================= */

  const ordersView = (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: 29,
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
          Manage customer orders
          and update their status.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "18px",
          border:
            "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "#f8fafc",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Order
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Customer
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Items
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Total
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Status
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Update
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map(
                (order) => (
                  <TableRow
                    key={order.id}
                    hover
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: 13,
                        }}
                      >
                        #
                        {String(
                          order.id
                        ).padStart(
                          6,
                          "0"
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: 13,
                        }}
                      >
                        {
                          order.customerName
                        }
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            "#94a3b8",
                          fontSize: 11,
                        }}
                      >
                        {
                          order.customerPhone
                        }
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        maxWidth: 300,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          color:
                            "#475569",
                        }}
                      >
                        {(
                          order.items ||
                          []
                        )
                          .map(
                            (item) =>
                              `${item.qty}× ${item.name} (${item.type})`
                          )
                          .join(
                            ", "
                          )}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 900,
                        }}
                      >
                        ₹
                        {
                          order.totalAmount
                        }
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <StatusChip
                        status={
                          order.status
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Select
                        size="small"
                        value={
                          order.status ||
                          "Pending"
                        }
                        onChange={(event) =>
                          handleStatusUpdate(
                            order.id,
                            event
                              .target
                              .value
                          )
                        }
                        sx={{
                          minWidth: 125,
                          borderRadius:
                            "10px",
                          fontSize: 12,
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
                    </TableCell>
                  </TableRow>
                )
              )}

              {orders.length ===
                0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 7,
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          "#94a3b8",
                      }}
                    >
                      No orders
                      available.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );

  /* =======================================================
     MENU VIEW
  ======================================================= */

  const menuView = (
    <>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 29,
              fontWeight: 950,
              color: "#0f172a",
            }}
          >
            Menu Management
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#64748b",
            }}
          >
            Add, edit and manage
            your restaurant dishes.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={openAddItem}
          sx={{
            height: 45,
            px: 2,
            borderRadius: "12px",
            textTransform:
              "none",
            fontWeight: 850,
            background:
              "linear-gradient(135deg,#0f766e,#0e7490)",
            boxShadow:
              "0 8px 20px rgba(15,118,110,.2)",

            "&:hover": {
              background:
                "linear-gradient(135deg,#115e59,#155e75)",
            },
          }}
        >
          Add New Dish
        </Button>
      </Box>

      {/* SEARCH / FILTER */}

      <Paper
        elevation={0}
        sx={{
          p: 1.2,
          mb: 2,
          borderRadius: "16px",
          border:
            "1px solid #e2e8f0",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.2}
        >
          <TextField
            fullWidth
            size="small"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search dishes..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded
                    sx={{
                      color:
                        "#94a3b8",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root":
                {
                  borderRadius:
                    "10px",
                },
            }}
          />

          <Select
            size="small"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
            sx={{
              minWidth: {
                xs: "100%",
                sm: 190,
              },
              borderRadius:
                "10px",
            }}
          >
            {categories.map(
              (category) => (
                <MenuItem
                  key={category}
                  value={category}
                >
                  {category}
                </MenuItem>
              )
            )}
          </Select>
        </Stack>
      </Paper>

      {/* MENU TABLE */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: "18px",
          border:
            "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "#f8fafc",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Dish
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Category
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Half / Full
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Status
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredMenu.map(
                (item) => (
                  <TableRow
                    key={item.id}
                    hover
                  >
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1.3}
                        alignItems="center"
                      >
                        <Avatar
                          src={
                            item.image
                          }
                          variant="rounded"
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius:
                              "10px",
                          }}
                        >
                          <RestaurantMenuRounded />
                        </Avatar>

                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 850,
                              fontSize: 13,
                            }}
                          >
                            {
                              item.name
                            }
                          </Typography>

                          {item.bestseller && (
                            <Chip
                              icon={
                                <LocalFireDepartmentRounded />
                              }
                              label="Bestseller"
                              size="small"
                              sx={{
                                mt: 0.5,
                                height: 21,
                                fontSize: 9,
                                fontWeight: 850,
                                color:
                                  "#c2410c",
                                background:
                                  "#ffedd5",
                              }}
                            />
                          )}
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          item.category ||
                          "Other"
                        }
                        size="small"
                        sx={{
                          background:
                            "#f1f5f9",
                          color:
                            "#475569",
                          fontWeight: 750,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: 13,
                        }}
                      >
                        ₹
                        {
                          item.priceHalf
                        }{" "}
                        / ₹
                        {
                          item.priceFull
                        }
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          item.available ===
                          false
                            ? "Unavailable"
                            : "Available"
                        }
                        size="small"
                        sx={{
                          background:
                            item.available ===
                            false
                              ? "#fee2e2"
                              : "#dcfce7",
                          color:
                            item.available ===
                            false
                              ? "#991b1b"
                              : "#166534",
                          fontWeight: 800,
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        onClick={() =>
                          openEditItem(
                            item
                          )
                        }
                        sx={{
                          color:
                            "#2563eb",
                          mr: 0.5,
                        }}
                      >
                        <EditRounded />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          handleDeleteItem(
                            item.id
                          )
                        }
                        sx={{
                          color:
                            "#dc2626",
                        }}
                      >
                        <DeleteOutlineRounded />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )}

              {filteredMenu.length ===
                0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      py: 7,
                    }}
                  >
                    <RestaurantMenuRounded
                      sx={{
                        fontSize: 42,
                        color:
                          "#cbd5e1",
                      }}
                    />

                    <Typography
                      sx={{
                        mt: 1,
                        fontWeight: 850,
                      }}
                    >
                      No dishes found
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          "#94a3b8",
                        fontSize: 12,
                      }}
                    >
                      Try another
                      search or
                      category.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );

  /* =======================================================
     PLACEHOLDER VIEWS
  ======================================================= */

  const placeholderView = (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 4,
          md: 7,
        },
        textAlign: "center",
        borderRadius: "20px",
        border:
          "1px solid #e2e8f0",
      }}
    >
      <Box
        sx={{
          width: 65,
          height: 65,
          mx: "auto",
          borderRadius: "18px",
          display: "grid",
          placeItems: "center",
          background: "#f1f5f9",
          color: "#64748b",
        }}
      >
        <MoreHorizRounded
          sx={{
            fontSize: 34,
          }}
        />
      </Box>

      <Typography
        sx={{
          mt: 2,
          fontSize: 22,
          fontWeight: 900,
          color: "#0f172a",
        }}
      >
        {navigation.find(
          (item) =>
            item.key ===
            activePage
        )?.label || "Coming Soon"}
      </Typography>

      <Typography
        sx={{
          mt: 0.7,
          color: "#64748b",
          maxWidth: 460,
          mx: "auto",
        }}
      >
        This section is planned
        for the next stage of
        the Famous Cook admin
        system.
      </Typography>
    </Paper>
  );

  /* =======================================================
     ACTIVE CONTENT
  ======================================================= */

  const activeContent =
    activePage === "dashboard"
      ? dashboardView
      : activePage === "menu"
      ? menuView
      : activePage === "orders"
      ? ordersView
      : placeholderView;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "#f8fafc",
      }}
    >
      {/* DESKTOP SIDEBAR */}

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,

            "& .MuiDrawer-paper":
              {
                width:
                  drawerWidth,
                boxSizing:
                  "border-box",
                border: "none",
              },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* MOBILE DRAWER */}

      {isMobile && (
        <Drawer
          open={mobileOpen}
          onClose={() =>
            setMobileOpen(false)
          }
          sx={{
            "& .MuiDrawer-paper":
              {
                width:
                  drawerWidth,
                border: "none",
              },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* MAIN */}

      <Box
        sx={{
          ml: {
            xs: 0,
            md: `${drawerWidth}px`,
          },
          minHeight: "100vh",
        }}
      >
        {/* TOP BAR */}

        <Paper
          elevation={0}
          sx={{
            height: 72,
            px: {
              xs: 1.5,
              md: 3,
            },
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            borderBottom:
              "1px solid #e2e8f0",
            borderRadius: 0,
            background:
              "rgba(255,255,255,.92)",
            backdropFilter:
              "blur(14px)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            {isMobile && (
              <IconButton
                onClick={() =>
                  setMobileOpen(
                    true
                  )
                }
              >
                <MenuRounded />
              </IconButton>
            )}

            <Box>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 850,
                  color: "#64748b",
                }}
              >
                Admin Panel
              </Typography>

              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 950,
                  color: "#0f172a",
                }}
              >
                Famous Cook
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
          >
            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
                textAlign: "right",
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 850,
                  color: "#0f172a",
                }}
              >
                Restaurant Admin
              </Typography>

              <Typography
                sx={{
                  fontSize: 10,
                  color: "#94a3b8",
                }}
              >
                Manage your restaurant
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 40,
                height: 40,
                background:
                  "linear-gradient(135deg,#0f766e,#2563eb)",
                fontWeight: 900,
              }}
            >
              A
            </Avatar>
          </Stack>
        </Paper>

        {/* CONTENT */}

        <Container
          maxWidth="xl"
          sx={{
            py: {
              xs: 2.5,
              md: 3.5,
            },
            px: {
              xs: 1.5,
              sm: 2.5,
              md: 3.5,
            },
          }}
        >
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius:
                  "12px",
              }}
              onClose={() =>
                setError("")
              }
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <Paper
              elevation={0}
              sx={{
                minHeight: 500,
                display: "grid",
                placeItems: "center",
                borderRadius:
                  "20px",
                border:
                  "1px solid #e2e8f0",
              }}
            >
              <Stack
                alignItems="center"
                spacing={1.5}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius:
                      "50%",
                    border:
                      "4px solid #ccfbf1",
                    borderTopColor:
                      "#0f766e",
                    animation:
                      "spin 1s linear infinite",
                    "@keyframes spin":
                      {
                        from: {
                          transform:
                            "rotate(0deg)",
                        },
                        to: {
                          transform:
                            "rotate(360deg)",
                        },
                      },
                  }}
                />

                <Typography
                  sx={{
                    color:
                      "#64748b",
                    fontSize: 13,
                  }}
                >
                  Loading admin
                  dashboard...
                </Typography>
              </Stack>
            </Paper>
          ) : (
            activeContent
          )}
        </Container>
      </Box>

      {/* =====================================================
          ADD / EDIT DISH DIALOG
      ===================================================== */}

      <Dialog
        open={openItemDialog}
        onClose={() =>
          setOpenItemDialog(false)
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "22px",
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
            fontSize: 22,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              {editingItem
                ? "Edit Dish"
                : "Add New Dish"}

              <Typography
                sx={{
                  mt: 0.4,
                  color: "#94a3b8",
                  fontSize: 11.5,
                  fontWeight: 500,
                }}
              >
                Manage restaurant
                menu information
              </Typography>
            </Box>

            <IconButton
              onClick={() =>
                setOpenItemDialog(
                  false
                )
              }
            >
              <CloseRounded />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent
          sx={{
            px: 3,
            pt: 2,
          }}
        >
          <Stack spacing={1.8}>
            <TextField
              fullWidth
              label="Dish Name"
              value={formData.name}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  name: event.target
                    .value,
                })
              }
            />

            <TextField
              fullWidth
              label="Category"
              value={
                formData.category
              }
              onChange={(event) =>
                setFormData({
                  ...formData,
                  category:
                    event.target
                      .value,
                })
              }
              placeholder="Example: Tandoor"
            />

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
            >
              <TextField
                fullWidth
                label="Half Price"
                type="number"
                value={
                  formData.priceHalf
                }
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    priceHalf:
                      event.target
                        .value,
                  })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      ₹
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Full Price"
                type="number"
                value={
                  formData.priceFull
                }
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    priceFull:
                      event.target
                        .value,
                  })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      ₹
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <TextField
              fullWidth
              label="Food Image URL"
              value={formData.image}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  image: event.target
                    .value,
                })
              }
              placeholder="https://..."
            />

            {formData.image && (
              <Box
                component="img"
                src={formData.image}
                alt="Dish preview"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
                sx={{
                  width: "100%",
                  height: 180,
                  objectFit:
                    "cover",
                  borderRadius:
                    "14px",
                  border:
                    "1px solid #e2e8f0",
                }}
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 1,
            gap: 1,
          }}
        >
          <Button
            onClick={() =>
              setOpenItemDialog(
                false
              )
            }
            sx={{
              px: 2,
              borderRadius:
                "10px",
              textTransform:
                "none",
              fontWeight: 800,
              color: "#64748b",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleSaveItem
            }
            sx={{
              px: 2.5,
              borderRadius:
                "10px",
              textTransform:
                "none",
              fontWeight: 850,
              background:
                "linear-gradient(135deg,#0f766e,#0e7490)",
            }}
          >
            {editingItem
              ? "Save Changes"
              : "Add Dish"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

