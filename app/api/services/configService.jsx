import { makeAuthenticatedRequest } from '../utils.ts';
import { API_URLS } from '../config.ts';

export const configService = {
    updateBiometricStatus: (userId, biometricRequest) => {
        return makeAuthenticatedRequest(API_URLS.ACCOUNTSETTING.UPDATE_BIOMETRIC_STATUS(userId), 'POST', biometricRequest);
    },

    updateSessionTimeout: (userId, sessionData) => {
        return makeAuthenticatedRequest(API_URLS.ACCOUNTSETTING.UPDATE_SESSION_TIMEOUT(userId), 'PUT', sessionData);
    },

    updateNotificationSettings: (userId, notificationData) => {
        return makeAuthenticatedRequest(API_URLS.ACCOUNTSETTING.UPDATE_NOTIFICATION_SETTINGS(userId), 'PUT', notificationData);
    },

    updatePreferences: (userId, preferences) => {
        return makeAuthenticatedRequest(API_URLS.ACCOUNTSETTING.UPDATE_PREFERENCES(userId), 'PUT', preferences);
    },
}

export default configService;