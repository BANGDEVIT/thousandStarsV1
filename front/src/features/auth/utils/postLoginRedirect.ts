/** Đường dẫn mặc định sau đăng nhập theo role từ API. */
export function getPostLoginPath(roles: string[]): string {
  if (roles.includes("admin") || roles.includes("manager")) {
    return "/admin";
  }
  if (roles.includes("staff")) {
    return "/employee";
  }
  return "/profile";
}

/** Ưu tiên trang user định vào trước khi bị chặn (ProtectedRoute). */
export function resolvePostLoginPath(
  roles: string[],
  fromPath?: string,
): string {
  if (
    fromPath &&
    fromPath !== "/signin" &&
    fromPath !== "/login" &&
    !fromPath.startsWith("/signup") &&
    !fromPath.startsWith("/register")
  ) {
    return fromPath;
  }
  return getPostLoginPath(roles);
}

export function displayNameFromEmail(email?: string): string {
  if (!email) return "Khách";
  const local = email.split("@")[0] ?? email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}
