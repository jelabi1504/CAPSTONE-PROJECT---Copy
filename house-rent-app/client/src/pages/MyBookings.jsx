import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =====================================================
  // LOAD BOOKINGS
  // =====================================================

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    fetchBookings();
  }, []);

  // =====================================================
  // GET MY BOOKINGS
  // =====================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/bookings/my-bookings",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengambil data booking"
        );
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Fetch bookings error:", error);

      setError(
        error.message ||
          "Terjadi kesalahan saat mengambil data booking"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "id-ID"
    );
  };

  // =====================================================
  // CALCULATE DAYS
  // =====================================================

  const calculateDays = (
    startDate,
    endDate
  ) => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference =
      end.getTime() - start.getTime();

    return Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "PENDING";

      case "approved":
        return "APPROVED";

      case "rejected":
        return "REJECTED";

      case "cancelled":
        return "CANCELLED";

      case "completed":
        return "COMPLETED";

      default:
        return "UNKNOWN";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#008000";

      case "pending":
        return "#FFFFFF";

      case "rejected":
        return "#FFFFFF";

      case "cancelled":
        return "#FFFFFF";

      case "completed":
        return "#008000";

      default:
        return "#FFFFFF";
    }
  };

  const getStatusBackground = (
    status
  ) => {
    switch (status) {
      case "approved":
        return "#FFFFFF";

      case "pending":
        return "#000000";

      case "rejected":
        return "#000000";

      case "cancelled":
        return "#000000";

      case "completed":
        return "#008000";

      default:
        return "#000000";
    }
  };

  const getStatusDescription = (
    status
  ) => {
    switch (status) {
      case "pending":
        return "Booking sedang menunggu persetujuan owner.";

      case "approved":
        return "Booking Anda telah disetujui oleh owner.";

      case "rejected":
        return "Booking Anda ditolak oleh owner.";

      case "cancelled":
        return "Booking ini telah dibatalkan.";

      case "completed":
        return "Masa sewa untuk booking ini telah selesai.";

      default:
        return "Status booking tidak diketahui.";
    }
  };

  // =====================================================
  // NAVBAR
  // =====================================================

  const Navbar = () => {
    return (
      <header
        style={{
          width: "100%",
          backgroundColor: "#000000",
          color: "#FFFFFF",
          borderBottom:
            "1px solid #008000",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            minHeight: "76px",
            padding:
              "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >

          {/* LOGO */}

          <div
            onClick={() =>
              navigate("/home")
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
            }}
          >

            <div
              style={{
                width: "42px",
                height: "42px",
                backgroundColor:
                  "#008000",
                color: "#FFFFFF",
                borderRadius: "10px",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize: "23px",
                fontWeight: "bold",
              }}
            >
              ⌂
            </div>

            <div>

              <div
                style={{
                  fontSize: "17px",
                  fontWeight: "800",
                  letterSpacing:
                    "1.5px",
                }}
              >
                HOUSE RENT
              </div>

              <div
                style={{
                  color:
                    "#FFFFFF",
                  opacity: 0.6,
                  fontSize: "11px",
                  marginTop: "2px",
                }}
              >
                Find Your Perfect Home
              </div>

            </div>

          </div>

          {/* NAVIGATION */}

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >

            <button
              onClick={() =>
                navigate("/home")
              }
              style={{
                background:
                  "transparent",
                border: "none",
                color:
                  "#FFFFFF",
                padding:
                  "10px 14px",
                borderRadius:
                  "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Properties
            </button>

            <button
              style={{
                backgroundColor:
                  "#008000",
                border:
                  "1px solid #008000",
                color:
                  "#FFFFFF",
                padding:
                  "10px 16px",
                borderRadius:
                  "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              My Bookings
            </button>

            {user?.role ===
              "owner" && (
              <button
                onClick={() =>
                  navigate("/owner")
                }
                style={{
                  background:
                    "transparent",
                  border: "none",
                  color:
                    "#FFFFFF",
                  padding:
                    "10px 14px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  fontSize:
                    "14px",
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
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "10px",
              }}
            >

              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius:
                    "50%",
                  backgroundColor:
                    "#008000",
                  color:
                    "#FFFFFF",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  fontWeight:
                    "800",
                }}
              >
                {user?.name
                  ?.charAt(0)
                  .toUpperCase() ||
                  "U"}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                }}
              >

                <strong
                  style={{
                    fontSize:
                      "13px",
                  }}
                >
                  {user?.name ||
                    "User"}
                </strong>

                <span
                  style={{
                    fontSize:
                      "11px",
                    color:
                      "#FFFFFF",
                    opacity:
                      0.6,
                    textTransform:
                      "capitalize",
                  }}
                >
                  {user?.role ||
                    "tenant"}
                </span>

              </div>

            </div>

            <button
              onClick={
                handleLogout
              }
              style={{
                background:
                  "transparent",
                border:
                  "1px solid #008000",
                color:
                  "#FFFFFF",
                padding:
                  "9px 15px",
                borderRadius:
                  "8px",
                cursor:
                  "pointer",
                fontWeight:
                  "700",
                fontSize:
                  "13px",
              }}
            >
              Logout
            </button>

          </div>

        </div>
      </header>
    );
  };

  // =====================================================
  // LOADING PAGE
  // =====================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight:
            "100vh",
          backgroundColor:
            "#000000",
          color:
            "#FFFFFF",
        }}
      >

        <Navbar />

        <main
          style={{
            minHeight:
              "calc(100vh - 76px)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            flexDirection:
              "column",
            padding: "40px",
          }}
        >

          <div
            style={{
              width: "46px",
              height: "46px",
              border:
                "4px solid #FFFFFF",
              borderTopColor:
                "#008000",
              borderRadius:
                "50%",
              animation:
                "spin 1s linear infinite",
              marginBottom:
                "20px",
            }}
          />

          <h2
            style={{
              margin:
                "0 0 8px",
              fontSize:
                "22px",
            }}
          >
            Loading Bookings
          </h2>

          <p
            style={{
              margin: 0,
              opacity: 0.65,
            }}
          >
            Sedang mengambil data
            booking Anda...
          </p>

        </main>

        <style>
          {`
            @keyframes spin {
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

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div
      style={{
        minHeight:
          "100vh",
        backgroundColor:
          "#000000",
        color:
          "#FFFFFF",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >

      <Navbar />

      <main
        style={{
          maxWidth:
            "1400px",
          margin:
            "0 auto",
          padding:
            "60px 32px 80px",
        }}
      >

        {/* =========================================
            PAGE HEADER
        ========================================= */}

        <section
          style={{
            marginBottom:
              "42px",
          }}
        >

          <div
            style={{
              display:
                "inline-block",
              color:
                "#008000",
              fontSize:
                "12px",
              fontWeight:
                "800",
              letterSpacing:
                "2px",
              marginBottom:
                "12px",
            }}
          >
            RENTAL HISTORY
          </div>

          <h1
            style={{
              fontSize:
                "clamp(36px, 5vw, 56px)",
              lineHeight:
                "1.05",
              margin:
                "0 0 16px",
              fontWeight:
                "900",
              letterSpacing:
                "-1.5px",
            }}
          >
            My{" "}
            <span
              style={{
                color:
                  "#008000",
              }}
            >
              Bookings
            </span>
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth:
                "650px",
              color:
                "#FFFFFF",
              opacity: 0.65,
              fontSize:
                "16px",
              lineHeight:
                "1.7",
            }}
          >
            Pantau seluruh permintaan
            booking rumah yang telah
            Anda lakukan.
          </p>

        </section>

        {/* =========================================
            SUMMARY
        ========================================= */}

        <section
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: "16px",
            marginBottom:
              "42px",
          }}
        >

          {[
            {
              label:
                "Total Booking",
              value:
                bookings.length,
              icon:
                "◷",
            },
            {
              label:
                "Pending",
              value:
                bookings.filter(
                  (b) =>
                    b.status ===
                    "pending"
                ).length,
              icon:
                "◌",
            },
            {
              label:
                "Approved",
              value:
                bookings.filter(
                  (b) =>
                    b.status ===
                    "approved"
                ).length,
              icon:
                "✓",
            },
            {
              label:
                "Rejected",
              value:
                bookings.filter(
                  (b) =>
                    b.status ===
                    "rejected"
                ).length,
              icon:
                "×",
            },
          ].map(
            (item) => (
              <div
                key={
                  item.label
                }
                style={{
                  backgroundColor:
                    "#FFFFFF",
                  color:
                    "#000000",
                  borderRadius:
                    "14px",
                  padding:
                    "22px",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "16px",
                  border:
                    "2px solid #008000",
                }}
              >

                <div
                  style={{
                    width:
                      "46px",
                    height:
                      "46px",
                    flexShrink:
                      0,
                    backgroundColor:
                      "#008000",
                    color:
                      "#FFFFFF",
                    borderRadius:
                      "10px",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontSize:
                      "20px",
                    fontWeight:
                      "900",
                  }}
                >
                  {
                    item.icon
                  }
                </div>

                <div>

                  <div
                    style={{
                      fontSize:
                        "28px",
                      fontWeight:
                        "900",
                      lineHeight:
                        "1",
                    }}
                  >
                    {
                      item.value
                    }
                  </div>

                  <div
                    style={{
                      fontSize:
                        "12px",
                      fontWeight:
                        "700",
                      marginTop:
                        "6px",
                      opacity:
                        0.6,
                    }}
                  >
                    {
                      item.label
                    }
                  </div>

                </div>

              </div>
            )
          )}

        </section>

        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <section
            style={{
              backgroundColor:
                "#FFFFFF",
              color:
                "#000000",
              border:
                "2px solid #008000",
              borderRadius:
                "14px",
              padding:
                "28px",
              marginBottom:
                "32px",
            }}
          >

            <div
              style={{
                display:
                  "flex",
                gap: "18px",
                alignItems:
                  "flex-start",
              }}
            >

              <div
                style={{
                  width:
                    "42px",
                  height:
                    "42px",
                  borderRadius:
                    "50%",
                  backgroundColor:
                    "#000000",
                  color:
                    "#FFFFFF",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  fontWeight:
                    "900",
                  flexShrink:
                    0,
                }}
              >
                !
              </div>

              <div>

                <h3
                  style={{
                    margin:
                      "0 0 8px",
                  }}
                >
                  Gagal mengambil
                  data booking
                </h3>

                <p
                  style={{
                    margin:
                      "0 0 16px",
                    opacity:
                      0.65,
                  }}
                >
                  {error}
                </p>

                <button
                  onClick={
                    fetchBookings
                  }
                  style={{
                    backgroundColor:
                      "#008000",
                    color:
                      "#FFFFFF",
                    border:
                      "none",
                    padding:
                      "11px 18px",
                    borderRadius:
                      "8px",
                    cursor:
                      "pointer",
                    fontWeight:
                      "700",
                  }}
                >
                  ↻ Coba Lagi
                </button>

              </div>

            </div>

          </section>
        )}

        {/* =========================================
            EMPTY
        ========================================= */}

        {!error &&
          bookings.length ===
            0 && (
            <section
              style={{
                backgroundColor:
                  "#FFFFFF",
                color:
                  "#000000",
                borderRadius:
                  "18px",
                padding:
                  "80px 30px",
                textAlign:
                  "center",
                border:
                  "2px solid #008000",
              }}
            >

              <div
                style={{
                  width:
                    "80px",
                  height:
                    "80px",
                  margin:
                    "0 auto 24px",
                  backgroundColor:
                    "#000000",
                  color:
                    "#008000",
                  borderRadius:
                    "50%",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  fontSize:
                    "34px",
                  border:
                    "2px solid #008000",
                }}
              >
                ◷
              </div>

              <div
                style={{
                  color:
                    "#008000",
                  fontSize:
                    "11px",
                  fontWeight:
                    "900",
                  letterSpacing:
                    "2px",
                  marginBottom:
                    "10px",
                }}
              >
                NO BOOKING YET
              </div>

              <h2
                style={{
                  margin:
                    "0 0 12px",
                  fontSize:
                    "30px",
                  fontWeight:
                    "900",
                }}
              >
                Belum Ada Booking
              </h2>

              <p
                style={{
                  maxWidth:
                    "500px",
                  margin:
                    "0 auto 28px",
                  opacity:
                    0.6,
                  lineHeight:
                    "1.7",
                }}
              >
                Anda belum melakukan
                booking rumah. Temukan
                property yang sesuai dan
                mulai booking sekarang.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/home"
                  )
                }
                style={{
                  backgroundColor:
                    "#008000",
                  color:
                    "#FFFFFF",
                  border:
                    "none",
                  padding:
                    "14px 24px",
                  borderRadius:
                    "9px",
                  fontSize:
                    "14px",
                  fontWeight:
                    "800",
                  cursor:
                    "pointer",
                }}
              >
                Explore Properties →
              </button>

            </section>
          )}

        {/* =========================================
            BOOKING LIST
        ========================================= */}

        {!error &&
          bookings.length >
            0 && (
            <section>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "flex-end",
                  gap: "20px",
                  marginBottom:
                    "22px",
                  flexWrap:
                    "wrap",
                }}
              >

                <div>

                  <div
                    style={{
                      color:
                        "#008000",
                      fontSize:
                        "11px",
                      fontWeight:
                        "900",
                      letterSpacing:
                        "2px",
                      marginBottom:
                        "7px",
                    }}
                  >
                    YOUR RENTALS
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      fontSize:
                        "30px",
                      fontWeight:
                        "900",
                    }}
                  >
                    Booking History
                  </h2>

                </div>

                <button
                  onClick={
                    fetchBookings
                  }
                  style={{
                    backgroundColor:
                      "#FFFFFF",
                    color:
                      "#000000",
                    border:
                      "2px solid #008000",
                    padding:
                      "10px 16px",
                    borderRadius:
                      "8px",
                    cursor:
                      "pointer",
                    fontWeight:
                      "700",
                  }}
                >
                  ↻ Refresh
                </button>

              </div>

              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap: "20px",
                }}
              >

                {bookings.map(
                  (booking) => {

                    const days =
                      calculateDays(
                        booking.startDate,
                        booking.endDate
                      );

                    return (
                      <article
                        key={
                          booking._id
                        }
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "280px 1fr",
                          backgroundColor:
                            "#FFFFFF",
                          color:
                            "#000000",
                          borderRadius:
                            "16px",
                          overflow:
                            "hidden",
                          border:
                            "2px solid #008000",
                          minHeight:
                            "280px",
                        }}
                      >

                        {/* IMAGE */}

                        <div
                          style={{
                            position:
                              "relative",
                            backgroundColor:
                              "#000000",
                            minHeight:
                              "280px",
                          }}
                        >

                          {booking
                            .property
                            ?.images
                            ?.length >
                          0 ? (
                            <img
                              src={
                                booking
                                  .property
                                  .images[0]
                              }
                              alt={
                                booking
                                  .property
                                  .title ||
                                "Property"
                              }
                              style={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                objectFit:
                                  "cover",
                                display:
                                  "block",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                minHeight:
                                  "280px",
                                display:
                                  "flex",
                                flexDirection:
                                  "column",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                color:
                                  "#008000",
                              }}
                            >

                              <span
                                style={{
                                  fontSize:
                                    "52px",
                                }}
                              >
                                ⌂
                              </span>

                              <span
                                style={{
                                  marginTop:
                                    "8px",
                                  fontSize:
                                    "11px",
                                  fontWeight:
                                    "800",
                                  letterSpacing:
                                    "2px",
                                }}
                              >
                                HOUSE RENT
                              </span>

                            </div>
                          )}

                          <div
                            style={{
                              position:
                                "absolute",
                              top: "16px",
                              left: "16px",
                              backgroundColor:
                                getStatusBackground(
                                  booking.status
                                ),
                              color:
                                getStatusColor(
                                  booking.status
                                ),
                              border:
                                "1px solid #FFFFFF",
                              padding:
                                "7px 11px",
                              borderRadius:
                                "6px",
                              fontSize:
                                "10px",
                              fontWeight:
                                "900",
                              letterSpacing:
                                "0.8px",
                            }}
                          >
                            {
                              getStatusText(
                                booking.status
                              )
                            }
                          </div>

                        </div>

                        {/* CONTENT */}

                        <div
                          style={{
                            padding:
                              "28px",
                            display:
                              "flex",
                            flexDirection:
                              "column",
                          }}
                        >

                          {/* TOP */}

                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              gap:
                                "20px",
                              alignItems:
                                "flex-start",
                            }}
                          >

                            <div>

                              <div
                                style={{
                                  color:
                                    "#008000",
                                  fontSize:
                                    "11px",
                                  fontWeight:
                                    "900",
                                  letterSpacing:
                                    "1.5px",
                                  textTransform:
                                    "uppercase",
                                  marginBottom:
                                    "6px",
                                }}
                              >
                                {booking
                                  .property
                                  ?.city ||
                                  "Location"}
                              </div>

                              <h2
                                style={{
                                  margin:
                                    "0 0 8px",
                                  fontSize:
                                    "24px",
                                  fontWeight:
                                    "900",
                                  lineHeight:
                                    "1.2",
                                }}
                              >
                                {booking
                                  .property
                                  ?.title ||
                                  "Property"}
                              </h2>

                              <p
                                style={{
                                  margin:
                                    0,
                                  fontSize:
                                    "13px",
                                  opacity:
                                    0.6,
                                  lineHeight:
                                    "1.5",
                                }}
                              >
                                📍{" "}
                                {booking
                                  .property
                                  ?.address ||
                                  "Address unavailable"}
                              </p>

                            </div>

                            <div
                              style={{
                                backgroundColor:
                                  "#000000",
                                color:
                                  "#FFFFFF",
                                borderRadius:
                                  "8px",
                                padding:
                                  "9px 13px",
                                fontSize:
                                  "11px",
                                fontWeight:
                                  "800",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {
                                getStatusText(
                                  booking.status
                                )
                              }
                            </div>

                          </div>

                          {/* DETAILS */}

                          <div
                            style={{
                              display:
                                "grid",
                              gridTemplateColumns:
                                "repeat(4, minmax(0, 1fr))",
                              gap:
                                "12px",
                              marginTop:
                                "26px",
                              paddingTop:
                                "22px",
                              borderTop:
                                "1px solid #000000",
                            }}
                          >

                            <div>

                              <small
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "9px",
                                  fontWeight:
                                    "900",
                                  letterSpacing:
                                    "1.2px",
                                  color:
                                    "#008000",
                                  marginBottom:
                                    "7px",
                                }}
                              >
                                CHECK-IN
                              </small>

                              <strong
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "13px",
                                }}
                              >
                                {formatDate(
                                  booking.startDate
                                )}
                              </strong>

                            </div>

                            <div>

                              <small
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "9px",
                                  fontWeight:
                                    "900",
                                  letterSpacing:
                                    "1.2px",
                                  color:
                                    "#008000",
                                  marginBottom:
                                    "7px",
                                }}
                              >
                                CHECK-OUT
                              </small>

                              <strong
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "13px",
                                }}
                              >
                                {formatDate(
                                  booking.endDate
                                )}
                              </strong>

                            </div>

                            <div>

                              <small
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "9px",
                                  fontWeight:
                                    "900",
                                  letterSpacing:
                                    "1.2px",
                                  color:
                                    "#008000",
                                  marginBottom:
                                    "7px",
                                }}
                              >
                                DURATION
                              </small>

                              <strong
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "13px",
                                }}
                              >
                                {days}{" "}
                                {days ===
                                1
                                  ? "Day"
                                  : "Days"}
                              </strong>

                            </div>

                            <div>

                              <small
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "9px",
                                  fontWeight:
                                    "900",
                                  letterSpacing:
                                    "1.2px",
                                  color:
                                    "#008000",
                                  marginBottom:
                                    "7px",
                                }}
                              >
                                TOTAL PRICE
                              </small>

                              <strong
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "16px",
                                  color:
                                    "#008000",
                                }}
                              >
                                Rp{" "}
                                {formatPrice(
                                  booking.totalPrice
                                )}
                              </strong>

                            </div>

                          </div>

                          {/* NOTES */}

                          {booking.notes && (
                            <div
                              style={{
                                marginTop:
                                  "20px",
                                padding:
                                  "13px 16px",
                                backgroundColor:
                                  "#000000",
                                color:
                                  "#FFFFFF",
                                borderRadius:
                                  "8px",
                                borderLeft:
                                  "4px solid #008000",
                              }}
                            >

                              <div
                                style={{
                                  fontSize:
                                    "9px",
                                  color:
                                    "#008000",
                                  fontWeight:
                                    "900",
                                  letterSpacing:
                                    "1.2px",
                                  marginBottom:
                                    "5px",
                                }}
                              >
                                BOOKING NOTES
                              </div>

                              <p
                                style={{
                                  margin:
                                    0,
                                  fontSize:
                                    "12px",
                                  lineHeight:
                                    "1.5",
                                  opacity:
                                    0.85,
                                }}
                              >
                                {
                                  booking.notes
                                }
                              </p>

                            </div>
                          )}

                          {/* STATUS MESSAGE */}

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "8px",
                              marginTop:
                                "18px",
                              fontSize:
                                "12px",
                              fontWeight:
                                "600",
                            }}
                          >

                            <span
                              style={{
                                color:
                                  "#008000",
                                fontSize:
                                  "15px",
                              }}
                            >
                              ●
                            </span>

                            <span
                              style={{
                                opacity:
                                  0.65,
                              }}
                            >
                              {getStatusDescription(
                                booking.status
                              )}
                            </span>

                          </div>

                          {/* FOOTER */}

                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                              gap:
                                "20px",
                              marginTop:
                                "auto",
                              paddingTop:
                                "20px",
                            }}
                          >

                            <div
                              style={{
                                fontSize:
                                  "10px",
                                color:
                                  "#000000",
                                opacity:
                                  0.45,
                              }}
                            >
                              BOOKING ID
                            </div>

                            <code
                              style={{
                                fontSize:
                                  "10px",
                                backgroundColor:
                                  "#000000",
                                color:
                                  "#FFFFFF",
                                padding:
                                  "6px 9px",
                                borderRadius:
                                  "5px",
                                wordBreak:
                                  "break-all",
                              }}
                            >
                              {
                                booking._id
                              }
                            </code>

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            </section>
          )}

      </main>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer
        style={{
          backgroundColor:
            "#000000",
          borderTop:
            "1px solid #008000",
          padding:
            "30px 32px",
          color:
            "#FFFFFF",
        }}
      >

        <div
          style={{
            maxWidth:
              "1400px",
            margin:
              "0 auto",
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: "20px",
            flexWrap:
              "wrap",
          }}
        >

          <div>

            <strong
              style={{
                color:
                  "#008000",
                fontSize:
                  "14px",
                letterSpacing:
                  "1.5px",
              }}
            >
              HOUSE RENT
            </strong>

            <div
              style={{
                fontSize:
                  "11px",
                opacity:
                  0.5,
                marginTop:
                  "5px",
              }}
            >
              Find Your Perfect Home
            </div>

          </div>

          <p
            style={{
              margin: 0,
              fontSize:
                "11px",
              opacity:
                0.5,
            }}
          >
            © 2026 House Rent.
            All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default MyBookings;