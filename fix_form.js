const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Add states
content = content.replace(
  "const [phone, setPhone] = useState('')",
  "const [phone, setPhone] = useState('')\n  const [isHomeowner, setIsHomeowner] = useState(true)\n  const [monthlyBill, setMonthlyBill] = useState('')\n  const [creditQualified, setCreditQualified] = useState(true)"
);

// 2. Replace submitEmail function
const oldSubmitEmail = content.match(/const submitEmail = async \(event: React\.FormEvent\) => \{[\s\S]*?setComplete\(true\)\n\s*\}\n\s*\}/)[0];

const newSubmitEmail = \const submitEmail = async (event: React.FormEvent) => {
    event.preventDefault()
    if (email.trim() && phone.trim()) {
      // 1. Save lead to Supabase
      const { error } = await supabase.from('leads').insert([{
        address,
        email,
        phone,
        is_homeowner: isHomeowner,
        monthly_bill: parseInt(monthlyBill) || 0,
        credit_qualified: creditQualified,
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
  }\;
content = content.replace(oldSubmitEmail, newSubmitEmail);

// 3. Replace Form UI
const oldForm = content.match(/<form onSubmit=\{submitEmail\} className="animate-fade-in w-full">[\s\S]*?<\/form>/)[0];

const newForm = \<form onSubmit={submitEmail} className="animate-fade-in w-full">
                <label className="mb-4 block text-base font-medium tracking-[-0.02em] text-navy">2. Tell us about your home to unlock your report:</label>
                
                <div className="space-y-4 mb-6">
                  <div className="relative flex items-center border-b border-navy/25 pb-2 transition-colors focus-within:border-navy">
                    <span className="absolute left-0 text-muted">??</span>
                    <input autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-transparent py-2 pl-8 text-xl tracking-[-0.03em] outline-none placeholder:text-navy/25" required />
                  </div>
                  <div className="relative flex items-center border-b border-navy/25 pb-2 transition-colors focus-within:border-navy">
                    <span className="absolute left-0 text-muted">??</span>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-transparent py-2 pl-8 text-xl tracking-[-0.03em] outline-none placeholder:text-navy/25" required />
                  </div>
                  <div className="relative flex items-center border-b border-navy/25 pb-2 transition-colors focus-within:border-navy">
                    <span className="absolute left-0 text-muted">??</span>
                    <input type="number" value={monthlyBill} onChange={(e) => setMonthlyBill(e.target.value)} placeholder="Average Monthly Electric Bill ($)" className="w-full bg-transparent py-2 pl-8 text-xl tracking-[-0.03em] outline-none placeholder:text-navy/25" required />
                  </div>
                  
                  <div className="flex flex-col gap-3 pt-2">
                    <label className="flex items-center gap-2 text-sm text-navy">
                      <input type="checkbox" checked={isHomeowner} onChange={(e) => setIsHomeowner(e.target.checked)} className="h-4 w-4 rounded border-navy/25 text-navy" />
                      I am the homeowner
                    </label>
                    <label className="flex items-center gap-2 text-sm text-navy">
                      <input type="checkbox" checked={creditQualified} onChange={(e) => setCreditQualified(e.target.checked)} className="h-4 w-4 rounded border-navy/25 text-navy" />
                      My credit score is 650 or higher
                    </label>
                  </div>
                </div>
                
                <button type="submit" className="flex h-12 w-full items-center justify-center rounded-full bg-navy text-sm font-medium text-white transition-colors hover:bg-navy/90">
                  Generate My Solar Report
                </button>
                
                <div className="mt-4 flex items-start gap-3">
                  <input type="checkbox" id="tcpa" required className="mt-1 h-3.5 w-3.5 shrink-0 rounded border-line text-navy focus:ring-navy cursor-pointer" />
                  <label htmlFor="tcpa" className="text-[10px] leading-relaxed text-muted cursor-pointer">
                    By submitting, I agree to the <a href="/privacy" className="underline hover:text-navy" target="_blank">Privacy Policy</a> and provide express written consent for SentiSolar to contact me.
                  </label>
                </div>
              </form>\;
content = content.replace(oldForm, newForm);

fs.writeFileSync('app/page.tsx', content);
console.log("Updated page.tsx successfully.");
