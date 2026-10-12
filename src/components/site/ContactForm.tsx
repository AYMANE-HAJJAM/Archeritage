'use client';

import { useMemo, useRef, useState, type InputHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { ArcheritageIcon } from '@/components/icons/ArcheritageIcon';
import {
  clientProfileKeys,
  projectTypeKeys,
  type ContactInitialValues,
} from '@/content/site/contact-form';
import { Link, useRouter } from '@/i18n/navigation';
import {
  createContactSchema,
  type ContactValues,
} from '@/lib/validation';

type ContactFormProps = {
  initialValues?: ContactInitialValues;
};

export function ContactForm({ initialValues = {} }: ContactFormProps) {
  const locale = useLocale();
  const t = useTranslations('contact');
  const router = useRouter();
  const sending = useRef(false);
  const [redirecting, setRedirecting] = useState(false);
  const [status, setStatus] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const contactSchema = useMemo(() => createContactSchema({
    fullName: t('validation.fullName'),
    email: t('validation.email'),
    profile: t('validation.profile'),
    projectType: t('validation.projectType'),
    phone: t('validation.phone'),
    privacyConsent: t('validation.privacyConsent'),
    tooLong: t('validation.tooLong'),
    messageMin: t('validation.messageMin'),
  }), [t]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      organization: '',
      profile: initialValues.profile,
      email: '',
      phone: '',
      projectType: initialValues.projectType,
      projectLocation: '',
      privacyConsent: false,
      publicationsConsent: false,
      context: initialValues.context,
      message: '',
      website: '',
    },
  });

  const submit = handleSubmit(async (values) => {
    if (sending.current) return;
    sending.current = true;
    setStatus(null);
    const form = new FormData();
    Object.entries(values).forEach(([key, value]) => { if (value !== undefined) form.append(key, String(value)); });
    form.append('locale', locale);
    try {
      const response = await fetch('/api/contact', { method: 'POST', body: form });
      const result = await response.json() as { success?: boolean; message?: string; errors?: Partial<Record<keyof ContactValues, string>> };
      if (!response.ok || result.success !== true) {
        Object.entries(result.errors ?? {}).forEach(([key, message], index) => {
          if (key in values && message) setError(key as keyof ContactValues, { message }, { shouldFocus: index === 0 });
        });
        setStatus({ kind: 'error', message: result.message || t('status.sendFailed') });
        return;
      }
      setRedirecting(true);
      router.push('/contact/confirmation');
    } catch {
      setStatus({ kind: 'error', message: t('status.genericError') });
    } finally {
      sending.current = false;
    }
  });

  const field = (
    name: keyof ContactValues,
    label: string,
    options: InputHTMLAttributes<HTMLInputElement> = {},
    required = false,
  ) => (
    <label htmlFor={name}>
      {label}{required ? <span aria-hidden="true"> *</span> : null}
      <input
        id={name}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...options}
        {...register(name)}
      />
      {errors[name] ? <small id={`${name}-error`} role="alert">{errors[name]?.message}</small> : null}
    </label>
  );

  const selectField = (
    name: 'profile' | 'projectType',
    label: string,
    options: readonly { value: string; label: string }[],
    required = false,
  ) => (
    <label htmlFor={name}>
      {label}{required ? <span aria-hidden="true"> *</span> : null}
      <select
        id={name}
        defaultValue={initialValues[name] ?? ''}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...register(name)}
      >
        <option value="">{t('form.select')}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {errors[name] ? <small id={`${name}-error`} role="alert">{errors[name]?.message}</small> : null}
    </label>
  );

  const profileOptions = clientProfileKeys.map((key) => ({ value: key, label: t(`profiles.${key}`) }));
  const projectTypeOptions = projectTypeKeys.map((key) => ({ value: key, label: t(`projectTypes.${key}`) }));

  return (
    <form className="contact-form" onSubmit={submit} noValidate aria-busy={isSubmitting}>
      {initialValues.context ? <p className="contact-context">{t('selectedContext', { name: t(`projectTypes.${initialValues.context}`) })}</p> : null}
      <p className="contact-required">{t('form.requiredNote')}</p>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">
          {t('form.website')}
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            {...register('website')}
          />
        </label>
      </div>
      <div className="form-grid">
        {field('fullName', t('form.fullName'), { autoComplete: 'name' }, true)}
        {field('organization', t('form.organization'), { autoComplete: 'organization' })}
        {field('email', t('form.email'), { type: 'email', autoComplete: 'email' }, true)}
        {field('phone', t('form.phone'), { type: 'tel', autoComplete: 'tel' })}
        {selectField('profile', t('form.profile'), profileOptions, true)}
        {selectField('projectType', t('form.projectType'), projectTypeOptions, true)}
        {field('projectLocation', t('form.projectLocation'), { autoComplete: 'address-level2' })}
      </div>
      <label htmlFor="message">
        {t('form.message')} <span aria-hidden="true">*</span>
        <textarea id="message" rows={5} required aria-required="true" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} {...register('message')} />
        {errors.message ? <small id="message-error" role="alert">{errors.message.message}</small> : null}
      </label>
      <div className="contact-consents">
        <label className="contact-consent" htmlFor="privacyConsent">
          <input id="privacyConsent" type="checkbox" required aria-invalid={Boolean(errors.privacyConsent)} aria-describedby={errors.privacyConsent ? 'privacyConsent-error' : undefined} {...register('privacyConsent')} />
          <span>{t.rich('form.privacyConsent', { privacy: (chunks) => <Link href="/confidentialite">{chunks}</Link> })} <span aria-hidden="true">*</span></span>
        </label>
        {errors.privacyConsent ? <small id="privacyConsent-error" role="alert">{errors.privacyConsent.message}</small> : null}
        <label className="contact-consent contact-consent--optional" htmlFor="publicationsConsent">
          <input id="publicationsConsent" type="checkbox" {...register('publicationsConsent')} />
          <span>{t('form.publicationsConsent')}</span>
        </label>
      </div>
      {status ? <div className={`form-status form-status--${status.kind}`} role={status.kind === 'error' ? 'alert' : 'status'} aria-live="polite"><ArcheritageIcon name={status.kind === 'success' ? 'check' : 'shield-alert'} />{status.message}</div> : null}
      <button className="button button--primary" type="submit" disabled={isSubmitting || redirecting}>
        {isSubmitting || redirecting ? t('form.submitting') : t('form.submit')}<ArcheritageIcon name="send" />
      </button>
      <span className="sr-only" role="status">{isSubmitting ? t('form.submitting') : ''}</span>
    </form>
  );
}
