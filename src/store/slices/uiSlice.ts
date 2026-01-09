import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  createPostModalOpen: boolean;
  imageViewerOpen: boolean;
  imageViewerImages: string[];
  imageViewerIndex: number;
  isMobile: boolean;
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: true,
  createPostModalOpen: false,
  imageViewerOpen: false,
  imageViewerImages: [],
  imageViewerIndex: 0,
  isMobile: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
        document.documentElement.classList.toggle('dark', action.payload === 'dark');
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
        document.documentElement.classList.toggle('dark', state.theme === 'dark');
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    openCreatePostModal: (state) => {
      state.createPostModalOpen = true;
    },
    closeCreatePostModal: (state) => {
      state.createPostModalOpen = false;
    },
    openImageViewer: (state, action: PayloadAction<{ images: string[]; index: number }>) => {
      state.imageViewerOpen = true;
      state.imageViewerImages = action.payload.images;
      state.imageViewerIndex = action.payload.index;
    },
    closeImageViewer: (state) => {
      state.imageViewerOpen = false;
      state.imageViewerImages = [];
      state.imageViewerIndex = 0;
    },
    setImageViewerIndex: (state, action: PayloadAction<number>) => {
      state.imageViewerIndex = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  toggleSidebar,
  setSidebarOpen,
  openCreatePostModal,
  closeCreatePostModal,
  openImageViewer,
  closeImageViewer,
  setImageViewerIndex,
  setIsMobile,
} = uiSlice.actions;

export default uiSlice.reducer;
