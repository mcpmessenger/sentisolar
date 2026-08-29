'use client'

import { useMemo, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
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
import { supabase } from '../lib/supabase'
import Autocomplete from 'react-google-autocomplete'
import { useConversation, ConversationProvider } from '@elevenlabs/react'

function Brand() {
  return (
    <a href="/" className="relative flex h-10 md:h-14 w-48 items-center cursor-pointer transition-opacity hover:opacity-80 overflow-hidden mix-blend-multiply">
      <img src="/logo.png" alt="SentiSolar" className="absolute top-1/2 left-0 -translate-y-1/2 h-[350%] w-auto max-w-none object-contain" />
    </a>
  )
}

function HomeView({ setView }: { setView: (view: 'home' | 'admin') => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isHomeowner, setIsHomeowner] = useState(true)
  const [monthlyBill, setMonthlyBill] = useState('')
  const [creditQualified, setCreditQualified] = useState(true)
  const [complete, setComplete] = useState(false)
  const [transcript, setTranscript] = useState<{source: string, text: string} | null>(null)

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs')
      setTranscript(null)
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs')
      setTranscript(null)
    },
    onError: (e) => console.error('ElevenLabs Error:', e),
    onMessage: (msg: any) => {
      // msg.source can be 'user' or 'ai'
      if (msg.message) {
        setTranscript({ source: msg.source, text: msg.message })
        
        // Hacky but effective auto-hangup if the AI says goodbye
        if (msg.source === 'ai' && msg.message.toLowerCase().includes("have a great day")) {
          setTimeout(() => conversation.endSession(), 7000) // wait 3.5s for audio to finish
        }
      }
    },
    clientTools: {
      generate_solar_report: async ({ address, email, phone, is_homeowner, monthly_bill, credit_qualified }) => {
        try {
          // 1. Evaluate Roof
          const roofRes = await fetch('/api/evaluate-roof', { method: 'POST', body: JSON.stringify({ address }) })
          const roofData = await roofRes.json()

          // 2. Send Email
          await fetch('/api/send-report', { 
            method: 'POST', 
            body: JSON.stringify({ email, address, panels: roofData.panels || 15, sunshineHours: roofData.sunshineHours || 1200 }) 
          })

          return "Successfully generated and emailed the solar report to the user!"
        } catch (error) {
          console.error("Tool execution failed:", error)
          return "Failed to send the report. Ask the user to try again."
        }
      }
    }
  })

  const submitAddress = (event: React.FormEvent) => {
    event.preventDefault()
    if (address.trim()) setStep(2)
  }
  const submitEmail = async (event: React.FormEvent) => {
    event.preventDefault()
    if (email.trim() && phone.trim()) {
      // 1. Save lead to Supabase
      const { error } = await supabase.from('leads').insert([{
        address,
        email,
        capture_method: 'text_form',
        status: 'New'
      }])
      if (error) console.error('Error saving lead to Supabase:', error)
      
      // 2. Evaluate Roof (Google Solar API)
      const roofRes = await fetch('/api/evaluate-roof', { method: 'POST', body: JSON.stringify({ address }) })
      const roofData = await roofRes.json()

      // 3. Send Email Report (Resend API)
      await fetch('/api/send-report', { method: 'POST', body: JSON.stringify({ email, address, panels: roofData.panels || 15, sunshineHours: roofData.sunshineHours || 1200 }) })

      setComplete(true)
    }
  }

  return (
    <main className="min-h-screen bg-paper text-navy">
      <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-16">
        <Brand />
        <a href="tel:8562194352" className="flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2 text-xs font-semibold text-navy transition-colors hover:bg-navy/5">
          Call (856) 219-4352
        </a>
      </header>
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl flex-col items-center px-6 pb-6 pt-10 text-center md:pt-14">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">A clearer path to solar</p>
        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.03] tracking-[-0.065em] text-navy md:text-7xl">Solar potential,<br /><span className="text-navy/55">calculated instantly.</span></h1>
        <p className="mt-5 max-w-lg text-sm leading-6 text-muted">Share an address and our AI will instantly query Google's LIDAR database. We analyze your exact roof topography and shading to calculate your maximum panel capacity and solar potential using Google's Solar API.</p>

        <div className="mt-8 flex w-full max-w-xl flex-col items-center justify-center px-4 md:mt-10 md:px-0">
          <div className={`w-full text-left transition-opacity duration-500 ${complete ? 'opacity-60' : 'opacity-100'}`}>
            {!complete ? step === 1 ? (
              <form onSubmit={submitAddress} className="animate-fade-in w-full relative">
                
                {/* Live Transcript Overlay - Reserved Space */}
                <div className="mb-4 flex min-h-[3.5rem] w-full items-end justify-center text-center">
                  {transcript && conversation.status === 'connected' && (
                    <p className={`animate-fade-in text-sm md:text-base tracking-[-0.01em] ${transcript.source === 'ai' ? 'text-navy font-medium' : 'text-muted italic'}`}>
                      {transcript.source === 'ai' ? 'Senti: ' : 'You: '}
                      "{transcript.text}"
                    </p>
                  )}
                </div>

                <label htmlFor="address" className="mb-4 block text-sm md:text-base font-medium tracking-[-0.02em] text-navy">1. What is your home address?</label>
                <div className="relative flex items-center border-b border-navy/25 pb-2 transition-colors focus-within:border-navy">
                  <Autocomplete apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} onPlaceSelected={(place) => { if (place && place.formatted_address) setAddress(place.formatted_address) }} options={{ types: ['address'] }} defaultValue={address} onChange={(e: any) => setAddress(e.target.value)} placeholder="Start typing your address..." className="w-full bg-transparent py-2 text-xl tracking-[-0.03em] outline-none placeholder:text-navy/25" autoFocus />
                  <div className="ml-2 flex shrink-0 items-center gap-2">
                    <button 
                      type="button" 
                      aria-label="Speak address" 
                      onClick={async () => {
                        if (conversation.status === 'connected') {
                          await conversation.endSession()
                        } else {
                          try {
                            await conversation.startSession({ agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || '' })
                          } catch (err) { console.error('ElevenLabs start failed', err) }
                        }
                      }} 
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${conversation.status === 'connected' ? 'bg-solar text-navy' : 'bg-slate/40 text-navy hover:bg-slate/70'}`}
                    >
                      {conversation.status === 'connected' ? <span className="absolute animate-ping rounded-full h-10 w-10 border border-solar/40" /> : null}
                      <Mic className="h-5 w-5" strokeWidth={2} />
                    </button>
                    <button type="submit" aria-label="Submit address" className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-navy/90">
                      <ArrowUpRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {conversation.status === 'connecting' && <p className="mt-3 text-[11px] font-medium text-solar animate-pulse">Connecting to Agent...</p>}
                {conversation.status === 'connected' && <p className="mt-3 text-[11px] font-medium text-solar">Listening... (Speak now!)</p>}
              </form>
            ) : (
              <form onSubmit={submitEmail} className="animate-fade-in w-full">
                <label className="mb-4 block text-base font-medium tracking-[-0.02em] text-navy">2. Tell us about your home to unlock your report:</label>
                
                <div className="space-y-4 mb-6">
                  <div className="relative flex items-center border-b border-navy/25 pb-2 transition-colors focus-within:border-navy">
                    
                    <input autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-transparent py-2 pl-8 text-xl tracking-[-0.03em] outline-none placeholder:text-navy/25" required />
                  </div>
                  <div className="relative flex items-center border-b border-navy/25 pb-2 transition-colors focus-within:border-navy">
                    
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-transparent py-2 pl-8 text-xl tracking-[-0.03em] outline-none placeholder:text-navy/25" required />
                  </div>
                  <div className="relative flex items-center border-b border-navy/25 pb-2 transition-colors focus-within:border-navy">
                    
                    <input type="number" value={monthlyBill} onChange={(e) => setMonthlyBill(e.target.value)} placeholder="Avg. Monthly Electric Bill ($)" className="w-full bg-transparent py-2 pl-8 text-xl tracking-[-0.03em] outline-none placeholder:text-navy/25" required />
                  </div>
                  
                  <div className="flex flex-col gap-3 pt-4">
                    <label className="flex items-center gap-3 text-sm font-medium text-navy cursor-pointer">
                      <input type="checkbox" checked={isHomeowner} onChange={(e) => setIsHomeowner(e.target.checked)} className="h-4 w-4 rounded border-navy/25 text-navy focus:ring-navy" />
                      I am the homeowner
                    </label>
                    <label className="flex items-center gap-3 text-sm font-medium text-navy cursor-pointer">
                      <input type="checkbox" checked={creditQualified} onChange={(e) => setCreditQualified(e.target.checked)} className="h-4 w-4 rounded border-navy/25 text-navy focus:ring-navy" />
                      My credit score is 650 or higher
                    </label>
                  </div>
                </div>
                
                <button type="submit" className="flex h-12 w-full items-center justify-center rounded-full bg-navy text-sm font-medium text-white transition-colors hover:bg-navy/90">
                  Generate My Solar Report
                </button>
                
                <div className="mt-6 flex items-start gap-3">
                  <input type="checkbox" id="tcpa" required className="mt-1 h-3.5 w-3.5 shrink-0 rounded border-line text-navy focus:ring-navy cursor-pointer" />
                  <label htmlFor="tcpa" className="text-[10px] leading-relaxed text-muted cursor-pointer">
                    By submitting, I agree to the <a href="/privacy" className="underline hover:text-navy" target="_blank">Privacy Policy</a> and provide express written consent for SentiSolar to contact me.
                  </label>
                </div>
              </form>
            ) : (
              <div className="animate-fade-in py-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-solar">
                  <Check className="h-6 w-6 text-navy" />
                </div>
                <p className="text-xl font-medium tracking-[-0.03em]">You&apos;re on your way to a brighter roof.</p>
                <p className="mt-2 text-sm leading-6 text-muted">We&apos;ll send your custom report to <strong>{email}</strong>.</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-auto flex w-full items-end justify-between border-t border-line pt-5 text-[10px] uppercase tracking-[0.18em] text-muted">
          <span>Designed for your address</span>
          <span className="flex items-center gap-4">
            <button type="button" onClick={() => setView('admin')} className="hover:text-navy transition-colors">Admin</button>
            <span>&copy; 2026 SentiSolar</span>
          </span>
        </div>
      </section>
    <footer className="w-full text-center py-8 border-t border-line text-xs text-muted mt-12 bg-paper"><a href="/privacy" className="hover:underline mr-4">Privacy Policy</a><a href="/terms" className="hover:underline">Terms &amp; Conditions</a></footer>
</main>
  )
}

function StatusPill({ status }: { status: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${status === 'New' ? 'bg-solar/35 text-navy' : status === 'Qualified' ? 'bg-navy text-white' : 'bg-slate/60 text-muted'}`}>{status}</span>
}

