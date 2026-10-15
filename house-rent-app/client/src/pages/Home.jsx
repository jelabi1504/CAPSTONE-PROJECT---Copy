import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("User data tidak valid:", error);
      }
    }

    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/properties"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengambil data property"
        );
      }

      setProperties(
        Array.isArray(data)
          ? data
          : data.properties || []
      );
    } catch (error) {
      console.error("Fetch properties error:", error);

      setError(
        error.message ||
          "Terjadi kesalahan saat mengambil data rumah"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  const handleBooking = (propertyId) => {
    navigate(`/booking/${propertyId}`);
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("id-ID");
  };

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
      {/* =========================
          NAVBAR
      ========================= */}

      <header
        style={{
          width: "100%",
          borderBottom:
            "1px solid rgba(0, 128, 0, 0.35)",
          backgroundColor: "#000000",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "30px",
          }}
        >
          {/* LOGO */}

          <div
            onClick={() => navigate("/home")}
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
                borderRadius: "10px",
                backgroundColor: "#008000",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                  fontWeight: "700",
                  marginTop: "3px",
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
              gap: "10px",
            }}
          >
            <button
              onClick={() => navigate("/home")}
              style={{
                backgroundColor: "#008000",
                color: "#FFFFFF",
                border: "1px solid #008000",
                padding: "10px 18px",
                borderRadius: "7px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Properties
            </button>

            <button
              onClick={() =>
                navigate("/my-bookings")
              }
              style={{
                backgroundColor: "#000000",
                color: "#FFFFFF",
                border:
                  "1px solid rgba(0, 128, 0, 0.7)",
                padding: "10px 18px",
                borderRadius: "7px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              My Bookings
            </button>

            {user?.role === "owner" && (
              <button
                onClick={() =>
                  navigate("/owner")
                }
                style={{
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  border:
                    "1px solid rgba(0, 128, 0, 0.7)",
                  padding: "10px 18px",
                  borderRadius: "7px",
                  cursor: "pointer",
                  fontWeight: "600",
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
              gap: "15px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1px solid #008000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#008000",
                fontWeight: "800",
              }}
            >
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                {user?.name || "User"}
              </div>

              <div
                style={{
                  color: "#008000",
                  fontSize: "11px",
                  textTransform: "capitalize",
                }}
              >
                {user?.role || "tenant"}
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#000000",
                color: "#FFFFFF",
                border:
                  "1px solid rgba(0, 128, 0, 0.7)",
                padding: "10px 18px",
                borderRadius: "7px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* =========================
          HERO
      ========================= */}

      <main>
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 30px 60px",
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            alignItems: "center",
            gap: "70px",
          }}
        >
          {/* LEFT */}

          <div>
            <div
              style={{
                display: "inline-block",
                border:
                  "1px solid #008000",
                color: "#008000",
                borderRadius: "30px",
                padding: "8px 16px",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "1.5px",
                marginBottom: "25px",
              }}
            >
              HOUSE RENT PLATFORM
            </div>

            <h1
              style={{
                fontSize: "58px",
                lineHeight: "1.05",
                margin: 0,
                fontWeight: "800",
              }}
            >
              Find Your
              <br />
              <span
                style={{
                  color: "#008000",
                }}
              >
                Perfect Home.
              </span>
            </h1>

            <p
              style={{
                color: "#FFFFFF",
                opacity: 0.65,
                maxWidth: "550px",
                lineHeight: "1.8",
                marginTop: "25px",
                fontSize: "15px",
              }}
            >
              Temukan rumah yang nyaman
              dan sesuai kebutuhan Anda
              dengan mudah melalui House
              Rent.
            </p>

            <button
              onClick={() => {
                document
                  .getElementById(
                    "available-properties"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
              style={{
                marginTop: "15px",
                backgroundColor: "#008000",
                color: "#FFFFFF",
                border: "none",
                padding:
                  "14px 24px",
                borderRadius: "7px",
                cursor: "pointer",
                fontWeight: "800",
                fontSize: "14px",
              }}
            >
              Explore Properties
            </button>
          </div>

          {/* RIGHT */}

          <div
            style={{
              border:
                "1px solid rgba(0, 128, 0, 0.65)",
              borderRadius: "18px",
              padding: "25px",
              backgroundColor:
                "rgba(0, 128, 0, 0.04)",
              boxShadow:
                "0 0 50px rgba(0, 128, 0, 0.08)",
            }}
          >
            <div
              style={{
                height: "270px",
                borderRadius: "12px",
                backgroundColor:
                  "rgba(0, 128, 0, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: "130px",
                  color: "#008000",
                  opacity: 0.9,
                }}
              >
                ⌂
              </div>
            </div>

            <div
              style={{
                marginTop: "25px",
              }}
            >
              <div
                style={{
                  color: "#008000",
                  fontSize: "10px",
                  fontWeight: "800",
                  letterSpacing: "2px",
                }}
              >
                WELCOME TO
              </div>

              <h2
                style={{
                  margin:
                    "8px 0",
                  fontSize: "24px",
                }}
              >
                House Rent
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#FFFFFF",
                  opacity: 0.55,
                  fontSize: "13px",
                }}
              >
                Your trusted home
                rental platform.
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            FEATURES
        ========================= */}

        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px 30px 80px",
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "18px",
          }}
        >
          {[
            {
              icon: "⌂",
              title: "Find Properties",
              text:
                "Cari berbagai pilihan rumah yang tersedia untuk disewa.",
            },
            {
              icon: "✓",
              title: "Easy Booking",
              text:
                "Lakukan proses booking rumah dengan cepat dan mudah.",
            },
            {
              icon: "◆",
              title: "Trusted Platform",
              text:
                "Kelola property dan booking dalam satu platform.",
            },
          ].map(
            (feature, index) => (
              <div
                key={index}
                style={{
                  border:
                    "1px solid rgba(0, 128, 0, 0.35)",
                  borderRadius: "12px",
                  padding: "25px",
                  backgroundColor:
                    "rgba(0, 128, 0, 0.025)",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9px",
                    backgroundColor:
                      "rgba(0, 128, 0, 0.18)",
                    color: "#008000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    marginBottom: "18px",
                  }}
                >
                  {feature.icon}
                </div>

                <h3
                  style={{
                    margin:
                      "0 0 10px",
                    fontSize: "15px",
                  }}
                >
                  {feature.title}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#FFFFFF",
                    opacity: 0.55,
                    fontSize: "12px",
                    lineHeight: "1.7",
                  }}
                >
                  {feature.text}
                </p>
              </div>
            )
          )}
        </section>

        {/* =========================
            AVAILABLE PROPERTIES
        ========================= */}

        <section
          id="available-properties"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding:
              "20px 30px 100px",
          }}
        >
          <div
            style={{
              borderTop:
                "1px solid rgba(0, 128, 0, 0.25)",
              paddingTop: "50px",
            }}
          >
            <div
              style={{
                color: "#008000",
                fontSize: "10px",
                fontWeight: "800",
                letterSpacing: "2px",
              }}
            >
              AVAILABLE HOMES
            </div>

            <h2
              style={{
                fontSize: "32px",
                margin:
                  "10px 0",
              }}
            >
              Find Your Next Home
            </h2>

            <p
              style={{
                color: "#FFFFFF",
                opacity: 0.6,
                marginBottom:
                  "35px",
              }}
            >
              Pilih rumah yang sesuai
              dengan kebutuhan Anda.
            </p>

            {/* LOADING */}

            {loading && (
              <div
                style={{
                  border:
                    "1px solid rgba(0, 128, 0, 0.3)",
                  borderRadius: "12px",
                  padding: "40px",
                  textAlign: "center",
                  color: "#008000",
                }}
              >
                Memuat data rumah...
              </div>
            )}

            {/* ERROR */}

            {!loading &&
              error && (
                <div
                  style={{
                    border:
                      "1px solid #008000",
                    borderRadius: "12px",
                    padding: "30px",
                    textAlign: "center",
                  }}
                >
                  <h3>
                    Gagal mengambil
                    data
                  </h3>

                  <p
                    style={{
                      opacity: 0.65,
                    }}
                  >
                    {error}
                  </p>

                  <button
                    onClick={
                      fetchProperties
                    }
                    style={{
                      backgroundColor:
                        "#008000",
                      color:
                        "#FFFFFF",
                      border: "none",
                      padding:
                        "10px 20px",
                      borderRadius:
                        "6px",
                      cursor:
                        "pointer",
                      fontWeight:
                        "700",
                    }}
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

            {/* EMPTY */}

            {!loading &&
              !error &&
              properties.length ===
                0 && (
                <div
                  style={{
                    border:
                      "1px solid rgba(0, 128, 0, 0.3)",
                    borderRadius:
                      "12px",
                    padding: "50px",
                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "45px",
                      color:
                        "#008000",
                      marginBottom:
                        "15px",
                    }}
                  >
                    ⌂
                  </div>

                  <h3>
                    Belum Ada
                    Property
                  </h3>

                  <p
                    style={{
                      opacity: 0.6,
                    }}
                  >
                    Belum ada rumah
                    yang tersedia
                    untuk disewa.
                  </p>
                </div>
              )}

            {/* PROPERTY LIST */}

            {!loading &&
              !error &&
              properties.length >
                0 && (
                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(3, 1fr)",
                    gap: "20px",
                  }}
                >
                  {properties.map(
                    (property) => (
                      <div
                        key={
                          property._id
                        }
                        style={{
                          border:
                            "1px solid rgba(0, 128, 0, 0.35)",
                          borderRadius:
                            "12px",
                          overflow:
                            "hidden",
                          backgroundColor:
                            "#000000",
                        }}
                      >
                        {/* IMAGE */}

                        <div
                          style={{
                            height:
                              "210px",
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
                            .images
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
                            <span
                              style={{
                                fontSize:
                                  "55px",
                                color:
                                  "#008000",
                              }}
                            >
                              ⌂
                            </span>
                          )}
                        </div>

                        {/* CONTENT */}

                        <div
                          style={{
                            padding:
                              "20px",
                          }}
                        >
                          <div
                            style={{
                              color:
                                "#008000",
                              fontSize:
                                "11px",
                              fontWeight:
                                "700",
                              marginBottom:
                                "7px",
                            }}
                          >
                            {
                              property.city
                            }
                          </div>

                          <h3
                            style={{
                              margin:
                                "0 0 10px",
                              fontSize:
                                "18px",
                            }}
                          >
                            {
                              property.title
                            }
                          </h3>

                          <p
                            style={{
                              margin:
                                "0 0 15px",
                              fontSize:
                                "12px",
                              opacity:
                                0.55,
                              lineHeight:
                                "1.5",
                            }}
                          >
                            {
                              property.address
                            }
                          </p>

                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                              marginBottom:
                                "18px",
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
                                    "10px",
                                }}
                              >
                                Harga / hari
                              </small>

                              <strong
                                style={{
                                  color:
                                    "#008000",
                                  fontSize:
                                    "17px",
                                }}
                              >
                                Rp{" "}
                                {formatPrice(
                                  property.price
                                )}
                              </strong>
                            </div>

                            <div
                              style={{
                                textAlign:
                                  "right",
                                fontSize:
                                  "11px",
                                opacity:
                                  0.7,
                              }}
                            >
                              <div>
                                🛏{" "}
                                {
                                  property.bedrooms
                                }{" "}
                                Bedrooms
                              </div>

                              <div>
                                🚿{" "}
                                {
                                  property.bathrooms
                                }{" "}
                                Bathrooms
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              handleBooking(
                                property._id
                              )
                            }
                            disabled={
                              property.status !==
                              "available"
                            }
                            style={{
                              width:
                                "100%",
                              padding:
                                "12px",
                              borderRadius:
                                "7px",
                              border:
                                "1px solid #008000",
                              backgroundColor:
                                property.status ===
                                "available"
                                  ? "#008000"
                                  : "#000000",
                              color:
                                "#FFFFFF",
                              cursor:
                                property.status ===
                                "available"
                                  ? "pointer"
                                  : "not-allowed",
                              fontWeight:
                                "700",
                            }}
                          >
                            {property.status ===
                            "available"
                              ? "Book Now"
                              : "Not Available"}
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================= */}

      <footer
        style={{
          borderTop:
            "1px solid rgba(0, 128, 0, 0.25)",
          padding:
            "30px",
          textAlign: "center",
          color: "#FFFFFF",
          opacity: 0.5,
          fontSize: "12px",
        }}
      >
        © 2026 House Rent. All
        rights reserved.
      </footer>
    </div>
  );
}

export default Home;