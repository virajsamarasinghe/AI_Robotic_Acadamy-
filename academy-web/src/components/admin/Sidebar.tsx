"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Users, BookOpen, LogOut, Bot,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",       href: "/admin",         icon: LayoutDashboard },
  { label: "Users",           href: "/admin/users",   icon: Users },
  { label: "Courses",         href: "/admin/courses", icon: BookOpen },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-slate-900 flex flex-col z-40">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
          <Image src="/logo.png" alt="logo" width={32} height={32} className="object-contain" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none tracking-tight">
            kidslab<span className="text-blue-400">.lk</span>
          </p>
          <p className="text-slate-500 text-[10px] mt-0.5 font-medium tracking-widest uppercase">Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
