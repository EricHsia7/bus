import { promptMessage } from '../interface/prompt/index';

function downloadBlobFile(blob: Blob, fileName: string, timeout: number = 32 * 1000): string {
  const blobURL = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = blobURL;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  setTimeout(() => {
    URL.revokeObjectURL(blobURL);
  }, timeout);
  return blobURL;
}

export async function shareFile(content: string, type: string = 'application/json', fileName: string): void {
  const blob = new Blob([content], { type: type });
  const fileObj = new File([blob], fileName, { type: type });
  if (navigator.canShare && navigator.canShare({ files: [fileObj] })) {
    try {
      await navigator.share({
        files: [fileObj]
      });
    } catch (error) {
      promptMessage('download', '下載資料', {
        text: '下載',
        action: function () {
          downloadBlobFile(blob, fileName);
        }
      });
    }
  } else {
    downloadBlobFile(blob, fileName);
  }
}

/**
 * Copies text to the clipboard using the Clipboard API, falling back to document.execCommand('copy') if necessary.
 *
 * @param text - The string to copy.
 * @returns A promise that resolves to true if successful, false otherwise.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  // Try the modern Clipboard API first (Async, Clean, Secure)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback...', err);
    }
  }

  // Fallback to the legacy textarea hack (Sync, Manual)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', 'readonly');
    document.body.appendChild(textArea);

    // Select the text
    textArea.select();
    // textArea.setSelectionRange(0, text.length);

    // Execute the copy command
    const successful = document.execCommand('copy');

    // Cleanup
    document.body.removeChild(textArea);

    return successful;
  } catch (err) {
    console.error('Fallback copy failed.', err);
    return false;
  }
}

async function copyLink(url: string) {
  promptMessage('link', '複製連結', {
    text: '複製',
    action: async function () {
      const copy = await copyToClipboard(url);
      if (copy) {
        promptMessage('check', '已複製連結');
      } else {
        promptMessage('cancel', '無法複製連結');
      }
    }
  });
}

export async function shareLink(title: string, url: string) {
  if (
    navigator.canShare &&
    navigator.canShare({
      title: title,
      url: url
    })
  ) {
    try {
      await navigator.share({
        title: title,
        url: url
      });
    } catch (error) {
      copyLink(url);
    }
  } else {
    copyLink(url);
  }
}
