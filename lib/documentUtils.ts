type DocumentExtractResult = {
  text: string;
  metadata?: {
    fileName: string;
    fileType: string;
    extractedAt: Date;
  };
};

const SUPPORTED_EXTENSIONS = {
  text: ['txt'],
  pdf: ['pdf'],
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  video: ['mp4', 'webm', 'mov', 'avi'],
  audio: ['mp3', 'wav', 'ogg', 'm4a']
};

function getFileType(extension: string): string {
  for (const [type, extensions] of Object.entries(SUPPORTED_EXTENSIONS)) {
    if (extensions.includes(extension)) {
      return type;
    }
  }
  return 'unknown';
}

export async function extractTextFromFile(file: Buffer, fileName: string): Promise<DocumentExtractResult> {
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  const fileType = getFileType(fileExtension);
  
  const metadata = {
    fileName,
    fileType,
    extractedAt: new Date(),
  };

  try {
    let text = '';

    switch (fileType) {
      case 'text': {
        text = file.toString('utf-8');
        break;
      }
      case 'pdf':
      case 'image':
      case 'video':
      case 'audio': {
        // ファイルをそのまま渡す
        text = `[${fileType.toUpperCase()} FILE] ${fileName}`;
        break;
      }
      default:
        throw new Error(`未対応のファイル形式です: ${fileExtension}`);
    }

    return {
      text,
      metadata
    };
  } catch (error) {
    console.error(`ファイル処理エラー (${fileExtension}):`, error);
    throw new Error(`${metadata.fileType}ファイルの処理に失敗しました`);
  }
}
