import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ==================================================
  // FETCH OWNER BOOKINGS
  // ==================================================

  const fetchOwnerBookings = async () => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/bookings/owner",
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
          data.message ||
            "Gagal mengambil data booking."
        );
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error(
        "Fetch owner bookings error:",
        error
      );

      setError(
        error.message ||
          "Gagal mengambil data booking."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    if (user?.role !== "owner") {
      navigate("/home", { replace: true });
      return;
    }

    fetchOwnerBookings();
  }, []);

  // ==================================================
  // APPROVE BOOKING
  // ==================================================

  const handleApprove = async (bookingId) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menyetujui booking ini?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(bookingId);

      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal menyetujui booking."
        );
      }

      alert(
        data.message ||
          "Booking berhasil disetujui."
      );

      await fetchOwnerBookings();
    } catch (error) {
      console.error(
        "Approve booking error:",
        error
      );

      alert(
        error.message ||
          "Terjadi kesalahan saat menyetujui booking."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==================================================
  // REJECT BOOKING
  // ==================================================

  const handleReject = async (bookingId) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menolak booking ini?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(bookingId);

      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal menolak booking."
        );
      }

      alert(
        data.message ||
          "Booking berhasil ditolak."
      );

      await fetchOwnerBookings();
    } catch (error) {
      console.error(
        "Reject booking error:",
        error
      );

      alert(
        error.message ||
          "Terjadi kesalahan saat menolak booking."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });
  };

  // ==================================================
  // NAVIGATION
  // ==================================================

  const goHome = () => {
    navigate("/home");
  };

  const goMyBookings = () => {
    navigate("/my-bookings");
  };

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // FORMAT PRICE
  // ==================================================

  const formatPrice = (price) => {
    const number = Number(price);

    if (isNaN(number)) {
      return "0";
    }

    return number.toLocaleString(
      "id-ID"
    );
  };

  // ==================================================
  // STATUS TEXT
  // ==================================================

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";

      case "approved":
        return "Approved";

      case "rejected":
        return "Rejected";

      case "cancelled":
        return "Cancelled";

      case "completed":
        return "Completed";

      default:
        return status || "Unknown";
    }
  };

  // ==================================================
  // STATUS STYLE
  // ==================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return {
          background: "#fff8e1",
          color: "#8a6200",
          border: "1px solid #f0d98a",
        };

      case "approved":
        return {
          background: "#e9f7ed",
          color: "#008000",
          border: "1px solid #9bd3aa",
        };

      case "rejected":
        return {
          background: "#fff0f0",
          color: "#b00000",
          border: "1px solid #efb1b1",
        };

      case "cancelled":
        return {
          background: "#f2f2f2",
          color: "#555555",
          border: "1px solid #d5d5d5",
        };

      case "completed":
        return {
          background: "#eaf2ff",
          color: "#1757a6",
          border: "1px solid #b7cef0",
        };

      default:
        return {
          background: "#f5f5f5",
          color: "#333333",
          border: "1px solid #dddddd",
        };
    }
  };

  // ==================================================
  // STATISTICS
  // ==================================================

  const pendingCount =
    bookings.filter(
      (booking) =>
        booking.status === "pending"
    ).length;

  const approvedCount =
    bookings.filter(
      (booking) =>
        booking.status === "approved"
    ).length;

  const rejectedCount =
    bookings.filter(
      (booking) =>
        booking.status === "rejected"
    ).length;

  const cancelledCount =
    bookings.filter(
      (booking) =>
        booking.status === "cancelled"
    ).length;

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f4",
        color: "#000000",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
      }}
    >

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: "74px",
          background: "#000000",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 5%",
          boxSizing: "border-box",
          boxShadow:
            "0 3px 15px rgba(0,0,0,0.18)",
        }}
      >

        {/* LOGO */}

        <div
          onClick={goHome}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
        >

          <div
            style={{
              width: "43px",
              height: "43px",
              borderRadius: "11px",
              background: "#008000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            ⌂
          </div>

          <div>

            <div
              style={{
                fontSize: "16px",
                fontWeight: "800",
                letterSpacing: "1.3px",
              }}
            >
              HOUSE RENT
            </div>

            <div
              style={{
                fontSize: "10px",
                color: "#aaaaaa",
                letterSpacing: "1px",
                marginTop: "2px",
              }}
            >
              OWNER DASHBOARD
            </div>

          </div>
        </div>

        {/* NAV RIGHT */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >

          <button
            onClick={goHome}
            style={{
              border: "1px solid #333333",
              background: "transparent",
              color: "#FFFFFF",
              padding:
                "9px 15px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Home
          </button>

          <button
            onClick={goMyBookings}
            style={{
              border: "1px solid #333333",
              background: "transparent",
              color: "#FFFFFF",
              padding:
                "9px 15px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            My Bookings
          </button>

          <div
            style={{
              width: "1px",
              height: "30px",
              background: "#333333",
              margin:
                "0 5px",
            }}
          />

          {/* USER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              marginRight: "5px",
            }}
          >

            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#008000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              {user?.name
                ?.charAt(0)
                .toUpperCase() ||
                "O"}
            </div>

            <div>

              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {user?.name ||
                  "Owner"}
              </div>

              <div
                style={{
                  fontSize: "10px",
                  color: "#aaaaaa",
                  marginTop: "2px",
                }}
              >
                Owner
              </div>

            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              border: "none",
              background: "#FFFFFF",
              color: "#000000",
              padding:
                "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "800",
            }}
          >
            Logout
          </button>

        </div>
      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main
        style={{
          width: "90%",
          maxWidth: "1250px",
          margin: "0 auto",
          padding:
            "50px 0 70px",
        }}
      >

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <section
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "25px",
            marginBottom: "35px",
          }}
        >

          <div>

            <div
              style={{
                display: "inline-block",
                color: "#008000",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "2px",
                marginBottom: "10px",
              }}
            >
              OWNER PANEL
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "38px",
                lineHeight: "1.15",
                fontWeight: "800",
                letterSpacing: "-1px",
              }}
            >
              Booking Management
            </h1>

            <p
              style={{
                margin:
                  "10px 0 0",
                color: "#666666",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Kelola seluruh permintaan
              booking dari penyewa
              property Anda.
            </p>

          </div>

          <button
            onClick={
              fetchOwnerBookings
            }
            disabled={loading}
            style={{
              flexShrink: 0,
              border: "2px solid #008000",
              background: "#FFFFFF",
              color: "#008000",
              padding:
                "11px 18px",
              borderRadius: "9px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontSize: "13px",
              fontWeight: "800",
            }}
          >
            ↻ Refresh
          </button>

        </section>

        {/* ==================================================
            STATISTICS
        ================================================== */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "40px",
          }}
        >

          {/* PENDING */}

          <div
            style={{
              background: "#FFFFFF",
              border:
                "1px solid #e5e5e5",
              borderRadius: "14px",
              padding: "22px",
              boxSizing: "border-box",
              borderTop:
                "4px solid #008000",
            }}
          >

            <div
              style={{
                fontSize: "11px",
                color: "#777777",
                fontWeight: "700",
                letterSpacing: "1px",
              }}
            >
              PENDING
            </div>

            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginTop: "8px",
                color: "#000000",
              }}
            >
              {pendingCount}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#888888",
                marginTop: "4px",
              }}
            >
              Menunggu keputusan
            </div>

          </div>

          {/* APPROVED */}

          <div
            style={{
              background: "#FFFFFF",
              border:
                "1px solid #e5e5e5",
              borderRadius: "14px",
              padding: "22px",
              boxSizing: "border-box",
              borderTop:
                "4px solid #008000",
            }}
          >

            <div
              style={{
                fontSize: "11px",
                color: "#777777",
                fontWeight: "700",
                letterSpacing: "1px",
              }}
            >
              APPROVED
            </div>

            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginTop: "8px",
                color: "#008000",
              }}
            >
              {approvedCount}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#888888",
                marginTop: "4px",
              }}
            >
              Booking disetujui
            </div>

          </div>

          {/* REJECTED */}

          <div
            style={{
              background: "#FFFFFF",
              border:
                "1px solid #e5e5e5",
              borderRadius: "14px",
              padding: "22px",
              boxSizing: "border-box",
              borderTop:
                "4px solid #000000",
            }}
          >

            <div
              style={{
                fontSize: "11px",
                color: "#777777",
                fontWeight: "700",
                letterSpacing: "1px",
              }}
            >
              REJECTED
            </div>

            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginTop: "8px",
              }}
            >
              {rejectedCount}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#888888",
                marginTop: "4px",
              }}
            >
              Booking ditolak
            </div>

          </div>

          {/* TOTAL */}

          <div
            style={{
              background: "#000000",
              color: "#FFFFFF",
              borderRadius: "14px",
              padding: "22px",
              boxSizing: "border-box",
            }}
          >

            <div
              style={{
                fontSize: "11px",
                color: "#aaaaaa",
                fontWeight: "700",
                letterSpacing: "1px",
              }}
            >
              TOTAL BOOKING
            </div>

            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginTop: "8px",
                color: "#FFFFFF",
              }}
            >
              {bookings.length}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#aaaaaa",
                marginTop: "4px",
              }}
            >
              Semua permintaan
            </div>

          </div>

        </section>

        {/* ==================================================
            BOOKING SECTION
        ================================================== */}

        <section>

          {/* SECTION HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              marginBottom: "20px",
            }}
          >

            <div>

              <div
                style={{
                  color: "#008000",
                  fontSize: "10px",
                  fontWeight: "800",
                  letterSpacing: "2px",
                  marginBottom: "7px",
                }}
              >
                REQUESTS
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "25px",
                  fontWeight: "800",
                }}
              >
                Booking Requests
              </h2>

            </div>

            <div
              style={{
                background: "#000000",
                color: "#FFFFFF",
                borderRadius: "20px",
                padding:
                  "7px 13px",
                fontSize: "11px",
                fontWeight: "700",
              }}
            >
              {bookings.length} Booking
            </div>

          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <div
              style={{
                background: "#FFFFFF",
                border:
                  "1px solid #e5e5e5",
                borderRadius: "15px",
                padding: "60px 20px",
                textAlign: "center",
              }}
            >

              <div
                style={{
                  width: "38px",
                  height: "38px",
                  border:
                    "4px solid #dddddd",
                  borderTop:
                    "4px solid #008000",
                  borderRadius: "50%",
                  margin:
                    "0 auto 15px",
                  animation:
                    "ownerSpin 0.8s linear infinite",
                }}
              />

              <p
                style={{
                  margin: 0,
                  color: "#666666",
                  fontSize: "13px",
                }}
              >
                Loading booking...
              </p>

            </div>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && error && (
            <div
              style={{
                background: "#FFFFFF",
                border:
                  "1px solid #f0cccc",
                borderLeft:
                  "4px solid #b00000",
                borderRadius: "12px",
                padding: "25px",
              }}
            >

              <h3
                style={{
                  margin:
                    "0 0 7px",
                  fontSize: "16px",
                  color: "#b00000",
                }}
              >
                Gagal mengambil data
              </h3>

              <p
                style={{
                  margin:
                    "0 0 17px",
                  color: "#666666",
                  fontSize: "13px",
                }}
              >
                {error}
              </p>

              <button
                onClick={
                  fetchOwnerBookings
                }
                style={{
                  border: "none",
                  background:
                    "#000000",
                  color: "#FFFFFF",
                  padding:
                    "10px 17px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                Coba Lagi
              </button>

            </div>
          )}

          {/* ==================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            bookings.length === 0 && (
              <div
                style={{
                  background: "#FFFFFF",
                  border:
                    "1px solid #e5e5e5",
                  borderRadius: "15px",
                  padding:
                    "70px 25px",
                  textAlign: "center",
                }}
              >

                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius:
                      "50%",
                    background:
                      "#eaf5ec",
                    color: "#008000",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    margin:
                      "0 auto 18px",
                    fontSize: "26px",
                  }}
                >
                  ◷
                </div>

                <h3
                  style={{
                    margin:
                      "0 0 8px",
                    fontSize: "19px",
                    fontWeight: "800",
                  }}
                >
                  Belum Ada Booking
                </h3>

                <p
                  style={{
                    maxWidth:
                      "400px",
                    margin:
                      "0 auto",
                    color: "#777777",
                    fontSize: "13px",
                    lineHeight: "1.6",
                  }}
                >
                  Belum ada penyewa yang
                  melakukan booking
                  property Anda.
                </p>

              </div>
            )}

          {/* ==================================================
              BOOKING LIST
          ================================================== */}

          {!loading &&
            !error &&
            bookings.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "18px",
                }}
              >

                {bookings.map(
                  (booking) => {

                    const property =
                      booking.property;

                    const renter =
                      booking.renter;

                    const isProcessing =
                      processingId ===
                      booking._id;

                    return (
                      <div
                        key={
                          booking._id
                        }
                        style={{
                          background:
                            "#FFFFFF",
                          border:
                            "1px solid #e3e3e3",
                          borderRadius:
                            "16px",
                          overflow:
                            "hidden",
                          boxShadow:
                            "0 5px 20px rgba(0,0,0,0.04)",
                        }}
                      >

                        {/* CARD HEADER */}

                        <div
                          style={{
                            padding:
                              "18px 22px",
                            borderBottom:
                              "1px solid #eeeeee",
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            gap: "15px",
                          }}
                        >

                          <div>

                            <div
                              style={{
                                fontSize:
                                  "9px",
                                color:
                                  "#999999",
                                fontWeight:
                                  "800",
                                letterSpacing:
                                  "1.5px",
                                marginBottom:
                                  "5px",
                              }}
                            >
                              BOOKING ID
                            </div>

                            <div
                              style={{
                                fontSize:
                                  "12px",
                                fontWeight:
                                  "700",
                                color:
                                  "#333333",
                                wordBreak:
                                  "break-all",
                              }}
                            >
                              #{booking._id}
                            </div>

                          </div>

                          <div
                            style={{
                              ...getStatusStyle(
                                booking.status
                              ),
                              padding:
                                "7px 12px",
                              borderRadius:
                                "20px",
                              fontSize:
                                "10px",
                              fontWeight:
                                "800",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {getStatusText(
                              booking.status
                            )}
                          </div>

                        </div>

                        {/* PROPERTY */}

                        <div
                          style={{
                            padding:
                              "22px",
                            display:
                              "flex",
                            gap: "18px",
                          }}
                        >

                          {/* IMAGE */}

                          <div
                            style={{
                              width: "150px",
                              height: "110px",
                              flexShrink: 0,
                              borderRadius:
                                "11px",
                              overflow:
                                "hidden",
                              background:
                                "#eeeeee",
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
                                  property
                                    ?.title ||
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
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  flexDirection:
                                    "column",
                                  color:
                                    "#999999",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize:
                                      "28px",
                                  }}
                                >
                                  ⌂
                                </span>

                                <small>
                                  No Image
                                </small>
                              </div>
                            )}

                          </div>

                          {/* PROPERTY INFO */}

                          <div
                            style={{
                              flex: 1,
                              minWidth: 0,
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
                                  "1px",
                                marginBottom:
                                  "5px",
                              }}
                            >
                              {property
                                ?.city ||
                                "Location"}
                            </div>

                            <h3
                              style={{
                                margin:
                                  "0 0 6px",
                                fontSize:
                                  "19px",
                                fontWeight:
                                  "800",
                                color:
                                  "#000000",
                              }}
                            >
                              {property
                                ?.title ||
                                "Property"}
                            </h3>

                            <p
                              style={{
                                margin:
                                  0,
                                color:
                                  "#777777",
                                fontSize:
                                  "12px",
                                lineHeight:
                                  "1.5",
                              }}
                            >
                              {property
                                ?.address ||
                                "Alamat property tidak tersedia."}
                            </p>

                          </div>

                        </div>

                        {/* DETAILS */}

                        <div
                          style={{
                            margin:
                              "0 22px",
                            padding:
                              "18px 0",
                            borderTop:
                              "1px solid #eeeeee",
                            borderBottom:
                              "1px solid #eeeeee",
                            display:
                              "grid",
                            gridTemplateColumns:
                              "repeat(4, 1fr)",
                            gap: "20px",
                          }}
                        >

                          {/* RENTER */}

                          <div>

                            <div
                              style={{
                                color:
                                  "#999999",
                                fontSize:
                                  "9px",
                                fontWeight:
                                  "800",
                                letterSpacing:
                                  "1px",
                                marginBottom:
                                  "7px",
                              }}
                            >
                              RENTER
                            </div>

                            <strong
                              style={{
                                display:
                                  "block",
                                fontSize:
                                  "13px",
                                color:
                                  "#000000",
                              }}
                            >
                              {renter
                                ?.name ||
                                "-"}
                            </strong>

                            <small
                              style={{
                                display:
                                  "block",
                                color:
                                  "#777777",
                                fontSize:
                                  "10px",
                                marginTop:
                                  "4px",
                                wordBreak:
                                  "break-word",
                              }}
                            >
                              {renter
                                ?.email ||
                                "-"}
                            </small>

                          </div>

                          {/* START DATE */}

                          <div>

                            <div
                              style={{
                                color:
                                  "#999999",
                                fontSize:
                                  "9px",
                                fontWeight:
                                  "800",
                                letterSpacing:
                                  "1px",
                                marginBottom:
                                  "7px",
                              }}
                            >
                              START DATE
                            </div>

                            <strong
                              style={{
                                fontSize:
                                  "13px",
                              }}
                            >
                              {formatDate(
                                booking.startDate
                              )}
                            </strong>

                          </div>

                          {/* END DATE */}

                          <div>

                            <div
                              style={{
                                color:
                                  "#999999",
                                fontSize:
                                  "9px",
                                fontWeight:
                                  "800",
                                letterSpacing:
                                  "1px",
                                marginBottom:
                                  "7px",
                              }}
                            >
                              END DATE
                            </div>

                            <strong
                              style={{
                                fontSize:
                                  "13px",
                              }}
                            >
                              {formatDate(
                                booking.endDate
                              )}
                            </strong>

                          </div>

                          {/* TOTAL */}

                          <div>

                            <div
                              style={{
                                color:
                                  "#999999",
                                fontSize:
                                  "9px",
                                fontWeight:
                                  "800",
                                letterSpacing:
                                  "1px",
                                marginBottom:
                                  "7px",
                              }}
                            >
                              TOTAL PRICE
                            </div>

                            <strong
                              style={{
                                fontSize:
                                  "14px",
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
                              margin:
                                "0 22px",
                              padding:
                                "16px 0",
                              borderBottom:
                                "1px solid #eeeeee",
                            }}
                          >

                            <div
                              style={{
                                fontSize:
                                  "9px",
                                fontWeight:
                                  "800",
                                letterSpacing:
                                  "1px",
                                color:
                                  "#999999",
                                marginBottom:
                                  "6px",
                              }}
                            >
                              NOTES
                            </div>

                            <p
                              style={{
                                margin: 0,
                                color:
                                  "#555555",
                                fontSize:
                                  "12px",
                                lineHeight:
                                  "1.6",
                              }}
                            >
                              {
                                booking.notes
                              }
                            </p>

                          </div>
                        )}

                        {/* ACTIONS */}

                        {booking.status ===
                          "pending" && (
                          <div
                            style={{
                              padding:
                                "18px 22px",
                              display:
                                "flex",
                              justifyContent:
                                "flex-end",
                              gap: "10px",
                            }}
                          >

                            <button
                              onClick={() =>
                                handleReject(
                                  booking._id
                                )
                              }
                              disabled={
                                isProcessing
                              }
                              style={{
                                minWidth:
                                  "100px",
                                height:
                                  "42px",
                                border:
                                  "1px solid #dddddd",
                                background:
                                  "#FFFFFF",
                                color:
                                  "#b00000",
                                borderRadius:
                                  "8px",
                                cursor:
                                  isProcessing
                                    ? "not-allowed"
                                    : "pointer",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  "800",
                                opacity:
                                  isProcessing
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              {isProcessing
                                ? "Processing..."
                                : "Reject"}
                            </button>

                            <button
                              onClick={() =>
                                handleApprove(
                                  booking._id
                                )
                              }
                              disabled={
                                isProcessing
                              }
                              style={{
                                minWidth:
                                  "100px",
                                height:
                                  "42px",
                                border:
                                  "none",
                                background:
                                  "#008000",
                                color:
                                  "#FFFFFF",
                                borderRadius:
                                  "8px",
                                cursor:
                                  isProcessing
                                    ? "not-allowed"
                                    : "pointer",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  "800",
                                opacity:
                                  isProcessing
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              {isProcessing
                                ? "Processing..."
                                : "Approve"}
                            </button>

                          </div>
                        )}

                      </div>
                    );
                  }
                )}

              </div>
            )}

        </section>
      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer
        style={{
          background: "#000000",
          color: "#FFFFFF",
          padding:
            "22px 5%",
          textAlign: "center",
          fontSize: "11px",
        }}
      >
        © 2026 House Rent. All rights reserved.
      </footer>

      {/* ==================================================
          RESPONSIVE CSS
      ================================================== */}

      <style>
        {`
          @keyframes ownerSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 900px) {
            .owner-stats {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (max-width: 700px) {
            header {
              height: auto !important;
              min-height: 74px !important;
              padding-top: 12px !important;
              padding-bottom: 12px !important;
              flex-wrap: wrap !important;
              gap: 12px !important;
            }

            header > div:last-child {
              width: 100% !important;
              justify-content: flex-end !important;
              flex-wrap: wrap !important;
            }

            main {
              width: 92% !important;
              padding-top: 35px !important;
            }

            section:first-child {
              align-items: flex-start !important;
              flex-direction: column !important;
            }

            .owner-stats {
              grid-template-columns: 1fr 1fr !important;
            }

            .booking-details {
              grid-template-columns: 1fr 1fr !important;
            }
          }

          @media (max-width: 550px) {
            .owner-stats {
              grid-template-columns: 1fr !important;
            }

            .booking-details {
              grid-template-columns: 1fr !important;
            }

            .booking-property {
              flex-direction: column !important;
            }

            .property-mini-image {
              width: 100% !important;
              height: 180px !important;
            }
          }
        `}
      </style>

    </div>
  );
}

export default OwnerDashboard;