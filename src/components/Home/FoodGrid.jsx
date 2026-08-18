import Grid from "@mui/material/Grid";
import FoodCard from "../FoodCard";

import rice from "../../assets/images/rice.jpg";

const foodItems = [
  {
    id: 1,
    name: "Chicken Fried Rice",
    image: rice,
    priceHalf: 180,
    priceFull: 320,
  },
  {
    id: 2,
    name: "Paneer Butter Masala",
    image: rice,
    priceHalf: 160,
    priceFull: 300,
  },
  {
    id: 3,
    name: "Chicken Lollipop",
    image: rice,
    priceHalf: 220,
    priceFull: 380,
  },
];

export default function FoodGrid() {
  return (
    <Grid container spacing={3} sx={{ mt: 5 }}>
      {foodItems.map((item) => (
        <Grid item xs={12} md={4} key={item.id}>
          <FoodCard
            item={item}
            onAdd={() => {}}
          />
        </Grid>
      ))}
    </Grid>
  );
}