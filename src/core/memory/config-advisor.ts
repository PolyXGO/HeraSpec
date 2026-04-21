/**
 * HeraSpec Memory Config Advisor
 * Auto-detects project scale and recommends optimal config adjustments
 */
import type { ContextConfig, MemoryStatus} from './memory-types.js';
import { loadContextConfig } from './context-config.js';

export interface ConfigRecommendation {
  setting: string;
  currentValue: number | boolean;
  recommendedValue: number | boolean;
  reason: string;
  impact: string;
}

export interface ConfigAdvice {
  projectScale: 'small' | 'medium' | 'large' | 'enterprise';
  recommendations: ConfigRecommendation[];
  hasChanges: boolean;
  summary: string;
}

/**
 * Thresholds for project scale detection
 */
const SCALE_THRESHOLDS = {
  small:      { maxObs: 50,   maxSum: 10  },
  medium:     { maxObs: 500,  maxSum: 50  },
  large:      { maxObs: 2000, maxSum: 200 },
  // enterprise: above large
};

/**
 * Optimal configs per project scale
 */
const SCALE_CONFIGS: Record<string, Partial<ContextConfig>> = {
  small: {
    totalObservationCount: 30,
    fullObservationCount: 3,
    sessionCount: 3,
    maxTokens: 4000,
  },
  medium: {
    totalObservationCount: 50,
    fullObservationCount: 5,
    sessionCount: 5,
    maxTokens: 6000,
  },
  large: {
    totalObservationCount: 80,
    fullObservationCount: 5,
    sessionCount: 8,
    maxTokens: 8000,
  },
  enterprise: {
    totalObservationCount: 100,
    fullObservationCount: 7,
    sessionCount: 10,
    maxTokens: 10000,
  },
};

/**
 * Analyze memory status and recommend config changes
 */
