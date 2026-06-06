export function getRoleHomePath(roles: string[]) {
  if (roles.some((role) => ["manager", "admin"].includes(role))) {
    return "/admin";
  }

  if (roles.includes("staff")) {
    return "/staff";
  }

  return "/profile";
}
