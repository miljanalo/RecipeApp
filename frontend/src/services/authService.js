export const getToken = () => {
    return localStorage.getItem('token') ||
           sessionStorage.getItem('token');
};

export const getUser = () => {
    const user =
        localStorage.getItem('user') ||
        sessionStorage.getItem('user');

    return user ? JSON.parse(user) : null;
};

export const saveUser = (user) => {
  if (localStorage.getItem('token')) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    sessionStorage.setItem('user', JSON.stringify(user));
  }
};

export const clearAuthStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
};

export const logout = () => {
    clearAuthStorage();
};

export const saveAuth = (token, user, remember) => {
  clearAuthStorage();

  if (remember) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
  }
};