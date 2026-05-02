import mongoose from "mongoose";
import { LocalUser } from "./user.helper";

export const ownerOrAdmin = (postUserId: unknown, me: LocalUser): boolean => {
  // Import isAdmin từ user.helper để dùng
  const title = me.role?.title?.toLowerCase();
  const isAdmin = title === "admin" || (me.role?.permissions ?? []).some((p) => p.toLowerCase() === "admin" || p === "manage_users");
  
  if (isAdmin) return true;
  
  const uid =
    postUserId &&
    typeof postUserId === "object" &&
    postUserId !== null &&
    "_id" in postUserId
      ? String((postUserId as { _id: mongoose.Types.ObjectId })._id)
      : String(postUserId);
  return uid === String(me._id);
};
