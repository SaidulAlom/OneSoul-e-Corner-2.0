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