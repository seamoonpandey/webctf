// Simple encryption for the flag
export function encryptFlag(flag: string): string {
  return btoa(flag.split('').reverse().join(''));
}

export function decryptFlag(encrypted: string): string {
  return atob(encrypted).split('').reverse().join('');
}