import { useMemo, useRef, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import {
  AddRounded,
  CheckCircleRounded,
  CloseRounded,
  CloudUploadRounded,
  DeleteOutlineRounded,
  EditRounded,
  ImageRounded,
  RestaurantMenuRounded,
  SearchRounded,
  VisibilityRounded,
  WarningAmberRounded,
} from "@mui/icons-material";

import { menuService } from "../services/api";


// ============================================================
// CLOUDINARY
// ============================================================

const CLOUDINARY_CLOUD_NAME = "ugukgnur";
const CLOUDINARY_UPLOAD_PRESET = "famous_cook";

const CLOUDINARY_UPLOAD_URL =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


// ============================================================
// INITIAL FORM
// ============================================================

const initialForm = {
  name: "",
  category: "",
  priceHalf: "",
  priceFull: "",
  image: "",
  available: true,
};


// ============================================================
// PRICE HELPER
// ============================================================

const getPrice = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
};


// ============================================================
// IMAGE FALLBACK COMPONENT
// ============================================================

function DishImage({ src, alt, height = 205 }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <Box
        sx={{
          width: "100%",
          height,
          display: "grid",
          placeItems: "center",
          background:
            "linear-gradient(135deg,#f8fafc,#e2e8f0)",
        }}
      >
        <RestaurantMenuRounded
          sx={{
            fontSize: 55,
            color: "#cbd5e1",
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt || "Dish"}
      onError={() => setFailed(true)}
      sx={{
        width: "100%",
        height,
        objectFit: "cover",
        display: "block",
      }}
    />
  );
}


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AdminMenu({
  menu = [],
  onRefresh,
  onError,
}) {
  const fileInputRef = useRef(null);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState(null);

  const [form, setForm] =
    useState(initialForm);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [uploadError, setUploadError] =
    useState("");

  const [uploadSuccess, setUploadSuccess] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);


  // ==========================================================
  // CATEGORIES
  // ==========================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        menu
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ].sort((a, b) =>
      String(a).localeCompare(String(b))
    );

    return ["All", ...uniqueCategories];
  }, [menu]);


  // ==========================================================
  // FILTER MENU
  // ==========================================================

  const filteredMenu = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return menu.filter((item) => {
      const name =
        item.name?.toLowerCase() || "";

      const category =
        item.category?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        name.includes(query) ||
        category.includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    menu,
    search,
    categoryFilter,
  ]);


  // ==========================================================
  // STATS
  // ==========================================================

  const totalItems = menu.length;

  const availableItems =
    menu.filter(
      (item) =>
        item.available !== false
    ).length;

  const unavailableItems =
    menu.filter(
      (item) =>
        item.available === false
    ).length;


  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };


  // ==========================================================
  // AVAILABILITY
  // ==========================================================

  const handleAvailabilityChange = (
    event
  ) => {
    setForm((current) => ({
      ...current,
      available:
        event.target.checked,
    }));
  };


  // ==========================================================
  // OPEN ADD
  // ==========================================================

  const openAddItem = () => {
    setEditingItem(null);

    setForm({
      ...initialForm,
    });

    setUploadError("");
    setUploadSuccess(false);

    setDialogOpen(true);
  };


  // ==========================================================
  // OPEN EDIT
  // ==========================================================

  const openEditItem = (item) => {
    setEditingItem(item);

    setForm({
      name: item.name || "",

      category:
        item.category || "",

      priceHalf:
        item.priceHalf ??
        "",

      priceFull:
        item.priceFull ??
        "",

      image:
        item.image || "",

      available:
        item.available !== false,
    });

    setUploadError("");
    setUploadSuccess(false);

    setDialogOpen(true);
  };


  // ==========================================================
  // CLOSE DIALOG
  // ==========================================================

  const closeDialog = () => {
    if (
      saving ||
      uploadingImage
    ) {
      return;
    }

    setDialogOpen(false);

    setEditingItem(null);

    setForm({
      ...initialForm,
    });

    setUploadError("");
    setUploadSuccess(false);
  };


  // ==========================================================
  // CLOUDINARY IMAGE UPLOAD
  // ==========================================================

  const handleImageUpload = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // Reset input so same image can be
    // selected again later.
    event.target.value = "";

    setUploadError("");
    setUploadSuccess(false);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError(
        "Please select a valid image file."
      );
      return;
    }

    // 5 MB limit
    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setUploadError(
        "Image must be smaller than 5 MB."
      );
      return;
    }

    try {
      setUploadingImage(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
      );

      const response =
        await fetch(
          CLOUDINARY_UPLOAD_URL,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            "Cloudinary upload failed."
        );
      }

      if (!data.secure_url) {
        throw new Error(
          "Cloudinary did not return an image URL."
        );
      }

      // Save Cloudinary URL
      // into the form.
      setForm((current) => ({
        ...current,
        image: data.secure_url,
      }));

      setUploadSuccess(true);
    } catch (error) {
      console.error(
        "Cloudinary upload error:",
        error
      );

      setUploadError(
        error?.message ||
          "Unable to upload image."
      );
    } finally {
      setUploadingImage(false);
    }
  };


  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validateForm = () => {
    if (!form.name.trim()) {
      onError?.(
        "Please enter the dish name."
      );

      return false;
    }

    if (!form.category.trim()) {
      onError?.(
        "Please enter the category."
      );

      return false;
    }

    const fullPrice =
      getPrice(form.priceFull);

    if (
      fullPrice === null ||
      fullPrice <= 0
    ) {
      onError?.(
        "Please enter a valid full price."
      );

      return false;
    }

    const halfPrice =
      getPrice(form.priceHalf);

    if (
      halfPrice !== null &&
      halfPrice < 0
    ) {
      onError?.(
        "Half price cannot be negative."
      );

      return false;
    }

    if (!form.image.trim()) {
      onError?.(
        "Please upload a dish image."
      );

      return false;
    }

    return true;
  };


  // ==========================================================
  // SAVE DISH
  // ==========================================================

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name:
          form.name.trim(),

        category:
          form.category.trim(),

        priceHalf:
          form.priceHalf === ""
            ? null
            : Number(
                form.priceHalf
              ),

        priceFull:
          Number(
            form.priceFull
          ),

        image:
          form.image.trim(),

        available:
          form.available !== false,
      };

      if (editingItem) {
        await menuService.updateItem(
          editingItem.id,
          payload
        );
      } else {
        await menuService.createItem(
          payload
        );
      }

      await onRefresh?.();

      closeDialog();

    } catch (error) {
      console.error(
        "Menu save error:",
        error
      );

      const message =
        error?.response
          ?.data?.message ||
        error?.message ||
        "Unable to save menu item.";

      onError?.(message);

    } finally {
      setSaving(false);
    }
  };


  // ==========================================================
  // DELETE
  // ==========================================================

  const openDeleteConfirm = (
    id
  ) => {
    setDeleteId(id);
  };


  const closeDeleteConfirm = () => {
    if (deleting) {
      return;
    }

    setDeleteId(null);
  };


  const handleDeleteItem =
    async () => {
      if (!deleteId) {
        return;
      }

      try {
        setDeleting(true);

        await menuService.deleteItem(
          deleteId
        );

        await onRefresh?.();

        setDeleteId(null);

      } catch (error) {
        console.error(
          "Menu delete error:",
          error
        );

        onError?.(
          error?.response
            ?.data?.message ||
            "Unable to delete menu item."
        );

      } finally {
        setDeleting(false);
      }
    };


  // ==========================================================
  // PRICE DISPLAY
  // ==========================================================

  const renderPrice = (
    item
  ) => {
    const half =
      getPrice(
        item.priceHalf
      );

    const full =
      getPrice(
        item.priceFull
      );

    if (
      half !== null &&
      half > 0 &&
      full !== null
    ) {
      return (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 800,
                color: "#64748b",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.08em",
              }}
            >
              Half
            </Typography>

            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 900,
                color: "#0f766e",
              }}
            >
              ₹{half}
            </Typography>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
          />

          <Box>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 800,
                color: "#64748b",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.08em",
              }}
            >
              Full
            </Typography>

            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              ₹{full}
            </Typography>
          </Box>
        </Stack>
      );
    }

    if (full !== null) {
      return (
        <Box>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 800,
              color: "#64748b",
              textTransform:
                "uppercase",
            }}
          >
            Full
          </Typography>

          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            ₹{full}
          </Typography>
        </Box>
      );
    }

    return (
      <Typography
        color="text.secondary"
        fontSize={13}
      >
        Price not set
      </Typography>
    );
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Box
      sx={{
        width: "100%",
        pb: 6,
      }}
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <Box
        sx={{
          mb: 3,
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
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: 27,
                md: 32,
              },
              fontWeight: 950,
              color: "#0f172a",
              letterSpacing:
                "-0.03em",
            }}
          >
            Menu Management
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#64748b",
              fontSize: 14,
            }}
          >
            Manage dishes, prices,
            images and availability.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <AddRounded />
          }
          onClick={
            openAddItem
          }
          sx={{
            minHeight: 46,
            px: 2.5,
            borderRadius:
              "13px",
            textTransform:
              "none",
            fontWeight: 850,
            background:
              "linear-gradient(135deg,#0f766e,#0891b2)",
            boxShadow:
              "0 10px 24px rgba(15,118,110,.2)",
            "&:hover": {
              background:
                "linear-gradient(135deg,#115e59,#0e7490)",
            },
          }}
        >
          Add Dish
        </Button>
      </Box>


      {/* ======================================================
          STATS
      ====================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3,1fr)",
          },
          gap: 1.5,
          mb: 2,
        }}
      >

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius:
              "16px",
            border:
              "1px solid #e2e8f0",
            background:
              "linear-gradient(135deg,#ffffff,#f8fafc)",
          }}
        >
          <Typography
            sx={{
              color: "#64748b",
              fontSize: 11,
              fontWeight: 800,
              textTransform:
                "uppercase",
            }}
          >
            Total Dishes
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 26,
              fontWeight: 950,
            }}
          >
            {totalItems}
          </Typography>
        </Paper>


        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius:
              "16px",
            border:
              "1px solid #bbf7d0",
            background:
              "linear-gradient(135deg,#ffffff,#f0fdf4)",
          }}
        >
          <Typography
            sx={{
              color: "#15803d",
              fontSize: 11,
              fontWeight: 800,
              textTransform:
                "uppercase",
            }}
          >
            Available
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 26,
              fontWeight: 950,
              color: "#15803d",
            }}
          >
            {availableItems}
          </Typography>
        </Paper>


        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius:
              "16px",
            border:
              "1px solid #fecaca",
            background:
              "linear-gradient(135deg,#ffffff,#fff7f7)",
          }}
        >
          <Typography
            sx={{
              color: "#dc2626",
              fontSize: 11,
              fontWeight: 800,
              textTransform:
                "uppercase",
            }}
          >
            Unavailable
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 26,
              fontWeight: 950,
              color: "#dc2626",
            }}
          >
            {unavailableItems}
          </Typography>
        </Paper>

      </Box>


      {/* ======================================================
          SEARCH
      ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          mb: 2.5,
          borderRadius:
            "16px",
          border:
            "1px solid #e2e8f0",
          background:
            "#ffffff",
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
            placeholder="Search dishes or categories..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                >
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
                    "12px",
                },
            }}
          />

          <Select
            size="small"
            value={
              categoryFilter
            }
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
            sx={{
              minWidth: {
                xs: "100%",
                md: 200,
              },
              borderRadius:
                "12px",
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


      {/* ======================================================
          RESULT COUNT
      ====================================================== */}

      <Box
        sx={{
          mb: 1.5,
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 800,
            color: "#475569",
          }}
        >
          {filteredMenu.length}{" "}
          dish
          {filteredMenu.length !==
          1
            ? "es"
            : ""}{" "}
          found
        </Typography>

        {(search ||
          categoryFilter !==
            "All") && (
          <Button
            size="small"
            onClick={() => {
              setSearch("");
              setCategoryFilter(
                "All"
              );
            }}
            sx={{
              textTransform:
                "none",
              fontWeight: 800,
            }}
          >
            Clear filters
          </Button>
        )}
      </Box>


      {/* ======================================================
          MENU GRID
      ====================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            lg: "repeat(3,1fr)",
          },
          gap: 2,
        }}
      >

        {filteredMenu.map(
          (item) => {
            const available =
              item.available !==
              false;

            return (
              <Card
                key={item.id}
                elevation={0}
                sx={{
                  border:
                    "1px solid #e2e8f0",
                  borderRadius:
                    "18px",
                  overflow:
                    "hidden",
                  background:
                    "#ffffff",
                  transition:
                    "all .2s ease",
                  "&:hover": {
                    transform:
                      "translateY(-4px)",
                    boxShadow:
                      "0 18px 40px rgba(15,23,42,.1)",
                  },
                }}
              >

                {/* IMAGE */}

                <Box
                  sx={{
                    position:
                      "relative",
                  }}
                >

                  <DishImage
                    src={
                      item.image
                    }
                    alt={
                      item.name
                    }
                    height={205}
                  />

                  <Chip
                    label={
                      available
                        ? "Available"
                        : "Unavailable"
                    }
                    size="small"
                    sx={{
                      position:
                        "absolute",
                      top: 12,
                      left: 12,
                      fontWeight:
                        850,
                      color:
                        available
                          ? "#166534"
                          : "#991b1b",
                      background:
                        available
                          ? "#dcfce7"
                          : "#fee2e2",
                    }}
                  />

                  <Box
                    sx={{
                      position:
                        "absolute",
                      right: 12,
                      bottom: 12,
                      width: 36,
                      height: 36,
                      display:
                        "grid",
                      placeItems:
                        "center",
                      borderRadius:
                        "10px",
                      background:
                        "rgba(15,23,42,.7)",
                      backdropFilter:
                        "blur(8px)",
                    }}
                  >
                    <ImageRounded
                      sx={{
                        color:
                          "#ffffff",
                      }}
                    />
                  </Box>

                </Box>


                {/* CONTENT */}

                <CardContent
                  sx={{
                    p: 2,
                  }}
                >

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                  >

                    <Box
                      sx={{
                        minWidth: 0,
                      }}
                    >

                      <Typography
                        sx={{
                          fontSize: 17,
                          fontWeight:
                            900,
                          color:
                            "#0f172a",
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.3,
                          fontSize: 11,
                          fontWeight:
                            700,
                          color:
                            "#64748b",
                        }}
                      >
                        {item.category ||
                          "Uncategorized"}
                      </Typography>

                    </Box>

                    <VisibilityRounded
                      sx={{
                        fontSize: 18,
                        color:
                          available
                            ? "#16a34a"
                            : "#cbd5e1",
                      }}
                    />

                  </Stack>


                  {/* PRICE */}

                  <Box
                    sx={{
                      mt: 2,
                      p: 1.3,
                      borderRadius:
                        "12px",
                      background:
                        "#f8fafc",
                      border:
                        "1px solid #f1f5f9",
                    }}
                  >
                    {renderPrice(
                      item
                    )}
                  </Box>


                  {/* ACTIONS */}

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      mt: 2,
                    }}
                  >

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={
                        <EditRounded />
                      }
                      onClick={() =>
                        openEditItem(
                          item
                        )
                      }
                      sx={{
                        minHeight: 40,
                        borderRadius:
                          "10px",
                        textTransform:
                          "none",
                        fontWeight:
                          800,
                        borderColor:
                          "#cbd5e1",
                        color:
                          "#334155",
                      }}
                    >
                      Edit
                    </Button>

                    <IconButton
                      onClick={() =>
                        openDeleteConfirm(
                          item.id
                        )
                      }
                      sx={{
                        width: 40,
                        height: 40,
                        border:
                          "1px solid #fecaca",
                        borderRadius:
                          "10px",
                        color:
                          "#dc2626",
                        "&:hover": {
                          background:
                            "#fef2f2",
                        },
                      }}
                    >
                      <DeleteOutlineRounded />
                    </IconButton>

                  </Stack>

                </CardContent>

              </Card>
            );
          }
        )}


        {/* EMPTY */}

        {filteredMenu.length ===
          0 && (
          <Paper
            elevation={0}
            sx={{
              gridColumn:
                "1 / -1",
              py: 9,
              textAlign:
                "center",
              border:
                "1px solid #e2e8f0",
              borderRadius:
                "18px",
            }}
          >

            <RestaurantMenuRounded
              sx={{
                fontSize: 55,
                color:
                  "#cbd5e1",
              }}
            />

            <Typography
              sx={{
                mt: 1,
                fontWeight:
                  900,
              }}
            >
              No dishes found
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13,
                color:
                  "#94a3b8",
              }}
            >
              Try another search
              or category.
            </Typography>

          </Paper>
        )}

      </Box>


      {/* ======================================================
          ADD / EDIT DIALOG
      ====================================================== */}

      <Dialog
        open={dialogOpen}
        onClose={
          closeDialog
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius:
              "22px",
            overflow:
              "hidden",
          },
        }}
      >

        {/* HEADER */}

        <DialogTitle
          sx={{
            px: 3,
            py: 2.5,
            background:
              "linear-gradient(135deg,#0f766e,#0891b2)",
            color:
              "#ffffff",
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
                  fontSize: 22,
                  fontWeight:
                    950,
                }}
              >
                {editingItem
                  ? "Edit Dish"
                  : "Add New Dish"}
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: 12,
                  color:
                    "rgba(255,255,255,.75)",
                }}
              >
                Add dish details and
                upload its image.
              </Typography>

            </Box>

            <IconButton
              onClick={
                closeDialog
              }
              disabled={
                saving ||
                uploadingImage
              }
              sx={{
                color:
                  "#ffffff",
                background:
                  "rgba(255,255,255,.12)",
              }}
            >
              <CloseRounded />
            </IconButton>

          </Stack>

        </DialogTitle>


        {/* CONTENT */}

        <DialogContent
          sx={{
            p: 3,
          }}
        >

          <Stack
            spacing={2}
            sx={{
              pt: 1,
            }}
          >

            {/* DISH NAME */}

            <TextField
              label="Dish Name"
              name="name"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              fullWidth
              required
              placeholder="e.g. Chicken Afghani"
              disabled={
                saving ||
                uploadingImage
              }
            />


            {/* CATEGORY */}

            <TextField
              label="Category"
              name="category"
              value={
                form.category
              }
              onChange={
                handleChange
              }
              fullWidth
              required
              placeholder="e.g. Chicken Gravy"
              disabled={
                saving ||
                uploadingImage
              }
            />


            {/* PRICES */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >

              <TextField
                label="Half Price"
                name="priceHalf"
                type="number"
                value={
                  form.priceHalf
                }
                onChange={
                  handleChange
                }
                fullWidth
                disabled={
                  saving ||
                  uploadingImage
                }
                placeholder="Optional"
                inputProps={{
                  min: 0,
                }}
                helperText="Leave empty if unavailable"
              />

              <TextField
                label="Full Price"
                name="priceFull"
                type="number"
                value={
                  form.priceFull
                }
                onChange={
                  handleChange
                }
                fullWidth
                required
                disabled={
                  saving ||
                  uploadingImage
                }
                inputProps={{
                  min: 0,
                }}
              />

            </Stack>


            {/* IMAGE UPLOAD */}

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius:
                  "16px",
                border:
                  "1px solid #dbe4ea",
                background:
                  "#f8fafc",
              }}
            >

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  mb: 1.5,
                }}
              >

                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display:
                      "grid",
                    placeItems:
                      "center",
                    borderRadius:
                      "12px",
                    background:
                      "#ccfbf1",
                    color:
                      "#0f766e",
                  }}
                >
                  <CloudUploadRounded />
                </Box>

                <Box>

                  <Typography
                    sx={{
                      fontWeight:
                        900,
                      fontSize: 14,
                    }}
                  >
                    Dish Image
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color:
                        "#64748b",
                    }}
                  >
                    Upload JPG, PNG or
                    WEBP • Max 5 MB
                  </Typography>

                </Box>

              </Stack>


              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/*"
                hidden
                onChange={
                  handleImageUpload
                }
              />


              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  uploadingImage ? (
                    <CircularProgress
                      size={18}
                    />
                  ) : (
                    <CloudUploadRounded />
                  )
                }
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={
                  saving ||
                  uploadingImage
                }
                sx={{
                  minHeight: 46,
                  borderRadius:
                    "12px",
                  textTransform:
                    "none",
                  fontWeight:
                    850,
                  borderColor:
                    "#0f766e",
                  color:
                    "#0f766e",
                  background:
                    "#ffffff",
                  "&:hover": {
                    borderColor:
                      "#115e59",
                    background:
                      "#f0fdfa",
                  },
                }}
              >
                {uploadingImage
                  ? "Uploading image..."
                  : form.image
                  ? "Change Image"
                  : "Choose Image"}
              </Button>


              {/* SUCCESS */}

              {uploadSuccess &&
                form.image && (
                  <Alert
                    severity="success"
                    icon={
                      <CheckCircleRounded />
                    }
                    sx={{
                      mt: 1.5,
                      borderRadius:
                        "10px",
                    }}
                  >
                    Image uploaded
                    successfully.
                  </Alert>
                )}


              {/* ERROR */}

              {uploadError && (
                <Alert
                  severity="error"
                  icon={
                    <WarningAmberRounded />
                  }
                  sx={{
                    mt: 1.5,
                    borderRadius:
                      "10px",
                  }}
                >
                  {uploadError}
                </Alert>
              )}


              {/* PREVIEW */}

              {form.image && (
                <Box
                  sx={{
                    mt: 1.5,
                    position:
                      "relative",
                    height: 190,
                    borderRadius:
                      "14px",
                    overflow:
                      "hidden",
                    background:
                      "#e2e8f0",
                  }}
                >

                  <DishImage
                    src={
                      form.image
                    }
                    alt="Dish preview"
                    height={190}
                  />

                  <Chip
                    label="Image Preview"
                    size="small"
                    sx={{
                      position:
                        "absolute",
                      left: 10,
                      bottom: 10,
                      fontWeight:
                        800,
                      background:
                        "rgba(15,23,42,.78)",
                      color:
                        "#ffffff",
                    }}
                  />

                </Box>
              )}

            </Paper>


            {/* AVAILABILITY */}

            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius:
                  "13px",
                border:
                  "1px solid #e2e8f0",
                background:
                  "#f8fafc",
              }}
            >

              <FormControlLabel
                control={
                  <Switch
                    checked={
                      form.available
                    }
                    onChange={
                      handleAvailabilityChange
                    }
                    disabled={
                      saving ||
                      uploadingImage
                    }
                  />
                }
                label={
                  <Box>

                    <Typography
                      sx={{
                        fontWeight:
                          850,
                        fontSize: 13,
                      }}
                    >
                      Available for
                      customers
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color:
                          "#64748b",
                      }}
                    >
                      Turn off when
                      temporarily
                      unavailable.
                    </Typography>

                  </Box>
                }
              />

            </Paper>

          </Stack>

        </DialogContent>


        {/* ACTIONS */}

        <DialogActions
          sx={{
            p: 2.5,
            pt: 0.5,
            gap: 1,
          }}
        >

          <Button
            onClick={
              closeDialog
            }
            disabled={
              saving ||
              uploadingImage
            }
            sx={{
              minHeight: 42,
              px: 2,
              borderRadius:
                "10px",
              textTransform:
                "none",
              fontWeight:
                800,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleSubmit
            }
            disabled={
              saving ||
              uploadingImage
            }
            sx={{
              minHeight: 42,
              px: 2.5,
              borderRadius:
                "11px",
              textTransform:
                "none",
              fontWeight:
                850,
              background:
                "linear-gradient(135deg,#0f766e,#0891b2)",
              "&:hover": {
                background:
                  "linear-gradient(135deg,#115e59,#0e7490)",
              },
            }}
          >
            {saving
              ? "Saving..."
              : editingItem
              ? "Save Changes"
              : "Add Dish"}
          </Button>

        </DialogActions>

      </Dialog>


      {/* ======================================================
          DELETE CONFIRMATION
      ====================================================== */}

      <Dialog
        open={
          deleteId !== null
        }
        onClose={
          closeDeleteConfirm
        }
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius:
              "18px",
          },
        }}
      >

        <DialogTitle
          sx={{
            fontWeight:
              950,
          }}
        >
          Delete Dish?
        </DialogTitle>

        <DialogContent>

          <Typography
            color="text.secondary"
            fontSize={14}
          >
            This will permanently
            remove the dish from
            your restaurant menu.
          </Typography>

        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
          }}
        >

          <Button
            onClick={
              closeDeleteConfirm
            }
            disabled={
              deleting
            }
            sx={{
              textTransform:
                "none",
              fontWeight:
                800,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleDeleteItem
            }
            disabled={
              deleting
            }
            sx={{
              textTransform:
                "none",
              fontWeight:
                850,
              borderRadius:
                "10px",
              background:
                "#dc2626",
              "&:hover": {
                background:
                  "#b91c1c",
              },
            }}
          >
            {deleting
              ? "Deleting..."
              : "Delete"}
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}