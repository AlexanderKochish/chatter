export const fileToArrayBufferPayload = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  return {
    name: file.name,
    type: file.type,
    buffer: Array.from(new Uint8Array(arrayBuffer)),
  };
};
