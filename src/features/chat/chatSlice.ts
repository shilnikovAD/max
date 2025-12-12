import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: number;
  tutorId: number;
  studentId: number;
  tutorName: string;
  studentName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

interface ChatState {
  conversations: Conversation[];
  messages: Record<number, ChatMessage[]>;
  currentConversationId: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  currentConversationId: null,
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Mock данные
    const conversations: Conversation[] = [];
    return conversations;
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId: number) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Mock данные
    const messages: ChatMessage[] = [];
    return { conversationId, messages };
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (data: { conversationId: number; text: string; senderId: number; senderName: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const message: ChatMessage = {
      id: Date.now(),
      conversationId: data.conversationId,
      senderId: data.senderId,
      senderName: data.senderName,
      text: data.text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    return message;
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (data: { tutorId: number; studentId: number; tutorName: string; studentName: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const conversation: Conversation = {
      id: Date.now(),
      tutorId: data.tutorId,
      studentId: data.studentId,
      tutorName: data.tutorName,
      studentName: data.studentName,
      unreadCount: 0,
    };

    return conversation;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversationId = action.payload;
    },
    clearCurrentConversation: (state) => {
      state.currentConversationId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch conversations';
      })
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages[action.payload.conversationId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch messages';
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const conversationId = action.payload.conversationId;
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(action.payload);

        // Update conversation last message
        const conversation = state.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.lastMessage = action.payload.text;
          conversation.lastMessageTime = action.payload.timestamp;
        }
      })
      // Create conversation
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.push(action.payload);
        state.currentConversationId = action.payload.id;
        state.messages[action.payload.id] = [];
      });
  },
});

export const { setCurrentConversation, clearCurrentConversation } = chatSlice.actions;
export default chatSlice.reducer;

