import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  AccessTimeRounded,
  AnalyticsRounded,
  DashboardRounded,
  LocalFireDepartmentRounded,
  LogoutRounded,
  MenuRounded,
  MoreHorizRounded,
  PeopleRounded,
  ReceiptLongRounded,
  RefreshRounded,
  RestaurantMenuRounded,
  SettingsRounded,
  ShoppingBagRounded,
  TrendingUpRounded,
  ArrowForwardRounded,
  CheckCircleRounded,
  CancelRounded,
  NotificationsNoneRounded,
  AddRounded,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import {
  menuService,
  orderService,
  authService,
} from "../services/api";

import AdminMenu from "./AdminMenu";
import AdminOrders from "./AdminOrders";


const drawerWidth = 250;


/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon,
  label,
  active,
  onClick,
  badge,
}) {
  return (
    <Button
      fullWidth
      onClick={onClick}
      startIcon={icon}
      endIcon={
        badge ? (
          <Box
            sx={{
              minWidth: 20,
              height: 20,
              px: 0.7,
              borderRadius: "20px",
              display: "grid",
              placeItems: "center",
              background: active
                ? "rgba(255,255,255,.16)"
                : "#3f2024",
              color: active
                ? "#ffffff"
                : "#f87171",
              fontSize: 10,
              fontWeight: 900,
            }}
          >
            {badge}
          </Box>
        ) : null
      }
      sx={{
        justifyContent: "flex-start",
        px: 1.6,
        py: 1.15,
        mb: 0.6,
        borderRadius: "11px",
        textTransform: "none",
        fontWeight: active ? 850 : 650,
        fontSize: 13,
        color: active
          ? "#ffffff"
          : "#a1a1aa",
        background: active
          ? "linear-gradient(135deg,#123c16,#0c2a10)"
          : "transparent",

        "& .MuiButton-startIcon": {
          color: active
            ? "#22c55e"
            : "#8b8f8b",
        },

        "&:hover": {
          background: active
            ? "linear-gradient(135deg,#123c16,#0c2a10)"
            : "#1b1d1c",
          color: "#ffffff",
        },
      }}
    >
      {label}
    </Button>
  );
}


/* =========================================================
   STATUS CHIP
========================================================= */

function StatusChip({ status }) {
  const normalized = String(
    status || ""
  ).toLowerCase();

  let background = "#272a28";
  let color = "#d1d5db";

  if (normalized === "pending") {
    background = "#33280d";
    color = "#fbbf24";
  }

  if (
    normalized === "cooking" ||
    normalized === "preparing"
  ) {
    background = "#182b42";
    color = "#60a5fa";
  }

  if (
    normalized === "delivered" ||
    normalized === "completed" ||
    normalized === "ready"
  ) {
    background = "#102d18";
    color = "#4ade80";
  }

  if (normalized === "cancelled") {
    background = "#351719";
    color = "#f87171";
  }

  return (
    <Chip
      label={status || "Unknown"}
      size="small"
      sx={{
        height: 25,
        borderRadius: "7px",
        background,
        color,
        fontWeight: 850,
        fontSize: 10.5,
        border: "1px solid rgba(255,255,255,.04)",
      }}
    />
  );
}


