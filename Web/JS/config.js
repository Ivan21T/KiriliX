window.API_CONFIG = {
  USER: 'https://localhost:7090/users',
  ADMIN:'https://localhost:7090/admin',
  POST:'https://localhost:7090/post',
  COMMENT:'https://localhost:7090/comment',
  NEWS:'https://localhost:7090/news'
};

let authToken = localStorage.getItem('authToken');

const authFetch = async (url, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        authToken = null;
        window.location.href = '../HTML/login.html';
    }
    
    return response;
};