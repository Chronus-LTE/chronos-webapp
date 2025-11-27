import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  /**
   * Generate a random avatar URL
   * Uses DiceBear API with random seed for truly random avatars
   */
  generateRandomAvatar(email?: string): string {
    // Create a random seed combining email (if provided) and random string
    const randomSeed = Math.random().toString(36).substring(2, 15) +
                       Math.random().toString(36).substring(2, 15);
    const seed = email ? `${email}-${randomSeed}` : randomSeed;

    // Using DiceBear API with avataaars style for nice random avatars
    const encodedSeed = encodeURIComponent(seed);
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedSeed}&scale=80`;
  }

  /**
   * Generate avatar from initials
   */
  getInitials(fullName: string): string {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}