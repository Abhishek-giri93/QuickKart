/**
 * Slugify String Utility
 * Converts human readable names into URL-safe slugs
 * Example: "Fruits & Vegetables" -> "fruits-vegetables"
 */

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
