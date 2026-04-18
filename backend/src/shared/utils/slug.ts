/**
 * Slug Generation Utilities
 */

import slugify from "slugify";

/**
 * Generates a unique slug from a name, handling duplicates by appending suffixes
 * @param name - The name to generate slug from
 * @param checkExistence - Function to check if slug exists in database
 * @returns Promise<string> - The unique slug
 */
export async function generateUniqueSlug(
    name: string,
    checkExistence: (slug: string) => Promise<boolean>
): Promise<string> {
    const baseSlug = slugify(name, { lower: true });

    let slug = baseSlug;
    let counter = 1;

    while (await checkExistence(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}