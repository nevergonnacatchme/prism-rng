/**
 * Chat Filter utility
 * Enforces strict ban on hate speech, racial/ethnic/sexual slurs, and severe harassment.
 * Permits mild swearing (e.g. damn, hell, crap, shit, ass) as explicitly requested.
 */

// Normalized pattern list targeting hate speech, racial slurs, homophobic/transphobic slurs, and severe slurs.
const SEVERE_SLUR_PATTERNS: RegExp[] = [
  // N-word and variants (with leetspeak like 1, !, 3, @)
  /\bn+[i1!l]+g+[e3a@]+r*s*\b/i,
  /\bn+[i1!l]+g+[a@]+h*s*\b/i,
  /\bn+[i1!l]+g+u+h+s*\b/i,
  /\bn+[e3]+g+r+[o0]+e*s*\b/i,

  // F-slur and variants
  /\bf+[a@]+g+[o0]+t+s*\b/i,
  /\bf+[a@]+g+s*\b/i,
  /\bf+[a@]+g+[e3]+t+s*\b/i,

  // K-word and variants
  /\bk+[i1!l]+k+[e3]+s*\b/i,

  // C-slur (Asian ethnic slur)
  /\bc+h+[i1!l]+n+k+s*\b/i,
  /\bg+[o0]+[o0]+k+s*\b/i,

  // S-slur (Hispanic ethnic slur)
  /\bs+p+[i1!l]+c+s*\b/i,
  /\bw+[e3]+t+b+[a@]+c+k+s*\b/i,

  // T-slur (transphobic slur)
  /\bt+r+[a@]+n+n+[y1i!]+e*s*\b/i,

  // R-word (ableist slur)
  /\br+[e3]+t+[a@]+r+d+[e3]*d*s*\b/i,

  // Other severe hate speech / violence inciting words
  /\bk+y+s\b/i,
  /\bk+i+l+l\s+y+o+u+r+s+e+l+f\b/i,
];

export interface FilterResult {
  allowed: boolean;
  reason?: string;
  cleanedText: string;
}

export function validateAndFilterChatMessage(rawText: string): FilterResult {
  const trimmed = rawText.trim();

  if (!trimmed) {
    return {
      allowed: false,
      reason: 'Message cannot be empty.',
      cleanedText: '',
    };
  }

  if (trimmed.length > 300) {
    return {
      allowed: false,
      reason: 'Message is too long (maximum 300 characters).',
      cleanedText: '',
    };
  }

  // Check against severe slur patterns
  // Normalize by stripping repetitive special characters to catch evasion attempts like "f.a.g" or "n_i_g_g_e_r"
  const normalizedNoPunct = trimmed.replace(/[\s\.\-_*~`|\\/,]+/g, '');

  for (const pattern of SEVERE_SLUR_PATTERNS) {
    if (pattern.test(trimmed) || pattern.test(normalizedNoPunct)) {
      return {
        allowed: false,
        reason: 'Message blocked: Slurs and hate speech are not allowed in the chatroom.',
        cleanedText: '',
      };
    }
  }

  // If passed slur check, mild swearing is allowed
  return {
    allowed: true,
    cleanedText: trimmed,
  };
}
