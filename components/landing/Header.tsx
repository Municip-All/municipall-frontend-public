"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard, Menu, X } from "lucide-react";
import clsx from "clsx";
import { navLinks, site } from "@/lib/content";
import { useBackofficeUrl } from "@/hooks/useBackofficeUrl";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const backofficeUrl = useBackofficeUrl();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[var(--border)] bg-white/90 backdrop-blur-xl shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:h-[4.5rem] lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white ring-1 ring-[var(--border)] shadow-sm">
            <Image
              src="/logo.png"
              alt={site.name}
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-[var(--foreground)]">
            Municip&apos;All
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href={backofficeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !gap-1.5 !py-2.5 !text-xs"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Accéder au backoffice
          </a>
          <a href="#contact" className="btn-primary !py-2.5 !text-xs">
            Demander un devis
          </a>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-[var(--foreground)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--border)] bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-municipall-sky/50"
              >
                {link.label}
              </a>
            ))}
            <a
              href={backofficeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-secondary mt-2 flex items-center justify-center gap-2 text-center"
            >
              <LayoutDashboard className="h-4 w-4" />
              Accéder au backoffice
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-primary text-center"
            >
              Demander un devis
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
