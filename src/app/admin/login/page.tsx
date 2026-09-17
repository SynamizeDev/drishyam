"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const ADMIN_USER = "admin";
const ADMIN_PASS = "drishyam123";
const AUTH_KEY = "drishyam_admin_auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(AUTH_KEY) === "1") {
      router.replace("/admin");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem(AUTH_KEY, "1");
      router.replace("/admin");
    } else {
      setError("Incorrect username or password. Please try again.");
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full rounded-2xl border border-[#eadcc6] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20";

  return (
<main className="min-h-screen bg-[#f4f1eb] text-[#111111]">
  {/* Background */}
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 overflow-hidden"
  >
    <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#f59e0b]/10 blur-[120px]" />
    <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#111111]/[0.04] blur-[120px]" />
  </div>

  <div className="relative min-h-screen lg:grid lg:grid-cols-[1fr_0.9fr]">

    {/* =========================================================
        LEFT BRAND PANEL
        Desktop: Left side
        Mobile: Top section
    ========================================================= */}
    <section
      className="
        relative
        min-h-[360px]
        overflow-hidden
        bg-[#111111]
        sm:min-h-[400px]
        lg:min-h-screen
      "
    >
      {/* Decorative gradient */}
      <div
        aria-hidden
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_15%_20%,rgba(245,158,11,0.20),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.06),transparent_35%)]
        "
      />

      {/* Grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* Decorative circles */}
      <div
        aria-hidden
        className="
          absolute
          -right-40
          -top-40
          h-[420px]
          w-[420px]
          rounded-full
          border
          border-white/[0.06]
          sm:h-[520px]
          sm:w-[520px]
        "
      />

      <div
        aria-hidden
        className="
          absolute
          -right-20
          -top-20
          h-[280px]
          w-[280px]
          rounded-full
          border
          border-[#f59e0b]/10
          sm:h-[320px]
          sm:w-[320px]
        "
      />

      {/* Content */}
      <div
        className="
          relative
          z-10
          flex
          min-h-[360px]
          flex-col
          justify-between
          p-6
          sm:min-h-[400px]
          sm:p-8
          md:p-10
          lg:min-h-screen
          lg:p-12
          xl:p-16
        "
      >

        {/* Logo */}
        <div>
          <div
            className="
              inline-flex
              rounded-2xl
             
              px-4
              py-3

              sm:px-5
              sm:py-4
            "
          >
            <BrandLogo
              variant="full"
              size="lg"
              theme="dark"
              href="/"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-10 max-w-xl sm:mt-12 lg:mt-0">

          <div className="mb-4 flex items-center gap-3 sm:mb-5">
            <span className="h-px w-8 bg-[#f59e0b] sm:w-10" />

            <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#f59e0b] sm:text-[11px] sm:tracking-[0.28em]">
              Admin Workspace
            </span>
          </div>

          <h2
            className="
              max-w-lg
              text-3xl
              font-semibold
              leading-[1.05]
              tracking-[-0.04em]
              text-white
              sm:text-4xl
              md:text-5xl
              xl:text-6xl
            "
          >
            Manage your

            <span className="block text-[#f59e0b]">
              store experience.
            </span>
          </h2>

          <p
            className="
              mt-4
              max-w-md
              text-sm
              leading-6
              text-white/50
              sm:mt-6
              sm:text-base
              sm:leading-7
            "
          >
            A focused workspace to manage store content, cards,
            catalogue and everything your team needs in one place.
          </p>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium text-white/60 sm:px-4 sm:py-2 sm:text-xs">
              Content
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium text-white/60 sm:px-4 sm:py-2 sm:text-xs">
              Cards
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium text-white/60 sm:px-4 sm:py-2 sm:text-xs">
              Catalogue
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 sm:mt-10 sm:pt-5 lg:mt-8 lg:pt-6">
          <p className="text-[9px] uppercase tracking-[0.16em] text-white/30 sm:text-[11px] sm:tracking-[0.18em]">
            Drishyam Optical
          </p>

          <div className="flex items-center gap-2 text-[9px] text-white/30 sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Secure Portal
          </div>
        </div>
      </div>
    </section>


    {/* =========================================================
        RIGHT LOGIN AREA
    ========================================================= */}
    <section
      className="
        relative
        flex
        min-h-[calc(100vh-360px)]
        items-center
        justify-center
        px-4
        py-10
        sm:min-h-[calc(100vh-400px)]
        sm:px-6
        sm:py-12
        md:px-8
        lg:min-h-screen
        lg:px-10
        xl:px-16
      "
    >

      <div className="w-full max-w-[480px]">

        {/* Heading */}
        <div className="mb-6 sm:mb-8">

          <div className="mb-3 flex items-center gap-3 sm:mb-4">
            <span className="h-1 w-7 rounded-full bg-[#f59e0b] sm:w-8" />

            <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#111111]/40 sm:text-[10px] sm:tracking-[0.28em]">
              Secure Access
            </span>
          </div>

          <h1
            className="
              text-3xl
              font-semibold
              tracking-[-0.04em]
              text-[#111111]
              sm:text-4xl
              md:text-5xl
            "
          >
            Welcome back.
          </h1>

          <p className="mt-2 max-w-sm text-xs leading-5 text-[#111111]/45 sm:mt-3 sm:text-sm sm:leading-6">
            Sign in to access your admin workspace and manage
            your store experience.
          </p>
        </div>


        {/* Login Card */}
        <div
          className="
            rounded-[26px]
            border
            border-[#e7ded0]
            bg-white
            p-5
            shadow-[0_25px_70px_rgba(17,17,17,0.09)]
            sm:rounded-[30px]
            sm:p-7
            md:p-8
          "
        >

          {/* Card Header */}
          <div className="mb-6 flex items-center justify-between sm:mb-7">

            <div>
              <p className="text-sm font-semibold text-[#111111]">
                Admin Portal
              </p>

              <p className="mt-1 text-[11px] text-[#111111]/35 sm:text-xs">
                Authorized access only
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8f4ee] sm:h-10 sm:w-10">
              <div className="h-2 w-2 rounded-full bg-[#f59e0b]" />
            </div>
          </div>


          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

            {/* Username */}
            <label className="block">

              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#111111]/50 sm:tracking-[0.2em]">
                Username
              </span>

              <div className="relative">

                <User
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    h-[17px]
                    w-[17px]
                    -translate-y-1/2
                    text-[#999]
                  "
                />

                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter username"
                  className={`${fieldClass} h-14 w-full rounded-2xl border-[#e7e1d7] bg-[#faf9f7] pl-12 text-sm transition-all placeholder:text-[#aaa] focus:border-[#111111] focus:bg-white focus:ring-0`}
                  required
                />

              </div>
            </label>


            {/* Password */}
            <label className="block">

              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#111111]/50 sm:tracking-[0.2em]">
                Password
              </span>

              <div className="relative">

                <Lock
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    h-[17px]
                    w-[17px]
                    -translate-y-1/2
                    text-[#999]
                  "
                />

                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter password"
                  className={`${fieldClass} h-14 w-full rounded-2xl border-[#e7e1d7] bg-[#faf9f7] pl-12 pr-12 text-sm transition-all placeholder:text-[#aaa] focus:border-[#111111] focus:bg-white focus:ring-0`}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#999]
                    transition-colors
                    hover:text-[#111111]
                  "
                  aria-label={
                    showPass
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPass ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>

              </div>
            </label>


            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                <span className="min-w-0 break-words">
                  {error}
                </span>
              </div>
            )}


            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="
                group
                mt-2
                flex
                h-14
                w-full
                items-center
                justify-center
                rounded-2xl
                bg-[#111111]
                px-5
                text-sm
                font-bold
                uppercase
                tracking-[0.16em]
                text-white
                shadow-[0_12px_30px_rgba(17,17,17,0.16)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#222]
                hover:shadow-[0_18px_35px_rgba(17,17,17,0.20)]
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:translate-y-0
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              )}
            </button>

          </form>


          {/* Footer */}
          <div className="mt-6 border-t border-[#eee8df] pt-5 sm:mt-7">

            <p className="text-center text-[10px] leading-5 text-[#111111]/30">
              Authorized personnel only — Drishyam Optical
            </p>

          </div>

        </div>


        {/* Security */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.14em] text-[#111111]/25 sm:mt-6 sm:text-[10px] sm:tracking-[0.16em]">

          <Lock className="h-3 w-3" />

          Secure administrative access

        </div>

      </div>
    </section>

  </div>
</main>
  );
}
