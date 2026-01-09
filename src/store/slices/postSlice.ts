import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '@/types';
import * as postAPI from '@/services/postService';

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: PostState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
};

// Async thunks
export const fetchFeed = createAsyncThunk(
  'posts/fetchFeed',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await postAPI.getFeed(page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feed');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: FormData, { rejectWithValue }) => {
    try {
      const response = await postAPI.createPost(postData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await postAPI.likePost(postId);
      return { postId, data: response };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postAPI.deletePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

// Slice
const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(p => p._id !== action.payload);
    },
    toggleLike: (state, action: PayloadAction<{ postId: string; userId: string }>) => {
      const post = state.posts.find(p => p._id === action.payload.postId);
      if (post) {
        const likeIndex = post.likes.indexOf(action.payload.userId);
        if (likeIndex > -1) {
          post.likes.splice(likeIndex, 1);
          post.likesCount--;
        } else {
          post.likes.push(action.payload.userId);
          post.likesCount++;
        }
      }
    },
    incrementCommentCount: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p._id === action.payload);
      if (post) {
        post.commentsCount++;
      }
    },
    clearPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
      // Fetch Feed
    builder.addCase(fetchFeed.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFeed.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.page === 1) {
        state.posts = action.payload.data;
      } else {
        state.posts = [...state.posts, ...action.payload.data];
      }
      state.page = action.payload.page;
      state.hasMore = action.payload.data.length > 0;
    });
    builder.addCase(fetchFeed.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Post
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.unshift(action.payload);
    });

    // Like Post
    builder.addCase(likePost.fulfilled, (state, action) => {
      const post = state.posts.find(p => p._id === action.payload.postId);
      if (post) {
        post.likes = action.payload.data.likes;
        post.likesCount = action.payload.data.likesCount;
      }
    });

    // Delete Post
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.posts = state.posts.filter(p => p._id !== action.payload);
    });
  },
});

export const {
  addPost,
  updatePost,
  removePost,
  toggleLike,
  incrementCommentCount,
  clearPosts,
} = postSlice.actions;

export default postSlice.reducer;
