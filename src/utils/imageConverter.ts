/**
 * 画像ファイルをbase64エンコードして返す
 * @param image
 * @returns base64エンコードされた画像データ
 */
export const convertImageToBase64 = async (image: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * base64エンコードされた画像データを画像ファイルに変換して返す
 * @param base64 base64エンコードされた画像データ
 * @returns 画像ファイル
 */
export const convertBase64ToImage = async (base64: string): Promise<Blob> => {
  return new Promise((resolve) => {
    // base64文字列からBlobを作成
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    resolve(blob);
  });
};
