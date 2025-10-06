const fs = require('fs');
const path = require('path');

// Simple database backup script
const dbPath = path.join(__dirname, 'app.db');
const backupDir = path.join(__dirname, 'backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(backupDir, `app-${timestamp}.db`);

if (!fs.existsSync(dbPath)) {
  console.log('❌ No database found to backup');
  process.exit(1);
}

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

fs.copyFileSync(dbPath, backupPath);
console.log(`✅ Database backed up to: ${backupPath}`);

// Keep only last 5 backups
const backups = fs.readdirSync(backupDir)
  .filter(f => f.startsWith('app-') && f.endsWith('.db'))
  .map(f => ({
    name: f,
    path: path.join(backupDir, f),
    time: fs.statSync(path.join(backupDir, f)).mtime.getTime()
  }))
  .sort((a, b) => b.time - a.time);

if (backups.length > 5) {
  backups.slice(5).forEach(backup => {
    fs.unlinkSync(backup.path);
    console.log(`🗑️  Removed old backup: ${backup.name}`);
  });
}

console.log(`\n📦 Total backups: ${Math.min(backups.length, 5)}`);


