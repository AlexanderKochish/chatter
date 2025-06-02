export const handleDownloadImage = (url: string) => {
  const downloadUrl = url.includes("/upload/")
    ? url.replace("/upload/", "/upload/fl_attachment/")
    : url;
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = downloadUrl.split("/").pop() ?? "image.jpg";
  link.click();
};
