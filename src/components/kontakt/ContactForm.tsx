"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { TurnstileWidget } from "@/components/kontakt/TurnstileWidget";
import { buttonClassName } from "@/components/ui/ButtonLink";
import { contactServiceOptions } from "@/data/contact";
import {
  CONTACT_LIMITS,
  GENERIC_ERROR_MESSAGE,
  HONEYPOT_FIELD,
  TIMESTAMP_FIELD,
  TURNSTILE_FIELD,
  UNAVAILABLE_MESSAGE,
} from "@/lib/contact/constants";
import {
  fieldMessages,
  isValidEmail,
  isValidPhone,
  validateClientFiles,
  type FieldErrors,
} from "@/lib/contact/validation";
import {
  formatPhotoReadyLabel,
  optimizeContactPhotos,
} from "@/lib/contact/optimize-image";
import type { ContactApiResponse } from "@/lib/contact/api-types";

type ContactFormProps = {
  timestampToken: string | null;
  turnstileSiteKey: string | null;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const inputClass =
  "mt-2 min-h-12 w-full border border-border bg-surface px-3.5 py-3 text-base text-navy placeholder:text-muted/50 focus-visible:border-gold focus-visible:outline-none disabled:opacity-60";

const labelClass = "text-[0.9375rem] font-medium text-navy";

const hintClass = "mt-1 text-sm text-muted";

const errorClass = "mt-1.5 text-sm text-[#8a3a2a]";

function validateFields(values: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  privacy: boolean;
  files: File[];
}): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const message = values.message.trim();

  if (name.length < CONTACT_LIMITS.nameMin || name.length > CONTACT_LIMITS.nameMax) {
    errors.name = fieldMessages.name;
  }

  if (!email && !phone) {
    errors.contact = fieldMessages.contact;
  }

  if (email && (email.length > CONTACT_LIMITS.emailMax || !isValidEmail(email))) {
    errors.email = fieldMessages.email;
  }

  if (phone && (phone.length > CONTACT_LIMITS.phoneMax || !isValidPhone(phone))) {
    errors.phone = fieldMessages.phone;
  }

  if (!values.service) {
    errors.service = fieldMessages.service;
  }

  if (
    message.length < CONTACT_LIMITS.messageMin ||
    message.length > CONTACT_LIMITS.messageMax
  ) {
    errors.message = fieldMessages.message;
  }

  if (!values.privacy) {
    errors.privacy = fieldMessages.privacy;
  }

  Object.assign(errors, validateClientFiles(values.files));
  return errors;
}

