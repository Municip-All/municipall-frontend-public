import { Check } from "lucide-react";
import clsx from "clsx";
import { pricingPlans } from "@/lib/content";

export default function Pricing() {
  return (
    <section id="tarifs" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Tarifs</p>
          <h2 className="section-title mt-3">
            Des offres adaptées à votre taille
          </h2>
          <p className="section-lead mx-auto">
            Tarifs indicatifs — chaque projet fait l&apos;objet d&apos;un devis
            personnalisé selon vos modules, votre volume et votre calendrier.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.id}
              className={clsx(
                "relative flex flex-col rounded-2xl border p-8 transition-all",
                plan.highlight
                  ? "border-[#0b0080] bg-gradient-to-b from-[#0b0080]/5 to-white shadow-hero ring-1 ring-[#0b0080]/20"
                  : "border-[var(--border)] bg-[var(--card)] shadow-premium",
              )}
            >
              {plan.highlight ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0b0080] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Le plus demandé
                </span>
              ) : null}

              <p className="text-sm font-semibold text-[var(--accent)]">
                {plan.name}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">{plan.audience}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl font-black text-[var(--foreground)]">
                  {plan.price}
                </span>
                {plan.period ? (
                  <span className="text-sm text-[var(--muted)]">
                    {plan.period}
                  </span>
                ) : null}
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-[var(--muted)]"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0b0080]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={clsx(
                  "mt-8 w-full text-center",
                  plan.highlight ? "btn-primary" : "btn-secondary",
                )}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-[var(--muted)]">
          Frais de mise en service et personnalisation avancée sur devis.
          <br />
          Remises possibles pour intercommunalités et engagements pluriannuels.
        </p>
      </div>
    </section>
  );
}
