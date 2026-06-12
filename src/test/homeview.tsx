import React, { useEffect, useState } from 'react';
import { useApp } from './Appcontext';
import { ViewName } from '../types';
import { MapModal } from './mapview';

/* ── CSS ───────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');

@keyframes hv-up {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes hv-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes hv-blob-1 {
  0%,100% { transform: translate(0,0) scale(1); }
  33%     { transform: translate(40px,-30px) scale(1.06); }
  66%     { transform: translate(-20px,20px) scale(.96); }
}
@keyframes hv-blob-2 {
  0%,100% { transform: translate(0,0) scale(1); }
  40%     { transform: translate(-36px,40px) scale(.94); }
  70%     { transform: translate(24px,-16px) scale(1.04); }
}
@keyframes hv-blob-3 {
  0%,100% { transform: translate(0,0) scale(1); }
  50%     { transform: translate(28px,30px) scale(1.05); }
}
@keyframes hv-blob-4 {
  0%,100% { transform: translate(0,0) scale(1); }
  55%     { transform: translate(-22px,-18px) scale(.97); }
}
@keyframes hv-ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes hv-stat-glow {
  0%,100% { text-shadow: none; }
  50%     { text-shadow: 0 0 28px rgba(59,85,143,.35); }
}
@keyframes hv-card-enter {
  from { opacity: 0; transform: translateY(28px) scale(.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes hv-sig-enter {
  from { opacity: 0; transform: translateX(-14px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes hv-pulse-dot {
  0%,100% { opacity: 1; }
  50%     { opacity: .35; }
}
@keyframes hv-weather-row-in {
  from { opacity: 0; transform: scale(.9); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes hv-arrow-bounce {
  0%,100% { transform: translateX(0); }
  50%     { transform: translateX(4px); }
}

/* ── Root ──────────────────────────────────────── */
.hv {
  position: fixed; inset: 0;
  overflow-y: auto; overflow-x: hidden;
  background: #FAFAF8;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #0F0F0E;
  scrollbar-width: thin;
  scrollbar-color: rgba(15,15,14,.12) transparent;
}
.hv::-webkit-scrollbar { width: 5px; }
.hv::-webkit-scrollbar-thumb { background: rgba(15,15,14,.12); border-radius: 3px; }

