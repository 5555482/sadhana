import { apiFetch } from "./client";

export type AuthUser = {
  id: string;
  email: string;
  token: string;
  name: string;
};

export type UserInfoWrapper = {
  user: AuthUser;
};

export type LoginInfo = {
  email: string;
  password: string;
};

export type LoginInfoWrapper = {
  user: LoginInfo;
};

export type RegisterInfo = {
  confirmation_id: string;
  email: string;
  password: string;
  name: string;
  lang: string;
};

export type ConfirmationType = "Registration" | "PasswordReset";

export type SendConfirmationLink = {
  email: string;
  confirmation_type: ConfirmationType;
  server_address: string;
};

export function login(credentials: LoginInfo) {
  return apiFetch<UserInfoWrapper>("/users/login", {
    method: "POST",
    body: JSON.stringify({ user: credentials } satisfies LoginInfoWrapper)
  });
}

export function currentUser() {
  return apiFetch<UserInfoWrapper>("/user");
}

export function sendConfirmationLink(data: SendConfirmationLink) {
  return apiFetch<void>("/users/confirmation", {
    method: "POST",
    body: JSON.stringify({ data })
  });
}

export function register(user: RegisterInfo) {
  return apiFetch<UserInfoWrapper>("/users", {
    method: "POST",
    body: JSON.stringify({ user })
  });
}

export function resetPassword(confirmationId: string, password: string) {
  return apiFetch<void>("/password-reset", {
    method: "PUT",
    body: JSON.stringify({
      data: {
        confirmation_id: confirmationId,
        password
      }
    })
  });
}
