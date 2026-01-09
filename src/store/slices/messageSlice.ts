import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, Message } from '@/types';
import * as messageAPI from '@/services/messageService';

interface MessageState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  typingUsers: { [conversationId: string]: string[] };
}

const initialState: MessageState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  typingUsers: {},
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await messageAPI.getConversations();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await messageAPI.getMessages(conversationId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (
    { conversationId, content, attachments }: { conversationId: string; content: string; attachments?: File[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await messageAPI.sendMessage(conversationId, content, attachments);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);
// Slice
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const existingIndex = state.messages.findIndex(m => m._id === action.payload._id);
      if (existingIndex === -1) {
        state.messages.push(action.payload);
      }
      
      // Update conversation last message
      const conversation = state.conversations.find(
        c => c._id === action.payload.conversation
      );
      if (conversation) {
        conversation.lastMessage = action.payload;
      }
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const index = state.messages.findIndex(m => m._id === action.payload._id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    deleteMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(m => m._id !== action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(c => c._id === action.payload);
      if (conversation) {
        conversation.unreadCount = 0;
      }
      
      state.messages.forEach(message => {
        if (message.conversation === action.payload) {
          message.isRead = true;
        }
      });
    },
    addTypingUser: (state, action: PayloadAction<{ conversationId: string; userId: string }>) => {
      const { conversationId, userId } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      if (!state.typingUsers[conversationId].includes(userId)) {
        state.typingUsers[conversationId].push(userId);
      }
    },
    removeTypingUser: (state, action: PayloadAction<{ conversationId: string; userId: string }>) => {
      const { conversationId, userId } = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(
          id => id !== userId
        );
      }
    },
    incrementUnreadCount: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(c => c._id === action.payload);
      if (conversation) {
        conversation.unreadCount++;
      }
    },
    clearMessages: (state) => {
      state.messages = [];
      state.currentConversation = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Conversations
    builder.addCase(fetchConversations.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.isLoading = false;
      state.conversations = action.payload;
    });
    builder.addCase(fetchConversations.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Messages
    builder.addCase(fetchMessages.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.messages = action.payload;
    });
    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Send Message
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.messages.push(action.payload);
    });
  },
});

export const {
  setCurrentConversation,
  addMessage,
  updateMessage,
  deleteMessage,
  markAsRead,
  addTypingUser,
  removeTypingUser,
  incrementUnreadCount,
  clearMessages,
} = messageSlice.actions;

export default messageSlice.reducer;
