import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ==========================================
  // HANDLE LOGIN
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validasi
    if (!formData.email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    if (!formData.password) {
      setError("Password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Email atau password salah."
        );
      }

      // ==========================================
      // SIMPAN TOKEN
      // ==========================================
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // ==========================================
      // SIMPAN USER
      // ==========================================
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // ==========================================
      // UPDATE STATUS LOGIN DI APP
      // ==========================================
      if (onLogin) {
        onLogin();
      }

      // ==========================================
      // REDIRECT BERDASARKAN ROLE
      // ==========================================
      const role = data.user?.role;

      if (role === "owner") {
        navigate("/owner", {
          replace: true,
        });
      } else {
        navigate("/home", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Terjadi kesalahan saat login."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GO TO REGISTER
  // ==========================================
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
        boxSizing: "border-box",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
      }}
    >
      {/* ======================================
          MAIN CONTAINER
      ====================================== */}

      <div
        style={{
          width: "100%",
          maxWidth: "1050px",
          minHeight: "620px",
          background: "#FFFFFF",
          borderRadius: "24px",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          boxShadow:
            "0 25px 70px rgba(0, 0, 0, 0.45)",
        }}
      >

        {/* ====================================
            LEFT SIDE
        ==================================== */}

        <div
          style={{
            background: "#008000",
            color: "#FFFFFF",
            padding: "55px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >

          {/* Decorative Circle */}

          <div
            style={{
              position: "absolute",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              border:
                "1px solid rgba(255,255,255,0.18)",
              right: "-120px",
              top: "-100px",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              border:
                "1px solid rgba(255,255,255,0.15)",
              left: "-100px",
              bottom: "-80px",
            }}
          />

          {/* Brand */}

          <div
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "70px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "25px",
                  fontWeight: "700",
                }}
              >
                ⌂
              </div>

              <div>
                <div
                  style={{
                    fontSize: "19px",
                    fontWeight: "800",
                    letterSpacing: "1.5px",
                  }}
                >
                  HOUSE RENT
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.8,
                    letterSpacing: "1px",
                    marginTop: "3px",
                  }}
                >
                  FIND YOUR PERFECT HOME
                </div>
              </div>
            </div>

            {/* Hero Text */}

            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "#000000",
                  padding:
                    "8px 13px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "1.5px",
                  marginBottom: "20px",
                }}
              >
                WELCOME BACK
              </div>

              <h1
                style={{
                  margin: "0 0 20px 0",
                  fontSize: "48px",
                  lineHeight: "1.05",
                  fontWeight: "800",
                  letterSpacing: "-1.5px",
                }}
              >
                Your home
                <br />
                starts here.
              </h1>

              <p
                style={{
                  margin: 0,
                  maxWidth: "390px",
                  fontSize: "15px",
                  lineHeight: "1.8",
                  color:
                    "rgba(255,255,255,0.88)",
                }}
              >
                Temukan rumah yang nyaman,
                aman, dan sesuai kebutuhan
                Anda melalui House Rent.
              </p>
            </div>
          </div>

          {/* Bottom */}

          <div
            style={{
              position: "relative",
              zIndex: 2,
              fontSize: "11px",
              opacity: 0.75,
            }}
          >
            © 2026 House Rent
          </div>
        </div>

        {/* ====================================
            RIGHT SIDE - LOGIN FORM
        ==================================== */}

        <div
          style={{
            background: "#FFFFFF",
            padding: "55px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >

            {/* Heading */}

            <div
              style={{
                marginBottom: "35px",
              }}
            >
              <div
                style={{
                  color: "#008000",
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "2px",
                  marginBottom: "10px",
                }}
              >
                ACCOUNT LOGIN
              </div>

              <h2
                style={{
                  margin: 0,
                  color: "#000000",
                  fontSize: "34px",
                  lineHeight: "1.15",
                  fontWeight: "800",
                }}
              >
                Welcome back
              </h2>

              <p
                style={{
                  margin:
                    "10px 0 0 0",
                  color: "#666666",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                Login untuk melanjutkan
                ke House Rent.
              </p>
            </div>

            {/* =================================
                ERROR MESSAGE
            ================================= */}

            {error && (
              <div
                style={{
                  background:
                    "#fff5f5",
                  border:
                    "1px solid #ffcccc",
                  color: "#c00000",
                  padding: "13px 15px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                {error}
              </div>
            )}

            {/* =================================
                FORM
            ================================= */}

            <form
              onSubmit={handleSubmit}
            >

              {/* EMAIL */}

              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    color: "#000000",
                    fontSize: "13px",
                    fontWeight: "700",
                    marginBottom: "8px",
                  }}
                >
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Masukkan email Anda"
                  autoComplete="email"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: "52px",
                    padding:
                      "0 16px",
                    boxSizing:
                      "border-box",
                    border:
                      "1px solid #dddddd",
                    borderRadius: "10px",
                    outline: "none",
                    fontSize: "14px",
                    color: "#000000",
                    background:
                      "#FFFFFF",
                  }}
                />
              </div>

              {/* PASSWORD */}

              <div
                style={{
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    marginBottom: "8px",
                  }}
                >
                  <label
                    style={{
                      color: "#000000",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    Password
                  </label>
                </div>

                <div
                  style={{
                    position:
                      "relative",
                  }}
                >
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan password Anda"
                    autoComplete="current-password"
                    disabled={loading}
                    style={{
                      width: "100%",
                      height: "52px",
                      padding:
                        "0 55px 0 16px",
                      boxSizing:
                        "border-box",
                      border:
                        "1px solid #dddddd",
                      borderRadius:
                        "10px",
                      outline:
                        "none",
                      fontSize: "14px",
                      color:
                        "#000000",
                      background:
                        "#FFFFFF",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) =>
                          !prev
                      )
                    }
                    disabled={
                      loading
                    }
                    style={{
                      position:
                        "absolute",
                      right: "5px",
                      top: "5px",
                      width: "42px",
                      height: "42px",
                      border:
                        "none",
                      borderRadius:
                        "8px",
                      background:
                        "#FFFFFF",
                      color:
                        "#008000",
                      cursor:
                        "pointer",
                      fontSize:
                        "17px",
                    }}
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword
                      ? "◉"
                      : "○"}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "52px",
                  marginTop: "15px",
                  border: "none",
                  borderRadius: "10px",
                  background:
                    loading
                      ? "#555555"
                      : "#000000",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: "800",
                  letterSpacing:
                    "0.5px",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  transition:
                    "0.2s",
                }}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>
            </form>

            {/* REGISTER */}

            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "12px",
                margin:
                  "30px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background:
                    "#eeeeee",
                }}
              />

              <span
                style={{
                  color:
                    "#999999",
                  fontSize: "11px",
                }}
              >
                OR
              </span>

              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background:
                    "#eeeeee",
                }}
              />
            </div>

            <div
              style={{
                textAlign:
                  "center",
                fontSize: "13px",
                color: "#666666",
              }}
            >
              Belum memiliki akun?
            </div>

            <button
              type="button"
              onClick={
                handleRegister
              }
              disabled={loading}
              style={{
                width: "100%",
                height: "50px",
                marginTop: "10px",
                border:
                  "2px solid #008000",
                borderRadius: "10px",
                background:
                  "#FFFFFF",
                color: "#008000",
                fontSize: "14px",
                fontWeight: "800",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              Create New Account
            </button>

          </div>
        </div>
      </div>

      {/* ======================================
          RESPONSIVE STYLE
      ====================================== */}

      <style>
        {`
          @media (max-width: 800px) {
            div[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
              max-width: 500px !important;
            }

            div[style*="grid-template-columns"] > div:first-child {
              min-height: 300px !important;
              padding: 35px !important;
            }

            div[style*="grid-template-columns"] > div:first-child h1 {
              font-size: 36px !important;
            }

            div[style*="grid-template-columns"] > div:first-child > div:first-child > div:first-child {
              margin-bottom: 35px !important;
            }

            div[style*="grid-template-columns"] > div:last-child {
              padding: 35px !important;
            }
          }

          @media (max-width: 480px) {
            div[style*="grid-template-columns"] > div:first-child {
              padding: 28px !important;
            }

            div[style*="grid-template-columns"] > div:last-child {
              padding: 28px 22px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Login;