import { create } from "zustand";

// 画像データの型定義
export interface ImageData {
  id: string;
  image: {
    originalImage: string; // base64エンコードされた画像データ
    processedImage: string | null; // crop, resizeされた画像データ（base64）
  };
}

// ストアの状態の型定義
interface ImageStoreState {
  images: ImageData[];
  addImage: (originalImage: string) => void;
  updateProcessedImage: (id: string, processedImage: string) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  getImageById: (id: string) => ImageData | undefined;
}

// 一意のIDを生成する関数
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Zustandストアの作成
export const useImageStore = create<ImageStoreState>((set, get) => ({
  // 初期状態
  images: [],

  // 新しい画像を追加
  addImage: (originalImage: string) => {
    const newImage: ImageData = {
      id: generateId(),
      image: {
        originalImage,
        processedImage: null,
      },
    };

    set((state) => ({
      images: [...state.images, newImage],
    }));
  },

  // 処理済み画像を更新
  updateProcessedImage: (id: string, processedImage: string) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? {
              ...img,
              image: {
                ...img.image,
                processedImage,
              },
            }
          : img
      ),
    }));
  },

  // 画像を削除
  removeImage: (id: string) => {
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    }));
  },

  // すべての画像をクリア
  clearImages: () => {
    set({ images: [] });
  },

  // IDで画像を取得
  getImageById: (id: string) => {
    return get().images.find((img) => img.id === id);
  },
}));
