import xhrClient from './xhrClient';
import authService from './services/authService';
import depositService from './services/depositService';
import userService from './services/userService';
import paymentService from './services/paymentService';
import walletService from './services/walletService';
import bankCollectionService from './services/bankCollectionList';
import withdrawService from './services/withdrawService';
import historyService from './services/historyService';

// Re-export utilities and config
export * from './utils';
export * from './config';

// Export individual services
export {
  xhrClient,
  authService,
  depositService,
  userService,
  paymentService,
  walletService,
  bankCollectionService,
  withdrawService,
  historyService,
};

// Default export as a grouped object
const api = {
  xhrClient,
  authService,
  depositService,
  userService,
  paymentService,
  walletService,
  bankCollectionService,
  withdrawService,
  historyService,
};

export default api;