/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  label,
  value,
  color = "#f4f4f5",
  icon,
}) {
  return (
    <Box
      sx={{
        minWidth: 0,
      }}
    >
      <Stack
        direction="row"
        spacing={0.7}
        alignItems="center"
        sx={{ mb: 0.8 }}
      >
        {icon}

        <Typography
          sx={{
            color: "#8f9691",
            fontSize: 11,
            fontWeight: 750,
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Typography
        sx={{
          color,
          fontSize: {
            xs: 25,
            md: 29,
          },
          fontWeight: 950,
          lineHeight: 1,
          letterSpacing: "-0.5px",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

export default function AdminDashboard() {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const navigate = useNavigate();

  const [activePage, setActivePage] =
    useState("dashboard");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [menuItems, setMenuItems] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

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
        err?.response?.status === 401
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
     TODAY
  ======================================================= */

  const todayOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      if (!order.createdAt) {
        return false;
      }

      const date = new Date(
        order.createdAt
      );

      return (
        date.getDate() ===
          now.getDate() &&
        date.getMonth() ===
          now.getMonth() &&
        date.getFullYear() ===
          now.getFullYear()
      );
    });
  }, [orders]);


  /* =======================================================
     TODAY STATS
  ======================================================= */

  const todayStats = useMemo(() => {
    const pending =
      todayOrders.filter(
        (order) =>
          String(
            order.status || ""
          ).toLowerCase() ===
          "pending"
      ).length;

    const cooking =
      todayOrders.filter((order) =>
        [
          "cooking",
          "preparing",
        ].includes(
          String(
            order.status || ""
          ).toLowerCase()
        )
      ).length;

    const delivered =
      todayOrders.filter((order) =>
        [
          "delivered",
          "completed",
          "ready",
        ].includes(
          String(
            order.status || ""
          ).toLowerCase()
        )
      ).length;

    const cancelled =
      todayOrders.filter(
        (order) =>
          String(
            order.status || ""
          ).toLowerCase() ===
          "cancelled"
      ).length;

    const revenue =
      todayOrders
        .filter(
          (order) =>
            String(
              order.status || ""
            ).toLowerCase() !==
            "cancelled"
        )
        .reduce(
          (sum, order) =>
            sum +
            Number(
              order.totalAmount || 0
            ),
          0
        );

    return {
      pending,
      cooking,
      delivered,
      cancelled,
      revenue,
    };
  }, [todayOrders]);


  /* =======================================================
     TOP DISHES
  ======================================================= */

  const topDishes = useMemo(() => {
    const dishMap = {};

    todayOrders.forEach(
      (order) => {
        (order.items || []).forEach(
          (item) => {
            const name =
              item.name ||
              "Unknown Dish";

            const qty = Number(
              item.qty || 0
            );

            if (!dishMap[name]) {
              dishMap[name] = 0;
            }

            dishMap[name] += qty;
          }
        );
      }
    );

    return Object.entries(
      dishMap
    )
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .slice(0, 4);
  }, [todayOrders]);


  /* =======================================================
     NAVIGATION
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
      icon: <RestaurantMenuRounded />,
    },
    {
      key: "orders",
      label: "Orders",
      icon: <ReceiptLongRounded />,
      badge:
        todayStats.pending > 0
          ? todayStats.pending
          : null,
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


  /* =========================================================
     SIDEBAR
  ========================================================= */

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg,#101211 0%,#0d0f0e 100%)",
        color: "#ffffff",
      }}
    >

      {/* BRAND */}

      <Box
        sx={{
          px: 2.2,
          py: 2.4,
        }}
      >
        <Stack
          direction="row"
          spacing={1.2}
          alignItems="center"
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(135deg,#0d6419,#0b4312)",
              color: "#22c55e",
              boxShadow:
                "0 8px 24px rgba(34,197,94,.12)",
            }}
          >
            <RestaurantMenuRounded />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 950,
                lineHeight: 1.1,
              }}
            >
              Famous Cook
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                color: "#676d69",
                fontSize: 9.5,
                fontWeight: 800,
                letterSpacing: ".08em",
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
            "rgba(255,255,255,.06)",
        }}
      />


      {/* MENU */}

      <Box
        sx={{
          px: 1.1,
          py: 2,
          flexGrow: 1,
        }}
      >
        <Typography
          sx={{
            px: 1.5,
            mb: 1,
            color: "#535955",
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: ".1em",
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
              badge={
                item.badge
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
          px: 1.1,
          pb: 2,
        }}
      >
        <Divider
          sx={{
            mb: 1.2,
            borderColor:
              "rgba(255,255,255,.06)",
          }}
        />

        <SidebarItem
          icon={<LogoutRounded />}
          label="Logout"
          onClick={
            handleLogout
          }
        />
      </Box>

    </Box>
  );


  /* =========================================================
     DASHBOARD VIEW
  ========================================================= */

  const dashboardView = (
    <Box
      sx={{
        background:
          "linear-gradient(135deg,#111312 0%,#151817 45%,#101211 100%)",
        border:
          "1px solid #252a27",
        borderRadius: "20px",
        color: "#f8fafc",
        p: {
          xs: 2,
          sm: 2.5,
          md: 3.5,
        },
      }}
    >

      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 4,
        }}
      >

        <Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 0.8 }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background:
                  "#22c55e",
                boxShadow:
                  "0 0 12px rgba(34,197,94,.8)",
              }}
            />

            <Typography
              sx={{
                color: "#22c55e",
                fontSize: 10,
                fontWeight: 850,
              }}
            >
              LIVE
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontSize: {
                xs: 28,
                md: 34,
              },
              fontWeight: 950,
              letterSpacing:
                "-1px",
              lineHeight: 1,
            }}
          >
            Dashboard
          </Typography>

          <Typography
            sx={{
              mt: 0.8,
              color: "#858c87",
              fontSize: 13,
            }}
          >
            Here's what's happening
            at Famous Cook today.
          </Typography>
        </Box>


        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >

          <IconButton
            sx={{
              width: 40,
              height: 40,
              color: "#8d938f",
              border:
                "1px solid #292e2b",
              background: "#171a18",
            }}
          >
            <NotificationsNoneRounded
              fontSize="small"
            />
          </IconButton>


          <Button
            variant="outlined"
            startIcon={
              <RefreshRounded />
            }
            onClick={fetchData}
            sx={{
              borderRadius: "10px",
              textTransform:
                "none",
              fontWeight: 800,
              color: "#c7cbc8",
              borderColor:
                "#333936",
              background:
                "#171a18",

              "&:hover": {
                borderColor:
                  "#22c55e",
                color: "#22c55e",
                background:
                  "#142017",
              },
            }}
          >
            Refresh
          </Button>

        </Stack>
      </Box>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2,1fr)",
            md: "repeat(4,1fr)",
          },
          gap: {
            xs: 2.5,
            md: 4,
          },
          px: {
            xs: 0.5,
            md: 1,
          },
          mb: 4,
        }}
      >

        <SummaryItem
          label="Today's orders"
          value={
            todayOrders.length
          }
          icon={
            <ShoppingBagRounded
              sx={{
                fontSize: 14,
                color:
                  "#6f7772",
              }}
            />
          }
        />

        <SummaryItem
          label="Pending"
          value={
            todayStats.pending
          }
          color="#fbbf24"
          icon={
            <AccessTimeRounded
              sx={{
                fontSize: 14,
                color:
                  "#6f7772",
              }}
            />
          }
        />

        <SummaryItem
          label="Cooking now"
          value={
            todayStats.cooking
          }
          icon={
            <LocalFireDepartmentRounded
              sx={{
                fontSize: 14,
                color:
                  "#6f7772",
              }}
            />
          }
        />

        <SummaryItem
          label="Today's revenue"
          value={`₹${todayStats.revenue.toLocaleString(
            "en-IN"
          )}`}
          color="#22c55e"
          icon={
            <TrendingUpRounded
              sx={{
                fontSize: 14,
                color:
                  "#6f7772",
              }}
            />
          }
        />

      </Box>


      {/* =================================================
          MAIN GRID
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.55fr 1fr",
          },
          gap: 2,
        }}
      >

        {/* TODAY'S ORDERS */}

        <Paper
          elevation={0}
          sx={{
            background:
              "#171918",
            border:
              "1px solid #2a2e2b",
            borderRadius: "16px",
            overflow: "hidden",
            color: "#ffffff",
          }}
        >

          <Box
            sx={{
              px: 2.5,
              py: 2,
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              borderBottom:
                "1px solid #292d2a",
            }}
          >

            <Box>
              <Typography
                fontSize={16}
                fontWeight={900}
              >
                Today's Orders
              </Typography>

              <Typography
                fontSize={10.5}
                color="#727a75"
                sx={{ mt: 0.3 }}
              >
                Latest customer
                orders.
              </Typography>
            </Box>


            <Button
              size="small"
              endIcon={
                <ArrowForwardRounded />
              }
              onClick={() =>
                handleNavigation(
                  "orders"
                )
              }
              sx={{
                color: "#60a5fa",
                textTransform:
                  "none",
                fontSize: 11,
                fontWeight: 800,
                minWidth: 0,
              }}
            >
              View all
            </Button>

          </Box>


          {todayOrders
            .slice(0, 6)
            .map((order) => {

              const itemCount =
                (
                  order.items ||
                  []
                ).reduce(
                  (
                    sum,
                    item
                  ) =>
                    sum +
                    Number(
                      item.qty ||
                        0
                    ),
                  0
                );

              return (
                <Box
                  key={
                    order.id
                  }
                  onClick={() =>
                    handleNavigation(
                      "orders"
                    )
                  }
                  sx={{
                    px: 2.5,
                    py: 1.7,
                    borderBottom:
                      "1px solid #242825",
                    cursor:
                      "pointer",
                    transition:
                      "background .2s ease",

                    "&:hover": {
                      background:
                        "#1d211f",
                    },
                  }}
                >

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >

                    <Box
                      sx={{
                        minWidth: 0,
                      }}
                    >

                      <Typography
                        fontWeight={850}
                        fontSize={13}
                        color="#f3f4f6"
                      >
                        #
                        {String(
                          order.id
                        ).padStart(
                          6,
                          "0"
                        )}{" "}
                        •{" "}
                        {
                          order.customerName
                        }
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.35,
                          color:
                            "#737a75",
                          fontSize: 11,
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap",
                          maxWidth: {
                            xs: 180,
                            sm: 350,
                          },
                        }}
                      >
                        {itemCount}{" "}
                        {itemCount ===
                        1
                          ? "item"
                          : "items"}{" "}
                        • ₹
                        {Number(
                          order.totalAmount ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </Typography>

                    </Box>


                    <StatusChip
                      status={
                        order.status
                      }
                    />

                  </Stack>

                </Box>
              );
            })}


          {todayOrders.length ===
            0 && (
            <Box
              sx={{
                py: 6,
                textAlign:
                  "center",
              }}
            >

              <ShoppingBagRounded
                sx={{
                  fontSize: 42,
                  color:
                    "#3d433f",
                }}
              />

              <Typography
                sx={{
                  mt: 1,
                  fontWeight: 800,
                  color:
                    "#9ca3af",
                }}
              >
                No orders today
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: 11,
                  color:
                    "#5e655f",
                }}
              >
                New orders will
                appear here.
              </Typography>

            </Box>
          )}

        </Paper>


        {/* ORDER STATUS */}

        <Paper
          elevation={0}
          sx={{
            background:
              "#171918",
            border:
              "1px solid #2a2e2b",
            borderRadius: "16px",
            p: 2.5,
            color: "#ffffff",
          }}
        >

          <Typography
            fontSize={16}
            fontWeight={900}
          >
            Today's Order Status
          </Typography>

          <Typography
            fontSize={10.5}
            color="#727a75"
            sx={{
              mt: 0.3,
              mb: 3,
            }}
          >
            Current order
            distribution.
          </Typography>


          {[
            {
              label: "Pending",
              value:
                todayStats.pending,
              color:
                "#f59e0b",
            },
            {
              label: "Cooking",
              value:
                todayStats.cooking,
              color:
                "#f97316",
            },
            {
              label: "Delivered",
              value:
                todayStats.delivered,
              color:
                "#22c55e",
            },
            {
              label: "Cancelled",
              value:
                todayStats.cancelled,
              color:
                "#ef4444",
            },
          ].map(
            (item) => {

              const percentage =
                todayOrders.length >
                0
                  ? Math.round(
                      (item.value /
                        todayOrders.length) *
                        100
                    )
                  : 0;

              return (
                <Box
                  key={
                    item.label
                  }
                  sx={{
                    mb: 2.1,
                  }}
                >

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      mb: 0.7,
                    }}
                  >

                    <Typography
                      fontSize={11.5}
                      fontWeight={750}
                      color="#c7cbc8"
                    >
                      {item.label}
                    </Typography>

                    <Typography
                      fontSize={11.5}
                      fontWeight={900}
                      color="#f3f4f6"
                    >
                      {item.value}
                    </Typography>

                  </Stack>


                  <Box
                    sx={{
                      height: 6,
                      borderRadius:
                        "20px",
                      background:
                        "#292d2a",
                      overflow:
                        "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height:
                          "100%",
                        width: `${percentage}%`,
                        background:
                          item.color,
                        borderRadius:
                          "20px",
                        transition:
                          "width .3s ease",
                      }}
                    />
                  </Box>

                </Box>
              );
            }
          )}


          <Divider
            sx={{
              my: 2.5,
              borderColor:
                "#292d2a",
            }}
          />


          <Box
            sx={{
              p: 1.8,
              borderRadius:
                "12px",
              background:
                "rgba(34,197,94,.07)",
              border:
                "1px solid rgba(34,197,94,.14)",
            }}
          >

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >

              <Box>
                <Typography
                  fontSize={10}
                  color="#6f7772"
                >
                  Net revenue today
                </Typography>

                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: 18,
                    fontWeight: 950,
                    color:
                      "#22c55e",
                  }}
                >
                  ₹
                  {todayStats.revenue.toLocaleString(
                    "en-IN"
                  )}
                </Typography>
              </Box>

              <TrendingUpRounded
                sx={{
                  color:
                    "#22c55e",
                  fontSize: 25,
                }}
              />

            </Stack>

            <Typography
              sx={{
                mt: 1,
                fontSize: 10,
                color:
                  "#657069",
              }}
            >
              Cancelled orders
              are excluded.
            </Typography>

          </Box>

        </Paper>

      </Box>


      {/* =================================================
          SECOND ROW
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
          mt: 2,
        }}
      >

        {/* TOP DISHES */}

        <Paper
          elevation={0}
          sx={{
            background:
              "#171918",
            border:
              "1px solid #2a2e2b",
            borderRadius: "16px",
            p: 2.5,
          }}
        >

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >

            <Box>
              <Typography
                fontSize={16}
                fontWeight={900}
              >
                Popular Dishes
              </Typography>

              <Typography
                fontSize={10.5}
                color="#727a75"
                sx={{ mt: 0.3 }}
              >
                Based on today's orders.
              </Typography>
            </Box>

            <RestaurantMenuRounded
              sx={{
                color:
                  "#3f4842",
              }}
            />

          </Stack>


          {topDishes.length >
          0 ? (
            topDishes.map(
              (
                dish,
                index
              ) => (
                <Box
                  key={
                    dish[0]
                  }
                  sx={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                    py: 1.15,
                    borderBottom:
                      index <
                      topDishes.length -
                        1
                        ? "1px solid #252a27"
                        : "none",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={1.2}
                    alignItems="center"
                  >

                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius:
                          "9px",
                        display:
                          "grid",
                        placeItems:
                          "center",
                        background:
                          "#202421",
                        color:
                          "#a8afa9",
                        fontSize: 11,
                        fontWeight:
                          900,
                      }}
                    >
                      {index + 1}
                    </Box>

                    <Typography
                      fontSize={12}
                      fontWeight={750}
                      color="#d5d8d6"
                    >
                      {dish[0]}
                    </Typography>

                  </Stack>


                  <Typography
                    fontSize={12}
                    fontWeight={900}
                    color="#22c55e"
                  >
                    {dish[1]} sold
                  </Typography>

                </Box>
              )
            )
          ) : (
            <Box
              sx={{
                py: 3,
                textAlign:
                  "center",
              }}
            >
              <Typography
                fontSize={12}
                color="#626963"
              >
                No dish data yet.
              </Typography>
            </Box>
          )}

        </Paper>


        {/* QUICK ACTIONS */}

        <Paper
          elevation={0}
          sx={{
            background:
              "#171918",
            border:
              "1px solid #2a2e2b",
            borderRadius: "16px",
            p: 2.5,
          }}
        >

          <Typography
            fontSize={16}
            fontWeight={900}
          >
            Quick Actions
          </Typography>

          <Typography
            fontSize={10.5}
            color="#727a75"
            sx={{
              mt: 0.3,
              mb: 2,
            }}
          >
            Manage your restaurant quickly.
          </Typography>


          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2,1fr)",
              gap: 1.2,
            }}
          >

            <Button
              startIcon={
                <AddRounded />
              }
              onClick={() =>
                handleNavigation(
                  "menu"
                )
              }
              sx={{
                justifyContent:
                  "flex-start",
                minHeight: 48,
                px: 1.5,
                borderRadius:
                  "10px",
                textTransform:
                  "none",
                color: "#c9cecb",
                background:
                  "#202421",
                border:
                  "1px solid #2d322e",
                fontSize: 11,
                fontWeight: 800,

                "&:hover": {
                  background:
                    "#263027",
                  color:
                    "#22c55e",
                },
              }}
            >
              Add Dish
            </Button>


            <Button
              startIcon={
                <ReceiptLongRounded />
              }
              onClick={() =>
                handleNavigation(
                  "orders"
                )
              }
              sx={{
                justifyContent:
                  "flex-start",
                minHeight: 48,
                px: 1.5,
                borderRadius:
                  "10px",
                textTransform:
                  "none",
                color: "#c9cecb",
                background:
                  "#202421",
                border:
                  "1px solid #2d322e",
                fontSize: 11,
                fontWeight: 800,

                "&:hover": {
                  background:
                    "#263027",
                  color:
                    "#22c55e",
                },
              }}
            >
              Manage Orders
            </Button>


            <Button
              startIcon={
                <RestaurantMenuRounded />
              }
              onClick={() =>
                handleNavigation(
                  "menu"
                )
              }
              sx={{
                justifyContent:
                  "flex-start",
                minHeight: 48,
                px: 1.5,
                borderRadius:
                  "10px",
                textTransform:
                  "none",
                color: "#c9cecb",
                background:
                  "#202421",
                border:
                  "1px solid #2d322e",
                fontSize: 11,
                fontWeight: 800,

                "&:hover": {
                  background:
                    "#263027",
                  color:
                    "#22c55e",
                },
              }}
            >
              Manage Menu
            </Button>


            <Button
              startIcon={
                <AnalyticsRounded />
              }
              onClick={() =>
                handleNavigation(
                  "analytics"
                )
              }
              sx={{
                justifyContent:
                  "flex-start",
                minHeight: 48,
                px: 1.5,
                borderRadius:
                  "10px",
                textTransform:
                  "none",
                color: "#c9cecb",
                background:
                  "#202421",
                border:
                  "1px solid #2d322e",
                fontSize: 11,
                fontWeight: 800,

                "&:hover": {
                  background:
                    "#263027",
                  color:
                    "#22c55e",
                },
              }}
            >
              Analytics
            </Button>

          </Box>

        </Paper>

      </Box>


      {/* FOOTER NOTE */}

      <Box
        sx={{
          mt: 2,
          px: 1,
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >

        <Typography
          fontSize={9.5}
          color="#555d58"
        >
          Famous Cook Admin • Today
        </Typography>

        <Typography
          fontSize={9.5}
          color="#555d58"
        >
          Revenue excludes cancelled orders
        </Typography>

      </Box>

    </Box>
  );


  /* =========================================================
     PLACEHOLDER
  ========================================================= */

  const placeholderView = (
    <Paper
      elevation={0}
      sx={{
        minHeight: 450,
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        borderRadius: "20px",
        background: "#171918",
        border:
          "1px solid #2a2e2b",
        color: "#ffffff",
        p: 4,
      }}
    >
      <Box>
        <Box
          sx={{
            width: 65,
            height: 65,
            mx: "auto",
            borderRadius: "18px",
            display: "grid",
            placeItems: "center",
            background:
              "#202421",
            color: "#606862",
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
          }}
        >
          {
            navigation.find(
              (item) =>
                item.key ===
                activePage
            )?.label
          }
        </Typography>

        <Typography
          sx={{
            mt: 0.7,
            color: "#737a75",
            maxWidth: 420,
            mx: "auto",
            fontSize: 13,
          }}
        >
          This section will be
          added in the next stage
          of the Famous Cook admin
          system.
        </Typography>
      </Box>
    </Paper>
  );


  /* =========================================================
     ACTIVE CONTENT
  ========================================================= */

  const activeContent =
    activePage === "dashboard"
      ? dashboardView
      : activePage === "menu"
      ? (
          <AdminMenu
            menu={menuItems}
            onRefresh={fetchData}
            onError={setError}
          />
        )
      : activePage === "orders"
      ? (
          <AdminOrders
            orders={orders}
            onRefresh={fetchData}
            onError={setError}
          />
        )
      : placeholderView;


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "#0d0f0e",
      }}
    >

      {/* DESKTOP SIDEBAR */}

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width:
              drawerWidth,
            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width:
                drawerWidth,
              boxSizing:
                "border-box",
              border: "none",
              background:
                "#101211",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}


      {/* MOBILE SIDEBAR */}

      {isMobile && (
        <Drawer
          open={mobileOpen}
          onClose={() =>
            setMobileOpen(
              false
            )
          }
          sx={{
            "& .MuiDrawer-paper": {
              width:
                drawerWidth,
              border: "none",
              background:
                "#101211",
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
          minHeight:
            "100vh",
          background:
            activePage ===
            "dashboard"
              ? "#0d0f0e"
              : "#f8fafc",
        }}
      >

        {/* TOP BAR */}

        <Box
          sx={{
            height: 68,
            px: {
              xs: 1.5,
              md: 3,
            },
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            borderBottom:
              "1px solid",
            borderColor:
              activePage ===
              "dashboard"
                ? "#252a27"
                : "#e2e8f0",
            background:
              activePage ===
              "dashboard"
                ? "#101211"
                : "#ffffff",
            position:
              "sticky",
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
                sx={{
                  color:
                    activePage ===
                    "dashboard"
                      ? "#d1d5db"
                      : "#334155",
                }}
              >
                <MenuRounded />
              </IconButton>
            )}


            <Box>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 800,
                  color:
                    activePage ===
                    "dashboard"
                      ? "#656c67"
                      : "#64748b",
                }}
              >
                Admin Panel
              </Typography>

              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 950,
                  color:
                    activePage ===
                    "dashboard"
                      ? "#f3f4f6"
                      : "#0f172a",
                }}
              >
                Famous Cook
              </Typography>
            </Box>

          </Stack>


          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
                textAlign:
                  "right",
              }}
            >

              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 850,
                  color:
                    activePage ===
                    "dashboard"
                      ? "#d1d5db"
                      : "#0f172a",
                }}
              >
                Restaurant Admin
              </Typography>

              <Typography
                sx={{
                  fontSize: 9.5,
                  color:
                    activePage ===
                    "dashboard"
                      ? "#626a65"
                      : "#94a3b8",
                }}
              >
                Manage your restaurant
              </Typography>

            </Box>


            <Avatar
              sx={{
                width: 38,
                height: 38,
                background:
                  "linear-gradient(135deg,#123c16,#166534)",
                color: "#4ade80",
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              A
            </Avatar>

          </Stack>

        </Box>


        {/* CONTENT */}

        <Container
          maxWidth="xl"
          sx={{
            py: {
              xs: 2,
              md: 3,
            },
            px: {
              xs: 1.2,
              sm: 2.5,
              md: 3,
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
            <Box
              sx={{
                minHeight: 500,
                display: "grid",
                placeItems:
                  "center",
              }}
            >

              <Stack
                alignItems="center"
                spacing={2}
              >

                <Box
                  sx={{
                    width: 45,
                    height: 45,
                    borderRadius:
                      "50%",
                    border:
                      activePage ===
                      "dashboard"
                        ? "4px solid #263029"
                        : "4px solid #ccfbf1",
                    borderTopColor:
                      "#22c55e",
                    animation:
                      "spin 1s linear infinite",

                    "@keyframes spin": {
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
                      activePage ===
                      "dashboard"
                        ? "#777e79"
                        : "#64748b",
                    fontSize: 12,
                  }}
                >
                  Loading admin dashboard...
                </Typography>

              </Stack>

            </Box>
          ) : (
            activeContent
          )}

        </Container>

      </Box>

    </Box>
  );
}