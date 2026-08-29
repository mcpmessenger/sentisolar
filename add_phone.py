import sys

with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_header = '''      <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-16">
        <Brand />
        
      </header>'''

new_header = '''      <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-16">
        <Brand />
        <a href="tel:8562194352" className="flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2 text-xs font-semibold text-navy transition-colors hover:bg-navy/5">
          ?? (856) 219-4352
        </a>
      </header>'''

if old_header in content:
    content = content.replace(old_header, new_header)
    with open('app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Added phone number to header.")
else:
    print("FAILED: old_header not found.")
