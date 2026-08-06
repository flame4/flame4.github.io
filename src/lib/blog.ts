import { getCollection } from 'astro:content';

export function getBlogPosts() {
	return getCollection('blog', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
}
