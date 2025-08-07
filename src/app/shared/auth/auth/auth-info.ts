export interface LoginRequestInfo {
  userName: string;
  password: string;
}

export interface LoginResponseInfo {
  token: string;
}

export interface UserProfileInfo {
  fullName: string;
  initials: string;
}
