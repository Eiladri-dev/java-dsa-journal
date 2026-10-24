#!/usr/bin/env python3
"""Local server for Java DSA Journal with live chapter/program discovery."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse
import html, json, os, re, sys

ROOT = Path(__file__).resolve().parent
CHAPTERS = [
("01","Java Foundations","Syntax, variables, data types, operators, and input/output","ch-01-foundation"),
("02","Conditionals & Loops","Decision-making, iteration, and flow control","ch-02-control"),
("03","Pattern Problems","Grid logic, shapes, and coordinate-based printing","ch-03-patterns"),
("04","Functions & Methods","Reusable logic, parameters, return values, and method design","ch-04-functions-methods"),
("05","Arrays","Traversal, updates, subarrays, and array problem-solving","ch-05-arrays"),
("06","Sorting","Elementary sorting, comparison sorts, and sorting patterns","ch-06-sorting"),
("07","2D Arrays","Matrices, row/column traversal, and grid algorithms","ch-07-2d-arrays"),
("08","Strings","String operations, character logic, and string problems","ch-08-strings"),
("09","Bit Manipulation","Binary representation, bitwise operators, and bit tricks","ch-09-bits"),
("10","Object-Oriented Programming","Classes, objects, constructors, inheritance, and polymorphism","ch-10-oop"),
("11","Recursion","Base cases, recursive calls, and recursion trees","ch-11-recursion"),
("12","Divide & Conquer","Problem decomposition, merge sort, and quick sort","ch-12-divide-conquer"),
("13","Backtracking","State-space exploration, choices, and constraint solving","ch-13-backtracking"),
("14","Time & Space Complexity","Asymptotic analysis and complexity estimation","ch-14-complexity"),
("15","Linked Lists","Nodes, pointers, traversal, and linked-list operations","ch-15-linked-lists"),
("16","Stacks","LIFO structures, monotonic stacks, and expression problems","ch-16-stacks"),
("17","Queues & Deques","FIFO structures, circular queues, and deque patterns","ch-17-queues"),
("18","Hashing","Hash maps, hash sets, frequency counting, and lookup patterns","ch-18-hashing"),
("19","Trees","Tree traversals, recursion, height, and tree properties","ch-19-trees"),
("20","Binary Search Trees","Ordered trees, search, insertion, and deletion","ch-20-bst"),
("21","Heaps & Priority Queues","Heap properties, top-k problems, and priority ordering","ch-21-heaps"),
("22","Greedy Algorithms","Local-choice strategies, scheduling, and optimization","ch-22-greedy"),
("23","Tries","Prefix trees, word lookup, and string-prefix problems","ch-23-tries"),
("24","Graphs","Representations, traversals, shortest paths, and connectivity","ch-24-graphs"),
("25","Dynamic Programming","Memoization, tabulation, and state-transition design","ch-25-dp"),
("26","Segment Trees & Range Queries","Range queries, updates, and tree-based structures","ch-26-segment-trees"),
("27","Interview Patterns & Revision","Mixed practice, common patterns, and interview-ready review","ch-27-interview"),
]

def natural_key(s):
    return [int(x) if x.isdigit() else x.casefold() for x in re.split(r'(\d+)', s)]

def display_name(file_name, title=''):
    stem = Path(file_name).stem
    t = re.sub(r'\s*[—–-]\s*(a guided dissection|guided dissection).*$','', title, flags=re.I).strip()
    if t and not t.lower().startswith(('chapter ', 'java dsa journal')):
        candidate = re.sub(r'\s*[—–-].*$', '', t).strip()
        if candidate: return candidate if candidate.lower().endswith('.java') else candidate + '.java'
    return stem + '.java'

def description_for(name, raw):
    m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)', raw, re.I)
    if m: return html.unescape(m.group(1)).strip()
    known = {'PrimeNo.java': 'A prime-number checker with divisor inspection and explicit input-state handling.', 'PrimesInRange.java': 'Prime-number logic applied across a range of values.', 'Bin2dec.java': 'Convert a binary number into a decimal representation.'}
    if name in known: return known[name]
    title = name.removesuffix('.java')
    spaced = re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', title).replace('_',' ').replace('-',' ')
    return f"Open the guided dissection for {spaced}: problem statement, logic, examples, and source walkthrough."

def topic_for(name):
    low=name.lower()
    if 'primesinrange' in low: return 'Range iteration'
    if any(x in low for x in ('prime','factor','divisor','gcd','lcm')): return 'Number logic'
    if any(x in low for x in ('bin','dec','hex','convert')): return 'Number conversion'
    if 'pattern' in low or 'diamond' in low: return 'Pattern logic'
    if 'array' in low: return 'Array logic'
    if 'sort' in low: return 'Sorting'
    if 'string' in low: return 'String logic'
    if 'recurs' in low: return 'Recursion'
    return 'Java practice'

PREFERRED_PROGRAM_ORDER = {'primeNo.html': 0, 'PrimesInRange.html': 1, 'Bin2dec.html': 2}

def catalog():
    chapter_rows=[]
    for n,name,desc,slug in CHAPTERS:
        chapter_rows.append({'n':n,'name':name,'desc':desc,'slug':slug,'url':f'/chapters/{slug}/index.html','programCount':0})
    by_slug={c['slug']:c for c in chapter_rows}
    programs=[]
    for chapter in chapter_rows:
        folder=ROOT/'chapters'/chapter['slug']/'programs'
        if not folder.is_dir(): continue
        files=sorted((f for f in folder.iterdir() if f.is_file() and f.suffix.lower()=='.html'),key=lambda f:(0, PREFERRED_PROGRAM_ORDER[f.name]) if f.name in PREFERRED_PROGRAM_ORDER else (1, natural_key(f.name)))
        for f in files:
            raw=f.read_text(encoding='utf-8',errors='replace')
            tm=re.search(r'<title[^>]*>(.*?)</title>',raw,re.I|re.S)
            title=html.unescape(re.sub(r'<[^>]+>','',tm.group(1))).strip() if tm else ''
            name=display_name(f.name,title)
            desc=description_for(name,raw)
            rel=f.relative_to(ROOT).as_posix()
            programs.append({'name':name,'file':f.name,'desc':desc,'topic':topic_for(name),'chapter':chapter['name'],'chapterSlug':chapter['slug'],'chapterNumber':chapter['n'],'url':'/'+rel,'slug':f.name,'symbol':re.sub(r'[^A-Za-z0-9]','',Path(name).stem)[:2].upper() or 'J','tone':['blue','teal','orange'][len([p for p in programs if p['chapterSlug']==chapter['slug']])%3],'keywords':f'{name} {chapter["name"]} {desc} {topic_for(name)}'})
            chapter['programCount']+=1
    for c in chapter_rows: c['state']='active' if c['programCount'] else 'empty';c['count']=f'{c["programCount"]:02d} programs' if c['programCount'] else '—'
    return {'chapters':chapter_rows,'programs':programs}

class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_GET(self):
        path=urlparse(self.path).path
        if path=='/api/catalog':
            payload=json.dumps(catalog(),ensure_ascii=False).encode()
            self.send_response(200);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(payload)));self.end_headers();self.wfile.write(payload);return
        super().do_GET()
    def guess_type(self,path):
        if path.endswith('.js'): return 'application/javascript'
        return super().guess_type(path)
    def send_head(self):
        # Inject contextual chapter-aware navigation into program HTML responses, without rewriting source files.
        path=urlparse(self.path).path
        local=(ROOT/unquote(path.lstrip('/'))).resolve()
        try: local.relative_to(ROOT)
        except ValueError: return super().send_head()
        if local.is_file() and local.suffix.lower()=='.html' and '/programs/' in path:
            try: raw=local.read_text(encoding='utf-8',errors='replace')
            except OSError: return super().send_head()
            # Compatibility for standalone journal pages that reference legacy shared files relatively.
            raw=re.sub(r'(?i)(href|src)(\s*=\s*)(["\'])journal-components\.css\3',
                       lambda m: f'{m.group(1)}{m.group(2)}{m.group(3)}/assets/journal-components.css{m.group(3)}', raw)
            raw=re.sub(r'(?i)(src)(\s*=\s*)(["\'])journal\.js\3',
                       lambda m: f'{m.group(1)}{m.group(2)}{m.group(3)}/assets/program-page.js{m.group(3)}', raw)
            if 'assets/program-navigation.js' not in raw:
                raw=re.sub(r'</body\s*>', '<script src="/assets/program-navigation.js" defer></script>\\n</body>', raw, count=1, flags=re.I)
            payload=raw.encode('utf-8')
            self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(payload)));self.end_headers()
            from io import BytesIO
            return BytesIO(payload)
        return super().send_head()

if __name__=='__main__':
    host=os.environ.get('HOST', '0.0.0.0');port=int(os.environ.get('PORT','8000'))
    print(f'Java DSA Journal listening on {host}:{port}')
    print('Live discovery enabled: add HTML files under the relevant chapter/programs/ folder, then refresh.')
    print('Press Ctrl+C to stop.')
    try: ThreadingHTTPServer((host,port),Handler).serve_forever()
    except KeyboardInterrupt: print('\nJournal stopped.')
