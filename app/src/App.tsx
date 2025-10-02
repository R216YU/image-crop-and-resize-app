import { Box, Button } from "@chakra-ui/react";

import FileUploadArea from "@/components/FileUploadArea";
import ImageTrimmingArea from "@/components/ImageTrimmingArea";
import ImageResizeForm from "@/components/ImageResizeForm";
import ImageHistory from "@/components/ImageHistory";

function App() {
  return (
    <Box>
      {/* ファイルアップロードエリア */}
      <FileUploadArea />

      {/* 画像トリミングエリア */}
      <ImageTrimmingArea />

      {/* 画像リサイズフォーム */}
      <ImageResizeForm />

      <Box>
        <Button variant={"solid"}>保存する</Button>
      </Box>

      {/* 画像履歴 */}
      <ImageHistory />
    </Box>
  );
}

export default App;
