/**
 * 认证相关的工具函数
 */

// Token 存储的键名
const TOKEN_KEY = 'token';

// 用户信息存储的键名
const USER_INFO_KEY = 'userInfo';

/**
 * 获取 Token
 * @returns {string|null} 存储的 token
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 设置 Token
 * @param {string} token - 要存储的 token
 */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * 移除 Token
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息对象
 */
export function getUserInfo() {
  const userInfoStr = localStorage.getItem(USER_INFO_KEY);
  return userInfoStr ? JSON.parse(userInfoStr) : null;
}

/**
 * 设置用户信息
 * @param {Object} userInfo - 用户信息对象
 */
export function setUserInfo(userInfo) {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
}

/**
 * 移除用户信息
 */
export function removeUserInfo() {
  localStorage.removeItem(USER_INFO_KEY);
}

/**
 * 检查是否已登录
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn() {
  return !!getToken();
}

/**
 * 执行登出操作
 */
export function logout() {
  removeToken();
  removeUserInfo();
}