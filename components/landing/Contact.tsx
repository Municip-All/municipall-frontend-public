"use client";

import { FormEvent, useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { faqs, site } from "@/lib/content";

type FormState = {
  name: string;
  email: string;
  commune: string;
  population: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  commune: "",
  population: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.commune.trim()) {
      setError("Merci de renseigner au minimum votre nom, email et commune.");
      return;
    }

    const subject = encodeURIComponent(
      `Demande de devis Municip'All — ${form.commune}`,
    );
    const body = encodeURIComponent(
      [
        `Nom : ${form.name}`,
        `Email : ${form.email}`,
        `Commune : ${form.commune}`,
        `Population : ${form.population || "Non précisée"}`,
        "",
        "Message :",
        form.message || "(aucun message complémentaire)",
      ].join("\n"),
    );

    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setForm(initialForm);
  };

  return (
    <section id="contact" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="section-eyebrow">Contact</p>
            <h2 className="section-title mt-3">
              Parlons de votre projet communal
            </h2>
            <p className="section-lead">
              Démo personnalisée, devis sur-mesure ou questions techniques :
              notre équipe vous répond sous 48 h ouvrées.
            </p>

            <div className="mt-10 space-y-4">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              >
                <Mail className="h-5 w-5 text-[#0b0080]" />
                {site.email}
              </a>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              >
                <Phone className="h-5 w-5 text-[#0b0080]" />
                {site.phone}
              </a>
              <p className="flex items-center gap-3 text-sm text-[var(--muted)]">
                <MapPin className="h-5 w-5 text-[#0b0080]" />
                France · Hébergement souverain
              </p>
            </div>

            <div className="mt-12 space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-[var(--border)] bg-white p-4"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--foreground)] marker:content-none">
                    {faq.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="card-surface p-8"
            >
              <h3 className="text-xl font-bold">Demander un devis</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Décrivez votre commune et vos besoins — nous préparons une
                proposition adaptée.
              </p>

              {sent ? (
                <div className="mt-8 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-emerald-900">
                      Merci pour votre demande !
                    </p>
                    <p className="mt-1 text-sm text-emerald-800">
                      Votre client mail va s&apos;ouvrir pour envoyer le
                      message. Nous vous recontactons rapidement.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-1">
                    <span className="mb-1.5 block text-xs font-semibold text-[var(--foreground)]">
                      Nom & prénom *
                    </span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none ring-[#0b0080]/0 transition focus:border-[#0b0080]/30 focus:ring-2 focus:ring-[#0b0080]/10"
                      placeholder="Marie Dupont"
                    />
                  </label>
                  <label className="block sm:col-span-1">
                    <span className="mb-1.5 block text-xs font-semibold text-[var(--foreground)]">
                      Email professionnel *
                    </span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0b0080]/30 focus:ring-2 focus:ring-[#0b0080]/10"
                      placeholder="mairie@ville.fr"
                    />
                  </label>
                  <label className="block sm:col-span-1">
                    <span className="mb-1.5 block text-xs font-semibold text-[var(--foreground)]">
                      Commune *
                    </span>
                    <input
                      required
                      value={form.commune}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, commune: e.target.value }))
                      }
                      className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0b0080]/30 focus:ring-2 focus:ring-[#0b0080]/10"
                      placeholder="Ville de…"
                    />
                  </label>
                  <label className="block sm:col-span-1">
                    <span className="mb-1.5 block text-xs font-semibold text-[var(--foreground)]">
                      Population
                    </span>
                    <input
                      value={form.population}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, population: e.target.value }))
                      }
                      className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0b0080]/30 focus:ring-2 focus:ring-[#0b0080]/10"
                      placeholder="ex. 12 000 habitants"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-semibold text-[var(--foreground)]">
                      Votre projet
                    </span>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      className="w-full resize-none rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0b0080]/30 focus:ring-2 focus:ring-[#0b0080]/10"
                      placeholder="Modules souhaités, délais, contexte…"
                    />
                  </label>
                </div>
              )}

              {error ? (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              ) : null}

              {!sent ? (
                <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
                  Envoyer ma demande
                  <Send className="h-4 w-4" />
                </button>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
