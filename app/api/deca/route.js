import fs from 'fs/promises';
import path from 'path';

const candidateRoots = [
  path.resolve(process.cwd(), '../Block1/applications'),
  'C:/Users/sophi/OneDrive/Documents/vcs-ai-program/Block1/applications',
  'C:/Users/sophi/Documents/vcs-ai-program/Block1/applications',
];

const sortedRoots = [
  path.resolve(process.cwd(), '../Block1/sorted'),
  'C:/Users/sophi/OneDrive/Documents/vcs-ai-program/Block1/sorted',
  'C:/Users/sophi/Documents/vcs-ai-program/Block1/sorted',
];

async function resolveExistingDirectory(candidatePaths) {
  for (const entry of candidatePaths) {
    try {
      const stats = await fs.stat(entry);
      if (stats.isDirectory()) return entry;
    } catch {
      // continue checking the next known path
    }
  }

  return candidatePaths[0];
}

const SOURCE_DIR = await resolveExistingDirectory(candidateRoots);
const SORTED_DIR = await resolveExistingDirectory(sortedRoots);

const categoryKeywords = {
  Marketing: [
    'marketing', 'brand', 'branding', 'advertising', 'promotion', 'sales', 'product launch',
    'social media', 'campaign', 'pricing', 'consumer', 'market research', 'customer behavior',
    'digital marketing', 'public relations', 'distribution', 'target audience', 'consumer insight'
  ],
  Finance: [
    'finance', 'financial', 'budgeting', 'accounting', 'cash flow', 'investment', 'investing',
    'stocks', 'loans', 'banking', 'revenue', 'risk analysis', 'profit', 'expense tracking',
    'balance sheet', 'annual report', 'taxes', 'asset management', 'equity'
  ],
  Entrepreneurship: [
    'entrepreneurship', 'startup', 'business idea', 'launching a business', 'venture',
    'small business', 'pitch', 'business plan', 'innovation', 'product development',
    'e-commerce', 'founder', 'scaling', 'market entry', 'customer acquisition'
  ],
  'Business Management': [
    'business management', 'operations', 'leadership', 'planning', 'strategy', 'workflow',
    'scheduling', 'team management', 'project management', 'coordination', 'organization',
    'decision making', 'process improvement', 'inventory', 'human resources', 'team leadership'
  ],
  Hospitality: [
    'hospitality', 'restaurant', 'hotel', 'catering', 'event planning', 'tourism',
    'guest services', 'food service', 'customer service', 'travel', 'reservation',
    'front desk', 'hospitality management', 'banquet', 'service operations'
  ],
  'Personal Finance': [
    'personal finance', 'saving', 'budget', 'spending', 'debt', 'credit', 'checking account',
    'emergency fund', 'retirement', 'income', 'expenses', 'financial literacy', 'paycheck',
    'tax planning', 'insurance', 'student loans', 'monthly budget'
  ],
};

const categories = Object.keys(categoryKeywords);

const classificationRules = {
  categories,
  thresholds: {
    high: 8,
    medium: 4,
    low: 0,
  },
  routing: {
    high: 'strict category folder',
    medium: 'sorted/Undecided/',
    low: 'sorted/Undecided/',
  },
  requireStrictFolderMatch: true,
  auditFolder: 'Undecided',
};

function getStudentName(lines) {
  const nameLine = lines.find((line) => line.startsWith('Name:'));
  return nameLine ? nameLine.split(':').slice(1).join(':').trim() : 'Unknown';
}

function getBodyText(lines) {
  return lines
    .filter((line) => line.trim() && !line.startsWith('Name:') && !line.startsWith('Category:'))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getGrade(lines) {
  const gradeLine = lines.find((line) => line.toLowerCase().startsWith('grade:'));
  if (!gradeLine) return 'N/A';
  return gradeLine.split(':').slice(1).join(':').trim();
}

function getSummary(lines) {
  const body = lines
    .filter((line) => line.trim() && !line.startsWith('Name:') && !line.startsWith('Grade:') && !line.startsWith('Category:'))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!body) return 'No summary available.';
  return body.length > 260 ? `${body.slice(0, 260).trim()}...` : body;
}

