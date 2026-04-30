const fs = require('fs');

const text = fs.readFileSync('src/otherviews_jsx.txt', 'utf8');
const views = text.split(/<div className="view" id="view-([a-z]+)">/);

let out = "import React from 'react';\nimport { useApp } from './Appcontext';\n\n";

for (let i = 1; i < views.length - 1; i += 2) {
    const name = views[i];
    let content = views[i+1];
    
    const bnIndex = content.indexOf('<nav className="bottomnav');
    if (bnIndex !== -1) content = content.slice(0, bnIndex);
    const bnCommentIndex = content.indexOf('{/* ══════════ BOTTOM NAV');
    if (bnCommentIndex !== -1) content = content.slice(0, bnCommentIndex);
    
    // Capitalize front
    const compName = name.charAt(0).toUpperCase() + name.slice(1) + 'View';
    
    out += `export const ${compName}: React.FC = () => {
  const { showView, user } = useApp();
  return (
    <div className="view active" id="view-${name}">
${content}
    </div>
  );
};

`;
}

fs.writeFileSync('src/test/otherviews.tsx', out);
console.log('Successfully generated otherviews.tsx');
