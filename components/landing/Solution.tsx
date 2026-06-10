import { CheckCircle2, Users, Building2, HeartHandshake } from "lucide-react";
import { steps } from "@/lib/content";

const pillars = [
  {
    icon: Users,
    title: "Pour les citoyens",
    points: [
      "Signaler un problème en 30 secondes",
      "Suivre les réponses de la mairie",
      "Accéder aux infos locales utiles",
    ],
  },
  {
    icon: Building2,
    title: "Pour les équipes",
    points: [
      "Modérer signalements & messages",
      "Attribuer et suivre les statuts",
      "Communiquer de façon structurée",
    ],
  },
  {
    icon: HeartHandshake,
    title: "Pour l'élu & la direction",
    points: [
      "Vue d'ensemble et alertes",
      "Satisfaction mesurée sur dossiers réels",
      "Avis citoyens en toute confidentialité",
    ],
  },
];

export default function Solution() {
  return (
    <section id="solution" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="section-eyebrow">La solution</p>
            <h2 className="section-title mt-3">
              Une plateforme, trois expériences complémentaires
            </h2>
            <p className="section-lead">
              Municip&apos;All connecte l&apos;application mobile de vos
              habitants au backoffice de vos agents et au tableau de bord de
              votre exécutif — sans multiplier les outils.
            </p>

            <div className="mt-10 space-y-6">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-premium ring-1 ring-[var(--border)]">
                    <pillar.icon className="h-5 w-5 text-[#0b0080]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--foreground)]">
                      {pillar.title}
                    </h3>
                    <ul className="mt-2 space-y-1.5">
                      {pillar.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2 text-sm text-[var(--muted)]"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface p-8 lg:mt-8">
            <p className="section-eyebrow">Mise en place</p>
            <h3 className="mt-2 text-2xl font-bold">Comment ça se passe ?</h3>
            <div className="mt-8 space-y-8">
              {steps.map((item) => (
                <div key={item.step} className="relative pl-14">
                  <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#0b0080] text-xs font-black text-white">
                    {item.step}
                  </span>
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
