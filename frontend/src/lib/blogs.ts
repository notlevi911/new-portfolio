export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  readingTime: number;
}

const rawPosts = import.meta.glob('../content/blogs/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function parseFrontmatter(raw: string): { meta: Record<string, string>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw.trim() };

  const [, frontmatter, body] = match;
  const meta: Record<string, string> = {};
  frontmatter.split('\n').forEach((line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) return;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');
    meta[key] = value;
  });

  return { meta, content: body.trim() };
}

export const blogPosts: BlogPost[] = Object.entries(rawPosts)
  .map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    const { meta, content } = parseFrontmatter(raw);

    const wordCount = content.split(/\s+/).filter(Boolean).length;

    return {
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      excerpt: meta.excerpt || '',
      tags: meta.tags ? meta.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
      content,
      readingTime: Math.max(1, Math.round(wordCount / 200)),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));
