import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  convertImageToBase64,
  convertBase64ToImage,
} from "../../utils/imageConverter";

describe("imageConverter", () => {
  // FileReaderのモック
  let mockFileReader: {
    readAsDataURL: ReturnType<typeof vi.fn>;
    onload: (() => void) | null;
    onerror: ((error: unknown) => void) | null;
    result: string | null;
  };

  beforeEach(() => {
    // FileReaderのモックを作成
    mockFileReader = {
      readAsDataURL: vi.fn(),
      onload: null,
      onerror: null,
      result: null,
    };

    // FileReaderのグローバルモック
    (globalThis as { FileReader: typeof FileReader }).FileReader = vi
      .fn()
      .mockImplementation(() => mockFileReader) as unknown as typeof FileReader;
  });

  describe("convertImageToBase64", () => {
    it("画像ファイルをbase64エンコードできる", async () => {
      // テスト用のFileオブジェクトを作成
      const mockFile = new File(["test image data"], "test.jpg", {
        type: "image/jpeg",
      });

      // 成功時のモック結果を設定
      const expectedBase64 = "data:image/jpeg;base64,dGVzdCBpbWFnZSBkYXRh";
      mockFileReader.result = expectedBase64;

      // readAsDataURLが呼ばれた時にonloadを実行するように設定
      mockFileReader.readAsDataURL.mockImplementation(() => {
        // 非同期でonloadを実行
        setTimeout(() => {
          if (mockFileReader.onload) {
            mockFileReader.onload();
          }
        }, 0);
      });

      const result = await convertImageToBase64(mockFile);

      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
      expect(result).toBe(expectedBase64);
    });

    it("FileReaderでエラーが発生した場合、エラーを投げる", async () => {
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const mockError = new Error("FileReader error");

      mockFileReader.readAsDataURL.mockImplementation(() => {
        // 非同期でonerrorを実行
        setTimeout(() => {
          if (mockFileReader.onerror) {
            mockFileReader.onerror(mockError);
          }
        }, 0);
      });

      await expect(convertImageToBase64(mockFile)).rejects.toThrow(
        "FileReader error"
      );
    });

    it("異なる画像形式でも正しく動作する", async () => {
      const mockFile = new File(["png data"], "test.png", {
        type: "image/png",
      });
      const expectedBase64 = "data:image/png;base64,cG5nIGRhdGE=";
      mockFileReader.result = expectedBase64;

      mockFileReader.readAsDataURL.mockImplementation(() => {
        setTimeout(() => {
          if (mockFileReader.onload) {
            mockFileReader.onload();
          }
        }, 0);
      });

      const result = await convertImageToBase64(mockFile);

      expect(result).toBe(expectedBase64);
    });
  });

  describe("convertBase64ToImage", () => {
    it("base64エンコードされた画像データをBlobに変換できる", async () => {
      const base64Data = "data:image/jpeg;base64,dGVzdCBpbWFnZSBkYXRh";
      const expectedMimeType = "image/jpeg";
      const expectedData = "test image data";

      const result = await convertBase64ToImage(base64Data);

      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe(expectedMimeType);
      expect(result.size).toBe(expectedData.length);
    });

    it("異なるMIMEタイプでも正しく処理される", async () => {
      const base64Data = "data:image/png;base64,cG5nIGRhdGE=";
      const expectedMimeType = "image/png";

      const result = await convertBase64ToImage(base64Data);

      expect(result.type).toBe(expectedMimeType);
    });

    it("MIMEタイプが指定されていない場合、空文字列になる", async () => {
      const base64Data = "data:;base64,dGVzdCBpbWFnZSBkYXRh"; // MIMEタイプなし

      const result = await convertBase64ToImage(base64Data);

      expect(result.type).toBe("");
    });

    it("無効なbase64データの場合はエラーを投げる", async () => {
      const invalidBase64 = "data:image/jpeg;base64,invalid-base64-data";

      // 無効なbase64の場合はエラーを投げることを確認
      await expect(convertBase64ToImage(invalidBase64)).rejects.toThrow();
    });
  });

  describe("統合テスト", () => {
    it("画像ファイルをbase64に変換し、再びBlobに変換できる", async () => {
      // テスト用のFileオブジェクトを作成
      const originalFile = new File(["test image data"], "test.jpg", {
        type: "image/jpeg",
      });

      // 成功時のモック結果を設定
      const expectedBase64 = "data:image/jpeg;base64,dGVzdCBpbWFnZSBkYXRh";
      mockFileReader.result = expectedBase64;

      mockFileReader.readAsDataURL.mockImplementation(() => {
        setTimeout(() => {
          if (mockFileReader.onload) {
            mockFileReader.onload();
          }
        }, 0);
      });

      // File → Base64
      const base64Result = await convertImageToBase64(originalFile);
      expect(base64Result).toBe(expectedBase64);

      // Base64 → Blob
      const blobResult = await convertBase64ToImage(base64Result);
      expect(blobResult).toBeInstanceOf(Blob);
      expect(blobResult.type).toBe("image/jpeg");
    });

    it("実際のテスト画像ファイルを使用したテスト", async () => {
      // テスト用画像ファイルを直接Fileオブジェクトとして作成
      const testImageData = new Uint8Array([255, 216, 255, 224]); // JPEGヘッダー
      const testFile = new File([testImageData], "image_for_test.jpg", {
        type: "image/jpeg",
      });

      // 成功時のモック結果を設定（実際のbase64データをシミュレート）
      const mockBase64 =
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";
      mockFileReader.result = mockBase64;

      mockFileReader.readAsDataURL.mockImplementation(() => {
        setTimeout(() => {
          if (mockFileReader.onload) {
            mockFileReader.onload();
          }
        }, 0);
      });

      // File → Base64
      const base64Result = await convertImageToBase64(testFile);
      expect(base64Result).toMatch(/^data:image\/jpeg;base64,/);

      // Base64 → Blob
      const blobResult = await convertBase64ToImage(base64Result);
      expect(blobResult).toBeInstanceOf(Blob);
      expect(blobResult.type).toBe("image/jpeg");
    });
  });
});