export function analyzeAndRecommend(status: MemoryStatus, projectPath: string = '.'): ConfigAdvice {
  const currentConfig = loadContextConfig(projectPath);
  const scale = detectScale(status);
  const optimal = SCALE_CONFIGS[scale];
  const recommendations: ConfigRecommendation[] = [];

  // Check totalObservationCount
  if (currentConfig.totalObservationCount !== optimal.totalObservationCount) {
    const current = currentConfig.totalObservationCount;
    const recommended = optimal.totalObservationCount!;

    if (status.observationCount > current * 0.8) {
      recommendations.push({
        setting: 'totalObservationCount',
        currentValue: current,
        recommendedValue: recommended,
        reason: `Dự án có ${status.observationCount} observations, context đang hiển thị ${current} — ${current < recommended ? 'có thể bỏ lỡ context quan trọng' : 'đang hiển thị quá nhiều'}`,
        impact: current < recommended
          ? `Tăng tầm nhìn từ ${current} → ${recommended} observations (+${(recommended - current) * 15} tokens index)`
          : `Giảm từ ${current} → ${recommended} observations (tiết kiệm ~${(current - recommended) * 15} tokens)`,
      });
    }
  }

  // Check fullObservationCount
  if (currentConfig.fullObservationCount !== optimal.fullObservationCount) {
    recommendations.push({
      setting: 'fullObservationCount',
      currentValue: currentConfig.fullObservationCount,
      recommendedValue: optimal.fullObservationCount!,
      reason: `Scale "${scale}" tối ưu với ${optimal.fullObservationCount} full observations`,
      impact: `${currentConfig.fullObservationCount < optimal.fullObservationCount! ? 'Thêm' : 'Giảm'} narrative đầy đủ → ${currentConfig.fullObservationCount < optimal.fullObservationCount! ? 'context phong phú hơn' : 'tiết kiệm tokens'}`,
    });
  }

  // Check sessionCount
  if (currentConfig.sessionCount !== optimal.sessionCount) {
    if (status.summaryCount > currentConfig.sessionCount * 2) {
      recommendations.push({
        setting: 'sessionCount',
        currentValue: currentConfig.sessionCount,
        recommendedValue: optimal.sessionCount!,
        reason: `Có ${status.summaryCount} summaries nhưng chỉ hiện ${currentConfig.sessionCount}`,
        impact: `Tăng session history → agent hiểu rõ hơn dòng thời gian dự án`,
      });
    }
  }

  // Check maxTokens
  if (currentConfig.maxTokens !== optimal.maxTokens) {
    const estimatedContextTokens = estimateContextCost(optimal, status);

    if (estimatedContextTokens > currentConfig.maxTokens * 0.85) {
      recommendations.push({
        setting: 'maxTokens',
        currentValue: currentConfig.maxTokens,
        recommendedValue: optimal.maxTokens!,
        reason: `Context ước tính ~${estimatedContextTokens} tokens, đang cắt bớt vì limit ${currentConfig.maxTokens}`,
        impact: `Tăng budget → context đầy đủ hơn, chỉ chiếm ${((optimal.maxTokens! / 128000) * 100).toFixed(1)}% context window nhỏ nhất (128K)`,
      });
    }
  }

  // Additional advice: prune old data
  if (status.observationCount > 1000) {
    const daysSinceOldest = status.oldestObservation
      ? Math.floor((Date.now() - new Date(status.oldestObservation).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    if (daysSinceOldest > 180) {
      recommendations.push({
        setting: 'prune',
        currentValue: daysSinceOldest,
        recommendedValue: 180,
        reason: `Có observations cũ ${daysSinceOldest} ngày — ít giá trị cho context hiện tại`,
        impact: `Chạy \`heraspec memory prune 180\` để xóa observations cũ hơn 6 tháng`,
      });
    }
  }

  const hasChanges = recommendations.filter(r => r.setting !== 'prune').length > 0;

  return {
    projectScale: scale,
    recommendations,
    hasChanges,
    summary: buildSummary(scale, status, recommendations),
  };
}

/**
 * Detect project scale from memory status
 */
function detectScale(status: MemoryStatus): 'small' | 'medium' | 'large' | 'enterprise' {
  const obsCount = status.observationCount;
  const sumCount = status.summaryCount;

  if (obsCount <= SCALE_THRESHOLDS.small.maxObs && sumCount <= SCALE_THRESHOLDS.small.maxSum) {
    return 'small';
  }
  if (obsCount <= SCALE_THRESHOLDS.medium.maxObs && sumCount <= SCALE_THRESHOLDS.medium.maxSum) {
    return 'medium';
  }
  if (obsCount <= SCALE_THRESHOLDS.large.maxObs && sumCount <= SCALE_THRESHOLDS.large.maxSum) {
    return 'large';
  }
  return 'enterprise';
}

/**
 * Estimate context token cost for given config
 */
function estimateContextCost(config: Partial<ContextConfig>, status: MemoryStatus): number {
  const fullObs = Math.min(config.fullObservationCount || 5, status.observationCount);
  const indexObs = Math.min(
    (config.totalObservationCount || 50) - fullObs,
    Math.max(0, status.observationCount - fullObs)
  );
  const sessions = Math.min(config.sessionCount || 5, status.summaryCount);

  // Estimates
  const headerTokens = 30;
  const fullObsTokens = fullObs * 350;    // ~350 tokens avg per full observation
  const indexTokens = indexObs * 15;       // ~15 tokens per index row
  const summaryTokens = sessions > 0 ? 300 + (sessions - 1) * 30 : 0; // first full, rest compact

  return headerTokens + fullObsTokens + indexTokens + summaryTokens;
}

/**
 * Build human-readable summary
 */
function buildSummary(
  scale: string,
  status: MemoryStatus,
  recommendations: ConfigRecommendation[]
): string {
  const scaleLabels: Record<string, string> = {
    small: '📦 Nhỏ (< 50 observations)',
    medium: '📊 Trung bình (50-500 observations)',
    large: '🏢 Lớn (500-2000 observations)',
    enterprise: '🏗️ Enterprise (2000+ observations)',
  };

  const lines: string[] = [];
  lines.push(`Quy mô dự án: ${scaleLabels[scale]}`);
  lines.push(`Observations: ${status.observationCount} | Summaries: ${status.summaryCount}`);

  if (recommendations.length === 0) {
    lines.push(`\n✅ Cấu hình hiện tại đã tối ưu cho quy mô dự án.`);
  } else {
    const configChanges = recommendations.filter(r => r.setting !== 'prune');
    if (configChanges.length > 0) {
      lines.push(`\n⚠️ Có ${configChanges.length} đề xuất điều chỉnh config.`);
    }
    const pruneAdvice = recommendations.find(r => r.setting === 'prune');
    if (pruneAdvice) {
      lines.push(`🗑️ Nên dọn dẹp observations cũ.`);
    }
  }

  return lines.join('\n');
}

/**
 * Generate the new config JSON to write
 */
export function buildOptimizedConfig(
  status: MemoryStatus,
  projectPath: string = '.'
): { config: ContextConfig; advice: ConfigAdvice } {
  const advice = analyzeAndRecommend(status, projectPath);
  const currentConfig = loadContextConfig(projectPath);

  // Apply recommendations
  const newConfig = { ...currentConfig };

  for (const rec of advice.recommendations) {
    if (rec.setting === 'prune') continue; // prune is a command, not config

    switch (rec.setting) {
      case 'totalObservationCount':
        newConfig.totalObservationCount = rec.recommendedValue as number;
        break;
      case 'fullObservationCount':
        newConfig.fullObservationCount = rec.recommendedValue as number;
        break;
      case 'sessionCount':
        newConfig.sessionCount = rec.recommendedValue as number;
        break;
      case 'maxTokens':
        newConfig.maxTokens = rec.recommendedValue as number;
        break;
    }
  }

  return { config: newConfig, advice };
}
