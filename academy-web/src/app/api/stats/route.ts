import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import User from "@/models/User";
import Course from "@/models/Course";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const [totalUsers, totalCourses, activeCourses, recentUsers] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Course.countDocuments(),
    Course.countDocuments({ isActive: true }),
    User.find({ role: "user" }).select("-password").sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return NextResponse.json({ totalUsers, totalCourses, activeCourses, recentUsers });
}
