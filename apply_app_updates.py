import os

with open('src/App.tsx', 'r') as f:
    app_content = f.read()

with open('app_updates.txt', 'r') as f:
    updates = f.read()

parts = updates.split('// Routes')
imports = parts[0].replace('// Lazy imports', '').strip()
routes = parts[1].strip()

app_content = app_content.replace('// Loading component', imports + '\n\n// Loading component')
app_content = app_content.replace('<Route path="/blog/:slug" element={<BlogPost />} />',
                                  '<Route path="/blog/:slug" element={<BlogPost />} />\n            ' + routes)

with open('src/App.tsx', 'w') as f:
    f.write(app_content)
