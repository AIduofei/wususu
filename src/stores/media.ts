import { create } from 'zustand';
import type { MediaItem } from '@/services/api';
import { getMedia } from '@/services/api';

interface MediaState {
  images: MediaItem[];
  videos: MediaItem[];
  loading: boolean;
  fetchMedia: () => Promise<void>;
  addImages: (items: MediaItem[]) => void;
  addVideos: (items: MediaItem[]) => void;
  removeImage: (id: string) => void;
  removeVideo: (id: string) => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  images: [],
  videos: [],
  loading: false,
  
  fetchMedia: async () => {
    set({ loading: true });
    try {
      const [imgRes, vidRes] = await Promise.all([
        getMedia('image'),
        getMedia('video'),
      ]);
      set({
        images: imgRes.success ? imgRes.items : [],
        videos: vidRes.success ? vidRes.items : [],
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
  
  addImages: (items) => set((state) => ({
    images: [...items, ...state.images],
  })),
  
  addVideos: (items) => set((state) => ({
    videos: [...items, ...state.videos],
  })),
  
  removeImage: (id) => set((state) => ({
    images: state.images.filter(i => i.id !== id),
  })),
  
  removeVideo: (id) => set((state) => ({
    videos: state.videos.filter(i => i.id !== id),
  })),
}));
