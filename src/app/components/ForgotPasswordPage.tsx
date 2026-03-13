import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Show success message and redirect to login
    alert("Password reset link sent to your email!");
    navigate("/login");
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
        No Worries.!!
      </motion.p>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate("/login")}
        className="absolute left-[73px] px-[24px] py-[14px] top-[512px] border-4 border-solid border-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <p className="font-semibold italic leading-[normal] text-[32px] text-white whitespace-nowrap">
          Take me back.!
        </p>
      </motion.button>

      {/* Decorative Circle 1 */}
      <div className="absolute left-[798px] size-[302px] top-[62px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 302 302">
          <circle cx="151" cy="151" fill="url(#paint0_linear_forgot_1)" r="151" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_forgot_1" x1="151" x2="151" y1="0" y2="302">
              <stop stopColor="#61003A" />
              <stop offset="1" stopColor="#2D0A30" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Decorative Circle 2 */}
      <div className="absolute flex items-center justify-center left-[1142px] size-[298.315px] top-[728px]">
        <div className="flex-none rotate-[-28.5deg]">
          <div className="relative size-[220px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 220 220">
              <circle cx="110" cy="110" fill="url(#paint0_linear_forgot_2)" r="110" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_forgot_2" x1="110" x2="110" y1="0" y2="220">
                  <stop stopColor="#61004B" />
                  <stop offset="1" stopColor="#220A30" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Forgot Password Card */}
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
            <h1 className="font-semibold text-[36px] text-white mb-1">Forgot Password ?</h1>
            <p className="font-medium text-[16px] text-white">Please enter you're email</p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleResetPassword} className="flex flex-col gap-[25px]">
            {/* Email Input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full px-[16px] py-[14px] rounded-[12px] border border-solid border-white bg-transparent text-[20px] text-white placeholder:text-white/60 focus:outline-none focus:border-[#e948c5] transition-colors"
              required
            />

            {/* Reset Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-[10px] py-[14px] rounded-[12px] font-medium text-[20px] text-white"
              style={{
                backgroundImage:
                  "linear-gradient(94.117deg, rgb(233, 72, 197) 9.9097%, rgb(205, 64, 123) 53.286%, rgb(117, 4, 45) 91.559%)",
              }}
            >
              Reset Password
            </motion.button>
          </form>

          {/* Bottom Section */}
          <div className="mt-auto">
            <p className="font-medium text-[16px] text-white text-center mb-[8px]">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-[#e948c5] hover:underline"
              >
                Signup
              </button>
            </p>
            <div className="bg-gradient-to-b from-[rgba(98,98,98,0)] to-[rgba(98,98,98,0.25)] flex items-center justify-between px-[6px] py-[4px] rounded-[6px]">
              <p className="font-normal text-[16px] text-white">Terms & Conditions</p>
              <p className="font-normal text-[16px] text-white">Support</p>
              <p className="font-normal text-[16px] text-white">Customer Care</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Line */}
      <div className="absolute h-0 left-[337px] top-[550px] w-[554px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 554 2">
          <line stroke="#4D4D4D" strokeDasharray="12 12" strokeLinecap="round" strokeWidth="2" x1="1" x2="553" y1="1" y2="1" />
        </svg>
      </div>
    </div>
  );
}
