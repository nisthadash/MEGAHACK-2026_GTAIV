import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";


export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to IDE after login
    navigate("/ide");
  };

  return (
    <div className="bg-[#0f0f0f] relative h-screen w-screen overflow-hidden">
      {/* Main Heading */}
      <motion.p
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute font-semibold leading-[normal] left-[60px] text-[96px] text-white top-[381px] whitespace-nowrap"
      >
        Welcome Back .!
      </motion.p>

      {/* Decorative Circle 1 */}
      <div className="absolute left-[749px] size-[302px] top-[81px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 302 302">
          <circle cx="151" cy="151" fill="url(#paint0_linear_login_1)" r="151" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_login_1" x1="151" x2="151" y1="0" y2="302">
              <stop stopColor="#530061" />
              <stop offset="1" stopColor="#0D0A30" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Decorative Circle 2 */}
      <div className="absolute flex items-center justify-center left-[1169.84px] size-[298.315px] top-[719.84px]">
        <div className="flex-none rotate-[-28.5deg]">
          <div className="relative size-[220px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 220 220">
              <circle cx="110" cy="110" fill="url(#paint0_linear_login_2)" r="110" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_login_2" x1="110" x2="110" y1="0" y2="220">
                  <stop stopColor="#300061" />
                  <stop offset="1" stopColor="#0A1030" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 -translate-y-1/2 right-[60px] backdrop-blur-[26.5px] h-[796px] rounded-[20px] w-[480px] border border-solid border-white shadow-[-8px_4px_5px_0px_rgba(0,0,0,0.24)]"
        style={{
          backgroundImage:
            "linear-gradient(-53.097deg, rgba(191, 191, 191, 0.063) 5.9849%, rgba(0, 0, 0, 0) 66.277%), linear-gradient(90deg, rgba(0, 0, 0, 0.14) 0%, rgba(0, 0, 0, 0.14) 100%)",
        }}
      >
        <div className="overflow-clip relative rounded-[inherit] size-full p-[40px] flex flex-col">
          {/* Header */}
          <div className="mb-[14px]">
            <h1 className="font-semibold text-[36px] text-white mb-1">Login</h1>
            <p className="font-medium text-[16px] text-white">Glad you're back.!</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-[25px]">
            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-[16px] py-[14px] rounded-[12px] border border-solid border-white bg-transparent text-[20px] text-white placeholder:text-white/60 focus:outline-none focus:border-[#8b5cf6] transition-colors"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-[16px] py-[14px] rounded-[12px] border border-solid border-white bg-transparent text-[20px] text-white placeholder:text-white/60 focus:outline-none focus:border-[#8b5cf6] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <div className="relative size-[18px]">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-[4px] mt-[12px]">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="relative size-[18px]"
                >
                  {rememberMe ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="url(#paint0_linear_remember)" />
                      <defs>
                        <linearGradient id="paint0_linear_remember" x1="12" x2="12" y1="3" y2="21" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#7CC1F3" />
                          <stop offset="1" stopColor="#D27EEF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  ) : (
                    <div className="w-full h-full border-2 border-white rounded" />
                  )}
                </button>
                <p className="font-medium text-[16px] text-white">Remember me</p>
              </div>
            </div>

            {/* Login Button */}
            <div className="flex flex-col gap-[12px] items-center">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-[10px] py-[14px] rounded-[12px] font-semibold text-[20px] text-white"
                style={{
                  backgroundImage:
                    "linear-gradient(94.117deg, rgb(98, 142, 255) 9.9097%, rgb(135, 64, 205) 53.286%, rgb(88, 4, 117) 91.559%)",
                }}
              >
                Login
              </motion.button>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="font-medium text-[16px] text-white hover:text-[#8b5cf6] transition-colors"
              >
                Forgot password ?
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex gap-[20px] items-center my-[47px]">
            <div className="flex-1 h-[2px] bg-[#4d4d4d] rounded-full" />
            <p className="font-medium text-[16px] text-[#4d4d4d]">Or</p>
            <div className="flex-1 h-[2px] bg-[#4d4d4d] rounded-full" />
          </div>

          {/* Social Login */}
          <div className="flex gap-[18px] items-center justify-center mb-[8px]">
            <SocialIcon type="google" />
            <SocialIcon type="facebook" />
            <SocialIcon type="github" />
          </div>

          {/* Bottom Section */}
          <div className="mt-auto">
            <p className="font-medium text-[16px] text-white text-center mb-[8px]">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-[#8b5cf6] hover:underline"
              >
                Signup
              </button>
            </p>
            <div className="bg-gradient-to-b from-[rgba(98,98,98,0)] to-[rgba(98,98,98,0.07)] flex items-center justify-between px-[6px] py-[4px] rounded-[6px]">
              <p className="font-normal text-[16px] text-white">Terms & Conditions</p>
              <p className="font-normal text-[16px] text-white">Support</p>
              <p className="font-normal text-[16px] text-white">Customer Care</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Line */}
      <div className="absolute h-0 left-[330px] top-[550px] w-[561px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 561 2">
          <line stroke="#4D4D4D" strokeDasharray="12 12" strokeLinecap="round" strokeWidth="2" x1="1" x2="560" y1="1" y2="1" />
        </svg>
      </div>
    </div>
  );
}

function SocialIcon({ type }: { type: "google" | "facebook" | "github" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative size-[42px] cursor-pointer rounded-full flex items-center justify-center overflow-hidden"
    >
      {type === "google" && (
        <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      )}
      {type === "facebook" && (
        <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
        </svg>
      )}
      {type === "github" && (
        <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.167 22 16.42 22 12c0-5.523-4.477-10-10-10z" fill="white" />
        </svg>
      )}
    </motion.button>
  );
}