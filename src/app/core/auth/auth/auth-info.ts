export interface LoginRequestInfo {
  userName: string;
  password: string;
}

export interface SignupRequestInfo extends LoginRequestInfo {
  fullName?: string;
}

export interface LoginResponseInfo {
  token: string;
}

export interface UserProfileInfo {
  fullName: string;
  initials: string;
}
