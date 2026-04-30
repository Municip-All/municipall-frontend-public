import re

with open('src/otherviews_jsx.txt', 'r') as f:
    text = f.read()

views = re.split(r'<div className="view" id="view-([a-z]+)">', text)

out = "import React from 'react';\nimport { useApp } from './Appcontext';\n\n"

for i in range(1, len(views)-1, 2):
    name = views[i]
    content = views[i+1]
    
    if '<nav className="bottomnav' in content:
        content = content[:content.find('<nav className="bottomnav')]
    if '{/* ══════════ BOTTOM NAV (mobile) ══════════ */}' in content:
         content = content[:content.find('{/* ══════════ BOTTOM NAV')]
        
    # We must ensure closing div is correct. 
    # Notice that the split regex matched <div className="view"... so we need to add the closing div at the end if it's missing, but it is usually at the end of content.
    # Wait, the html of the views has `</div>` at the end naturally.
    
    # We also need to map some icons or data dynamically? For now just raw copy to fix the issue.
    CompName = name.capitalize() + 'View'
    out += f"""export const {CompName}: React.FC = () => {{
  const {{ showView, user }} = useApp();
  return (
    <div className="view active" id="view-{name}">
{content}
  );
}};

"""

with open('src/test/otherviews.tsx', 'w') as f:
    f.write(out)
