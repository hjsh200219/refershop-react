import sql from './db';

export async function getProducts() {
  const products = await sql`
    SELECT * FROM products
    LIMIT 10
  `;
  return products;
}

export async function searchProducts(keyword: string) {
  const products = await sql`
    SELECT * FROM products
    WHERE name ILIKE ${`%${keyword}%`}
    LIMIT 10
  `;
  return products;
}

export interface VideoAnalysis {
  id: number;
  video_id: string;
  title: string;
  channel_title: string;
  product_name: string;
  category: string;
  pros: string[];
  cons: string[];
  recommendation_reasons: string[];
}

export async function searchVideoAnalysis(keyword: string): Promise<VideoAnalysis[]> {
  const keyword_list = keyword.split(' ').filter(kw => kw.trim() !== '');
  
  if (keyword_list.length === 0) {
    return [];
  }

  const searchPattern = `%${keyword}%`;

  const results = await sql`
    SELECT
      SI.channel_title,
      CI.video_id,
      CI.title,
      VA.id,
      VA.category,
      VA.product_name,
      VA.pros,
      VA.cons,
      VA.recommendation_reasons
    FROM video_analysis VA
    LEFT JOIN channel_info CI ON VA.video_id = CI.video_id
    LEFT JOIN subscription_info SI ON CI.channel_id = SI.channel_id
    WHERE category ILIKE ${searchPattern}
    OR product_name ILIKE ${searchPattern}
  `;
  
  return results as VideoAnalysis[];
} 