import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';
import messageReducer from './slices/messageSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';
import callReducer from './slices/callSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    messages: messageReducer,
    notifications: notificationReducer,
    ui: uiReducer,
    call: callReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['call/setStream', 'call/setPeerConnection'],
        ignoredPaths: ['call.localStream', 'call.remoteStream', 'call.peerConnection'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


