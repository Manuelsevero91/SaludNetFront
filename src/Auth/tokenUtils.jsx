export const setToken = (access_token) => {
    localStorage.setItem('token', access_token);
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  export const removeToken = () => {
    localStorage.removeItem('token');
  };