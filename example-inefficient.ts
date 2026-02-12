import fs from 'fs';

export async function processFiles(files: string[]) {
  // Fixed: Async I/O
  await Promise.all(files.map(async (file) => {
    const data = await fs.promises.readFile(file, 'utf-8');
    console.log(data.length);
  }));
}

export function findUser(users: any[], id: string) {
    // Anti-pattern: Linear search instead of map lookup (keeping as is for now)
    return users.find(u => u.id === id);
}
