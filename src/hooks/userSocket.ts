import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import socketService from '@/lib/socket';
import { addMessage, addTypingUser, removeTypingUser, markAsRead } from '@/store/slices/messageSlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { setIncomingCall } from '@/store/slices/callSlice';

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (token && user) {
      // Connect to socket
      socketService.connect(token);

      // Message events
      socketService.on('new-message', (message) => {
        dispatch(addMessage(message));
      });

      socketService.on('typing-start', ({ conversationId, userId }) => {
        dispatch(addTypingUser({ conversationId, userId }));
      });

      socketService.on('typing-stop', ({ conversationId, userId }) => {
        dispatch(removeTypingUser({ conversationId, userId }));
      });

      socketService.on('message-read', ({ conversationId }) => {
        dispatch(markAsRead(conversationId));
      });

      // Notification events
      socketService.on('new-notification', (notification) => {
        dispatch(addNotification(notification));
      });

      // Call events
      socketService.on('incoming-call', ({ callId, from, offer, callType }) => {
        dispatch(setIncomingCall({
          callId,
          from,
          offer,
          type: callType,
        }));
      });

      // Cleanup
      return () => {
        socketService.disconnect();
      };
    }
  }, [token, user, dispatch]);

  return socketService;
};
