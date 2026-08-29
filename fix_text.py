import sys

with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_text = "analyze your exact roof topography and shading to calculate your maximum panel capacity, 400W system size, and algorithmic home battery recommendations."
new_text = "analyze your exact roof topography and shading to calculate your maximum panel capacity and solar potential using Google's Solar API."

if old_text in content:
    content = content.replace(old_text, new_text)
    with open('app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Removed algorithmic text.")
else:
    print("FAILED: old_text not found.")
