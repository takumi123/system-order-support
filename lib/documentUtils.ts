export async function readFileContent(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);
    return text;
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('ファイルの読み込みに失敗しました');
  }
}
