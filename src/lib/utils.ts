import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from 'firebase/firestore';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: any) => {
  if (!date) return '';
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
};

export const stripHtml = (html: string): string => {
  if (!html) return '';
  // Remove HTML tags using regex (works on both server and client)
  const text = html.replace(/<[^>]*>/g, '');
  // Decode common HTML entities
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};