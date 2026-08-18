import { Box, Chip, Stack } from "@mui/material";

const categoryIcons = {
  All: "🍽️",
  Gravy: "🍛",
  Rice: "🍚",
  Starters: "🍗",
  Veg: "🥬",
  "Non-Veg": "🍖",
  Drinks: "🥤",
  Dessert: "🍰",
  Bestseller: "🔥",
};

export default function CategoryBar({
  categories,
  selected,
  onChange,
}) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 64,
        zIndex: 20,
        bgcolor: "#fff",
        borderBottom: "1px solid #f1f1f1",
        py: 1.5,
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 2,
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        <Stack direction="row" spacing={1.5}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              clickable
              onClick={() => onChange(cat)}
              label={`${categoryIcons[cat] || "🍴"} ${cat}`}
              sx={{
                px: 1,
                py: 2.7,
                fontSize: "0.95rem",
                fontWeight: 600,
                borderRadius: "999px",
                transition: "all .3s ease",
                whiteSpace: "nowrap",
                border:
                  selected === cat
                    ? "none"
                    : "1px solid #e0e0e0",

                bgcolor:
                  selected === cat
                    ? undefined
                    : "#fff",

                color:
                  selected === cat
                    ? "#fff"
                    : "#444",

                background:
                  selected === cat
                    ? "linear-gradient(135deg,#ff6b35,#ff9800)"
                    : "#fff",

                boxShadow:
                  selected === cat
                    ? "0 8px 18px rgba(255,107,53,.35)"
                    : "0 2px 6px rgba(0,0,0,.05)",

                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,.15)",
                  background:
                    selected === cat
                      ? "linear-gradient(135deg,#ff6b35,#ff9800)"
                      : "#fafafa",
                },
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}