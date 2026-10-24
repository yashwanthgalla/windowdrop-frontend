import type { LucideIcon } from 'lucide-react';
import {
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  FileArchive,
  FileCode,
} from 'lucide-react';
import type { FolderTreeNode } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getFileCategoryIcon(fileName: string, mimeType?: string): LucideIcon {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // Images
  if (
    mimeType?.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico', 'avif', 'tiff'].includes(ext)
  ) {
    return FileImage;
  }

  // Videos
  if (
    mimeType?.startsWith('video/') ||
    ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'm4v'].includes(ext)
  ) {
    return FileVideo;
  }

  // Audio
  if (
    mimeType?.startsWith('audio/') ||
    ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'wma'].includes(ext)
  ) {
    return FileAudio;
  }

  // Code
  if (
    [
      'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'json', 'py', 'rs', 'go',
      'cpp', 'c', 'h', 'java', 'php', 'rb', 'swift', 'kt', 'sql', 'yaml', 'yml', 'sh',
    ].includes(ext)
  ) {
    return FileCode;
  }

  // Archives
  if (
    [
      'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso', 'dmg',
    ].includes(ext)
  ) {
    return FileArchive;
  }

  // Text & documents
  if (
    mimeType?.startsWith('text/') ||
    ['txt', 'md', 'pdf', 'doc', 'docx', 'rtf', 'csv', 'log', 'pages', 'xls', 'xlsx'].includes(ext)
  ) {
    return FileText;
  }

  return File;
}

// Convert flat list of files with relative paths into a hierarchical tree
export function buildFolderTree(
  items: Array<{ id?: string; name: string; size: number; path: string; type?: string }>
): FolderTreeNode[] {
  const root: { [key: string]: any } = {};

  for (const item of items) {
    // Clean path and split
    const cleanPath = item.path.replace(/\\/g, '/').replace(/^\/+/, '');
    const parts = cleanPath.split('/');

    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      if (!current[part]) {
        current[part] = {
          name: part,
          path: parts.slice(0, i + 1).join('/'),
          isFolder: !isFile,
          size: isFile ? item.size : 0,
          type: isFile ? item.type : 'folder',
          id: isFile ? item.id : undefined,
          children: isFile ? undefined : {},
        };
      } else if (isFile) {
        current[part].size = item.size;
        current[part].id = item.id;
        current[part].type = item.type;
      }

      if (!isFile) {
        current = current[part].children;
      }
    }
  }

  // Convert nested dict to array and calculate folder sizes recursively
  function convertToArray(nodeDict: { [key: string]: any }): FolderTreeNode[] {
    const nodes: FolderTreeNode[] = Object.values(nodeDict).map((node) => {
      if (node.isFolder && node.children) {
        const childrenArray = convertToArray(node.children);
        const folderSize = childrenArray.reduce((acc, c) => acc + c.size, 0);
        return {
          name: node.name,
          path: node.path,
          isFolder: true,
          size: folderSize,
          children: childrenArray,
        };
      }
      return {
        name: node.name,
        path: node.path,
        isFolder: false,
        size: node.size,
        type: node.type,
        id: node.id,
      };
    });

    // Sort folders first, then alphabetically
    return nodes.sort((a, b) => {
      if (a.isFolder === b.isFolder) {
        return a.name.localeCompare(b.name);
      }
      return a.isFolder ? -1 : 1;
    });
  }

  return convertToArray(root);
}

export function extractFilePath(file: File): string {
  const rawPath = (file as any).path || (file as any).webkitRelativePath || file.name;
  return rawPath.replace(/\\/g, '/').replace(/^\/+/, '');
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

export async function getDroppedFilesAndFolders(
  dataTransfer: DataTransfer
): Promise<{ files: { file: File; path: string }[]; hasFolder: boolean }> {
  const items = dataTransfer.items;
  const result: { file: File; path: string }[] = [];
  let detectedFolder = false;

  if (items && items.length > 0 && typeof (items[0] as any).webkitGetAsEntry === 'function') {
    const queue: { entry: any; currentDir: string }[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind !== 'file') continue;
      const entry = (item as any).webkitGetAsEntry?.();
      if (entry) {
        if (entry.isDirectory) {
          detectedFolder = true;
          queue.push({ entry, currentDir: entry.name });
        } else {
          queue.push({ entry, currentDir: '' });
        }
      }
    }

    const readDirectory = async (dirEntry: any, dirPath: string) => {
      const dirReader = dirEntry.createReader();
      const readBatch = (): Promise<any[]> => {
        return new Promise((resolve, reject) => {
          dirReader.readEntries(resolve, reject);
        });
      };

      let entries: any[] = [];
      let batch: any[];
      do {
        batch = await readBatch();
        entries = entries.concat(batch);
      } while (batch.length > 0);

      for (const child of entries) {
        const childPath = dirPath ? `${dirPath}/${child.name}` : child.name;
        if (child.isFile) {
          const file: File = await new Promise((resolve, reject) => child.file(resolve, reject));
          result.push({ file, path: childPath });
        } else if (child.isDirectory) {
          detectedFolder = true;
          await readDirectory(child, childPath);
        }
      }
    };

    for (const { entry, currentDir } of queue) {
      if (entry.isFile) {
        const file: File = await new Promise((resolve, reject) => entry.file(resolve, reject));
        const path = currentDir ? `${currentDir}/${entry.name}` : entry.name;
        result.push({ file, path });
      } else if (entry.isDirectory) {
        await readDirectory(entry, currentDir);
      }
    }

    return { files: result, hasFolder: detectedFolder };
  }

  // Fallback to dataTransfer.files
  const fallbackFiles = Array.from(dataTransfer.files).map((file) => ({
    file,
    path: extractFilePath(file),
  }));
  const fallbackHasFolder = fallbackFiles.some((f) => f.path.includes('/'));
  return { files: fallbackFiles, hasFolder: fallbackHasFolder };
}

export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

export async function saveItemsToDirectory(
  items: Array<{ id: string; name: string; path: string; size: number }>,
  fetchBlob: (itemId: string) => Promise<Blob>,
  onProgress?: (completed: number, total: number, currentName: string) => void
): Promise<void> {
  if (!isFileSystemAccessSupported()) {
    throw new Error('FILE_SYSTEM_ACCESS_NOT_SUPPORTED');
  }

  const rootDirHandle = await (window as any).showDirectoryPicker({
    mode: 'readwrite',
  });

  let completed = 0;
  for (const item of items) {
    onProgress?.(completed, items.length, item.name);

    const cleanPath = item.path.replace(/\\/g, '/').replace(/^\/+/, '');
    const segments = cleanPath.split('/');
    const fileName = segments.pop() || item.name;

    let currentDirHandle = rootDirHandle;
    for (const segment of segments) {
      if (segment.trim().length > 0) {
        currentDirHandle = await currentDirHandle.getDirectoryHandle(segment, { create: true });
      }
    }

    const blob = await fetchBlob(item.id);
    const fileHandle = await currentDirHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();

    completed++;
    onProgress?.(completed, items.length, item.name);
  }
}

