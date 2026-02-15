import json
import re

def to_pascal_case(text):
    pascal = ''.join(word.capitalize() for word in re.split(r'[-_]', text))
    if pascal[0].isdigit():
        pascal = "Blog" + pascal
    return pascal

with open('blog_plan.json', 'r') as f:
    blogs = json.load(f)

imports = []
routes = []

for blog in blogs:
    component_name = to_pascal_case(blog['slug'])
    slug = blog['slug']
    imports.append(f"const {component_name} = React.lazy(() => import('./pages/blogs/{component_name}'));")
    routes.append(f'            <Route path="/blog/{slug}" element={{<{component_name} />}} />')

print("// Lazy imports")
print("\n".join(imports))
print("\n// Routes")
print("\n".join(routes))
