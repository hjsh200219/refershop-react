import React, { useState } from 'react';
import { searchVideoAnalysis, VideoAnalysis } from '../utils/queries';
import { CoupangClient, CoupangProduct } from '../utils/coupangClient';

const KeywordSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<VideoAnalysis[]>([]);
    const [coupangResults, setCoupangResults] = useState<CoupangProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const coupangClient = new CoupangClient();

    const handleSearch = async () => {
        if (!keyword.trim()) return;

        setIsLoading(true);
        setError(null);
        setSearchPerformed(true);

        try {
            const searchResults = await searchVideoAnalysis(keyword.trim());
            setResults(searchResults);

            // 각 검색 결과의 product_name으로 쿠팡 검색 실행
            const coupangSearchPromises = searchResults.map(result => 
                coupangClient.searchProducts(result.product_name, 1)
            );
            const coupangResultsArray = await Promise.all(coupangSearchPromises);
            
            // 모든 쿠팡 검색 결과를 하나의 배열로 합치기
            const allCoupangResults = coupangResultsArray.flat();
            
            console.log('검색 결과:', searchResults);
            console.log('검색 결과 개수:', searchResults.length);
            console.log('쿠팡 검색 결과:', allCoupangResults);
            
            setCoupangResults(allCoupangResults);
        } catch (err) {
            console.error('검색 에러:', err);
            setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-2 py-1">
            <div className="mb-8">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="제품명 또는 카테고리 검색"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isLoading ? '검색 중...' : '검색'}
                    </button>
                </div>
                {error && (
                    <p className="mt-2 text-red-600">{error}</p>
                )}
            </div>

            {searchPerformed && results.length === 0 ? (
                <div className="text-center text-gray-600">
                    검색 결과가 없습니다.
                </div>
            ) : (
                <>
                    {results.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((result) => (
                                <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="p-4 flex flex-col h-full">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-2">{result.product_name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                <span className="font-bold">채널:</span> {result.channel_title}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-2">
                                                <span className="font-bold">영상 제목:</span> {result.title}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-4">
                                                <span className="font-bold">카테고리:</span> {result.category}
                                            </p>
                                            
                                            {(result.pros ?? []).length > 0 && (
                                                <div className="mb-3">
                                                    <h4 className="font-bold text-sm text-gray-700 mb-1">장점:</h4>
                                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                                        {(result.pros ?? []).map((pro, idx) => (
                                                            <li key={idx}>{pro}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            
                                            {(result.cons ?? []).length > 0 && (
                                                <div className="mb-3">
                                                    <h4 className="font-bold text-sm text-gray-700 mb-1">단점:</h4>
                                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                                        {(result.cons ?? []).map((con, idx) => (
                                                            <li key={idx}>{con}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {(result.recommendation_reasons ?? []).length > 0 && (
                                                <div className="mb-3">
                                                    <h4 className="font-bold text-sm text-gray-700 mb-1">추천 이유:</h4>
                                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                                        {(result.recommendation_reasons ?? []).map((reason, idx) => (
                                                            <li key={idx}>{reason}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex justify-center items-center gap-4 pt-4">
                                            <a
                                                href={`https://youtube.com/watch?v=${result.video_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center px-4 py-2 bg-white rounded hover:bg-gray-100"
                                            >
                                                <img src="/assets/logo_youtube.png" alt="YouTube에서 보기" className="h-6" />
                                            </a>
                                            <a
                                                href={`https://www.coupang.com/search?q=${encodeURIComponent(result.product_name)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center px-4 py-2 bg-white rounded hover:bg-gray-100"
                                            >
                                                <img src="/assets/logo_coupang.png" alt="쿠팡" className="h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {coupangResults.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold mb-4">쿠팡 추천 상품</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {coupangResults.map((product) => (
                                    <a
                                        key={product.productId}
                                        href={product.productUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="aspect-w-1 aspect-h-1">
                                            <img
                                                src={product.productImage}
                                                alt={product.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {product.productName}
                                            </h3>
                                            <p className="mt-1 text-lg font-bold text-gray-900">
                                                {product.productPrice.toLocaleString()}원
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default KeywordSearch;
