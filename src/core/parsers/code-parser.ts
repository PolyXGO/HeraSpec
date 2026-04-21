/**
 * HeraSpec Code Parser
 * Regex-based multi-language symbol extraction (no tree-sitter dependency)
 * Supports: TypeScript, JavaScript, Python, PHP, Go, Rust, Java, C#
 */
import { promises as fs } from 'fs';
import path from 'path';

export interface SymbolInfo {
  name: string;
  type: 'function' | 'class' | 'method' | 'interface' | 'type' | 'export' | 'variable' | 'enum';
  signature: string;
  startLine: number;
  endLine: number;
  filePath: string;
}

export interface FileOutline {
  filePath: string;
  language: string;
  symbols: SymbolInfo[];
  lineCount: number;
  estimatedTokens: number;
}

// Language detection by extension
const LANGUAGE_MAP: Record<string, string> = {
  '.ts': 'typescript', '.tsx': 'typescript',
  '.js': 'javascript', '.jsx': 'javascript', '.mjs': 'javascript', '.cjs': 'javascript',
  '.py': 'python',
  '.php': 'php',
  '.go': 'go',
  '.rs': 'rust',
  '.java': 'java',
  '.cs': 'csharp',
  '.rb': 'ruby',
  '.vue': 'vue',
  '.svelte': 'svelte',
};

