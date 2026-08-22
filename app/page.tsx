'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  LayoutDashboard,
  Mail,
  Menu,
  Mic,
  MoreHorizontal,
  Search,
  Settings,
  Sun,
  Users,
  X,
} from 'lucide-react'

const leads = [
  { date: 'Aug 22, 2026', address: '1842 Birch Street, Portland', email: 'alex.morgan@email.com', source: 'Typeform', status: 'New' },
  { date: 'Aug 22, 2026', address: '92 Cedar Avenue, Seattle', email: 'jamie.lee@hey.com', source: 'ElevenLabs', status: 'Contacted' },
  { date: 'Aug 21, 2026', address: '410 Lakeview Drive, Austin', email: 'samira.chen@gmail.com', source: 'Typeform', status: 'Qualified' },
  { date: 'Aug 21, 2026', address: '27 Meadow Lane, Denver', email: 'taylor.brooks@icloud.com', source: 'Typeform', status: 'New' },
  { date: 'Aug 20, 2026', address: '811 Suncrest Road, San Diego', email: 'mike.roberts@outlook.com', source: 'ElevenLabs', status: 'Qualified' },
]

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-navy text-white">
        <Sun className="h-4 w-4 text-solar" strokeWidth={2.3} />
      </div>
      <span className="text-[17px] font-semibold tracking-[-0.04em] text-navy">SentiSolar</span>
    </div>
  )
}

function ViewToggle({ view, setView }: { view: 'home' | 'admin'; setView: (view: 'home' | 'admin') => void }) {
  return (
    <div className="fixed left-1/2 top-5 z-20 flex -translate-x-1/2 rounded-full border border-line bg-white/85 p-1 shadow-sm backdrop-blur-md">
      <button onClick={() => setView('home')} className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${view === 'home' ? 'bg-navy text-white' : 'text-muted hover:text-navy'}`}>Home</button>
      <button onClick={() => setView('admin')} className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${view === 'admin' ? 'bg-navy text-white' : 'text-muted hover:text-navy'}`}>Admin CRM</button>
    </div>
  )
}

function HomeView({ setView }: { setView: (view: 'home' | 'admin') => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [listening, setListening] = useState(false)
  const [complete, setComplete] = useState(false)

  const submitAddress = (event: React.FormEvent) => {
    event.preventDefault()
    if (address.trim()) setStep(2)
  }
  const submitEmail = (event: React.FormEvent) => {
    event.preventDefault()
    if (email.trim()) setComplete(true)
  }

  return (
    <main className="min-h-screen bg-paper text-navy">
      <ViewToggle view="home" setView={setView} />
      <header className="flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">
        <Brand />
        <button onClick={() => setView('admin')} className="hidden items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-navy md:flex">Open CRM <ArrowUpRight className="h-3.5 w-3.5" /></button>
      </header>
      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl flex-col items-center px-6 pb-16 pt-20 text-center md:pt-28">
        <p className="mb-7 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">A clearer path to solar</p>
        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.03] tracking-[-0.065em] text-navy md:text-7xl">Solar potential,<br /><span className="text-navy/55">calculated instantly.</span></h1>
        <p className="mt-7 max-w-md text-sm leading-6 text-muted">See what your roof can do. Share an address and we&apos;ll prepare a custom solar report, built for your home.</p>

        <div className="mt-16 flex w-full max-w-3xl flex-col items-center gap-12 md:mt-20 md:flex-row md:items-start md:justify-center md:gap-20">
          <div className="flex w-full flex-col items-center md:w-44">
            <button aria-label="Tap to speak your address" onClick={() => { setListening(!listening); setTimeout(() => setListening(false), 2200) }} className={`group relative flex h-28 w-28 items-center justify-center rounded-full border transition-all ${listening ? 'border-solar bg-solar/10' : 'border-line bg-white hover:border-navy/40 hover:shadow-lg'}`}>
              {listening && <span className="absolute inset-[-8px] animate-ping rounded-full border border-solar/40" />}
              <Mic className={`h-7 w-7 transition-colors ${listening ? 'text-navy' : 'text-navy/70 group-hover:text-navy'}`} strokeWidth={1.5} />
            </button>
            <span className="mt-4 text-xs font-medium text-navy">{listening ? 'Listening…' : 'Tap to speak your address'}</span>
            <span className="mt-1 text-[11px] text-muted">Powered by ElevenLabs</span>
          </div>

          <div className="hidden h-32 w-px bg-line md:block" />
          <div className={`w-full max-w-md text-left transition-opacity duration-500 ${complete ? 'opacity-60' : 'opacity-100'}`}>
            {!complete ? step === 1 ? (
              <form onSubmit={submitAddress} className="animate-fade-in">
                <label htmlFor="address" className="mb-4 block text-base font-medium tracking-[-0.02em] text-navy">1. What is your home address?</label>
                <div className="border-b border-navy/25 transition-colors focus-within:border-navy">
                  <input autoFocus id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Start typing your address…" className="w-full bg-transparent py-3 text-xl tracking-[-0.03em] outline-none placeholder:text-navy/25" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-muted"><span className="rounded border border-line px-1.5 py-0.5 font-mono">Enter ↵</span> to continue</div>
              </form>
            ) : (
              <form onSubmit={submitEmail} className="animate-fade-in">
                <label htmlFor="email" className="mb-4 block text-base font-medium tracking-[-0.02em] text-navy">2. Where should we send your custom roof report?</label>
                <div className="border-b border-navy/25 transition-colors focus-within:border-navy">
                  <input autoFocus type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-transparent py-3 text-xl tracking-[-0.03em] outline-none placeholder:text-navy/25" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-muted"><span className="rounded border border-line px-1.5 py-0.5 font-mono">Enter ↵</span> to get your report</div>
              </form>
            ) : (
              <div className="animate-fade-in py-4"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-solar"><Check className="h-5 w-5 text-navy" /></div><p className="text-lg font-medium tracking-[-0.03em]">You&apos;re on your way to a brighter roof.</p><p className="mt-2 text-sm leading-6 text-muted">We&apos;ll send your custom report to {email}.</p></div>
            )}
          </div>
        </div>
        <div className="mt-auto flex w-full items-end justify-between border-t border-line pt-5 text-[10px] uppercase tracking-[0.18em] text-muted"><span>Designed for your address</span><span>© 2026 SentiSolar</span></div>
      </section>
    </main>
  )
}

