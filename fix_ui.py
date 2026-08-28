import sys

with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_form = '''              <form onSubmit={submitEmail} className="animate-fade-in w-full">
                <label htmlFor="email" className="mb-4 block text-base font-medium tracking-[-0.02em] text-navy">2. Where should we send your custom roof report?</label>
                <div className="relative flex items-center border-b border-navy/25 pb-2 transition-colors focus-within:border-navy">
                  <input autoFocus type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-transparent py-2 text-xl tracking-[-0.03em] outline-none placeholder:text-navy/25" required />
                  <button type="submit" className="ml-4 flex h-10 w-28 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-medium text-white transition-colors hover:bg-navy/90">
                    Get Report
                  </button>
                </div>
                
                <div className="mt-6 flex items-start gap-3">
                  <input type="checkbox" id="tcpa" required className="mt-1 h-3.5 w-3.5 shrink-0 rounded border-line text-navy focus:ring-navy cursor-pointer" />
                  <label htmlFor="tcpa" className="text-[10px] leading-relaxed text-muted cursor-pointer">
                    By submitting, I agree to the <a href="/privacy" className="underline hover:text-navy" target="_blank">Privacy Policy</a> and provide express written consent for SentiSolar to contact me via automated AI voice calls and SMS. Consent is not a condition of purchase.
                  </label>
                </div>
              </form>'''

new_form = '''              <form onSubmit={submitEmail} className="animate-fade-in w-full">
                <label className="mb-4 block text-base font-medium tracking-[-0.02em] text-navy">2. Tell us about your home to unlock your report:</label>
                
                <div className="space-y-4 mb-6">
                  <div className="relative flex items-center border-b border-navy/25 pb-2 transition-colors focus-within:border-navy">
                    <span className="absolute left-0 text-muted mr-3">??</span>
                    <input autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-transparent py-2 pl-8 text-xl tracking-[-0.03em] outline-none placeholder:text-navy/25" required />
                  </div>
                  <div className="relative flex items-center border-b border-navy/25 pb-2 transition-colors focus-within:border-navy">
                    <span className="absolute left-0 text-muted mr-3">??</span>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-transparent py-2 pl-8 text-xl tracking-[-0.03em] outline-none placeholder:text-navy/25" required />
                  </div>
                  <div className="relative flex items-center border-b border-navy/25 pb-2 transition-colors focus-within:border-navy">
                    <span className="absolute left-0 text-muted mr-3">??</span>
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
              </form>'''

if old_form in content:
    new_content = content.replace(old_form, new_form)
    with open('app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: UI replaced")
else:
    print("FAILED: old_form not found in content")
