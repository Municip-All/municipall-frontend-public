import {
  ArrowRight,
  Smartphone,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { heroStats, site } from "@/lib/content";

export default function Hero() {
  return (
    <section className="hero-glow relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#0b0080]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--accent)] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Solution SaaS pour collectivités
            </div>

            <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-[3.4rem]">
              Rapprochez votre commune{" "}
              <span className="text-gradient">de vos habitants</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              {site.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="btn-primary">
                Demander une démo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#fonctionnalites" className="btn-secondary">
                Découvrir les fonctionnalités
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[var(--border)] pt-8">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-black text-[var(--accent)] sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative mx-auto aspect-[4/5] max-w-sm">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#0b0080] to-indigo-500 opacity-90 shadow-hero" />
              <div className="absolute inset-[1px] rounded-[2rem] bg-[#0a0a12] p-4">
                <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-slate-50 to-white">
                  <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-[#0b0080]/10" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-800">
                          Ma commune
                        </p>
                        <p className="text-[9px] text-slate-500">Bienvenue</p>
                      </div>
                    </div>
                    <Smartphone className="h-4 w-4 text-[#0b0080]" />
                  </div>

                  <div className="flex-1 space-y-3 p-4">
                    <div className="rounded-2xl bg-[#0b0080] p-4 text-white shadow-lg">
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                        Signalement
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        Lampadaire défectueux
                      </p>
                      <p className="mt-2 text-[10px] opacity-75">
                        En cours · Réponse mairie
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {["Carte", "Contact", "Événements", "Transports"].map(
                        (label) => (
                          <div
                            key={label}
                            className="rounded-xl border border-slate-200 bg-white px-2 py-3 text-center text-[10px] font-semibold text-slate-700"
                          >
                            {label}
                          </div>
                        ),
                      )}
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                      <p className="text-[10px] font-bold text-emerald-800">
                        ★★★★★ Satisfaction citoyenne
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-6 hidden rounded-2xl border border-[var(--border)] bg-white p-4 shadow-premium sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b0080]/10">
                    <LayoutDashboard className="h-5 w-5 text-[#0b0080]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Backoffice mairie</p>
                    <p className="text-[10px] text-[var(--muted)]">
                      Modération & pilotage
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
