export interface AccessTokenInfo {
  accessToken?: string;
  sessionKey?: string;
  expiresIn: number;
  getTime: number;
  openid: string;
}
export interface SessionKeyInfo {
  sessionKey: string;
  expiresIn: number;
  getTime: number;
  openid: string;
}

export interface AccessConfig {
  access_token: string;
  session_key: string;
  refresh_token: string;
  openid: string;
  scope: string;
  unionid?: string;
  expires_in: number;
}

export interface WechatError {
  errcode: number;
  errmsg: string;
}

export interface WechatUserInfo {
  openid: string;
  username: string;
  nickname: string;
  nickName: string;
  sex: number;
  language: string;
  city: string;
  province: string;
  country: string;
  avatarUrl: string;
  privilege: string[];
  unionid: string;
}
