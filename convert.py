import re

def convert(filename):
    with open(filename, 'r') as f:
        html = f.read()

    # Simple JSX transformations
    html = html.replace('class="', 'className="')
    
    # We will manually map the static views using regex replace
    html = re.sub(r'onclick="([^"]*)"', '', html)
    html = html.replace('<!--', '{/*')
    html = html.replace('-->', '*/}')
    html = html.replace('<br>', '<br/>')
    
    # Fix unclosed inputs
    html = re.sub(r'(<input[^>]+?)(?<!/)>', r'\1 />', html)

    # Style parsing into React object format
    def style_repl(m):
        style_str = m.group(1)
        styles = style_str.split(';')
        obj_props = []
        for s in styles:
            if not s.strip(): continue
            parts = s.split(':', 1)
            if len(parts) == 2:
                k, v = parts
                k = k.strip()
                v = v.strip()
                # kebab to camel case
                if '-' in k and not k.startswith('--'):
                    k = re.sub(r'-([a-z])', lambda x: x.group(1).upper(), k)
                obj_props.append(f"'{k}': '{v}'")
        return "style={{" + ", ".join(obj_props) + "}}"

    html = re.sub(r'style="([^"]*)"', style_repl, html)

    with open('src/otherviews_jsx.txt', 'w') as f:
        f.write(html)

convert("src/otherviews.html")