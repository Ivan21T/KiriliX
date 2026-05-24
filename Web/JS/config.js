window.API_CONFIG = {
    USER: 'http://ittashev-001-site1.rtempurl.com/users',
    ADMIN: 'http://ittashev-001-site1.rtempurl.com/admins',
    POST: 'http://ittashev-001-site1.rtempurl.com/posts',
    COMMENT: 'http://ittashev-001-site1.rtempurl.com/comments',
    NEWS: 'http://ittashev-001-site1.rtempurl.com/news'
};

window.Validation = {
    USERNAME_MIN_LENGTH: 3,
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    ALLOWED_DOMAINS: ['gmail.com', 'yahoo.com', 'outlook.com', 'protonmail.com', 'proton.me'],
    TITLE_MIN_LENGTH: 3,
    CONTENT_MIN_LENGTH: 10,

    isValidEmailDomain: function (email) {
        if (!email) return false;
        const emailDomain = email.split('@')[1]?.toLowerCase();
        return emailDomain && this.ALLOWED_DOMAINS.includes(emailDomain);
    },
    isValidPassword: function (password) {
        return this.PASSWORD_REGEX.test(password);
    }
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
        window.location.href = 'login.html';
    }

    return response;
};
const updateAuthToken = (newToken) => {
    authToken = newToken;
    if (newToken) {
        localStorage.setItem('authToken', newToken);
    } else {
        localStorage.removeItem('authToken');
    }
};