import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

function formatTownName(slug: string) {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata({ params }: { params: { town: string } }): Promise<Metadata> {
  const townName = formatTownName(params.town);
  return {
    title: `$0 Down Solar PPA in ${townName}, NJ | SentiSolar`,
    description: `Are you a homeowner in ${townName}, New Jersey? See if your roof qualifies for a zero-down Power Purchase Agreement (PPA) to lock in your energy rates.`,
  };
}

export default function TownPage({ params }: { params: { town: string } }) {
  const townName = formatTownName(params.town);

  return (
    <main className="min-h-screen bg-paper text-navy font-sans">
      <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-16 border-b border-line bg-white">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">SentiSolar</span>
        </Link>
        <a href="tel:8562194352" className="flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2 text-xs font-semibold text-navy transition-colors hover:bg-navy/5">
          Call (856) 219-4352
        </a>
      </header>

      <section className="mx-auto flex flex-col items-center px-6 pb-12 pt-16 text-center md:pt-24 max-w-4xl">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-solar">New Jersey Local Solar Initiative</p>
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-navy md:text-6xl mb-6">
          $0-Down Solar Upgrades in <br/><span className="text-navy/70">{townName}, NJ.</span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted mb-10">
          Utility rates in New Jersey are climbing. We use Google LIDAR Solar API to analyze roofs in {townName}. Find out instantly if your home qualifies for a Power Purchase Agreement (PPA) to lock in a lower energy rate with zero out-of-pocket installation costs.
        </p>

        <div className="bg-white border border-line p-8 w-full max-w-md rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Scan Your {townName} Roof</h2>
          <Link href="/" className="flex h-12 w-full items-center justify-center rounded-full bg-navy text-sm font-medium text-white transition-colors hover:bg-navy/90 mb-4">
            Calculate My Solar Potential
          </Link>
          <p className="text-xs text-muted">Or speak to our AI Advisor right now at <strong>(856) 219-4352</strong></p>
        </div>
      </section>
    </main>
  );
}
