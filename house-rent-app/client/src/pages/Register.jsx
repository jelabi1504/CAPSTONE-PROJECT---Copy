import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tenant",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            role: formData.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registrasi gagal."
        );
      }

      setSuccess(
        "Registrasi berhasil! Mengarahkan ke halaman login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "tenant",
      });

      setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 1500);
    } catch (error) {
      console.error("Register error:", error);

      setError(
        error.message ||
          "Terjadi kesalahan saat melakukan registrasi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #000000 0%, #001a00 45%, #008000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1050px",
          minHeight: "650px",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          boxShadow:
            "0 25px 70px rgba(0, 0, 0, 0.45)",
        }}
      >
        {/* =====================================
            LEFT SIDE
        ===================================== */}

        <div
          style={{
            background:
              "linear-gradient(160deg, #008000 0%, #005c00 55%, #000000 100%)",
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
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              border:
                "1px solid rgba(255,255,255,0.15)",
              top: "-100px",
              right: "-100px",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              border:
                "1px solid rgba(255,255,255,0.1)",
              bottom: "-70px",
              left: "-70px",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Logo */}

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
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  backgroundColor:
                    "#FFFFFF",
                  color: "#008000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                ⌂
              </div>

              <div>
                <div
                  style={{
                    fontSize: "21px",
                    fontWeight: "800",
                    letterSpacing: "2px",
                  }}
                >
                  HOUSE RENT
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.8,
                    letterSpacing: "1.5px",
                    marginTop: "4px",
                  }}
                >
                  FIND YOUR PERFECT HOME
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "2px",
                marginBottom: "18px",
                opacity: 0.8,
              }}
            >
              JOIN OUR PLATFORM
            </div>

            <h1
              style={{
                fontSize: "48px",
                lineHeight: "1.08",
                margin: "0 0 24px",
                fontWeight: "800",
              }}
            >
              Create Your
              <br />
              <span
                style={{
                  color: "#FFFFFF",
                }}
              >
                Account.
              </span>
            </h1>

            <p
              style={{
                maxWidth: "390px",
                fontSize: "15px",
                lineHeight: "1.8",
                margin: 0,
                color:
                  "rgba(255,255,255,0.82)",
              }}
            >
              Bergabung dengan House Rent dan
              temukan rumah yang nyaman sesuai
              kebutuhan Anda.
            </p>
          </div>

          {/* Bottom */}

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "12px",
              opacity: 0.75,
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor:
                  "#FFFFFF",
                display: "inline-block",
              }}
            />

            Secure & Trusted Rental Platform
          </div>
        </div>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div
          style={{
            padding: "50px 55px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div
            style={{
              maxWidth: "430px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            {/* Heading */}

            <div
              style={{
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "7px 13px",
                  borderRadius: "20px",
                  backgroundColor:
                    "#e8f5e8",
                  color: "#008000",
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                  marginBottom: "14px",
                }}
              >
                CREATE ACCOUNT
              </div>

              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: "30px",
                  color: "#000000",
                  fontWeight: "800",
                }}
              >
                Register
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#666666",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                Buat akun baru untuk mulai
                menggunakan House Rent.
              </p>
            </div>

            {/* Error */}

            {error && (
              <div
                style={{
                  backgroundColor:
                    "#fff1f1",
                  border:
                    "1px solid #ffcccc",
                  color: "#b00000",
                  padding:
                    "12px 15px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  marginBottom: "18px",
                  lineHeight: "1.5",
                }}
              >
                {error}
              </div>
            )}

            {/* Success */}

            {success && (
              <div
                style={{
                  backgroundColor:
                    "#eaf7ea",
                  border:
                    "1px solid #b9dfb9",
                  color: "#006600",
                  padding:
                    "12px 15px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  marginBottom: "18px",
                  lineHeight: "1.5",
                }}
              >
                {success}
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
            >
              {/* Name */}

              <div
                style={{
                  marginBottom: "18px",
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
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Masukkan nama lengkap"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: "48px",
                    boxSizing:
                      "border-box",
                    border:
                      "1px solid #dddddd",
                    borderRadius: "10px",
                    padding:
                      "0 15px",
                    fontSize: "14px",
                    outline: "none",
                    color: "#000000",
                    backgroundColor:
                      "#FFFFFF",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor =
                      "#008000";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(0,128,0,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      "#dddddd";
                    e.target.style.boxShadow =
                      "none";
                  }}
                />
              </div>

              {/* Email */}

              <div
                style={{
                  marginBottom: "18px",
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
                  Email Address
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
                  placeholder="contoh@email.com"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: "48px",
                    boxSizing:
                      "border-box",
                    border:
                      "1px solid #dddddd",
                    borderRadius: "10px",
                    padding:
                      "0 15px",
                    fontSize: "14px",
                    outline: "none",
                    color: "#000000",
                    backgroundColor:
                      "#FFFFFF",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor =
                      "#008000";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(0,128,0,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      "#dddddd";
                    e.target.style.boxShadow =
                      "none";
                  }}
                />
              </div>

              {/* Password */}

              <div
                style={{
                  marginBottom: "18px",
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
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Minimal 6 karakter"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: "48px",
                    boxSizing:
                      "border-box",
                    border:
                      "1px solid #dddddd",
                    borderRadius: "10px",
                    padding:
                      "0 15px",
                    fontSize: "14px",
                    outline: "none",
                    color: "#000000",
                    backgroundColor:
                      "#FFFFFF",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor =
                      "#008000";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(0,128,0,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      "#dddddd";
                    e.target.style.boxShadow =
                      "none";
                  }}
                />
              </div>

              {/* Role */}

              <div
                style={{
                  marginBottom: "25px",
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
                  Register As
                </label>

                <select
                  name="role"
                  value={
                    formData.role
                  }
                  onChange={
                    handleChange
                  }
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: "48px",
                    boxSizing:
                      "border-box",
                    border:
                      "1px solid #dddddd",
                    borderRadius: "10px",
                    padding:
                      "0 15px",
                    fontSize: "14px",
                    outline: "none",
                    color: "#000000",
                    backgroundColor:
                      "#FFFFFF",
                    cursor: "pointer",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor =
                      "#008000";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(0,128,0,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      "#dddddd";
                    e.target.style.boxShadow =
                      "none";
                  }}
                >
                  <option value="tenant">
                    Tenant
                  </option>

                  <option value="owner">
                    Owner
                  </option>
                </select>
              </div>

              {/* Register Button */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "50px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor:
                    loading
                      ? "#66a866"
                      : "#008000",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: "800",
                  letterSpacing:
                    "0.5px",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  transition:
                    "0.2s ease",
                  boxShadow:
                    "0 8px 20px rgba(0,128,0,0.2)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor =
                      "#006600";
                    e.target.style.transform =
                      "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor =
                      "#008000";
                    e.target.style.transform =
                      "translateY(0)";
                  }
                }}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            {/* Login */}

            <div
              style={{
                textAlign: "center",
                marginTop: "25px",
                paddingTop: "22px",
                borderTop:
                  "1px solid #eeeeee",
                fontSize: "13px",
                color: "#666666",
              }}
            >
              Sudah memiliki akun?

              <Link
                to="/"
                style={{
                  marginLeft: "6px",
                  color: "#008000",
                  fontWeight: "800",
                  textDecoration:
                    "none",
                }}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}

      <style>
        {`
          @media (max-width: 800px) {
            .register-container {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Register;