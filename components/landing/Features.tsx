import {
  MapPin,
  MessageSquare,
  Landmark,
  Shield,
  BarChart3,
  Palette,
} from "lucide-react";
import { features } from "@/lib/content";

const icons = {
  "map-pin": MapPin,
  messages: MessageSquare,
  landmark: Landmark,
  shield: Shield,
  chart: BarChart3,
  palette: Palette,
} as const;

export default function Features() {
  return (
    <section id="fonctionnalites" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="section-eyebrow">Fonctionnalités</p>
          <h2 className="section-title mt-3">
            Tout ce dont une commune moderne a besoin
          </h2>
          <p className="section-lead">
            Une application citoyenne complète, couplée à un backoffice pensé
            pour les équipes municipales et le pilotage politique.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = icons[feature.icon];
            return (
              <article
                key={feature.title}
                className="card-surface group p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(11,0,128,0.12)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b0080]/8 text-[#0b0080] transition-colors group-hover:bg-[#0b0080] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
