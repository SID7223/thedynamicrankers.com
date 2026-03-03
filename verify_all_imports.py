import re
import os

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Find all element={<Component />} in content
elements = re.findall(r'element={<([A-Za-z0-9]+)\s*/>}', content)
elements = set(elements)

# 2. Find all const Component = React.lazy(() => import('path'))
lazy_imports = re.findall(r'const\s+([A-Za-z0-9]+)\s*=\s*React\.lazy\(\(\)\s*=>\s*import\(\'([^\']+)\'\)\)', content)

# 3. Find all direct imports: import Component from 'path' or import { Component } from 'path'
direct_imports = re.findall(r'^import\s+([A-Za-z0-9]+)\s+from', content, re.MULTILINE)
destructured_imports = re.findall(r'^import\s+\{([^}]+)\}\s+from', content, re.MULTILINE)

# 4. Find local definitions
local_defs = re.findall(r'const\s+([A-Za-z0-9]+)\s*=\s*\(', content)

defined = set(direct_imports) | set(local_defs)
for comp, path in lazy_imports:
    defined.add(comp)
    # Check if file exists
    # Handle relative paths
    clean_path = path.replace('./', '')
    possible_paths = [
        os.path.join('src', clean_path + '.tsx'),
        os.path.join('src', clean_path + '.ts'),
        os.path.join('src', clean_path, 'index.tsx'),
        os.path.join('src', clean_path, 'index.ts'),
        os.path.join('src', clean_path) # maybe it's already full
    ]
    exists = any(os.path.exists(p) for p in possible_paths)
    if not exists:
        print(f"Lazy import path does not exist: {path}")

for group in destructured_imports:
    for item in group.split(','):
        # Handle "A as B"
        comp_name = item.strip().split(' as ')[-1].split(':')[0].strip()
        defined.add(comp_name)

missing = elements - defined
if missing:
    print("Missing definitions for elements used in routes:")
    for m in sorted(missing):
        print(f"  - {m}")
else:
    print("All elements used in routes are defined.")
