import { z } from 'zod';
import { clientProfileKeys, projectTypeKeys } from '@/content/site/contact-form';
export type ContactValidationMessages = {
  fullName: string; email: string; profile: string; projectType: string;
  messageMin: string; phone: string; privacyConsent: string; tooLong: string;
};
const fallback: ContactValidationMessages = {
  fullName: 'Indiquez votre nom et prénom.', email: 'Indiquez une adresse email valide.',
  profile: 'Choisissez votre profil.', projectType: 'Choisissez un besoin.',
  messageMin: 'Indiquez votre message.', phone: 'Vérifiez le numéro de téléphone.',
  privacyConsent: 'Votre accord est nécessaire pour traiter votre demande.',
  tooLong: 'Ce texte est trop long. Merci de le raccourcir.',
};
export function createContactSchema(messages: ContactValidationMessages = fallback) {
  const optionalText = (max: number) => z.string().trim().max(max, messages.tooLong).optional();
  return z.object({
    fullName: z.string().trim().min(1, messages.fullName).max(160, messages.tooLong),
    organization: optionalText(160),
    email: z.string().trim().email(messages.email).max(254, messages.tooLong),
    phone: optionalText(60).refine((value) => !value || (/^[+\p{Nd}\s().\-/#xextensio:]+$/iu.test(value) && (value.match(/\p{Nd}/gu)?.length ?? 0) >= 6), messages.phone),
    profile: z.enum(clientProfileKeys, { error: messages.profile }),
    projectType: z.enum(projectTypeKeys, { error: messages.projectType }),
    projectLocation: optionalText(180),
    message: z.string().trim().min(1, messages.messageMin).max(5000, messages.tooLong),
    privacyConsent: z.boolean().refine((value) => value, messages.privacyConsent),
    publicationsConsent: z.boolean(),
    context: z.enum(projectTypeKeys).optional(),
    website: optionalText(200),
  });
}
export const contactSchema = createContactSchema();
export type ContactValues = z.infer<typeof contactSchema>;
