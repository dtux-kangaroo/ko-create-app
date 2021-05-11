/*
 * @Author: lenlen
 * @Date: 2020-12-07 11:53:19
 * @LastEditTime: 2020-12-07 14:13:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ko-create-app\packages\ko-util\src\tools.ts
 */


/**
 * 文件下载
 * @param fileName 文件名
 * @param data 数据流
 * @param contenType mime类型 
 */
export function downloadFile(
  fileName: string,
  data: BlobPart,
  contenType: string
) {
  const blob = new Blob([data], { type: contenType });

  if (window.navigator.msSaveBlob) {
    try {
      window.navigator.msSaveBlob(blob, fileName);
    } catch (e) {
      console.error(e);
    }
  } else {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = 'none';
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
