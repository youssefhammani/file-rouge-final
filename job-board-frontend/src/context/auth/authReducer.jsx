// src/context/auth/authReducer.js
const authReducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
            };
        case 'REGISTER_SUCCESS':
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
            };
        case 'REGISTER_FAIL':
        case 'LOGIN_FAIL':
        case 'AUTH_ERROR':
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: action.payload,
            };
        case 'UPDATE_PROFILE_SUCCESS':
            return {
                ...state,
                user: action.payload,
                loading: false,
            };
        case 'UPDATE_PROFILE_FAIL':
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case 'CLEAR_ERRORS':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export default authReducer;
