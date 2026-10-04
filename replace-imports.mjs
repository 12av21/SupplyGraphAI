import fs from 'fs';
import path from 'path';

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      walk(full);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      const content = fs.readFileSync(full, 'utf8');
      const updated = content.replace(/from\s+(['"])(.*?)\.js\1/g, 'from $1$2.ts$1');
      if (updated !== content) {
        fs.writeFileSync(full, updated);
        console.log('Updated', full);
      }
    }
  }
}

walk('.');
