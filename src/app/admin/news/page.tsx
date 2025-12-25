import { getNewsArticles } from '@/lib/news';
import AdminNewsPageContent from './admin-news-page-content';

export default async function AdminNewsPage() {
  const articles = await getNewsArticles();

  return <AdminNewsPageContent articles={articles} />;
}
