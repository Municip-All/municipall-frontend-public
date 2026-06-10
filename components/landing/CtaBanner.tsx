import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b0080] via-[#312e81] to-indigo-600 px-8 py-14 text-center text-white shadow-hero sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-300/20 blur-2xl" />

          <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
            Prêt à vous lancer ?
          </p>
          <h2 className="relative mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Offrez à vos habitants une mairie à portée de main
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-indigo-100">
            Réservez une démonstration gratuite et découvrez comment Municip&apos;All
            s&apos;adapte à votre commune.
          </p>
          <a
            href="#contact"
            className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#0b0080] transition hover:bg-indigo-50"
          >
            Demander une démo gratuite
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
