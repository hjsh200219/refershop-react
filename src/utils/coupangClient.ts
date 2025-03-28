export interface CoupangProduct {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
}

export class CoupangClient {
  private baseUrl = 'http://localhost:3001';

  async searchProducts(keyword: string, limit: number = 3): Promise<CoupangProduct[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/coupang-search?keyword=${encodeURIComponent(keyword)}`);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('쿠팡 API 에러:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`쿠팡 API 요청 실패: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();

      if (!responseData.data || !Array.isArray(responseData.data)) {
        console.error('잘못된 응답 형식:', responseData);
        return [];
      }

      return responseData.data.map((item: any) => ({
        productId: item.productId || '',
        productName: item.productName || '',
        productPrice: item.productPrice || 0,
        productImage: item.productImage || '',
        productUrl: item.productUrl || ''
      }));
    } catch (error) {
      console.error('쿠팡 검색 오류:', error);
      throw error;
    }
  }
} 