// api/services/userService.js
import { makeAuthenticatedRequest } from '../utils.ts';
import { API_URLS } from '../config.ts';

export const userService = {
    getAll: () => {
        return makeAuthenticatedRequest(API_URLS.USER.BASE, 'GET');
    },
    
    getById: (id) => {
        return makeAuthenticatedRequest(API_URLS.USER.BY_ID(id), 'GET');
    },
    
    updateProfile: (userData, id) => {
        return makeAuthenticatedRequest(API_URLS.USER.PROFILE(id), 'PUT', userData);
    },

    updateUserPassword:(userData) => {
        return makeAuthenticatedRequest(API_URLS.USER.UPDATE_PASSWORD, 'PUT', userData);
    },
    
    updatePreferences: (userId, preferences) => {
        return makeAuthenticatedRequest(API_URLS.USER.UPDATE_PREFERENCES(userId), 'PUT', preferences);
    },

    sendAccountStatement:(id, email, statement) => {
        return makeAuthenticatedRequest(API_URLS.USER.SENDACCOUNTSTATEMENT(id, email), 'POST', statement);
    },

    update2FAStatus: (userId, twoFARequest) => {
        return makeAuthenticatedRequest(API_URLS.USER.UPDATE2FASTATUS(), 'POST', twoFARequest);
    },

    uploadProfileImage: (formData, id) => {
        return makeAuthenticatedRequest(API_URLS.USER.UPLOAD_PROFILE_IMAGE(id), 'POST', formData);
    },

    updateBiometricStatus: (userId, biometricRequest) => {
        return makeAuthenticatedRequest(API_URLS.USER.UPDATE_BIOMETRIC_STATUS(userId), 'POST', biometricRequest);
    },

    updateSessionTimeout: (userId, sessionData) => {
        return makeAuthenticatedRequest(API_URLS.USER.UPDATE_SESSION_TIMEOUT(userId), 'PUT', sessionData);
    },

    updateNotificationSettings: (userId, notificationData) => {
        return makeAuthenticatedRequest(API_URLS.USER.UPDATE_NOTIFICATION_SETTINGS(userId), 'PUT', notificationData);
    },

    changePassword: (userId, passwordData) => {
        return makeAuthenticatedRequest(API_URLS.USER.UPDATE_PASSWORD(), 'PUT', passwordData);
    },
    
};

export default userService;