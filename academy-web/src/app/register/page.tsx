"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COURSES = [
  "Robotics Engineering",
  "Artificial Intelligence",
  "Autonomous Systems",
  "IoT & Smart Devices",
  "Mechanical Design",
  "Coding & AI Apps",
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    age: "", parentName: "", city: "", interestedCourse: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, age: Number(form.age) }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
    } else {
      setError(data.error ?? "Registration failed");
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">You&apos;re Registered!</h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            Welcome to kidslab.lk! Our team will contact you shortly to confirm
            your enrolment and share class details.
          </p>
          <a href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 font-semibold">
              Back to Home
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 py-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </a>
          <div className="inline-flex w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 items-center justify-center shadow-md mb-4 overflow-hidden">
            <Image src="/logo.png" alt="kidslab.lk" width={56} height={56} className="object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Join kidslab.lk</h1>
          <p className="text-slate-500 mt-2">Register your child for our AI &amp; Robotics programs</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Student Full Name *
                </Label>
                <Input placeholder="Kavindu Perera" className="border-slate-200 text-sm h-11" value={form.name} onChange={set("name")} required />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Email *</Label>
                <Input type="email" placeholder="you@email.com" className="border-slate-200 text-sm h-11" value={form.email} onChange={set("email")} required />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Password *</Label>
                <Input type="password" placeholder="••••••••" className="border-slate-200 text-sm h-11" value={form.password} onChange={set("password")} required />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Phone Number</Label>
                <Input placeholder="07X XXX XXXX" className="border-slate-200 text-sm h-11" value={form.phone} onChange={set("phone")} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Student Age</Label>
                <Input type="number" placeholder="12" min={5} max={20} className="border-slate-200 text-sm h-11" value={form.age} onChange={set("age")} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Parent / Guardian Name</Label>
                <Input placeholder="Sunil Perera" className="border-slate-200 text-sm h-11" value={form.parentName} onChange={set("parentName")} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">City / District</Label>
                <Input placeholder="Galle" className="border-slate-200 text-sm h-11" value={form.city} onChange={set("city")} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Interested Program
                </Label>
                <select
                  value={form.interestedCourse}
                  onChange={set("interestedCourse")}
                  className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a program…</option>
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-full text-[15px] tracking-[-0.01em] shadow-md shadow-blue-100"
            >
              {loading ? "Registering…" : "Complete Registration"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Conducted by Computer Engineers · University of Ruhuna, Faculty of Engineering
        </p>
      </div>
    </div>
  );
}
