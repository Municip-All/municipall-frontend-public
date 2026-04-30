import re

with open('src/test/layout.tsx', 'r') as f:
    layout = f.read()
    
# Clean up "NAVIGATION" text issues? 
# Maybe he meant: "genre le mot navigation tu vois c'est banale mais règle tous ces petit problème"
# In desktop sidebar, maybe replace "NAVIGATION" with "MUNICIP'ALL" or just remove it or change style. Let's make it look cooler.

layout = layout.replace('<div className="dsb-logo"><span>NAVIGATION</span></div>', '<div className="dsb-logo"><div className="topbar__mark" style={{width: 24, height: 24, fontSize: ".6rem"}}>M</div><span>MUNICIP\'ALL</span></div>')

with open('src/test/layout.tsx', 'w') as f:
    f.write(layout)
