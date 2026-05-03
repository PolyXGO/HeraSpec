/**
 * File system utilities for HeraSpec
 */
import { promises as fs } from 'fs';
import path from 'path';

export class FileSystemUtils {
  static async createDirectory(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  static async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  }

  static async writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content, 'utf-8');
  }

  static async readDirectory(dirPath: string): Promise<string[]> {
    return await fs.readdir(dirPath);
  }

  static async stat(filePath: string) {
    return await fs.stat(filePath);
  }

  static async copyFile(src: string, dest: string): Promise<void> {
    await fs.copyFile(src, dest);
  }

  static async copyDirectory(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  static async removeFile(filePath: string): Promise<void> {
    await fs.unlink(filePath);
  }

  static async removeDirectory(dirPath: string, recursive = true): Promise<void> {
    // Use fs.rm for Node.js 14.14.0+ (fs.rmdir with recursive is deprecated)
    // Fallback to fs.rmdir for older versions
    if (typeof (fs as any).rm === 'function') {
      await (fs as any).rm(dirPath, { recursive, force: true });
    } else {
      await fs.rmdir(dirPath, { recursive });
    }
  }

  static async moveFile(src: string, dest: string): Promise<void> {
    await fs.rename(src, dest);
  }

  static joinPath(...segments: string[]): string {
    return path.join(...segments);
  }

  static resolvePath(...segments: string[]): string {
    return path.resolve(...segments);
  }

  static getDirectoryName(filePath: string): string {
    return path.dirname(filePath);
  }

  static getBaseName(filePath: string): string {
    return path.basename(filePath);
  }

  static async generateTree(
    dirPath: string,
    maxDepth: number = 3,
    ignoreDirs: string[] = ['node_modules', '.git', 'dist', 'build', 'vendor', '.next', '.nuxt', 'heraspec', '.heraspec'],
    currentDepth: number = 0,
    prefix: string = ''
  ): Promise<string> {
    if (currentDepth >= maxDepth) return '';

    let result = '';
    let entries: string[];
    try {
      entries = await fs.readdir(dirPath);
    } catch {
      return result;
    }

    const validEntries = [];
    for (const entry of entries) {
      if (ignoreDirs.includes(entry)) continue;
      // Skip hidden folders to keep tree clean
      if (entry.startsWith('.')) {
        const stat = await this.stat(path.join(dirPath, entry)).catch(() => null);
        if (stat?.isDirectory()) continue;
      }
      validEntries.push(entry);
    }

    // Sort: directories first, then files
    const statsCache = new Map<string, any>();
    for (const entry of validEntries) {
      const stat = await this.stat(path.join(dirPath, entry)).catch(() => null);
      statsCache.set(entry, stat);
    }

    validEntries.sort((a, b) => {
      const statA = statsCache.get(a);
      const statB = statsCache.get(b);
      if (statA?.isDirectory() && !statB?.isDirectory()) return -1;
      if (!statA?.isDirectory() && statB?.isDirectory()) return 1;
      return a.localeCompare(b);
    });

    for (let i = 0; i < validEntries.length; i++) {
      const entry = validEntries[i];
      const isLast = i === validEntries.length - 1;
      const marker = isLast ? '└── ' : '├── ';
      const childPrefix = prefix + (isLast ? '    ' : '│   ');

      const entryPath = path.join(dirPath, entry);
      const stat = statsCache.get(entry);

      if (stat?.isDirectory()) {
        result += `${prefix}${marker}${entry}/\n`;
        result += await this.generateTree(entryPath, maxDepth, ignoreDirs, currentDepth + 1, childPrefix);
      } else {
        result += `${prefix}${marker}${entry}\n`;
      }
    }

    return result;
  }
}
