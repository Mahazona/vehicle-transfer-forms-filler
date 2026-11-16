/**
 * Parse Sri Lankan Vehicle Registration Numbers into structured parts for MTA 6 & MTA 8 forms.
 * Supports:
 * - Sri Numbers: e.g. "5 Sri 2525", "19 Sri 1234", "301 Sri 5555", "31 SRI 4567"
 * - Modern Province Format: e.g. "WP CAA-2525", "WP CAA 2525", "SP BBA-1234"
 * - Vintage Dash Format: e.g. "64-1234", "250-5678"
 * - Government / Special formats
 */
export function parseVehicleNumber(raw) {
  if (!raw) {
    return { part1: '', part2: '', part3: '', fullFormatted: '', mta8String: '' };
  }

  const str = raw.trim().toUpperCase().replace(/\s+/g, ' ');

  // 1. Sri numbers: e.g. "5 SRI 2525" or "19 SRI 1234" or "301 SRI 5555"
  const sriMatch = str.match(/^(\d{1,3})\s*[-/ ]?\s*(SRI|ශ්‍රී)\s*[-/ ]?\s*(\d{1,4})$/i);
  if (sriMatch) {
    const p1 = sriMatch[1]; // e.g. "5", "19", "301"
    const p2 = 'SRI';
    const p3 = sriMatch[3]; // e.g. "2525"
    // For MTA 8 (10 cells continuous): e.g. "5  SRI 2525"
    let mta8 = '';
    if (p1.length === 1) {
      mta8 = `${p1} SRI ${p3}`; // e.g. "5 SRI 2525" (10 chars with spaces)
    } else if (p1.length === 2) {
      mta8 = `${p1} SRI ${p3}`; // 10 chars
    } else {
      mta8 = `${p1} SRI ${p3}`.slice(0, 10);
    }

    return {
      part1: p1,
      part2: p2,
      part3: p3,
      isSri: true,
      fullFormatted: `${p1} SRI ${p3}`,
      mta8String: mta8
    };
  }

  // 2. Modern Province format: e.g. "WP CAA-2525" or "WP CAA 2525"
  const modernMatch = str.match(/^([A-Z]{2})\s*[-/ ]?\s*([A-Z]{2,3})\s*[-/ ]?\s*(\d{4})$/);
  if (modernMatch) {
    const p1 = modernMatch[1]; // "WP"
    const p2 = modernMatch[2]; // "CAA"
    const p3 = modernMatch[3]; // "2525"
    return {
      part1: p1,
      part2: p2,
      part3: p3,
      isModern: true,
      fullFormatted: `${p1} ${p2}-${p3}`,
      // For MTA 8 (10 cells): e.g. "WP CAA 2525" or "WP CAA2525"
      mta8String: `${p1} ${p2} ${p3}`.slice(0, 10)
    };
  }

  // 3. Vintage Dash format: e.g. "64-1234" or "250-5678"
  const dashMatch = str.match(/^(\d{1,3})\s*[-/ ]\s*(\d{4})$/);
  if (dashMatch) {
    const p1 = dashMatch[1];
    const p2 = '-';
    const p3 = dashMatch[2];
    return {
      part1: p1,
      part2: p2,
      part3: p3,
      isDash: true,
      fullFormatted: `${p1}-${p3}`,
      mta8String: `${p1} - ${p3}`.slice(0, 10)
    };
  }

  // 4. Fallback: split by space/hyphen
  const parts = str.split(/[\s-]+/).filter(Boolean);
  if (parts.length >= 3) {
    return {
      part1: parts[0].slice(0, 3),
      part2: parts[1].slice(0, 3),
      part3: parts[2].slice(0, 4),
      fullFormatted: str,
      mta8String: str.replace(/[^A-Z0-9]/g, ' ').slice(0, 10)
    };
  } else if (parts.length === 2) {
    return {
      part1: parts[0].slice(0, 3),
      part2: '',
      part3: parts[1].slice(0, 4),
      fullFormatted: str,
      mta8String: str.slice(0, 10)
    };
  }

  return {
    part1: str.slice(0, 3),
    part2: str.slice(3, 6),
    part3: str.slice(6, 10),
    fullFormatted: str,
    mta8String: str.slice(0, 10)
  };
}
