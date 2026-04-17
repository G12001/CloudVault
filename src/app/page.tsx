"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Cloud,
  FolderOpen,
  Lock,
  Zap,
  Users,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  // Auto-redirect if authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-linear-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 text-black dark:text-white overflow-hidden transition-colors">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-black/30 border-b border-gray-200 dark:border-white/10 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-linear-to-r from-blue-600 dark:from-blue-400 to-cyan-600 dark:to-cyan-400 bg-clip-text text-transparent"
          >
            CloudVault
          </motion.div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <a
              href="/login"
              className="px-4 py-2 rounded-lg text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition"
            >
              Login
            </a>
            <a
              href="/register"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium text-white"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Manage Your Files <br />
              <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Seamlessly
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              A powerful, secure file management solution with cloud storage,
              folder organization, and real-time collaboration.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/register"
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                Get Started <ArrowRight size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/login"
                className="flex items-center gap-2 px-8 py-4 border border-white/20 hover:bg-white/10 rounded-lg font-semibold transition"
              >
                Sign In
              </motion.a>
            </div>
          </motion.div>

          {/* Hero Image/Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Cloud size={64} className="mx-auto mb-4 text-blue-400" />
                  <p className="text-gray-300">
                    Your File Management Dashboard
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-linear-to-b from-transparent via-black/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Powerful Features
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Cloud,
                title: "Cloud Storage",
                description:
                  "Secure storage backed by AWS S3 with lightning-fast uploads",
              },
              {
                icon: FolderOpen,
                title: "Smart Organization",
                description:
                  "Organize files into hierarchical folders for easy navigation",
              },
              {
                icon: Lock,
                title: "Secure & Private",
                description:
                  "Your files are encrypted and only accessible to you",
              },
              {
                icon: Zap,
                title: "Fast Performance",
                description: "Optimized for speed with instant file previews",
              },
              {
                icon: BarChart3,
                title: "Storage Tracking",
                description: "Real-time storage usage monitoring",
              },
              {
                icon: Users,
                title: "User Management",
                description: "Secure authentication with bcrypt hashing",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-linear-to-br from-white/5 to-white/10 border border-white/10 rounded-xl p-6 hover:border-blue-400/50 transition"
              >
                <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Why Choose CloudVault?
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "✨ Beautiful Interface",
                description:
                  "Modern, intuitive UI built with React and Tailwind CSS for a seamless experience.",
              },
              {
                title: "🔒 Enterprise Security",
                description:
                  "Military-grade encryption and secure authentication protocols keep your data safe.",
              },
              {
                title: "⚡ Lightning Fast",
                description:
                  "Powered by Next.js and cloud infrastructure for instant performance.",
              },
              {
                title: "📱 Responsive Design",
                description:
                  "Works perfectly on desktop, tablet, and mobile devices.",
              },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex gap-4"
              >
                <div className="text-blue-400 text-2xl min-w-fit">✓</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-linear-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of users managing their files securely in the cloud.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/register"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              Create Account
            </a>
            <a
              href="/login"
              className="px-8 py-3 border border-white/20 hover:bg-white/10 rounded-lg font-semibold transition"
            >
              Sign In
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-gray-400">
        <p>
          © 2026 CloudVault. All rights reserved. Built with Next.js & React.
        </p>
      </footer>
    </div>
  );
}
