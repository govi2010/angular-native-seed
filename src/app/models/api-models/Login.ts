export interface SignUpWithPassword {
  email: string;
  password: string;
  mobileNo: string;
}

export interface LoginWithPassword {
  uniqueKey: string;
  password: string;
}

export class ResetPasswordV2 {
  verificationCode: string;
  uniqueKey: string;
  newPassword: string;
}