function classifyCandidate(body) {
  const text = body.toLowerCase();
  const scores = Object.fromEntries(categories.map((category) => [category, 0]));
  const evidence = Object.fromEntries(categories.map((category) => [category, []]));

  for (const category of categories) {
    const normalizedCategory = category.toLowerCase();
    if (text.includes(normalizedCategory)) {
      scores[category] += 3;
      evidence[category].push(normalizedCategory);
    }

    for (const keyword of categoryKeywords[category]) {
      if (text.includes(keyword.toLowerCase())) {
        scores[category] += 2;
        evidence[category].push(keyword.toLowerCase());
      }
    }
  }

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [bestCategory, bestScore] = ranked[0];
  const secondBest = ranked[1]?.[1] ?? 0;
  const uniqueEvidence = [...new Set(evidence[bestCategory])].slice(0, 3);

  if (bestScore === 0) {
    return {
      assignedCategory: 'Undecided',
      confidence: 'low',
      score: bestScore,
      reason: 'No clear DECA keyword match was detected.',
      evidence: uniqueEvidence,
      routingFolder: 'Undecided',
    };
  }

  if (bestScore >= classificationRules.thresholds.high && bestScore >= secondBest + 2) {
    return {
      assignedCategory: bestCategory,
      confidence: 'high',
      score: bestScore,
      reason: `Strong keyword signals for ${bestCategory}: ${uniqueEvidence.join(', ') || 'category terms detected'}.`,
      evidence: uniqueEvidence,
      routingFolder: bestCategory,
    };
  }

  if (bestScore >= classificationRules.thresholds.medium) {
    return {
      assignedCategory: bestCategory,
      confidence: 'medium',
      score: bestScore,
      reason: `Moderate keyword overlap suggests ${bestCategory} but needs human review.`,
      evidence: uniqueEvidence,
      routingFolder: 'Undecided',
    };
  }

  return {
    assignedCategory: 'Undecided',
    confidence: 'low',
    score: bestScore,
    reason: `Only weak matches were found; the file did not clearly support ${bestCategory}.`,
    evidence: uniqueEvidence,
    routingFolder: 'Undecided',
  };
}

async function ensureFolderStructure() {
  await fs.mkdir(SORTED_DIR, { recursive: true });

  for (const category of [...categories, 'Undecided']) {
    await fs.mkdir(path.join(SORTED_DIR, category), { recursive: true });
  }
}

async function uniqueDestinationPath(destinationDir, filename) {
  const extension = path.extname(filename);
  const baseName = path.basename(filename, extension);
  let candidate = path.join(destinationDir, filename);
  let index = 1;

  while (true) {
    try {
      await fs.access(candidate);
      candidate = path.join(destinationDir, `${baseName}_${index}${extension}`);
      index += 1;
    } catch {
      return candidate;
    }
  }
}

async function routeFileToFolder(filePath, classification) {
  const destinationDir = path.join(SORTED_DIR, classification.routingFolder);
  await fs.mkdir(destinationDir, { recursive: true });
  const destinationPath = await uniqueDestinationPath(destinationDir, path.basename(filePath));
  await fs.copyFile(filePath, destinationPath);

  return {
    fileName: path.basename(filePath),
    source: filePath,
    destination: destinationPath,
    routingFolder: classification.routingFolder,
  };
}

async function buildReport() {
  await ensureFolderStructure();

  const files = await fs.readdir(SOURCE_DIR);
  const txtFiles = files.filter((file) => file.toLowerCase().endsWith('.txt')).sort();

  const candidates = [];

  for (const fileName of txtFiles) {
    const filePath = path.join(SOURCE_DIR, fileName);
    const text = await fs.readFile(filePath, 'utf-8');
    const lines = text.split(/\r?\n/).map((line) => line.trim());
    const candidateName = getStudentName(lines);
    const grade = getGrade(lines);
    const summary = getSummary(lines);
    const body = getBodyText(lines);
    const classification = classifyCandidate(body);
    const routingResult = await routeFileToFolder(filePath, classification);

    candidates.push({
      name: candidateName,
      grade,
      fileName,
      summary,
      category: classification.assignedCategory,
      confidence: classification.confidence,
      routingFolder: classification.routingFolder,
      score: classification.score,
      reason: classification.reason,
      evidence: classification.evidence,
      destination: routingResult.destination,
    });
  }

  const summary = {
    total: candidates.length,
    high: candidates.filter((candidate) => candidate.confidence === 'high').length,
    medium: candidates.filter((candidate) => candidate.confidence === 'medium').length,
    low: candidates.filter((candidate) => candidate.confidence === 'low').length,
    undecided: candidates.filter((candidate) => candidate.routingFolder === 'Undecided').length,
  };

  const categoryBreakdown = categories.map((category) => ({
    category,
    count: candidates.filter((candidate) => candidate.routingFolder === category).length,
  }));

  return {
    rules: classificationRules,
    summary,
    categoryBreakdown,
    candidates,
    generatedAt: new Date().toISOString(),
  };
}

export async function GET() {
  try {
    const report = await buildReport();
    return Response.json(report);
  } catch (error) {
    console.error('DECA report failed:', error);
    return Response.json(
      {
        error: 'Failed to generate DECA report.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const report = await buildReport();
    return Response.json(report);
  } catch (error) {
    console.error('DECA report failed:', error);
    return Response.json(
      {
        error: 'Failed to generate DECA report.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