function AdminView({ setView }: { setView: (view: 'home' | 'admin') => void }) {
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('All sources')
  const [dbLeads, setDbLeads] = useState<any[]>([])
  
  useEffect(() => {
    const fetchLeads = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )
      const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
      if (data) {
        const formatted = data.map(d => ({
          date: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          address: d.address || 'Unknown Address',
          email: d.email || 'No Email',
          phone: d.phone || '',
          is_homeowner: d.is_homeowner,
          monthly_bill: d.monthly_bill,
          credit_qualified: d.credit_qualified,
          source: d.source || 'ElevenLabs',
          status: d.status || 'New'
        }))
        setDbLeads(formatted)
      }
    }
    fetchLeads()
  }, [])

  const filteredLeads = useMemo(() => dbLeads.filter((lead) => (`${lead.address} ${lead.email}`).toLowerCase().includes(query.toLowerCase()) && (source === 'All sources' || lead.source === source)), [query, source, dbLeads])
  return (
    <main className="min-h-screen bg-paper text-navy">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white px-7 py-7 md:flex">
          <Brand />
          <div className="mt-14"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Workspace</p><nav className="space-y-1"><button className="flex w-full items-center gap-3 rounded-md bg-slate/45 px-3 py-2.5 text-left text-sm font-medium"><LayoutDashboard className="h-4 w-4" /> Overview</button><button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-muted hover:bg-slate/30"><Users className="h-4 w-4" /> Leads <span className="ml-auto text-[10px]">{dbLeads.length}</span></button><button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-muted hover:bg-slate/30"><BarChart3 className="h-4 w-4" /> Analytics</button></nav></div>
          <div className="mt-auto space-y-1"><button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-muted"><Settings className="h-4 w-4" /> Settings</button><div className="mt-5 flex items-center gap-3 border-t border-line pt-5"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs text-white">W</div><div><p className="text-xs font-medium">Will</p><p className="text-[10px] text-muted">Admin</p></div><MoreHorizontal className="ml-auto h-4 w-4 text-muted" /></div></div>
        </aside>
        <section className="w-full px-6 pb-12 pt-24 md:px-10 md:pt-12 lg:px-16">
          <div className="mx-auto max-w-6xl"><div className="mb-10 flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Monday, August 22, 2026</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">Good morning, Will.</h1><p className="mt-2 text-sm text-muted">Here&apos;s the pulse of your solar pipeline.</p></div><button className="hidden items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-xs font-medium md:flex"><CircleHelp className="h-4 w-4 text-muted" /> Help center</button></div>
            <div className="mb-10 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3"><div className="bg-white p-6"><p className="text-xs text-muted">Total leads</p><p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">{dbLeads.length}</p><p className="mt-2 text-[11px] text-muted"><span className="text-navy">+18.4%</span> from last month</p></div><div className="bg-white p-6"><p className="text-xs text-muted">Qualified</p><p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">42</p><p className="mt-2 text-[11px] text-muted"><span className="text-navy">+12.2%</span> conversion rate</p></div><div className="bg-white p-6"><p className="text-xs text-muted">Reports sent</p><p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">86</p><p className="mt-2 text-[11px] text-muted"><span className="text-navy">+24</span> this week</p></div></div>
            <div className="border border-line bg-white"><div className="flex flex-col gap-4 border-b border-line p-5 md:flex-row md:items-center md:justify-between"><div><h2 className="text-base font-semibold tracking-[-0.03em]">Recent leads</h2><p className="mt-1 text-xs text-muted">Manage and track incoming solar opportunities.</p></div><div className="flex gap-2"><div className="flex items-center gap-2 border border-line px-3 py-2"><Search className="h-3.5 w-3.5 text-muted" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leads" className="w-28 bg-transparent text-xs outline-none placeholder:text-muted" /></div><select value={source} onChange={(e) => setSource(e.target.value)} className="border border-line bg-white px-2 text-xs text-muted outline-none"><option>All sources</option><option>Typeform</option><option>ElevenLabs</option></select></div></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead><tr className="border-b border-line text-[10px] uppercase tracking-[0.16em] text-muted"><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Address</th><th className="px-5 py-3 font-medium">Email</th><th className="px-5 py-3 font-medium">Phone</th><th className="px-5 py-3 font-medium">Source</th><th className="px-5 py-3 font-medium">Quals</th><th className="px-5 py-3 font-medium">Status</th></tr></thead><tbody>{filteredLeads.map((lead, index) => <tr key={index} className="border-b border-line last:border-0 hover:bg-paper"><td className="px-5 py-4 text-xs text-muted"><span className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" />{lead.date}</span></td><td className="px-5 py-4 text-sm font-medium">{lead.address}</td><td className="px-5 py-4 text-xs text-muted">{lead.email}</td><td className="px-5 py-4 text-xs font-medium">{lead.phone || "No phone"}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 text-xs"><span className={`h-1.5 w-1.5 rounded-full ${lead.source === 'Typeform' ? 'bg-navy' : 'bg-solar'}`} />{lead.source}</span></td><td className="px-5 py-4 text-xs font-medium"><div className="flex flex-col gap-1">{lead.is_homeowner ? <span className="text-green-600">? Owner</span> : <span className="text-red-500">x Renter</span>}{lead.monthly_bill ? <span>${lead.monthly_bill}/mo</span> : null}{lead.credit_qualified ? <span className="text-green-600">? Credit 650+</span> : null}</div></td><td className="px-5 py-4"><StatusPill status={lead.status} /></td></tr>)}</tbody></table>{filteredLeads.length === 0 && <div className="p-10 text-center text-sm text-muted">No leads match your search.</div>}</div></div>
          </div>
        </section>
      </div>
    <footer className="w-full text-center py-8 border-t border-line text-xs text-muted mt-12 bg-paper"><a href="/privacy" className="hover:underline mr-4">Privacy Policy</a><a href="/terms" className="hover:underline">Terms &amp; Conditions</a></footer>
</main>
  )
}