/* ── Nav ───────────────────────────────────────── */
.hv-nav {
  position: sticky; top: 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 3.5rem; height: 64px;
  background: rgba(250,250,248,.92);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(15,15,14,.07);
}
.hv-nav-logo {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 1.2rem; color: #0F0F0E; letter-spacing: -.3px; text-decoration: none;
  background: none; border: none; padding: 0; cursor: pointer;
}
.hv-nav-logo span { color: #3B558F; }
.hv-nav-links {
  display: flex; gap: 2.25rem; list-style: none; margin: 0; padding: 0;
}
.hv-nav-links button {
  font-size: .84rem; font-weight: 500;
  color: rgba(15,15,14,.4); text-decoration: none;
  transition: color .2s; letter-spacing: .01em; position: relative;
  background: none; border: none; padding: 0; cursor: pointer;
  font-family: inherit;
}
.hv-nav-links button::after {
  content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
  height: 1.5px; background: #0F0F0E; transform: scaleX(0);
  transform-origin: left; transition: transform .25s cubic-bezier(.22,1,.36,1);
}
.hv-nav-links button:hover,
.hv-nav-links button.active { color: #0F0F0E; }
.hv-nav-links button.active::after,
.hv-nav-links button:hover::after { transform: scaleX(1); }
.hv-nav-right { display: flex; align-items: center; gap: 1rem; }
.hv-nav-notif {
  width: 36px; height: 36px; border-radius: 50%;
  background: #F4F2ED; border: 1px solid rgba(15,15,14,.1);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; position: relative; transition: background .2s, transform .2s;
}
.hv-nav-notif:hover { background: #ECEAE4; transform: scale(1.06); }
.hv-nav-notif-dot {
  position: absolute; top: 7px; right: 7px;
  width: 7px; height: 7px; border-radius: 50%;
  background: #C62828; border: 1.5px solid #FAFAF8;
  animation: hv-pulse-dot 2.4s ease-in-out infinite;
}
.hv-nav-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #1A3A8F, #7B8FCC);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: .82rem; color: #fff; cursor: pointer;
  box-shadow: 0 2px 12px rgba(26,58,143,.22);
  transition: transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s;
}
.hv-nav-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 20px rgba(26,58,143,.3);
}

/* ── Hero ──────────────────────────────────────── */
.hv-hero {
  position: relative; overflow: hidden;
  background: #F4F2ED;
  padding: 4.5rem 3.5rem 4rem;
  border-bottom: 1px solid rgba(15,15,14,.07);
  display: flex; align-items: center; justify-content: space-between;
  gap: 4rem; min-height: 280px;
}
.hv-hero-blobs { position: absolute; inset: 0; pointer-events: none; }
.hv-hero-blob {
  position: absolute; border-radius: 50%;
  filter: blur(80px); pointer-events: none; will-change: transform;
}
.hv-hero-blob-1 {
  width: 640px; height: 460px; top: -180px; right: -120px;
  background: radial-gradient(ellipse, rgba(59,85,143,.12), transparent 70%);
  animation: hv-blob-1 18s ease-in-out infinite;
}
.hv-hero-blob-2 {
  width: 440px; height: 360px; bottom: -100px; left: -80px;
  background: radial-gradient(ellipse, rgba(123,143,204,.1), transparent 70%);
  animation: hv-blob-2 24s ease-in-out 2s infinite;
}
.hv-hero-blob-3 {
  width: 320px; height: 280px; top: 20%; right: 28%;
  background: radial-gradient(ellipse, rgba(157,110,70,.07), transparent 70%);
  animation: hv-blob-3 30s ease-in-out 1s infinite;
}
.hv-hero-blob-4 {
  width: 200px; height: 160px; bottom: 10%; right: 20%;
  background: radial-gradient(ellipse, rgba(83,74,183,.08), transparent 70%);
  animation: hv-blob-4 20s ease-in-out 4s infinite;
}
.hv-hero-ghost {
  position: absolute; bottom: -2.5rem; right: -1.5rem;
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: clamp(130px, 15vw, 220px); line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(59,85,143,.07);
  pointer-events: none; user-select: none; letter-spacing: -6px;
  white-space: nowrap;
  animation: hv-fade 1.2s ease .4s both;
}
.hv-hero-left { position: relative; z-index: 1; flex: 1; }
.hv-hero-eyebrow {
  font-size: .73rem; font-weight: 600; letter-spacing: .15em;
  text-transform: uppercase; color: #3B558F; margin-bottom: 1.1rem;
  animation: hv-up .7s cubic-bezier(.22,1,.36,1) .1s both;
  display: flex; align-items: center; gap: .6rem;
}
.hv-hero-eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #3B558F;
  animation: hv-pulse-dot 2s ease-in-out infinite;
}
.hv-hero-greeting {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: clamp(2.4rem, 4vw, 3.6rem); letter-spacing: -2px;
  color: #0F0F0E; line-height: 1.08; margin-bottom: .6rem;
  animation: hv-up .75s cubic-bezier(.22,1,.36,1) .2s both;
}
.hv-hero-greeting em { font-style: italic; color: #3B558F; }
.hv-hero-sub {
  font-size: .98rem; color: rgba(15,15,14,.42); line-height: 1.65;
  animation: hv-up .75s cubic-bezier(.22,1,.36,1) .32s both;
}
.hv-hero-ctas {
  display: flex; gap: .85rem; margin-top: 1.8rem;
  animation: hv-up .75s cubic-bezier(.22,1,.36,1) .44s both;
}
.hv-hero-btn {
  padding: .75rem 1.6rem; border-radius: 2rem; font-size: .84rem;
  font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif;
  letter-spacing: .02em; transition: all .22s cubic-bezier(.22,1,.36,1); border: none;
}
.hv-hero-btn-primary {
  background: #0F0F0E; color: #FAFAF8;
  box-shadow: 0 4px 18px rgba(15,15,14,.2);
}
.hv-hero-btn-primary:hover {
  background: #1A3A8F;
  box-shadow: 0 8px 28px rgba(26,58,143,.3);
  transform: translateY(-2px);
}
.hv-hero-btn-secondary {
  background: transparent; color: #0F0F0E;
  border: 1.5px solid rgba(15,15,14,.18) !important;
}
.hv-hero-btn-secondary:hover {
  background: rgba(15,15,14,.04);
  border-color: rgba(15,15,14,.3) !important;
  transform: translateY(-2px);
}

/* Weather card */
.hv-weather {
  position: relative; z-index: 1; flex-shrink: 0;
  background: rgba(250,250,248,.88);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(15,15,14,.1);
  border-radius: 18px; padding: 1.8rem 2.25rem 1.5rem;
  min-width: 230px;
  animation: hv-up .75s cubic-bezier(.22,1,.36,1) .5s both;
  box-shadow: 0 8px 32px rgba(15,15,14,.07);
}
.hv-weather-label {
  font-size: .66rem; font-weight: 600; letter-spacing: .13em;
  text-transform: uppercase; color: rgba(15,15,14,.28); margin-bottom: .6rem;
}
.hv-weather-row {
  display: flex; align-items: flex-end; gap: .75rem; margin-bottom: .4rem;
  animation: hv-weather-row-in .6s cubic-bezier(.22,1,.36,1) .6s both;
}
.hv-weather-temp {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 3.4rem; color: #0F0F0E; letter-spacing: -2px; line-height: 1;
}
.hv-weather-icon { font-size: 2.4rem; opacity: .85; padding-bottom: .15rem; }
.hv-weather-desc { font-size: .88rem; color: rgba(15,15,14,.5); }
.hv-weather-city {
  font-size: .7rem; color: rgba(15,15,14,.28); margin-top: .2rem; letter-spacing: .04em;
}
.hv-weather-forecast {
  display: flex; gap: .5rem; margin-top: 1.1rem; padding-top: .9rem;
  border-top: 1px solid rgba(15,15,14,.07);
}
.hv-weather-day {
  flex: 1; text-align: center;
  font-size: .66rem; color: rgba(15,15,14,.35); line-height: 1.8;
}
.hv-weather-day-icon { font-size: .95rem; display: block; }
.hv-weather-day-temp { font-weight: 600; font-size: .7rem; color: rgba(15,15,14,.5); }

/* ── Stats strip ───────────────────────────────── */
.hv-stats-strip {
  background: #0F0F0E;
  padding: 0 3.5rem;
  display: flex; align-items: stretch;
  border-bottom: 1px solid rgba(255,255,255,.06);
  overflow: hidden;
}
.hv-stat {
  flex: 1; padding: 1.6rem 0; text-align: center;
  border-right: 1px solid rgba(255,255,255,.07);
  animation: hv-up .65s cubic-bezier(.22,1,.36,1) both;
  transition: background .25s;
}
.hv-stat:last-child { border-right: none; }
.hv-stat:hover { background: rgba(255,255,255,.03); }
.hv-stat-num {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 2rem; color: #FAFAF8; letter-spacing: -1px; line-height: 1;
  animation: hv-stat-glow 3.5s ease-in-out infinite;
}
.hv-stat:nth-child(2) .hv-stat-num { animation-delay: .8s; }
.hv-stat:nth-child(3) .hv-stat-num { animation-delay: 1.6s; }
.hv-stat-label {
  font-size: .68rem; font-weight: 500; letter-spacing: .1em;
  text-transform: uppercase; color: rgba(255,255,255,.35); margin-top: .35rem;
}
.hv-stat-accent { color: #7B8FCC; }

/* ── Alerts ticker ─────────────────────────────── */
.hv-ticker {
  background: linear-gradient(90deg, #1A3A8F, #3B558F 50%, #534AB7);
  padding: .6rem 0; overflow: hidden; position: relative;
}
.hv-ticker::before,
.hv-ticker::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: 60px; z-index: 1;
  pointer-events: none;
}
.hv-ticker::before { left: 0;  background: linear-gradient(90deg, #1A3A8F, transparent); }
.hv-ticker::after  { right: 0; background: linear-gradient(270deg, #534AB7, transparent); }
.hv-ticker-track {
  display: flex; gap: 0; white-space: nowrap;
  animation: hv-ticker 30s linear infinite;
  width: max-content;
}
.hv-ticker:hover .hv-ticker-track { animation-play-state: paused; }
.hv-ticker-item {
  padding: 0 2.4rem; font-size: .76rem; font-weight: 500;
  color: rgba(255,255,255,.82); display: inline-flex; align-items: center; gap: .55rem;
  border-right: 1px solid rgba(255,255,255,.12);
}
.hv-ticker-item:last-child { border-right: none; }
.hv-ticker-dot {
  width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.5); flex-shrink: 0;
}
.hv-ticker-badge {
  padding: .15rem .5rem; border-radius: 2rem;
  font-size: .62rem; font-weight: 600; letter-spacing: .06em;
  text-transform: uppercase; background: rgba(255,255,255,.18); color: #fff; flex-shrink: 0;
}
.hv-ticker-badge.urgent { background: rgba(198,40,40,.7); }
.hv-ticker-badge.info   { background: rgba(24,109,16,.6); }

/* ── Main content ──────────────────────────────── */
.hv-content { max-width: 1160px; margin: 0 auto; padding: 0 3.5rem 5rem; }

/* Section headers */
.hv-section-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin: 3.5rem 0 1.75rem; padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(15,15,14,.08);
}
.hv-section-label {
  font-size: .68rem; font-weight: 600; letter-spacing: .14em;
  text-transform: uppercase; color: rgba(15,15,14,.28); margin-bottom: .5rem;
}
.hv-section-title {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 1.65rem; letter-spacing: -1px; color: #0F0F0E; line-height: 1.1;
}
.hv-section-title em { font-style: italic; color: #3B558F; }
.hv-section-link {
  font-size: .8rem; font-weight: 500; color: rgba(15,15,14,.3);
  cursor: pointer; transition: color .2s; white-space: nowrap;
  display: flex; align-items: center; gap: .3rem;
}
.hv-section-link:hover { color: #0F0F0E; }
.hv-section-link-arrow { transition: transform .22s cubic-bezier(.22,1,.36,1); }
.hv-section-link:hover .hv-section-link-arrow { transform: translateX(4px); }

/* ── Services grid ─────────────────────────────── */
.hv-services-grid {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.3rem;
}
.hv-service-card {
  background: #F4F2ED;
  border: 1px solid rgba(15,15,14,.08);
  border-radius: 14px;
  padding: 1.5rem 1.3rem 1.4rem;
  cursor: pointer;
  transition: box-shadow .25s, border-color .25s;
  animation: hv-card-enter .6s cubic-bezier(.22,1,.36,1) both;
  display: flex; flex-direction: column; gap: .9rem;
  position: relative; overflow: hidden; will-change: transform;
}
.hv-service-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--accent-color, rgba(15,15,14,.1));
  opacity: 0; transition: opacity .25s;
  border-radius: 14px 14px 0 0;
}
.hv-service-card:hover::before { opacity: 1; }
.hv-service-card:hover {
  box-shadow: 0 16px 48px rgba(15,15,14,.12);
  border-color: rgba(15,15,14,.13);
}
.hv-service-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(15,15,14,.06); transition: transform .22s cubic-bezier(.34,1.56,.64,1);
}
.hv-service-card:hover .hv-service-icon { transform: scale(1.08) rotate(-4deg); }
.hv-service-icon svg { width: 22px; height: 22px; }
.hv-service-num {
  font-family: 'Playfair Display', serif; font-size: .72rem;
  font-weight: 700; color: rgba(15,15,14,.18); letter-spacing: .04em;
}
.hv-service-title {
  font-weight: 600; font-size: .93rem; color: #0F0F0E; line-height: 1.3;
}
.hv-service-desc {
  font-size: .78rem; color: rgba(15,15,14,.45); line-height: 1.6; flex: 1;
}
.hv-service-arrow {
  font-size: .78rem; color: rgba(15,15,14,.25); font-weight: 500;
  transition: color .2s, transform .22s cubic-bezier(.22,1,.36,1);
  align-self: flex-start;
}
.hv-service-card:hover .hv-service-arrow {
  color: var(--accent-text, #0F0F0E); transform: translateX(4px);
}

/* ── Lower grid ────────────────────────────────── */
.hv-lower {
  display: grid; grid-template-columns: 1fr 340px; gap: 2.5rem; align-items: start;
}

/* Signalement cards */
.hv-sig-list { display: flex; flex-direction: column; gap: .9rem; }
.hv-sig-card {
  background: #F4F2ED;
  border: 1px solid rgba(15,15,14,.08);
  border-left: 3px solid var(--sig-color, rgba(15,15,14,.1));
  border-radius: 12px;
  padding: 1.2rem 1.4rem 1.2rem 1.2rem;
  display: flex; align-items: flex-start; gap: .95rem;
  cursor: pointer;
  transition: transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s, border-color .22s;
  animation: hv-sig-enter .55s cubic-bezier(.22,1,.36,1) both;
}
.hv-sig-card:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 24px rgba(15,15,14,.08);
}
.hv-sig-cat {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.hv-sig-body { flex: 1; min-width: 0; }
.hv-sig-title {
  font-weight: 600; font-size: .93rem; color: #0F0F0E;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: .18rem;
}
.hv-sig-addr { font-size: .76rem; color: rgba(15,15,14,.35); }
.hv-sig-foot { display: flex; align-items: center; gap: .6rem; margin-top: .55rem; flex-wrap: wrap; }
.hv-badge {
  font-size: .59rem; font-weight: 600; letter-spacing: .06em;
  text-transform: uppercase; padding: .22rem .62rem; border-radius: 20px;
}
.hv-badge.en-cours  { background: rgba(59,85,143,.1);  color: #3B558F; }
.hv-badge.attente   { background: rgba(157,110,70,.12); color: #9D6E46; }
.hv-badge.resolu    { background: rgba(24,109,16,.1);  color: #186D10; }
.hv-sig-date { font-size: .68rem; color: rgba(15,15,14,.26); }
.hv-sig-progress {
  flex: 1; height: 2px; background: rgba(15,15,14,.08); border-radius: 1px;
  overflow: hidden; min-width: 40px;
}
.hv-sig-progress-fill {
  height: 100%; background: var(--sig-color, #3B558F); border-radius: 1px;
  transition: width 1.1s cubic-bezier(.25,.46,.45,.94);
}
.hv-empty {
  font-size: .9rem; color: rgba(15,15,14,.3); font-style: italic; padding: .5rem 0;
}

/* New signalement CTA */
.hv-sig-new-btn {
  margin-top: .5rem; padding: .8rem 1.4rem;
  background: transparent; border: 1.5px dashed rgba(15,15,14,.18);
  border-radius: 12px; width: 100%;
  font-family: 'Inter', sans-serif; font-size: .84rem; font-weight: 500;
  color: rgba(15,15,14,.4); cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: .5rem;
  transition: all .22s cubic-bezier(.22,1,.36,1);
}
.hv-sig-new-btn:hover {
  border-color: #3B558F; color: #3B558F;
  background: rgba(59,85,143,.04);
  transform: translateY(-1px);
}

/* ── Aside card ────────────────────────────────── */
.hv-aside-card {
  background: #F4F2ED; border: 1px solid rgba(15,15,14,.08);
  border-radius: 14px; overflow: hidden;
  animation: hv-card-enter .7s cubic-bezier(.22,1,.36,1) .5s both;
  box-shadow: 0 4px 20px rgba(15,15,14,.05);
}
.hv-aside-top {
  background: linear-gradient(135deg, #1A3A8F 0%, #3B558F 60%, #534AB7 100%);
  padding: 1.6rem 1.5rem 1.4rem; position: relative; overflow: hidden;
}
.hv-aside-top::before {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,255,255,.06); pointer-events: none;
}
.hv-aside-top::after {
  content: ''; position: absolute; bottom: -20px; left: -20px;
  width: 100px; height: 100px; border-radius: 50%;
  background: rgba(255,255,255,.04); pointer-events: none;
}
.hv-aside-avatar-row {
  display: flex; align-items: center; gap: .85rem; margin-bottom: 1.1rem; position: relative; z-index: 1;
}
.hv-aside-avatar {
  width: 46px; height: 46px; border-radius: 50%;
  background: rgba(255,255,255,.2); backdrop-filter: blur(8px);
  border: 2px solid rgba(255,255,255,.3);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-weight: 800; font-size: .95rem; color: #fff;
}
.hv-aside-name { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1.05rem; color: #fff; letter-spacing: -.2px; }
.hv-aside-role { font-size: .7rem; color: rgba(255,255,255,.55); margin-top: .15rem; }
.hv-aside-stats {
  display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; position: relative; z-index: 1;
}
.hv-aside-stat-box {
  background: rgba(255,255,255,.1); backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,.12); border-radius: 10px;
  padding: .65rem .8rem; text-align: center;
}
.hv-aside-stat-num {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 1.3rem; color: #fff; letter-spacing: -.5px;
}
.hv-aside-stat-lbl {
  font-size: .62rem; color: rgba(255,255,255,.5); font-weight: 500;
  text-transform: uppercase; letter-spacing: .08em; margin-top: .1rem;
}
.hv-aside-body { padding: 1.1rem 1.5rem; }
.hv-aside-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: .72rem 0; border-bottom: 1px solid rgba(15,15,14,.06); font-size: .84rem;
}
.hv-aside-row:last-child { border-bottom: none; }
.hv-aside-row-label { color: rgba(15,15,14,.42); display: flex; align-items: center; gap: .45rem; }
.hv-aside-row-label-icon { font-size: .9rem; }
.hv-aside-row-val { font-weight: 600; color: #0F0F0E; }
.hv-aside-cta {
  margin: 0 1.5rem 1.5rem; width: calc(100% - 3rem);
  padding: .82rem 1.2rem; background: #0F0F0E; border: none; border-radius: 2rem;
  font-family: 'Inter', sans-serif; font-size: .84rem; font-weight: 500;
  color: #FAFAF8; cursor: pointer; letter-spacing: .02em;
  display: flex; align-items: center; justify-content: center; gap: .5rem;
  transition: background .22s, transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s;
}
.hv-aside-cta:hover {
  background: #1A3A8F; transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(26,58,143,.22);
}
.hv-aside-cta-arrow {
  transition: transform .22s cubic-bezier(.22,1,.36,1);
  animation: hv-arrow-bounce 1.8s ease-in-out infinite;
}

/* ── Events mini preview ───────────────────────── */
.hv-events-row {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.1rem;
  margin-bottom: .5rem;
}
.hv-event-card {
  background: #F4F2ED; border: 1px solid rgba(15,15,14,.08); border-radius: 12px;
  padding: 1.1rem 1.2rem; cursor: pointer;
  transition: transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s;
  animation: hv-card-enter .6s cubic-bezier(.22,1,.36,1) both;
}
.hv-event-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(15,15,14,.1); }
.hv-event-date-tag {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .2rem .65rem; border-radius: 2rem; margin-bottom: .7rem;
  font-size: .63rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
  background: rgba(59,85,143,.1); color: #3B558F;
}
.hv-event-title { font-weight: 600; font-size: .88rem; color: #0F0F0E; line-height: 1.35; margin-bottom: .4rem; }
.hv-event-meta { font-size: .73rem; color: rgba(15,15,14,.38); }

/* ── Map FAB (left) ────────────────────────────── */
.hv-nav-chat {
  width: 36px; height: 36px; border-radius: 50%;
  background: #F4F2ED; border: 1px solid rgba(15,15,14,.1);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .2s, transform .2s;
}
.hv-nav-chat:hover { background: #ECEAE4; transform: scale(1.06); }
.hv-nav-chat.on {
  background: linear-gradient(135deg, #1A3A8F, #3B558F);
  border-color: transparent;
}
.hv-nav-chat.on svg { stroke: #fff; }

/* ── Map FAB ────────────────────────────────────── */
.hv-map-fab {
  position: fixed; bottom: 2rem; right: 2rem; z-index: 50;
  width: 52px; height: 52px; border-radius: 50%;
  background: #0F0F0E; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 28px rgba(15,15,14,.22);
  transition: background .22s, transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s;
  animation: hv-up .6s cubic-bezier(.22,1,.36,1) .9s both;
}
.hv-map-fab:hover {
  background: #1A3A8F; transform: translateY(-3px) scale(1.06);
  box-shadow: 0 12px 32px rgba(26,58,143,.3);
}
.hv-map-fab svg { width: 22px; height: 22px; }
.hv-map-fab-tip {
  position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
  background: #0F0F0E; color: #FAFAF8; font-family: 'Inter', sans-serif;
  font-size: .68rem; font-weight: 500; padding: .3rem .7rem; border-radius: .4rem;
  white-space: nowrap; pointer-events: none; opacity: 0;
  transition: opacity .2s; letter-spacing: .03em;
}
.hv-map-fab-tip::after {
  content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
  border: 4px solid transparent; border-top-color: #0F0F0E;
}
.hv-map-fab:hover .hv-map-fab-tip { opacity: 1; }
`;

/* ── Data ──────────────────────────────────────── */
const WEATHER_DATA: Record<string, {
  temp: number; desc: string; icon: string;
  forecast: Array<{ day: string; icon: string; hi: number }>;
}> = {
  'Kremlin-Bicêtre': {
    temp: 19, desc: 'Couvert', icon: '☁️',
    forecast: [
      { day: 'Jeu', icon: '⛅', hi: 20 }, { day: 'Ven', icon: '🌦️', hi: 17 },
      { day: 'Sam', icon: '☀️', hi: 24 }, { day: 'Dim', icon: '⛅', hi: 22 },
    ],
  },
  'Bouffémont': {
    temp: 17, desc: 'Nuageux', icon: '⛅',
    forecast: [
      { day: 'Jeu', icon: '🌧️', hi: 16 }, { day: 'Ven', icon: '⛅', hi: 18 },
      { day: 'Sam', icon: '☀️', hi: 22 }, { day: 'Dim', icon: '☀️', hi: 23 },
    ],
  },
  'Creil': {
    temp: 16, desc: 'Pluvieux', icon: '🌧️',
    forecast: [
      { day: 'Jeu', icon: '🌦️', hi: 17 }, { day: 'Ven', icon: '⛅', hi: 19 },
      { day: 'Sam', icon: '☀️', hi: 23 }, { day: 'Dim', icon: '🌤️', hi: 21 },
    ],
  },
  'Saint-Maur-les-Fossés': {
    temp: 20, desc: 'Partiellement ensoleillé', icon: '⛅',
    forecast: [
      { day: 'Jeu', icon: '☀️', hi: 22 }, { day: 'Ven', icon: '⛅', hi: 20 },
      { day: 'Sam', icon: '☀️', hi: 25 }, { day: 'Dim', icon: '🌤️', hi: 24 },
    ],
  },
};

const ALERTS = [
  { text: 'Fermeture route de la Libération — chantier eau potable jusqu\'au 28 juin', badge: 'urgent', city: 'Kremlin-Bicêtre' },
  { text: 'Marché estival : place du Général-de-Gaulle — tous les samedis 8h–13h', badge: 'info', city: 'Général' },
  { text: 'Collecte supplémentaire encombrants prévue le 18 juin dans le quartier Centre', badge: 'info', city: null },
  { text: 'Alerte canicule : brumisateurs ouverts au parc Henri-Barbusse de 10h à 20h', badge: 'urgent', city: null },
  { text: 'Conseil municipal ouvert au public — jeudi 19 juin à 19h30 — salle des fêtes', badge: 'info', city: null },
  { text: 'Perturbation ligne H SNCF en semaine jusqu\'au 30 juin — prévoir +15 min', badge: 'urgent', city: 'Creil' },
];

const CAT_STYLE: Record<string, { bg: string; color: string; icon: string }> = {
  'Voirie':        { bg: 'rgba(59,85,143,.12)',  color: '#3B558F', icon: '🛣️' },
  'Éclairage':     { bg: 'rgba(224,123,32,.12)', color: '#E07B20', icon: '💡' },
  'Propreté':      { bg: 'rgba(24,109,16,.12)',  color: '#186D10', icon: '🗑️' },
  'Espaces verts': { bg: 'rgba(24,109,16,.12)',  color: '#186D10', icon: '🌳' },
  'Nuisance':      { bg: 'rgba(198,40,40,.1)',   color: '#C62828', icon: '🔊' },
  'Stationnement': { bg: 'rgba(83,74,183,.1)',   color: '#534AB7', icon: '🚗' },
};

const SIG_STATUS_COLOR: Record<string, string> = {
  'en-cours': '#3B558F',
  'attente':  '#E07B20',
  'resolu':   '#186D10',
};

const SERVICES: Array<{
  key: ViewName; num: string; title: string; desc: string;
  bg: string; color: string; accentColor: string; icon: React.ReactNode;
}> = [
  {
    key: 'sig', num: '01', title: 'Signalements', desc: 'Déclarez un incident et suivez son avancement en temps réel.',
    bg: 'rgba(59,85,143,.1)', color: '#3B558F', accentColor: '#3B558F',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    key: 'collecte', num: '02', title: 'Déchets & Toilettes', desc: 'Points de collecte et sanitaires publics géolocalisés.',
    bg: 'rgba(24,109,16,.1)', color: '#186D10', accentColor: '#186D10',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
        <path d="M9 6V4h6v2"/>
      </svg>
    ),
  },
  {
    key: 'travaux', num: '03', title: 'Travaux', desc: 'Chantiers en cours et planifiés dans votre quartier.',
    bg: 'rgba(224,123,32,.1)', color: '#E07B20', accentColor: '#E07B20',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-1-1a1 1 0 010-1.4l8-8a1 1 0 011.4 0l1 1z"/>
        <path d="M16 2l4 4-1.5 1.5L14.5 3.5z"/><path d="M2 22l1.5-5.5 3.5 3.5z"/>
      </svg>
    ),
  },
  {
    key: 'transports', num: '04', title: 'Transports', desc: 'Horaires et perturbations en temps réel.',
    bg: 'rgba(26,58,143,.1)', color: '#1A3A8F', accentColor: '#1A3A8F',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="14" rx="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="8" y1="21" x2="8" y2="17"/><line x1="16" y1="21" x2="16" y2="17"/>
        <line x1="5" y1="21" x2="19" y2="21"/>
      </svg>
    ),
  },
  {
    key: 'social', num: '05', title: 'Social & Asso.', desc: 'Associations, groupes citoyens et initiatives locales.',
    bg: 'rgba(107,79,160,.1)', color: '#6B4FA0', accentColor: '#6B4FA0',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
];

const DEMO_EVENTS = [
  { id: 1, titre: 'Conseil de quartier', date: '14 juin', lieu: 'Salle des fêtes', emoji: '🏛️' },
  { id: 2, titre: 'Marché bio', date: '15 juin', lieu: 'Place du marché', emoji: '🌿' },
  { id: 3, titre: 'Fête de la musique', date: '21 juin', lieu: 'Esplanade', emoji: '🎵' },
];

/* ── 3D Tilt handlers ──────────────────────────── */
function handleTilt(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  const rx = (y - 0.5) * -10;
  const ry = (x - 0.5) * 10;
  el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px) scale(1.01)`;
  el.style.transition = 'box-shadow .25s, border-color .25s';
}
function resetTilt(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = '';
  e.currentTarget.style.transition = 'transform .45s cubic-bezier(.22,1,.36,1), box-shadow .25s, border-color .25s';
}

/* ── Component ─────────────────────────────────── */
export const HomeView: React.FC = () => {
  const { user, signalements, showView, toggleNotif, toggleBot, botOpen, weather: apiWeather, homeEventPreviews, alerts: apiAlerts, cityConfig } = useApp();
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const id = 'municipall-home-css';
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = css;
      document.head.appendChild(s);
    }
  }, []);

  const now       = new Date();
  const dayName   = now.toLocaleDateString('fr-FR', { weekday: 'long' });
  const dateStr   = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const ville     = user?.ville ?? cityConfig?.officialName ?? cityConfig?.name ?? 'Kremlin-Bicêtre';
  const weather   = apiWeather ?? WEATHER_DATA[ville] ?? WEATHER_DATA['Kremlin-Bicêtre'];
  const hour      = now.getHours();
  const greeting  = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const activeSigs = signalements.filter(s => s.statut !== 'resolu');
  const initials  = user ? (user.prenom[0] ?? '') + (user.nom[0] ?? '') : 'M';

  /* Doubled alerts for seamless loop */
  const tickerAlerts = apiAlerts.length ? apiAlerts : ALERTS;
  const allAlerts = [...tickerAlerts, ...tickerAlerts];

  return (
    <div className="hv">

      {/* ── NAV ── */}
      <nav className="hv-nav">
        <button type="button" className="hv-nav-logo">Municip<span>'All</span></button>
        <ul className="hv-nav-links">
          <li><button type="button" className="active">Accueil</button></li>
          <li><button type="button" onClick={() => showView('sig')}>Signalements</button></li>
          <li><button type="button" onClick={() => showView('evenement')}>Évènements</button></li>
          <li><button type="button" onClick={() => showView('contact')}>Contact</button></li>
        </ul>
        <div className="hv-nav-right">
          <div className={`hv-nav-chat${botOpen ? ' on' : ''}`} onClick={toggleBot} title="Assistant MuniBot">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0F0F0E" strokeWidth="1.8"
                 strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <div className="hv-nav-notif" onClick={toggleNotif} title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0F0F0E" strokeWidth="1.8"
                 strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <div className="hv-nav-notif-dot" />
          </div>
          <div className="hv-nav-avatar" title="Mon profil" onClick={() => showView('profil')}>
            {initials.toUpperCase()}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hv-hero">
        <div className="hv-hero-blobs">
          <div className="hv-hero-blob hv-hero-blob-1" />
          <div className="hv-hero-blob hv-hero-blob-2" />
          <div className="hv-hero-blob hv-hero-blob-3" />
          <div className="hv-hero-blob hv-hero-blob-4" />
        </div>
        <div className="hv-hero-ghost">{ville.split('-')[0].split(' ')[0]}</div>

        <div className="hv-hero-left">
          <p className="hv-hero-eyebrow">
            <span className="hv-hero-eyebrow-dot" />
            {dayName.charAt(0).toUpperCase() + dayName.slice(1)}&nbsp;·&nbsp;{dateStr}
          </p>
          <h1 className="hv-hero-greeting">
            {greeting},<br /><em>{user?.prenom ?? 'Citoyen'}</em>
          </h1>
          <p className="hv-hero-sub">
            {ville}{user?.quartier ? ` · Quartier ${user.quartier}` : ''} — votre espace municipal
          </p>
          <div className="hv-hero-ctas">
            <button className="hv-hero-btn hv-hero-btn-primary" onClick={() => showView('sig')}>
              Mes signalements →
            </button>
            <button className="hv-hero-btn hv-hero-btn-secondary" onClick={() => showView('evenement')}>
              Agenda →
            </button>
          </div>
        </div>

        {/* Weather card */}
        <div className="hv-weather">
          <div className="hv-weather-label">Météo · {ville}</div>
          <div className="hv-weather-row">
            <div className="hv-weather-temp">{weather.temp}°</div>
            <div className="hv-weather-icon">{weather.icon}</div>
          </div>
          <div className="hv-weather-desc">{weather.desc}</div>
          <div className="hv-weather-forecast">
            {weather.forecast.map(f => (
              <div key={f.day} className="hv-weather-day">
                <span className="hv-weather-day-icon">{f.icon}</span>
                <span className="hv-weather-day-temp">{f.hi}°</span>
                <div style={{ color: 'rgba(15,15,14,.22)', fontSize: '.6rem', marginTop: '.1rem' }}>{f.day}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALERTS TICKER ── */}
      <div className="hv-ticker" role="marquee" aria-label="Alertes en direct">
        <div className="hv-ticker-track">
          {allAlerts.map((a, i) => (
            <div key={i} className="hv-ticker-item">
              <span className={`hv-ticker-badge ${a.badge}`}>
                {a.badge === 'urgent' ? '⚠ Urgent' : '✓ Info'}
              </span>
              {a.text}
              <span className="hv-ticker-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="hv-content">

        {/* Services */}
        <div className="hv-section-head">
          <div>
            <p className="hv-section-label">Services municipaux</p>
            <h2 className="hv-section-title">Tout ce dont vous avez <em>besoin</em>.</h2>
          </div>
        </div>

        <div className="hv-services-grid">
          {SERVICES.map((s, i) => (
            <div
              key={s.key}
              className="hv-service-card"
              style={{
                animationDelay: `${.4 + i * .08}s`,
                '--accent-color': s.accentColor,
                '--accent-text': s.color,
              } as React.CSSProperties}
              onClick={() => showView(s.key)}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
            >
              <div className="hv-service-icon" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <p className="hv-service-num">{s.num}</p>
              <h3 className="hv-service-title">{s.title}</h3>
              <p className="hv-service-desc">{s.desc}</p>
              <span className="hv-service-arrow" style={{ '--accent-text': s.color } as React.CSSProperties}>
                Accéder →
              </span>
            </div>
          ))}
        </div>

        {/* Events preview */}
        <div className="hv-section-head" style={{ marginTop: '3.5rem' }}>
          <div>
            <p className="hv-section-label">À venir</p>
            <h2 className="hv-section-title">Prochains <em>évènements</em>.</h2>
          </div>
          <span className="hv-section-link" onClick={() => showView('evenement')}>
            Tout l'agenda <span className="hv-section-link-arrow">→</span>
          </span>
        </div>

        <div className="hv-events-row">
          {(homeEventPreviews.length ? homeEventPreviews : DEMO_EVENTS).map((ev, i) => (
            <div
              key={ev.id}
              className="hv-event-card"
              style={{ animationDelay: `${.5 + i * .09}s` }}
              onClick={() => showView('evenement')}
            >
              <div className="hv-event-date-tag">📅 {ev.date}</div>
              <div className="hv-event-title">{ev.emoji} {ev.titre}</div>
              <div className="hv-event-meta">📍 {ev.lieu}</div>
            </div>
          ))}
        </div>

        {/* Lower: signalements + aside */}
        <div className="hv-lower">

          {/* Signalements */}
          <div>
            <div className="hv-section-head">
              <div>
                <p className="hv-section-label">Suivi citoyen</p>
                <h2 className="hv-section-title">Mes signalements <em>actifs</em>.</h2>
              </div>
              <span className="hv-section-link" onClick={() => showView('sig')}>
                Tout voir <span className="hv-section-link-arrow">→</span>
              </span>
            </div>

            <div className="hv-sig-list">
              {activeSigs.length === 0 ? (
                <p className="hv-empty">Aucun signalement actif pour le moment.</p>
              ) : (
                activeSigs.map((sig, i) => {
                  const cat = CAT_STYLE[sig.categorie as string]
                           ?? { bg: 'rgba(15,15,14,.08)', color: '#0F0F0E', icon: '📍' };
                  const statusColor = SIG_STATUS_COLOR[sig.statut] ?? '#3B558F';
                  return (
                    <div
                      key={sig.id}
                      className="hv-sig-card"
                      style={{
                        animationDelay: `${.5 + i * .09}s`,
                        '--sig-color': statusColor,
                      } as React.CSSProperties}
                      onClick={() => showView('sig')}
                    >
                      <div className="hv-sig-cat" style={{ background: cat.bg }}>
                        {cat.icon}
                      </div>
                      <div className="hv-sig-body">
                        <div className="hv-sig-title">{sig.description}</div>
                        {sig.adresse && <div className="hv-sig-addr">📍 {sig.adresse}</div>}
                        <div className="hv-sig-foot">
                          <span className={`hv-badge ${sig.statut}`}>
                            {sig.statut === 'en-cours' ? 'En cours'
                              : sig.statut === 'attente' ? 'En attente'
                              : 'Résolu'}
                          </span>
                          {sig.dateCreation && (
                            <span className="hv-sig-date">{sig.dateCreation}</span>
                          )}
                          {sig.progression != null && (
                            <div className="hv-sig-progress">
                              <div className="hv-sig-progress-fill" style={{ width: `${sig.progression}%` }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <button className="hv-sig-new-btn" onClick={() => showView('sig')}>
                Voir tous mes signalements →
              </button>
            </div>
          </div>

          {/* Aside — profil rapide */}
          <div>
            <div className="hv-section-head" style={{ marginTop: '3.5rem' }}>
              <div><p className="hv-section-label">Mon espace</p></div>
            </div>
            <div className="hv-aside-card">
              <div className="hv-aside-top">
                <div className="hv-aside-avatar-row">
                  <div className="hv-aside-avatar">{initials.toUpperCase()}</div>
                  <div>
                    <div className="hv-aside-name">{user?.prenom} {user?.nom}</div>
                    <div className="hv-aside-role">Citoyen · {ville}</div>
                  </div>
                </div>
                <div className="hv-aside-stats">
                  <div className="hv-aside-stat-box">
                    <div className="hv-aside-stat-num">{signalements.length}</div>
                    <div className="hv-aside-stat-lbl">Signalements</div>
                  </div>
                  <div className="hv-aside-stat-box">
                    <div className="hv-aside-stat-num">{activeSigs.length}</div>
                    <div className="hv-aside-stat-lbl">En cours</div>
                  </div>
                </div>
              </div>
              <div className="hv-aside-body">
                <div className="hv-aside-row">
                  <span className="hv-aside-row-label">
                    <span className="hv-aside-row-label-icon">📍</span> Quartier
                  </span>
                  <span className="hv-aside-row-val">{user?.quartier ?? '—'}</span>
                </div>
                <div className="hv-aside-row">
                  <span className="hv-aside-row-label">
                    <span className="hv-aside-row-label-icon">📧</span> Email
                  </span>
                  <span className="hv-aside-row-val" style={{ fontSize: '.75rem', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.email ?? '—'}
                  </span>
                </div>
                <div className="hv-aside-row">
                  <span className="hv-aside-row-label">
                    <span className="hv-aside-row-label-icon">✅</span> Résolus
                  </span>
                  <span className="hv-aside-row-val" style={{ color: '#186D10' }}>
                    {signalements.filter(s => s.statut === 'resolu').length}
                  </span>
                </div>
              </div>
              <button className="hv-aside-cta" onClick={() => showView('profil')}>
                Mon profil <span className="hv-aside-cta-arrow">→</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── MAP FAB (bottom-left) ── */}
      <button
        className="hv-map-fab"
        aria-label="Ouvrir la carte"
        onClick={() => setShowMap(true)}
        style={{ position: 'fixed' }}
      >
        <div className="hv-map-fab-tip">Carte interactive</div>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"
             strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
          <line x1="9" y1="3" x2="9" y2="18"/>
          <line x1="15" y1="6" x2="15" y2="21"/>
        </svg>
      </button>

      {showMap && <MapModal onClose={() => setShowMap(false)} />}

    </div>
  );
};
