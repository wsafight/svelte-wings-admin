/**
 * 下载文件
 * @param urlOrFilename
 * @param content
 * @param mime
 */
export default function downloadFile(
  urlOrFilename: string,
  content?: BlobPart,
  mime?: string,
  bom?: string) {
  // 如果传递第二个参数，走下载流,否则直接请求 url
  if (content) {
    downloadContent(content, urlOrFilename, mime, bom)
  } else {
    downloadUrl(urlOrFilename)
  }
}

function downloadUrl(url: string) {
  let el: any = document.getElementById('iframeForDownload') as HTMLElement
  if (!el) {
    el = document.createElement('iframe')
    el.id = 'iframeForDownload'
    el.style.width = 0
    el.style.height = 0
    el.style.position = 'absolute'
    document.body.appendChild(el)
  }
  el.src = url
}

/**
 * https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
 * @param filename
 * @param content
 * @param mime
 */
function downloadContent(data:  string | ArrayBuffer | ArrayBufferView | Blob,
                         filename: string,
                         mime?: string,
                         bom?: string) {
  // 如果当前 bom 为 null, IE 11 报错
  const blobData = (typeof bom !== 'undefined') ? [bom, data] : [data]
  const blob = new Blob(blobData, {
    // 当前没有指定类型，直接使用任意格式
    type: mime || 'application/octet-stream'
  });

  // IE9 以上的 IE 浏览器都会报一个 request URI too large 的错误, 直接使用 msSaveBlob
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    // 兼容 webkitURL
    const blobURL = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);

    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);

    // 当前浏览器不支持 h5 download，打开
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempLink);
    tempLink.click();

    // 修复移动端 safari 浏览器下载 bug "webkit blob resource error 1"
    setTimeout(function () {
      document.body.removeChild(tempLink);
      // 释放 url 对象
      window.URL.revokeObjectURL(blobURL);
    }, 200)
  }
}