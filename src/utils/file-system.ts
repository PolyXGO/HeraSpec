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
}