function AdminLogin({ setView, onLogin }: { setView: (view: 'home' | 'admin') => void, onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple hardcoded password for MVP
    if (password === 'admin123') {
      onLogin()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <main className="min-h-screen bg-paper text-navy flex items-center justify-center p-6">
      <div className="w-full max-w-sm animate-fade-in bg-white p-10 border border-line shadow-sm">
        <div className="mb-8 flex justify-center"><Brand /></div>
        <h2 className="text-xl font-medium tracking-[-0.03em] text-center mb-2">Restricted Access</h2>
        <p className="text-xs text-muted text-center mb-8">Please enter the admin password to view the Admin panel.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..." 
              className={`w-full bg-transparent border-b ${error ? 'border-red-500 text-red-500' : 'border-line'} py-2 text-sm outline-none focus:border-navy transition-colors`}
              autoFocus
            />
          </div>
          <button type="submit" className="w-full bg-navy text-white py-3 text-xs font-medium tracking-[0.05em] uppercase hover:bg-navy/90 transition-colors">
            Enter Dashboard
          </button>
        </form>
      </div>
    <footer className="w-full text-center py-8 border-t border-line text-xs text-muted mt-12 bg-paper"><a href="/privacy" className="hover:underline mr-4">Privacy Policy</a><a href="/terms" className="hover:underline">Terms &amp; Conditions</a></footer>
</main>
  )
}

export default function Page() {
  const [view, setView] = useState<'home' | 'admin'>('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (view === 'admin' && !isAuthenticated) {
    return <AdminLogin setView={setView} onLogin={() => setIsAuthenticated(true)} />
  }

  return view === 'home' ? (
    <ConversationProvider>
      <HomeView setView={setView} />
    </ConversationProvider>
  ) : (
    <AdminView setView={setView} />
  )
}













