from pathlib import Path
import re
import sys

root = Path(sys.argv[1]).resolve()
migration = Path('D:/herd/mspace/database/migrations/2026_09_27_010000_standardize_domain_schema.php').read_text()
tables_block = migration.split('private const TABLES = [', 1)[1].split('];', 1)[0]
columns_block = migration.split('private const COLUMNS = [', 1)[1].split('];', 1)[0]
tables = dict(re.findall(r"'([^']+)'\s*=>\s*'([^']+)'", tables_block))
columns = dict(re.findall(r"'([^']+)'\s*=>\s*'([^']+)'", columns_block))

paths = []
for folder, suffixes in [('app', {'.php'}), ('database/seeders', {'.php'}), ('database/factories', {'.php'}), ('routes', {'.php'}), ('tests', {'.php'}), ('resources/js', {'.ts', '.tsx'})]:
    base = root / folder
    if base.exists():
        paths += [path for path in base.rglob('*') if path.suffix in suffixes and path.name != 'LegacyErdBackfillService.php']

for path in paths:
    original = path.read_text(encoding='utf-8')
    text = original
    # Table names embedded in qualified column references and SQL fragments.
    for old, new in sorted(tables.items(), key=lambda pair: -len(pair[0])):
        text = re.sub(r'\b' + re.escape(old) + r'\b', new, text)
    for old, new in {'birdepts': 'units', 'faqs': 'faqs', 'informasi': 'information'}.items():
        text = text.replace("'" + old + "'", "'" + new + "'")
        text = text.replace('exists:' + old + ',', 'exists:' + new + ',')
        text = text.replace("'" + old + '.', "'" + new + '.')
    for old, new in sorted(columns.items(), key=lambda pair: -len(pair[0])):
        text = re.sub(r'\b' + re.escape(old) + r'\b', new, text)

    # Inertia prop and relation names are API keys, not database tables.
    text = text.replace("'units' => $birdepts", "'birdepts' => $birdepts")
    text = text.replace("'information' => $informasi", "'informasi' => $informasi")
    text = text.replace("setRelation('information'", "setRelation('informasi'")
    # URL, route, component, and generated module names are public API paths.
    text = text.replace('admin/information', 'admin/informasi')
    text = text.replace('admin.information', 'admin.informasi')
    text = text.replace('admin/information/index', 'admin/informasi/index')
    text = text.replace('./information', './informasi')
    text = text.replace("route('information.show'", "route('informasi.show'")
    text = text.replace("->name('information.show')", "->name('informasi.show')")
    if root.as_posix().lower().endswith('/mspace'):
        text = text.replace('/information', '/informasi')
        text = text.replace('img/information', 'img/informasi')
        text = text.replace("'information-", "'informasi-")
    text = text.replace("\\'", "'") if path.suffix == '.php' and '/Models/' in path.as_posix() else text
    if path.suffix == '.php' and '/Models/' in path.as_posix() and 'public const CREATED_AT' not in text and re.search(r'class\s+\w+\s+extends\s+(?:Model|Authenticatable)', text):
        text = re.sub(r'(class\s+\w+\s+extends\s+(?:Model|Authenticatable)(?:\s+implements\s+\w+)?\s*\{)',
                      lambda match: match.group(1) + "\n    public const CREATED_AT = 'createdAt';\n    public const UPDATED_AT = 'updatedAt';", text, count=1)
        if 'use SoftDeletes;' in text:
            text = text.replace("public const UPDATED_AT = 'updatedAt';", "public const UPDATED_AT = 'updatedAt';\n    public const DELETED_AT = 'deletedAt';", 1)
    if text != original:
        path.write_text(text, encoding='utf-8')
        print(path.relative_to(root))
