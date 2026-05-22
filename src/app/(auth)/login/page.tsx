import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — navy brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#1a2744] p-12">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          InPro.ai
        </Link>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300 mb-6">
            By Application Only
          </div>
          <blockquote className="text-2xl font-semibold text-white leading-snug mb-6">
            &ldquo;The AI runs my business.<br />I just show up and consult.&rdquo;
          </blockquote>
          <p className="text-sm text-blue-200/60">— InPro.ai member since 2026</p>
        </div>
        <p className="text-xs text-blue-200/30">© 2026 InPro.ai</p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block text-xl font-bold text-[#1a2744] mb-10">
            InPro.ai
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1a2744] tracking-tight">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Don&apos;t have access?{" "}
              <Link href="/" className="font-medium text-[#204ecf] hover:underline">
                Apply to join
              </Link>
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
