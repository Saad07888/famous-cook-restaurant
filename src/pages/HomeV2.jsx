import Header from "../components/Header";
import { useState, useEffect, useRef } from "react";
import { menuService, orderService } from "../services/api";
import FeaturedSection from "../components/Home/FeaturedSection";
import HeroV2 from "../components/Home/HeroV2";
import RestaurantStats from "../components/Home/RestaurantStats";

export default function HomeV2() {
    const [selectedCategory, setSelectedCategory] = useState("All");
const [search, setSearch] = useState("");
const [foodItems, setFoodItems] = useState([]);
const [cart, setCart] = useState([]);
const [drawerOpen, setDrawerOpen] = useState(false);
const [portionOpen, setPortionOpen] = useState(false);
const [checkoutOpen, setCheckoutOpen] = useState(false);
const [qrOpen, setQrOpen] = useState(false);
const [successOpen, setSuccessOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [customer, setCustomer] = useState({ name: "", phone: "" });
  return (
    <>
      <Header />
      <HeroV2 />
      <RestaurantStats />
       <FeaturedSection />
    </>
  );
}