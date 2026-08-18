import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { CartProvider } from "./context/CartContext";

import Menu from "./pages/Menu";
import OrderConfirmation from "./pages/OrderConfirmation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
    },

    success: {
      main: "#16a34a",
    },

    background: {
      default: "#f8fafc",
    },

    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
  },

  typography: {
    fontFamily:
      '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 700,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <CartProvider>
        <Router>
          <Routes>

            {/* HOME */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* MENU */}
            <Route
              path="/menu"
              element={<Menu />}
            />

            {/* CHECKOUT */}
            <Route
              path="/checkout"
              element={<Checkout />}
            />

            {/* ORDER CONFIRMATION */}
            <Route
              path="/order-confirmation"
              element={<OrderConfirmation />}
            />

            {/* LOGIN */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;