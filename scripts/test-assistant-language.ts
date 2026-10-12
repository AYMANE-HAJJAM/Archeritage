import {
  detectAssistantLanguage,
  detectLanguageFromText,
  getLocalizedAssistantErrorMessage,
} from '../src/lib/assistant/shared/language';

const cases = [
  ['Que fait ARCHERITAGE ?', 'fr'],
  ['What does ARCHERITAGE do?', 'en'],
  ['ما هي خدمات ARCHERITAGE؟', 'ar'],
  ['شنو كدير ARCHERITAGE؟', 'darija-arabic'],
  ['ach katdir ARCHERITAGE ?', 'darija-latin'],
  ['3andi terrain wach t9dro t3awnoni ?', 'darija-latin'],
  ['Je veux comprendre PATRIGOV, can you explain it in English?', 'en'],
  ['Bonjour', 'fr'],
  ['Hello', 'en'],
  ['Salam', 'darija-latin'],
  ['السلام عليكم', 'ar'],
  ['Bghit n3raf PATRIGOV, explique-moi ça simplement.', 'darija-latin'],
  ['Et PATRIGOV ?', null],
] as const;

let failed = 0;
for (const [text, expected] of cases) {
  const got = detectLanguageFromText(text);
  const pass = got === expected;
  if (!pass) failed += 1;
  console.log(`${pass ? 'OK' : 'FAIL'} ${JSON.stringify(text)} => ${got}`);
}

const continuity = detectAssistantLanguage([
  { role: 'user', content: 'Que fait ARCHERITAGE ?' },
  { role: 'assistant', content: 'ARCHERITAGE est un cabinet...' },
  { role: 'user', content: 'Et PATRIGOV ?' },
]);
console.log(`continuity => ${continuity}`);
if (continuity !== 'fr') failed += 1;

console.log('en timeout:', getLocalizedAssistantErrorMessage('timeout', 'en'));
console.log(`failed=${failed}`);
process.exit(failed === 0 ? 0 : 1);
