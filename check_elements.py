import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Find all element names in Routes
elements = re.findall(r'element={<([A-Za-z0-9]+)\s*/>}', content)
elements = set(elements)

# Find all definitions (lazy, import, or local)
lazy_defs = re.findall(r'const\s+([A-Za-z0-9]+)\s*=\s*React\.lazy', content)
import_defs = re.findall(r'import\s+([A-Za-z0-9]+)\s+from', content)
destructured_imports = re.findall(r'import\s+\{([^}]+)\}\s+from', content)
local_defs = re.findall(r'const\s+([A-Za-z0-9]+)\s*=\s*\(\)\s*=>', content)

all_defs = set(lazy_defs) | set(import_defs) | set(local_defs)
for group in destructured_imports:
    for item in group.split(','):
        all_defs.add(item.strip().split(' as ')[-1])

missing = elements - all_defs
print("Missing definitions for elements:")
for m in sorted(missing):
    print(f"  - {m}")