export function ContactForm({ timestampToken, turnstileSiteKey }: ContactFormProps) {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitLock = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<File[]>([]);
  const [photosPreparing, setPhotosPreparing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [banner, setBanner] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const submitting = status === "submitting";
  const photosBusy = photosPreparing;
  const processedBytes = processedFiles.reduce((sum, file) => sum + file.size, 0);

  useEffect(() => {
    if (files.length === 0) {
      return;
    }

    let cancelled = false;

    optimizeContactPhotos(files)
      .then((optimized) => {
        if (cancelled) return;
        setProcessedFiles(optimized);
        setPhotosPreparing(false);
        setErrors((current) => ({ ...current, photos: undefined }));
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setProcessedFiles([]);
        setPhotosPreparing(false);
        const message =
          error instanceof Error && error.message
            ? error.message
            : fieldMessages.filesOptimize;
        setErrors((current) => ({ ...current, photos: message }));
      });

    return () => {
      cancelled = true;
    };
  }, [files]);

  function ids(field: string) {
    return {
      field: `${formId}-${field}`,
      error: `${formId}-${field}-error`,
    };
  }

  function mergeFiles(incoming: FileList | File[]) {
    const next = [...files];
    for (const file of Array.from(incoming)) {
      const duplicate = next.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified,
      );
      if (!duplicate) next.push(file);
    }

    const fileErrors = validateClientFiles(next);
    if (fileErrors.photos) {
      setErrors((current) => ({ ...current, photos: fileErrors.photos }));
      return;
    }

    setFiles(next);
    setProcessedFiles([]);
    setPhotosPreparing(true);
    setErrors((current) => ({ ...current, photos: undefined }));
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    if (next.length === 0) {
      setProcessedFiles([]);
      setPhotosPreparing(false);
    } else {
      setProcessedFiles([]);
      setPhotosPreparing(true);
    }
    const fileErrors = validateClientFiles(next);
    setErrors((current) => ({ ...current, photos: fileErrors.photos }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function focusFirstError(nextErrors: FieldErrors) {
    const order = ["name", "email", "phone", "contact", "service", "message", "photos", "privacy"] as const;
    for (const key of order) {
      if (!nextErrors[key]) continue;
      const targetId = key === "contact" ? ids("email").field : ids(key).field;
      document.getElementById(targetId)?.focus();
      break;
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current || submitting || photosBusy) return;

    const nextErrors = validateFields({
      name,
      email,
      phone,
      service,
      message,
      privacy,
      files,
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      setBanner(null);
      focusFirstError(nextErrors);
      return;
    }

    if (files.length > 0 && processedFiles.length !== files.length) {
      setErrors({ photos: fieldMessages.filesOptimize });
      setStatus("error");
      focusFirstError({ photos: fieldMessages.filesOptimize });
      return;
    }

    submitLock.current = true;
    setStatus("submitting");
    setBanner(null);
    setErrors({});

    const body = new FormData();
    body.set("name", name);
    body.set("email", email);
    body.set("phone", phone);
    body.set("service", service);
    body.set("message", message);
    body.set("privacy", privacy ? "true" : "false");
    body.set(HONEYPOT_FIELD, honeypot);
    if (timestampToken) body.set(TIMESTAMP_FIELD, timestampToken);
    if (turnstileToken) body.set(TURNSTILE_FIELD, turnstileToken);
    for (const file of processedFiles) {
      body.append("photos", file);
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body,
      });
      const payload = (await response.json()) as ContactApiResponse;

      if (payload.ok) {
        setStatus("success");
        setBanner(null);
        queueMicrotask(() => statusRef.current?.focus());
        return;
      }

      if (payload.error === "validation" && payload.fields) {
        setErrors(payload.fields);
        setStatus("error");
        setBanner(payload.message);
        focusFirstError(payload.fields);
        return;
      }

      setStatus("error");
      setBanner(
        payload.error === "unavailable" ? UNAVAILABLE_MESSAGE : GENERIC_ERROR_MESSAGE,
      );
      queueMicrotask(() => statusRef.current?.focus());
    } catch {
      setStatus("error");
      setBanner(GENERIC_ERROR_MESSAGE);
      queueMicrotask(() => statusRef.current?.focus());
    } finally {
      submitLock.current = false;
    }
  }

  if (status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        className="border-t border-border pt-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        role="status"
        aria-live="polite"
      >
        <p className="font-serif text-2xl text-foreground sm:text-3xl">
          Vielen Dank für Ihre Anfrage.
        </p>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Wir haben Ihre Nachricht erhalten und melden uns in Kürze — in der
          Regel noch am selben Werktag.
        </p>
        <button
          type="button"
          className={buttonClassName("gold", "mt-8")}
          onClick={() => {
            setName("");
            setEmail("");
            setPhone("");
            setService("");
            setMessage("");
            setPrivacy(false);
            setFiles([]);
            setProcessedFiles([]);
            setPhotosPreparing(false);
            setErrors({});
            setBanner(null);
            setTurnstileToken("");
            setStatus("idle");
          }}
        >
          Neue Anfrage
        </button>
      </div>
    );
  }

  const nameIds = ids("name");
  const emailIds = ids("email");
  const phoneIds = ids("phone");
  const serviceIds = ids("service");
  const messageIds = ids("message");
  const photosIds = ids("photos");
  const privacyIds = ids("privacy");
  const contactErrorId = ids("contact").error;
  const statusId = `${formId}-status`;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={submitting}
      className="space-y-6"
    >
      <div
        ref={statusRef}
        id={statusId}
        tabIndex={-1}
        className="sr-only"
        aria-live="assertive"
        role="status"
      >
        {submitting
          ? "Ihre Anfrage wird gesendet."
          : banner
            ? banner
            : ""}
      </div>

      {banner ? (
        <p className="text-sm leading-relaxed text-[#8a3a2a]" role="alert">
          {banner}
        </p>
      ) : null}

      <div className="sr-only" aria-hidden="true">
        <label htmlFor={ids(HONEYPOT_FIELD).field}>Website</label>
        <input
          id={ids(HONEYPOT_FIELD).field}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {timestampToken ? (
        <input type="hidden" name={TIMESTAMP_FIELD} value={timestampToken} />
      ) : null}

      <div>
        <label htmlFor={nameIds.field} className={labelClass}>
          Name
        </label>
        <input
          id={nameIds.field}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={CONTACT_LIMITS.nameMax}
          value={name}
          disabled={submitting}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? nameIds.error : undefined}
          className={inputClass}
          onChange={(event) => setName(event.target.value)}
        />
        {errors.name ? (
          <p id={nameIds.error} className={errorClass}>
            {errors.name}
          </p>
        ) : null}
      </div>

      <fieldset className="min-w-0">
        <legend className={labelClass}>E-Mail oder Telefon</legend>
        <p id={contactErrorId} className={hintClass}>
          Bitte mindestens eines der beiden Felder ausfüllen.
        </p>

        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div className="min-w-0">
            <label htmlFor={emailIds.field} className={labelClass}>
              E-Mail
            </label>
            <input
              id={emailIds.field}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={CONTACT_LIMITS.emailMax}
              value={email}
              disabled={submitting}
              aria-invalid={Boolean(errors.email || errors.contact)}
              aria-describedby={
                [errors.email ? emailIds.error : null, contactErrorId]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              className={inputClass}
              onChange={(event) => setEmail(event.target.value)}
            />
            {errors.email ? (
              <p id={emailIds.error} className={errorClass}>
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="min-w-0">
            <label htmlFor={phoneIds.field} className={labelClass}>
              Telefon
            </label>
            <input
              id={phoneIds.field}
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={CONTACT_LIMITS.phoneMax}
              value={phone}
              disabled={submitting}
              aria-invalid={Boolean(errors.phone || errors.contact)}
              aria-describedby={
                [errors.phone ? phoneIds.error : null, contactErrorId]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              className={inputClass}
              onChange={(event) => setPhone(event.target.value)}
            />
            {errors.phone ? (
              <p id={phoneIds.error} className={errorClass}>
                {errors.phone}
              </p>
            ) : null}
          </div>
        </div>
        {errors.contact ? (
          <p className={errorClass}>{errors.contact}</p>
        ) : null}
      </fieldset>

      <div>
        <label htmlFor={serviceIds.field} className={labelClass}>
          Leistung / Anliegen
        </label>
        <select
          id={serviceIds.field}
          name="service"
          required
          value={service}
          disabled={submitting}
          aria-invalid={Boolean(errors.service)}
          aria-describedby={errors.service ? serviceIds.error : undefined}
          className={`${inputClass} appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 fill=%22none%22%3E%3Cpath d=%22M1 1.5 6 6.5 11 1.5%22 stroke=%22%23131D3B%22 stroke-width=%221.4%22/%3E%3C/svg%3E')] bg-[length:12px_8px] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
          onChange={(event) => setService(event.target.value)}
        >
          <option value="">Bitte wählen</option>
          {contactServiceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.service ? (
          <p id={serviceIds.error} className={errorClass}>
            {errors.service}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={messageIds.field} className={labelClass}>
          Nachricht
        </label>
        <textarea
          id={messageIds.field}
          name="message"
          required
          rows={5}
          maxLength={CONTACT_LIMITS.messageMax}
          value={message}
          disabled={submitting}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? messageIds.error : undefined}
          className={`${inputClass} min-h-[8.5rem] resize-y leading-relaxed`}
          onChange={(event) => setMessage(event.target.value)}
        />
        {errors.message ? (
          <p id={messageIds.error} className={errorClass}>
            {errors.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={photosIds.field} className={labelClass}>
          Fotos <span className="font-normal text-muted">(optional)</span>
        </label>
        <p id={`${photosIds.field}-hint`} className={hintClass}>
          Bis zu {CONTACT_LIMITS.maxFiles} Dateien, je max. 8 MB — JPG, PNG oder
          WebP. Fotos werden vor dem Versand automatisch für die Anfrage
          optimiert.
        </p>

        <div
          className={`relative mt-3 border border-dashed bg-surface px-4 py-5 text-center transition-colors motion-reduce:transition-none ${
            dragging ? "border-gold bg-gold/10" : "border-border"
          } focus-within:border-gold`}
        >
          <input
            ref={fileInputRef}
            id={photosIds.field}
            name="photos"
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            multiple
            disabled={submitting || photosBusy}
            aria-invalid={Boolean(errors.photos)}
            aria-describedby={
              errors.photos
                ? `${photosIds.field}-hint ${photosIds.error}`
                : `${photosIds.field}-hint`
            }
            className="absolute inset-0 z-10 min-h-11 cursor-pointer opacity-0 disabled:cursor-not-allowed"
            onChange={(event) => {
              if (event.target.files?.length) mergeFiles(event.target.files);
              event.target.value = "";
            }}
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDrop={() => setDragging(false)}
          />
          <div className="pointer-events-none">
            <span className="inline-flex min-h-12 items-center justify-center rounded-sm border border-navy/30 bg-ivory px-4 py-2 text-sm font-medium text-navy">
              Dateien auswählen
            </span>
            <p className="mt-3 text-sm text-muted">
              oder Fotos hierher ziehen
            </p>
          </div>
        </div>

        {files.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex min-w-0 items-center justify-between gap-3 border-b border-border py-2 text-sm"
              >
                <span className="min-w-0 truncate text-foreground">
                  {file.name}
                </span>
                <button
                  type="button"
                  className="shrink-0 text-sm text-muted underline-offset-2 hover:text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  onClick={() => removeFile(index)}
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {photosBusy ? (
          <p className={hintClass} role="status">
            Fotos werden vorbereitet …
          </p>
        ) : processedFiles.length > 0 ? (
          <p className={hintClass} role="status">
            {formatPhotoReadyLabel(processedFiles.length, processedBytes)}
          </p>
        ) : null}

        {errors.photos ? (
          <p id={photosIds.error} className={errorClass}>
            {errors.photos}
          </p>
        ) : null}
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={privacyIds.field}
            name="privacy"
            type="checkbox"
            checked={privacy}
            disabled={submitting}
            aria-invalid={Boolean(errors.privacy)}
            aria-describedby={errors.privacy ? privacyIds.error : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            onChange={(event) => setPrivacy(event.target.checked)}
          />
          <label htmlFor={privacyIds.field} className="text-sm leading-relaxed text-foreground">
            Ich habe die{" "}
            <Link
              href="/datenschutz"
              className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
            >
              Datenschutzerklärung
            </Link>{" "}
            zur Kenntnis genommen.
          </label>
        </div>
        {errors.privacy ? (
          <p id={privacyIds.error} className={errorClass}>
            {errors.privacy}
          </p>
        ) : null}
      </div>

      {turnstileSiteKey ? (
        <TurnstileWidget siteKey={turnstileSiteKey} onToken={setTurnstileToken} />
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting || photosBusy}
          className={buttonClassName("gold", "w-full")}
        >
          {submitting ? "Wird gesendet …" : "Kostenloses Angebot anfragen"}
        </button>
      </div>
    </form>
  );
}