function StatusPill({ status }: { status: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${status === 'New' ? 'bg-solar/35 text-navy' : status === 'Qualified' ? 'bg-navy text-white' : 'bg-slate/60 text-muted'}`}>{status}</span>
}

function AdminView({ setView }: { setView: (view: 'home' | 'admin') => void }) {
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('All sources')
  const filteredLeads = useMemo(() => leads.filter((lead) => `${lead.address} ${lead.email}`.toLowerCase().includes(query.toLowerCase()) && (source === 'All sources' || lead.source === source)), [query, source])
  return (
    <main className="min-h-screen bg-paper text-navy">
      <ViewToggle view="admin" setView={setView} />
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white px-7 py-7 md:flex">
          <Brand />
          <div className="mt-14"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Workspace</p><nav className="space-y-1"><button className="flex w-full items-center gap-3 rounded-md bg-slate/45 px-3 py-2.5 text-left text-sm font-medium"><LayoutDashboard className="h-4 w-4" /> Overview</button><button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-muted hover:bg-slate/30"><Users className="h-4 w-4" /> Leads <span className="ml-auto text-[10px]">128</span></button><button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-muted hover:bg-slate/30"><BarChart3 className="h-4 w-4" /> Analytics</button></nav></div>
          <div className="mt-auto space-y-1"><button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-muted"><Settings className="h-4 w-4" /> Settings</button><div className="mt-5 flex items-center gap-3 border-t border-line pt-5"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs text-white">AM</div><div><p className="text-xs font-medium">Alex Morgan</p><p className="text-[10px] text-muted">Admin</p></div><MoreHorizontal className="ml-auto h-4 w-4 text-muted" /></div></div>
        </aside>
        <section className="w-full px-6 pb-12 pt-24 md:px-10 md:pt-12 lg:px-16">
          <div className="mx-auto max-w-6xl"><div className="mb-10 flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Monday, August 22, 2026</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">Good morning, Alex.</h1><p className="mt-2 text-sm text-muted">Here&apos;s the pulse of your solar pipeline.</p></div><button className="hidden items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-xs font-medium md:flex"><CircleHelp className="h-4 w-4 text-muted" /> Help center</button></div>
            <div className="mb-10 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3"><div className="bg-white p-6"><p className="text-xs text-muted">Total leads</p><p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">128</p><p className="mt-2 text-[11px] text-muted"><span className="text-navy">+18.4%</span> from last month</p></div><div className="bg-white p-6"><p className="text-xs text-muted">Qualified</p><p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">42</p><p className="mt-2 text-[11px] text-muted"><span className="text-navy">+12.2%</span> conversion rate</p></div><div className="bg-white p-6"><p className="text-xs text-muted">Reports sent</p><p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">86</p><p className="mt-2 text-[11px] text-muted"><span className="text-navy">+24</span> this week</p></div></div>
            <div className="border border-line bg-white"><div className="flex flex-col gap-4 border-b border-line p-5 md:flex-row md:items-center md:justify-between"><div><h2 className="text-base font-semibold tracking-[-0.03em]">Recent leads</h2><p className="mt-1 text-xs text-muted">Manage and track incoming solar opportunities.</p></div><div className="flex gap-2"><div className="flex items-center gap-2 border border-line px-3 py-2"><Search className="h-3.5 w-3.5 text-muted" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leads" className="w-28 bg-transparent text-xs outline-none placeholder:text-muted" /></div><select value={source} onChange={(e) => setSource(e.target.value)} className="border border-line bg-white px-2 text-xs text-muted outline-none"><option>All sources</option><option>Typeform</option><option>ElevenLabs</option></select></div></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead><tr className="border-b border-line text-[10px] uppercase tracking-[0.16em] text-muted"><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Address</th><th className="px-5 py-3 font-medium">Email</th><th className="px-5 py-3 font-medium">Source</th><th className="px-5 py-3 font-medium">Status</th></tr></thead><tbody>{filteredLeads.map((lead) => <tr key={lead.email} className="border-b border-line last:border-0 hover:bg-paper"><td className="px-5 py-4 text-xs text-muted"><span className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" />{lead.date}</span></td><td className="px-5 py-4 text-sm font-medium">{lead.address}</td><td className="px-5 py-4 text-xs text-muted">{lead.email}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 text-xs"><span className={`h-1.5 w-1.5 rounded-full ${lead.source === 'Typeform' ? 'bg-navy' : 'bg-solar'}`} />{lead.source}</span></td><td className="px-5 py-4"><StatusPill status={lead.status} /></td></tr>)}</tbody></table>{filteredLeads.length === 0 && <div className="p-10 text-center text-sm text-muted">No leads match your search.</div>}</div></div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default function Page() {
  const [view, setView] = useState<'home' | 'admin'>('home')
  return view === 'home' ? <HomeView setView={setView} /> : <AdminView setView={setView} />
}
