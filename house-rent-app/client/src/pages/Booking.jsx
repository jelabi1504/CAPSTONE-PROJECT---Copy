import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Booking() {
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const token = localStorage.getItem("token");

  const savedUser = localStorage.getItem("user");
  const user = savedUser
    ? JSON.parse(savedUser)
    : null;

  const [property, setProperty] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // GET PROPERTY
  // ==========================================

  useEffect(() => {
    if (!propertyId) {
      setError("ID property tidak ditemukan");
      setLoading(false);
      return;
    }

    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Property tidak ditemukan"
        );
      }

      if (!data.property) {
        throw new Error("Property tidak ditemukan");
      }

      setProperty(data.property);
    } catch (error) {
      console.error(
        "Fetch property error:",
        error
      );

      setError(
        error.message ||
          "Gagal mengambil data property"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORMAT PRICE
  // ==========================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "id-ID"
    );
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // CALCULATE TOTAL DAYS
  // ==========================================

  const calculateTotalDays = () => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime())
    ) {
      return 0;
    }

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const difference =
      end.getTime() - start.getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(
      difference / millisecondsPerDay
    );
  };

  const totalDays =
    calculateTotalDays();

  const totalPrice =
    property && totalDays > 0
      ? Number(property.price) *
        totalDays
      : 0;

  // ==========================================
  // SUBMIT BOOKING
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ------------------------------------------
    // CEK LOGIN
    // ------------------------------------------

    if (!token) {
      setError(
        "Anda harus login terlebih dahulu."
      );

      return;
    }

    // ------------------------------------------
    // CEK USER
    // ------------------------------------------

    if (!user) {
      setError(
        "Data user tidak ditemukan. Silakan login kembali."
      );

      return;
    }

    // ------------------------------------------
    // OWNER TIDAK BOLEH BOOK PROPERTY
    // ------------------------------------------

    if (user.role === "owner") {
      setError(
        "Owner tidak dapat melakukan booking property."
      );

      return;
    }

    // ------------------------------------------
    // CEK PROPERTY
    // ------------------------------------------

    if (!property) {
      setError(
        "Data property tidak ditemukan."
      );

      return;
    }

    // ------------------------------------------
    // CEK DATE
    // ------------------------------------------

    if (!startDate || !endDate) {
      setError(
        "Start date dan end date wajib diisi."
      );

      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime())
    ) {
      setError(
        "Format tanggal tidak valid."
      );

      return;
    }

    if (end <= start) {
      setError(
        "End date harus setelah start date."
      );

      return;
    }

    if (totalDays <= 0) {
      setError(
        "Durasi booking tidak valid."
      );

      return;
    }

    // ------------------------------------------
    // SUBMIT
    // ------------------------------------------

    try {
      setSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            property: property._id,
            startDate,
            endDate,
            notes: notes.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Booking gagal"
        );
      }

      setSuccess(
        "Booking berhasil dibuat. Menunggu persetujuan owner."
      );

      // Bersihkan form
      setStartDate("");
      setEndDate("");
      setNotes("");

      // Pindah ke My Bookings
      setTimeout(() => {
        navigate("/my-bookings");
      }, 1500);
    } catch (error) {
      console.error(
        "Create booking error:",
        error
      );

      setError(
        error.message ||
          "Terjadi kesalahan saat membuat booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // BACK
  // ==========================================

  const handleBack = () => {
    navigate("/home");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#000000",
          color: "#FFFFFF",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >
        <header
          style={{
            borderBottom:
              "1px solid rgba(0, 128, 0, 0.35)",
            padding: "20px 40px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                backgroundColor:
                  "#008000",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              ⌂
            </div>

            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                }}
              >
                HOUSE RENT
              </div>

              <div
                style={{
                  color: "#008000",
                  fontSize: "11px",
                }}
              >
                Booking
              </div>
            </div>
          </div>
        </header>

        <main
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "100px 30px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border:
                "3px solid rgba(0, 128, 0, 0.25)",
              borderTop:
                "3px solid #008000",
              borderRadius: "50%",
              margin:
                "0 auto 25px",
              animation:
                "bookingSpin 1s linear infinite",
            }}
          />

          <h2>
            Memuat Property...
          </h2>

          <p
            style={{
              opacity: 0.6,
            }}
          >
            Mohon tunggu sebentar.
          </p>
        </main>

        <style>
          {`
            @keyframes bookingSpin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }

  // ==========================================
  // ERROR PROPERTY
  // ==========================================

  if (error && !property) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#000000",
          color: "#FFFFFF",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >
        {/* NAVBAR */}

        <header
          style={{
            borderBottom:
              "1px solid rgba(0, 128, 0, 0.35)",
            backgroundColor:
              "#000000",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding:
                "20px 30px",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
            }}
          >
            <div
              onClick={() =>
                navigate("/home")
              }
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "12px",
                cursor:
                  "pointer",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius:
                    "10px",
                  backgroundColor:
                    "#008000",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  fontSize: "22px",
                  fontWeight:
                    "bold",
                }}
              >
                ⌂
              </div>

              <div>
                <div
                  style={{
                    fontSize:
                      "18px",
                    fontWeight:
                      "800",
                    letterSpacing:
                      "1px",
                  }}
                >
                  HOUSE RENT
                </div>

                <div
                  style={{
                    color:
                      "#008000",
                    fontSize:
                      "11px",
                  }}
                >
                  Booking
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/home")
              }
              style={{
                backgroundColor:
                  "#008000",
                color:
                  "#FFFFFF",
                border: "none",
                padding:
                  "11px 20px",
                borderRadius:
                  "7px",
                cursor:
                  "pointer",
                fontWeight:
                  "700",
              }}
            >
              Back to Home
            </button>
          </div>
        </header>

        <main
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            padding:
              "100px 30px",
          }}
        >
          <div
            style={{
              border:
                "1px solid rgba(0, 128, 0, 0.5)",
              borderRadius:
                "16px",
              padding:
                "50px 40px",
              textAlign:
                "center",
              backgroundColor:
                "rgba(0, 128, 0, 0.03)",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius:
                  "50%",
                border:
                  "2px solid #008000",
                color:
                  "#008000",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize:
                  "30px",
                margin:
                  "0 auto 25px",
              }}
            >
              !
            </div>

            <div
              style={{
                color:
                  "#008000",
                fontSize:
                  "11px",
                fontWeight:
                  "800",
                letterSpacing:
                  "2px",
                marginBottom:
                  "10px",
              }}
            >
              BOOKING FAILED
            </div>

            <h1
              style={{
                margin:
                  "0 0 15px",
                fontSize:
                  "30px",
              }}
            >
              Property Tidak
              Ditemukan
            </h1>

            <p
              style={{
                opacity: 0.6,
                lineHeight:
                  "1.7",
                marginBottom:
                  "30px",
              }}
            >
              {error}
            </p>

            <button
              onClick={() =>
                navigate("/home")
              }
              style={{
                backgroundColor:
                  "#008000",
                color:
                  "#FFFFFF",
                border: "none",
                padding:
                  "13px 25px",
                borderRadius:
                  "7px",
                cursor:
                  "pointer",
                fontWeight:
                  "700",
              }}
            >
              Kembali ke Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // MAIN BOOKING PAGE
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        color: "#FFFFFF",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      {/* ======================================
          NAVBAR
      ====================================== */}

      <header
        style={{
          width: "100%",
          borderBottom:
            "1px solid rgba(0, 128, 0, 0.35)",
          backgroundColor:
            "#000000",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding:
              "20px 30px",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            gap: "30px",
          }}
        >
          {/* LOGO */}

          <div
            onClick={() =>
              navigate("/home")
            }
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: "12px",
              cursor:
                "pointer",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius:
                  "10px",
                backgroundColor:
                  "#008000",
                color:
                  "#FFFFFF",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize:
                  "22px",
                fontWeight:
                  "bold",
              }}
            >
              ⌂
            </div>

            <div>
              <div
                style={{
                  fontSize:
                    "18px",
                  fontWeight:
                    "800",
                  letterSpacing:
                    "1px",
                }}
              >
                HOUSE RENT
              </div>

              <div
                style={{
                  color:
                    "#008000",
                  fontSize:
                    "11px",
                  fontWeight:
                    "700",
                  marginTop:
                    "3px",
                }}
              >
                Booking
              </div>
            </div>
          </div>

          {/* NAVIGATION */}

          <nav
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: "10px",
            }}
          >
            <button
              onClick={() =>
                navigate("/home")
              }
              style={{
                backgroundColor:
                  "#000000",
                color:
                  "#FFFFFF",
                border:
                  "1px solid rgba(0, 128, 0, 0.7)",
                padding:
                  "10px 18px",
                borderRadius:
                  "7px",
                cursor:
                  "pointer",
                fontWeight:
                  "600",
              }}
            >
              Home
            </button>

            <button
              onClick={() =>
                navigate(
                  "/my-bookings"
                )
              }
              style={{
                backgroundColor:
                  "#000000",
                color:
                  "#FFFFFF",
                border:
                  "1px solid rgba(0, 128, 0, 0.7)",
                padding:
                  "10px 18px",
                borderRadius:
                  "7px",
                cursor:
                  "pointer",
                fontWeight:
                  "600",
              }}
            >
              My Bookings
            </button>

            {user?.role ===
              "owner" && (
              <button
                onClick={() =>
                  navigate(
                    "/owner"
                  )
                }
                style={{
                  backgroundColor:
                    "#000000",
                  color:
                    "#FFFFFF",
                  border:
                    "1px solid rgba(0, 128, 0, 0.7)",
                  padding:
                    "10px 18px",
                  borderRadius:
                    "7px",
                  cursor:
                    "pointer",
                  fontWeight:
                    "600",
                }}
              >
                Owner Dashboard
              </button>
            )}
          </nav>

          {/* USER */}

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius:
                  "50%",
                border:
                  "1px solid #008000",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                color:
                  "#008000",
                fontWeight:
                  "800",
              }}
            >
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
              }}
            >
              <span
                style={{
                  fontSize:
                    "13px",
                  fontWeight:
                    "700",
                }}
              >
                {user?.name ||
                  "User"}
              </span>

              <span
                style={{
                  fontSize:
                    "10px",
                  color:
                    "#008000",
                  textTransform:
                    "capitalize",
                }}
              >
                {user?.role ||
                  "tenant"}
              </span>
            </div>

            <button
              onClick={
                handleLogout
              }
              style={{
                backgroundColor:
                  "#000000",
                color:
                  "#FFFFFF",
                border:
                  "1px solid rgba(0, 128, 0, 0.7)",
                padding:
                  "9px 15px",
                borderRadius:
                  "7px",
                cursor:
                  "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ======================================
          MAIN
      ====================================== */}

      <main
        style={{
          maxWidth:
            "1100px",
          margin:
            "0 auto",
          padding:
            "60px 30px 100px",
        }}
      >
        {/* BACK BUTTON */}

        <button
          onClick={
            handleBack
          }
          style={{
            background:
              "transparent",
            color:
              "#008000",
            border: "none",
            padding: 0,
            cursor:
              "pointer",
            fontSize:
              "13px",
            fontWeight:
              "700",
            marginBottom:
              "35px",
          }}
        >
          ← Back to Properties
        </button>

        {/* PAGE HEADER */}

        <div
          style={{
            marginBottom:
              "40px",
          }}
        >
          <div
            style={{
              color:
                "#008000",
              fontSize:
                "10px",
              fontWeight:
                "800",
              letterSpacing:
                "2px",
              marginBottom:
                "10px",
            }}
          >
            PROPERTY BOOKING
          </div>

          <h1
            style={{
              fontSize:
                "42px",
              margin: 0,
              fontWeight:
                "800",
            }}
          >
            Book Your
            <span
              style={{
                color:
                  "#008000",
              }}
            >
              {" "}
              Home
            </span>
          </h1>

          <p
            style={{
              marginTop:
                "12px",
              opacity:
                0.6,
              fontSize:
                "14px",
            }}
          >
            Isi detail booking
            untuk mengajukan
            permintaan sewa.
          </p>
        </div>

        {/* ==================================
            CONTENT
        ================================== */}

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "1.1fr 0.9fr",
            gap:
              "30px",
            alignItems:
              "start",
          }}
        >
          {/* ==================================
              PROPERTY CARD
          ================================== */}

          <section
            style={{
              border:
                "1px solid rgba(0, 128, 0, 0.4)",
              borderRadius:
                "16px",
              overflow:
                "hidden",
              backgroundColor:
                "rgba(0, 128, 0, 0.025)",
            }}
          >
            {/* PROPERTY IMAGE */}

            <div
              style={{
                height:
                  "330px",
                backgroundColor:
                  "rgba(0, 128, 0, 0.08)",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                overflow:
                  "hidden",
              }}
            >
              {property
                ?.images
                ?.length >
              0 ? (
                <img
                  src={
                    property
                      .images[0]
                  }
                  alt={
                    property.title
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "100%",
                    objectFit:
                      "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize:
                      "100px",
                    color:
                      "#008000",
                  }}
                >
                  ⌂
                </div>
              )}
            </div>

            {/* PROPERTY INFORMATION */}

            <div
              style={{
                padding:
                  "30px",
              }}
            >
              <div
                style={{
                  color:
                    "#008000",
                  fontSize:
                    "11px",
                  fontWeight:
                    "800",
                  letterSpacing:
                    "1px",
                  marginBottom:
                    "8px",
                }}
              >
                {property?.city ||
                  "Location"}
              </div>

              <h2
                style={{
                  fontSize:
                    "27px",
                  margin:
                    "0 0 12px",
                  lineHeight:
                    "1.2",
                }}
              >
                {
                  property?.title
                }
              </h2>

              <p
                style={{
                  margin:
                    "0 0 25px",
                  fontSize:
                    "13px",
                  opacity:
                    0.6,
                  lineHeight:
                    "1.7",
                }}
              >
                {
                  property?.address
                }
              </p>

              {/* PRICE */}

              <div
                style={{
                  borderTop:
                    "1px solid rgba(0, 128, 0, 0.2)",
                  borderBottom:
                    "1px solid rgba(0, 128, 0, 0.2)",
                  padding:
                    "20px 0",
                  marginBottom:
                    "25px",
                }}
              >
                <small
                  style={{
                    display:
                      "block",
                    opacity:
                      0.5,
                    fontSize:
                      "10px",
                    marginBottom:
                      "6px",
                  }}
                >
                  RENTAL PRICE / DAY
                </small>

                <strong
                  style={{
                    color:
                      "#008000",
                    fontSize:
                      "25px",
                  }}
                >
                  Rp{" "}
                  {formatPrice(
                    property?.price
                  )}
                </strong>
              </div>

              {/* FEATURES */}

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(3, 1fr)",
                  gap:
                    "10px",
                }}
              >
                <div
                  style={{
                    border:
                      "1px solid rgba(0, 128, 0, 0.25)",
                    borderRadius:
                      "9px",
                    padding:
                      "14px 10px",
                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      color:
                        "#008000",
                      fontSize:
                        "20px",
                      marginBottom:
                        "5px",
                    }}
                  >
                    🛏
                  </div>

                  <small
                    style={{
                      display:
                        "block",
                      opacity:
                        0.5,
                      fontSize:
                        "9px",
                    }}
                  >
                    BEDROOMS
                  </small>

                  <strong
                    style={{
                      fontSize:
                        "14px",
                    }}
                  >
                    {
                      property?.bedrooms
                    }
                  </strong>
                </div>

                <div
                  style={{
                    border:
                      "1px solid rgba(0, 128, 0, 0.25)",
                    borderRadius:
                      "9px",
                    padding:
                      "14px 10px",
                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      color:
                        "#008000",
                      fontSize:
                        "20px",
                      marginBottom:
                        "5px",
                    }}
                  >
                    🚿
                  </div>

                  <small
                    style={{
                      display:
                        "block",
                      opacity:
                        0.5,
                      fontSize:
                        "9px",
                    }}
                  >
                    BATHROOMS
                  </small>

                  <strong
                    style={{
                      fontSize:
                        "14px",
                    }}
                  >
                    {
                      property?.bathrooms
                    }
                  </strong>
                </div>

                <div
                  style={{
                    border:
                      "1px solid rgba(0, 128, 0, 0.25)",
                    borderRadius:
                      "9px",
                    padding:
                      "14px 10px",
                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      color:
                        "#008000",
                      fontSize:
                        "20px",
                      marginBottom:
                        "5px",
                    }}
                  >
                    ◈
                  </div>

                  <small
                    style={{
                      display:
                        "block",
                      opacity:
                        0.5,
                      fontSize:
                        "9px",
                    }}
                  >
                    AREA
                  </small>

                  <strong
                    style={{
                      fontSize:
                        "14px",
                    }}
                  >
                    {
                      property?.area
                    }{" "}
                    m²
                  </strong>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================
              BOOKING FORM
          ================================== */}

          <section
            style={{
              border:
                "1px solid rgba(0, 128, 0, 0.45)",
              borderRadius:
                "16px",
              padding:
                "30px",
              backgroundColor:
                "#000000",
            }}
          >
            <div
              style={{
                color:
                  "#008000",
                fontSize:
                  "10px",
                fontWeight:
                  "800",
                letterSpacing:
                  "2px",
                marginBottom:
                  "8px",
              }}
            >
              RESERVATION DETAILS
            </div>

            <h2
              style={{
                margin:
                  "0 0 8px",
                fontSize:
                  "24px",
              }}
            >
              Booking Form
            </h2>

            <p
              style={{
                margin:
                  "0 0 30px",
                opacity:
                  0.55,
                fontSize:
                  "12px",
                lineHeight:
                  "1.6",
              }}
            >
              Tentukan tanggal
              sewa dan tambahkan
              catatan jika
              diperlukan.
            </p>

            {/* ERROR */}

            {error && (
              <div
                style={{
                  border:
                    "1px solid #008000",
                  backgroundColor:
                    "rgba(0, 128, 0, 0.08)",
                  borderRadius:
                    "8px",
                  padding:
                    "14px",
                  marginBottom:
                    "20px",
                  color:
                    "#FFFFFF",
                  fontSize:
                    "12px",
                  lineHeight:
                    "1.5",
                }}
              >
                <strong
                  style={{
                    color:
                      "#008000",
                    display:
                      "block",
                    marginBottom:
                      "4px",
                  }}
                >
                  Booking gagal
                </strong>

                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div
                style={{
                  border:
                    "1px solid #008000",
                  backgroundColor:
                    "rgba(0, 128, 0, 0.1)",
                  borderRadius:
                    "8px",
                  padding:
                    "14px",
                  marginBottom:
                    "20px",
                  color:
                    "#FFFFFF",
                  fontSize:
                    "12px",
                }}
              >
                <strong
                  style={{
                    color:
                      "#008000",
                  }}
                >
                  ✓ {success}
                </strong>
              </div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
            >
              {/* START DATE */}

              <div
                style={{
                  marginBottom:
                    "20px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    fontSize:
                      "12px",
                    fontWeight:
                      "700",
                    marginBottom:
                      "8px",
                  }}
                >
                  Start Date
                </label>

                <input
                  type="date"
                  value={
                    startDate
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split(
                        "T"
                      )[0]
                  }
                  onChange={(
                    event
                  ) =>
                    setStartDate(
                      event
                        .target
                        .value
                    )
                  }
                  style={{
                    width:
                      "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "13px",
                    border:
                      "1px solid rgba(0, 128, 0, 0.55)",
                    borderRadius:
                      "7px",
                    backgroundColor:
                      "#000000",
                    color:
                      "#FFFFFF",
                    outline:
                      "none",
                    fontSize:
                      "13px",
                  }}
                  required
                />
              </div>

              {/* END DATE */}

              <div
                style={{
                  marginBottom:
                    "20px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    fontSize:
                      "12px",
                    fontWeight:
                      "700",
                    marginBottom:
                      "8px",
                  }}
                >
                  End Date
                </label>

                <input
                  type="date"
                  value={
                    endDate
                  }
                  min={
                    startDate ||
                    new Date()
                      .toISOString()
                      .split(
                        "T"
                      )[0]
                  }
                  onChange={(
                    event
                  ) =>
                    setEndDate(
                      event
                        .target
                        .value
                    )
                  }
                  style={{
                    width:
                      "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "13px",
                    border:
                      "1px solid rgba(0, 128, 0, 0.55)",
                    borderRadius:
                      "7px",
                    backgroundColor:
                      "#000000",
                    color:
                      "#FFFFFF",
                    outline:
                      "none",
                    fontSize:
                      "13px",
                  }}
                  required
                />
              </div>

              {/* NOTES */}

              <div
                style={{
                  marginBottom:
                    "25px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    fontSize:
                      "12px",
                    fontWeight:
                      "700",
                    marginBottom:
                      "8px",
                  }}
                >
                  Notes
                  <span
                    style={{
                      opacity:
                        0.4,
                      fontWeight:
                        "400",
                      marginLeft:
                        "5px",
                    }}
                  >
                    (optional)
                  </span>
                </label>

                <textarea
                  value={
                    notes
                  }
                  onChange={(
                    event
                  ) =>
                    setNotes(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Tambahkan catatan untuk owner..."
                  rows="4"
                  style={{
                    width:
                      "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "13px",
                    border:
                      "1px solid rgba(0, 128, 0, 0.55)",
                    borderRadius:
                      "7px",
                    backgroundColor:
                      "#000000",
                    color:
                      "#FFFFFF",
                    outline:
                      "none",
                    fontSize:
                      "13px",
                    resize:
                      "vertical",
                    fontFamily:
                      "Arial, Helvetica, sans-serif",
                  }}
                />
              </div>

              {/* =================================
                  BOOKING SUMMARY
              ================================= */}

              <div
                style={{
                  border:
                    "1px solid rgba(0, 128, 0, 0.3)",
                  borderRadius:
                    "10px",
                  padding:
                    "18px",
                  marginBottom:
                    "20px",
                  backgroundColor:
                    "rgba(0, 128, 0, 0.04)",
                }}
              >
                <div
                  style={{
                    color:
                      "#008000",
                    fontSize:
                      "10px",
                    fontWeight:
                      "800",
                    letterSpacing:
                      "1.5px",
                    marginBottom:
                      "15px",
                  }}
                >
                  BOOKING SUMMARY
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    marginBottom:
                      "10px",
                    fontSize:
                      "12px",
                  }}
                >
                  <span
                    style={{
                      opacity:
                        0.55,
                    }}
                  >
                    Price / day
                  </span>

                  <strong>
                    Rp{" "}
                    {formatPrice(
                      property?.price
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    marginBottom:
                      "10px",
                    fontSize:
                      "12px",
                  }}
                >
                  <span
                    style={{
                      opacity:
                        0.55,
                    }}
                  >
                    Start
                  </span>

                  <strong>
                    {formatDate(
                      startDate
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    marginBottom:
                      "15px",
                    fontSize:
                      "12px",
                  }}
                >
                  <span
                    style={{
                      opacity:
                        0.55,
                    }}
                  >
                    End
                  </span>

                  <strong>
                    {formatDate(
                      endDate
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    borderTop:
                      "1px solid rgba(0, 128, 0, 0.3)",
                    paddingTop:
                      "15px",
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                  }}
                >
                  <div>
                    <small
                      style={{
                        display:
                          "block",
                        opacity:
                          0.5,
                        fontSize:
                          "9px",
                        marginBottom:
                          "4px",
                      }}
                    >
                      TOTAL
                    </small>

                    <span
                      style={{
                        fontSize:
                          "11px",
                        opacity:
                          0.55,
                      }}
                    >
                      {totalDays}{" "}
                      {totalDays ===
                      1
                        ? "day"
                        : "days"}
                    </span>
                  </div>

                  <strong
                    style={{
                      color:
                        "#008000",
                      fontSize:
                        "23px",
                    }}
                  >
                    Rp{" "}
                    {formatPrice(
                      totalPrice
                    )}
                  </strong>
                </div>
              </div>

              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                disabled={
                  submitting ||
                  !property ||
                  user?.role ===
                    "owner"
                }
                style={{
                  width:
                    "100%",
                  padding:
                    "15px",
                  border:
                    "1px solid #008000",
                  borderRadius:
                    "8px",
                  backgroundColor:
                    submitting ||
                    user?.role ===
                      "owner"
                      ? "#000000"
                      : "#008000",
                  color:
                    "#FFFFFF",
                  cursor:
                    submitting ||
                    user?.role ===
                      "owner"
                      ? "not-allowed"
                      : "pointer",
                  fontWeight:
                    "800",
                  fontSize:
                    "14px",
                }}
              >
                {submitting
                  ? "Processing..."
                  : user?.role ===
                    "owner"
                  ? "Owner Tidak Dapat Booking"
                  : "Confirm Booking"}
              </button>

              <p
                style={{
                  margin:
                    "15px 0 0",
                  textAlign:
                    "center",
                  fontSize:
                    "10px",
                  opacity:
                    0.4,
                  lineHeight:
                    "1.5",
                }}
              >
                Booking Anda akan
                berstatus{" "}
                <strong>
                  pending
                </strong>{" "}
                sampai disetujui
                oleh owner.
              </p>
            </form>
          </section>
        </div>
      </main>

      {/* ======================================
          FOOTER
      ====================================== */}

      <footer
        style={{
          borderTop:
            "1px solid rgba(0, 128, 0, 0.25)",
          padding:
            "30px",
          textAlign:
            "center",
          color:
            "#FFFFFF",
          opacity:
            0.5,
          fontSize:
            "12px",
        }}
      >
        © 2026 House Rent. All
        rights reserved.
      </footer>
    </div>
  );
}

export default Booking;