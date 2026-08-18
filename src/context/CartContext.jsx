import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("famous-cook-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [portionOpen, setPortionOpen] = useState(false);

  // Save cart
  useEffect(() => {
    localStorage.setItem(
      "famous-cook-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  // Existing logic - kept
  const handleAddClick = (item) => {
    setSelectedItem(item);
    setPortionOpen(true);
  };

  /*
   * IMPORTANT FIX
   *
   * itemOverride is optional.
   *
   * Existing code can still call:
   * addToCart("Half")
   *
   * Menu.jsx can now safely call:
   * addToCart("Half", portionItem)
   *
   * This prevents the previous dish from being used.
   */
  const addToCart = (type, itemOverride = null) => {
    const item = itemOverride || selectedItem;

    if (!item) {
      return;
    }

    const price =
      type === "Half"
        ? Number(item.priceHalf)
        : Number(item.priceFull);

    setCart((prev) => {
      /*
       * Use ID instead of name.
       *
       * This is important because the unique dish ID
       * identifies the actual menu item.
       */
      const index = prev.findIndex(
        (i) =>
          i.id === item.id &&
          i.type === type
      );

      // Existing item + same portion
      if (index !== -1) {
        return prev.map((i, idx) =>
          idx === index
            ? {
                ...i,
                qty: i.qty + 1,
              }
            : i
        );
      }

      // New item
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          type: type,
          price: price,
          qty: 1,
          image: item.image,
        },
      ];
    });

    setPortionOpen(false);
  };

  // Existing quantity logic
  const updateQty = (index, change) => {
    setCart((prev) =>
      prev
        .map((item, i) =>
          i === index
            ? {
                ...item,
                qty: item.qty + change,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // Total number of items
  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  // Total cart amount
  const totalAmount = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () =>
  useContext(CartContext);