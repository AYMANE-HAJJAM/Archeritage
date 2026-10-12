/**
 * Verifies FR/EN/AR message catalogs stay in sync.
 *
 * Usage: npx tsx scripts/check-i18n-messages.ts
 * or: npm run i18n:check
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'messages');
const LOCALES = ['fr', 'en', 'ar'] as const;
const ALLOWED_IDENTICAL = new Set([
  'ARCHERITAGE',
  'PATRIGOV',
  'UNESCO',
  'UNDP',
  'UNESCO / UNDP',
  'Casablanca',
  'Tinmel',
  'Tiznit',
  'Safi',
  'Tanger',
  'APDN',
  'Ahmed Taoufik Naciri',
]);

const PLACEHOLDER_RE = /TODO_TRANSLATE|FIXME_TRANSLATE|\[\[.*\]\]|TBD_TRANSLATION/i;
const FRENCH_HINT_RE =
  /\b(cabinet d’architecture|maître d’ouvrage|valorisation foncière|à paraître|discuter d’un projet|mentions légales)\b/i;

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function flatten(value: Json, prefix = ''): Record<string, string> {
  if (typeof value === 'string') {
    return { [prefix]: value };
  }
  if (Array.isArray(value)) {
    return value.reduce<Record<string, string>>((acc, item, index) => {
      Object.assign(acc, flatten(item as Json, prefix ? `${prefix}.${index}` : String(index)));
      return acc;
    }, {});
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce<Record<string, string>>((acc, [key, nested]) => {
      Object.assign(acc, flatten(nested, prefix ? `${prefix}.${key}` : key));
      return acc;
    }, {});
  }
  return { [prefix]: String(value) };
}

function loadNamespace(locale: string, file: string) {
  const path = join(ROOT, locale, file);
  return JSON.parse(readFileSync(path, 'utf8')) as Json;
}

function validateIcu(text: string, key: string, errors: string[]) {
  const opens = (text.match(/\{/g) ?? []).length;
  const closes = (text.match(/\}/g) ?? []).length;
  if (opens !== closes) {
    errors.push(`ICU brace mismatch at ${key}`);
  }
}

function main() {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const locale of LOCALES) {
    const dir = join(ROOT, locale);
    if (!existsSync(dir)) {
      errors.push(`Missing locale directory: messages/${locale}`);
    }
  }
  if (errors.length) {
    fail(errors, warnings);
  }

  const frFiles = readdirSync(join(ROOT, 'fr')).filter((name) => name.endsWith('.json')).sort();
  for (const locale of LOCALES.slice(1)) {
    const files = readdirSync(join(ROOT, locale)).filter((name) => name.endsWith('.json')).sort();
    for (const file of frFiles) {
      if (!files.includes(file)) errors.push(`Missing namespace ${locale}/${file}`);
    }
    for (const file of files) {
      if (!frFiles.includes(file)) errors.push(`Unexpected namespace ${locale}/${file}`);
    }
  }

  for (const file of frFiles) {
    const frFlat = flatten(loadNamespace('fr', file));
    for (const locale of LOCALES.slice(1)) {
      const otherFlat = flatten(loadNamespace(locale, file));
      for (const key of Object.keys(frFlat)) {
        if (!(key in otherFlat)) {
          errors.push(`Missing key ${locale}/${file} → ${key}`);
          continue;
        }
        const value = otherFlat[key]?.trim() ?? '';
        if (!value) {
          errors.push(`Empty translation ${locale}/${file} → ${key}`);
        }
        if (PLACEHOLDER_RE.test(value)) {
          errors.push(`Placeholder left in ${locale}/${file} → ${key}`);
        }
        validateIcu(value, `${locale}/${file}:${key}`, errors);
        if (locale !== 'fr' && FRENCH_HINT_RE.test(value) && !ALLOWED_IDENTICAL.has(value)) {
          warnings.push(`Possible leftover French in ${locale}/${file} → ${key}: "${value.slice(0, 80)}"`);
        }
      }
      for (const key of Object.keys(otherFlat)) {
        if (!(key in frFlat)) {
          errors.push(`Extra key ${locale}/${file} → ${key}`);
        }
      }
    }

    for (const [key, value] of Object.entries(frFlat)) {
      if (!value.trim()) errors.push(`Empty French source fr/${file} → ${key}`);
      validateIcu(value, `fr/${file}:${key}`, errors);
    }
  }

  fail(errors, warnings);
}

function fail(errors: string[], warnings: string[]) {
  if (warnings.length) {
    console.warn(`i18n warnings (${warnings.length}):`);
    for (const warning of warnings.slice(0, 40)) console.warn(`  - ${warning}`);
    if (warnings.length > 40) console.warn(`  … ${warnings.length - 40} more`);
  }
  if (errors.length) {
    console.error(`i18n check failed (${errors.length} error(s)):`);
    for (const error of errors.slice(0, 80)) console.error(`  - ${error}`);
    if (errors.length > 80) console.error(`  … ${errors.length - 80} more`);
    process.exit(1);
  }
  console.log('i18n check passed: FR/EN/AR namespaces and keys are aligned.');
}

main();