// Symbol extraction patterns per language
const LANGUAGE_PATTERNS: Record<string, Array<{ regex: RegExp; type: SymbolInfo['type'] }>> = {
  typescript: [
    { regex: /^(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/gm, type: 'class' },
    { regex: /^(?:export\s+)?interface\s+(\w+)/gm, type: 'interface' },
    { regex: /^(?:export\s+)?type\s+(\w+)/gm, type: 'type' },
    { regex: /^(?:export\s+)?enum\s+(\w+)/gm, type: 'enum' },
    { regex: /^(?:export\s+)?(?:async\s+)?function\s+(\w+)/gm, type: 'function' },
    { regex: /^(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\(/gm, type: 'function' },
    { regex: /^\s+(?:public|private|protected|static|async|readonly)\s+(?:async\s+)?(\w+)\s*\(/gm, type: 'method' },
    { regex: /^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*[=:]/gm, type: 'variable' },
  ],
  javascript: [
    { regex: /^(?:export\s+)?class\s+(\w+)/gm, type: 'class' },
    { regex: /^(?:export\s+)?(?:async\s+)?function\s+(\w+)/gm, type: 'function' },
    { regex: /^(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\(/gm, type: 'function' },
    { regex: /^\s+(\w+)\s*\([^)]*\)\s*\{/gm, type: 'method' },
    { regex: /^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=/gm, type: 'variable' },
  ],
  python: [
    { regex: /^class\s+(\w+)/gm, type: 'class' },
    { regex: /^(?:async\s+)?def\s+(\w+)/gm, type: 'function' },
    { regex: /^\s+(?:async\s+)?def\s+(\w+)/gm, type: 'method' },
    { regex: /^(\w+)\s*=\s*/gm, type: 'variable' },
  ],
  php: [
    { regex: /^(?:\s*(?:abstract|final)\s+)?class\s+(\w+)/gm, type: 'class' },
    { regex: /^(?:\s*interface\s+)(\w+)/gm, type: 'interface' },
    { regex: /^(?:\s*(?:public|private|protected|static)\s+)*function\s+(\w+)/gm, type: 'function' },
  ],
  go: [
    { regex: /^type\s+(\w+)\s+struct\b/gm, type: 'class' },
    { regex: /^type\s+(\w+)\s+interface\b/gm, type: 'interface' },
    { regex: /^func\s+(?:\([^)]+\)\s+)?(\w+)/gm, type: 'function' },
  ],
  rust: [
    { regex: /^(?:pub\s+)?struct\s+(\w+)/gm, type: 'class' },
    { regex: /^(?:pub\s+)?trait\s+(\w+)/gm, type: 'interface' },
    { regex: /^(?:pub\s+)?enum\s+(\w+)/gm, type: 'enum' },
    { regex: /^(?:pub\s+)?(?:async\s+)?fn\s+(\w+)/gm, type: 'function' },
    { regex: /^\s+(?:pub\s+)?(?:async\s+)?fn\s+(\w+)/gm, type: 'method' },
  ],
  java: [
    { regex: /^(?:\s*(?:public|private|protected)\s+)?(?:abstract\s+)?class\s+(\w+)/gm, type: 'class' },
    { regex: /^(?:\s*(?:public|private|protected)\s+)?interface\s+(\w+)/gm, type: 'interface' },
    { regex: /^(?:\s*(?:public|private|protected|static)\s+)+[\w<>\[\]]+\s+(\w+)\s*\(/gm, type: 'method' },
  ],
  csharp: [
    { regex: /^(?:\s*(?:public|private|protected|internal)\s+)?(?:abstract|static|sealed|partial)?\s*class\s+(\w+)/gm, type: 'class' },
    { regex: /^(?:\s*(?:public|private|protected|internal)\s+)?interface\s+(\w+)/gm, type: 'interface' },
    { regex: /^(?:\s*(?:public|private|protected|internal|static)\s+)+[\w<>\[\]]+\s+(\w+)\s*\(/gm, type: 'method' },
  ],
};

// Use same patterns as base language for derivatives
LANGUAGE_PATTERNS['vue'] = LANGUAGE_PATTERNS['typescript'];
LANGUAGE_PATTERNS['svelte'] = LANGUAGE_PATTERNS['typescript'];
LANGUAGE_PATTERNS['ruby'] = LANGUAGE_PATTERNS['python']; // Similar enough

export class CodeParser {
  /**
   * Get structural outline of a file (symbols without full source)
   */
  static async outline(filePath: string): Promise<FileOutline> {
    const content = await fs.readFile(filePath, 'utf-8');
    const ext = path.extname(filePath).toLowerCase();
    const language = LANGUAGE_MAP[ext] || 'unknown';
    const lines = content.split('\n');
    const symbols = CodeParser.extractSymbols(content, language, filePath);

    return {
      filePath,
      language,
      symbols,
      lineCount: lines.length,
      estimatedTokens: Math.ceil(content.length / 4),
    };
  }

  /**
   * Extract all symbols from file content
   */
  static extractSymbols(content: string, language: string, filePath: string): SymbolInfo[] {
    const patterns = LANGUAGE_PATTERNS[language];
    if (!patterns) return [];

    const lines = content.split('\n');
    const symbols: SymbolInfo[] = [];
    const seenPositions = new Set<string>(); // Prevent duplicates

    for (const { regex, type } of patterns) {
      // Reset regex state
      const re = new RegExp(regex.source, regex.flags);
      let match;

      while ((match = re.exec(content)) !== null) {
        const name = match[1];
        if (!name || name.length < 2) continue;

        // Skip common false positives
        if (['if', 'for', 'while', 'switch', 'catch', 'return', 'new', 'this', 'super'].includes(name)) {
          continue;
        }

        const startLine = content.substring(0, match.index).split('\n').length;
        const endLine = CodeParser.findEndLine(lines, startLine - 1, language);
        const signature = match[0].trim();

        const posKey = `${startLine}:${name}`;
        if (seenPositions.has(posKey)) continue;
        seenPositions.add(posKey);

        symbols.push({
          name,
          type,
          signature,
          startLine,
          endLine,
          filePath,
        });
      }
    }

    // Sort by line number
    symbols.sort((a, b) => a.startLine - b.startLine);
    return symbols;
  }

  /**
   * Unfold: extract the full source of a specific symbol
   */
  static async unfold(filePath: string, symbolName: string): Promise<{
    symbol: SymbolInfo | null;
    source: string;
    estimatedTokens: number;
  }> {
    const outline = await CodeParser.outline(filePath);
    const symbol = outline.symbols.find(s => s.name === symbolName);

    if (!symbol) {
      return { symbol: null, source: '', estimatedTokens: 0 };
    }

    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const source = lines.slice(symbol.startLine - 1, symbol.endLine).join('\n');

    return {
      symbol,
      source,
      estimatedTokens: Math.ceil(source.length / 4),
    };
  }

  /**
   * Search for symbols across a directory
   */
  static async search(query: string, searchPath: string, maxResults: number = 20): Promise<Array<{
    symbol: SymbolInfo;
    relevance: number;
  }>> {
    const results: Array<{ symbol: SymbolInfo; relevance: number }> = [];
    const queryLower = query.toLowerCase();

    await CodeParser.walkDir(searchPath, async (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (!LANGUAGE_MAP[ext]) return;

      try {
        const outline = await CodeParser.outline(filePath);
        for (const symbol of outline.symbols) {
          const nameLower = symbol.name.toLowerCase();
          const sigLower = symbol.signature.toLowerCase();

          // Simple relevance scoring
          let relevance = 0;
          if (nameLower === queryLower) relevance = 100;
          else if (nameLower.startsWith(queryLower)) relevance = 80;
          else if (nameLower.includes(queryLower)) relevance = 60;
          else if (sigLower.includes(queryLower)) relevance = 40;

          if (relevance > 0) {
            results.push({ symbol, relevance });
          }
        }
      } catch { /* skip unreadable files */ }
    });

    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxResults);
  }

  /**
   * Format outline as markdown
   */
  static formatOutline(outline: FileOutline): string {
    const lines: string[] = [];
    const relPath = path.relative(process.cwd(), outline.filePath);

    lines.push(`## 📄 ${relPath}`);
    lines.push(`*${outline.language} | ${outline.lineCount} lines | ~${outline.estimatedTokens} tokens*\n`);

    if (outline.symbols.length === 0) {
      lines.push('No symbols found (language may not be supported).');
      return lines.join('\n');
    }

    const typeIcons: Record<string, string> = {
      class: '🏛️', interface: '🔷', type: '🔹', enum: '📋',
      function: '⚡', method: '  ↳', variable: '📌', export: '📤',
    };

    for (const sym of outline.symbols) {
      const icon = typeIcons[sym.type] || '•';
      lines.push(`${icon} ${sym.signature} (L${sym.startLine}-${sym.endLine})`);
    }

    return lines.join('\n');
  }

  // ============ Helpers ============

  /**
   * Find the end line of a code block (brace/indent matching)
   */
  private static findEndLine(lines: string[], startIdx: number, language: string): number {
    if (startIdx >= lines.length) return startIdx + 1;

    // For brace-based languages
    if (['typescript', 'javascript', 'php', 'go', 'rust', 'java', 'csharp', 'vue', 'svelte'].includes(language)) {
      let braceCount = 0;
      let foundOpen = false;

      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i];
        for (const ch of line) {
          if (ch === '{') { braceCount++; foundOpen = true; }
          if (ch === '}') braceCount--;
        }
        if (foundOpen && braceCount <= 0) return i + 1;
      }

      // Fallback: no braces found (declaration/one-liner)
      return startIdx + 1;
    }

    // For Python: indent-based
    if (language === 'python' || language === 'ruby') {
      const startIndent = lines[startIdx].search(/\S/);
      for (let i = startIdx + 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') continue; // Skip empty
        const indent = line.search(/\S/);
        if (indent <= startIndent) return i;
      }
      return lines.length;
    }

    return startIdx + 1;
  }

  /**
   * Walk directory recursively, calling callback for each file
   */
  private static async walkDir(dirPath: string, callback: (filePath: string) => Promise<void>): Promise<void> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const full = path.join(dirPath, entry.name);

      // Skip common non-source directories
      if (entry.isDirectory()) {
        if (['node_modules', '.git', 'dist', 'build', '__pycache__', '.next', 'vendor', 'coverage'].includes(entry.name)) {
          continue;
        }
        await CodeParser.walkDir(full, callback);
      } else {
        await callback(full);
      }
    }
  }
}
