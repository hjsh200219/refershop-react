import React, { useState } from 'react';
import { searchVideoAnalysis, VideoAnalysis } from '../utils/queries';

type TabType = '장점' | '단점' | '추천 이유';

const KeywordSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<VideoAnalysis[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [activeTabs, setActiveTabs] = useState<{ [key: number]: TabType }>({});

    const handleTabChange = (resultId: number, tab: TabType) => {
        setActiveTabs(prev => ({ ...prev, [resultId]: tab }));
    };

    const handleSearch = async () => {
        if (!keyword.trim()) return;

        setIsLoading(true);
        setError(null);
        setSearchPerformed(true);

        try {
            const searchResults = await searchVideoAnalysis(keyword.trim());
            setResults(searchResults);
        } catch (err) {
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

    const renderTabContent = (result: VideoAnalysis) => {
        const activeTab = activeTabs[result.id] || '장점';
        
        switch (activeTab) {
            case '장점':
                return (result.pros ?? []).length > 0 ? (
                    <ul className="list-disc text-sm text-gray-600 pl-5">
                        {result.pros.map((pro, idx) => (
                            <li key={idx} className="pl-1">
                                <span className="block ml-1">{pro}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-2">
                        등록된 장점이 없습니다.
                    </p>
                );
            
            case '단점':
                return (result.cons ?? []).length > 0 ? (
                    <ul className="list-disc text-sm text-gray-600 pl-5">
                        {result.cons.map((con, idx) => (
                            <li key={idx} className="pl-1">
                                <span className="block ml-1">{con}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-2">
                        등록된 단점이 없습니다.
                    </p>
                );
            
            case '추천 이유':
                return (result.recommendation_reasons ?? []).length > 0 ? (
                    <ul className="list-disc text-sm text-gray-600 pl-5">
                        {result.recommendation_reasons.map((reason, idx) => (
                            <li key={idx} className="pl-1">
                                <span className="block ml-1">{reason}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-2">
                        등록된 추천 이유가 없습니다.
                    </p>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-2 py-1 min-h-screen relative">
            <div className="mb-8">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="제품명 또는 카테고리 검색"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg 
                                   hover:bg-indigo-700 focus:outline-none 
                                   focus:ring-2 focus:ring-indigo-500 
                                   focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isLoading ? '검색 중...' : '검색'}
                    </button>
                </div>
                {error && (
                    <p className="mt-2 text-red-600">{error}</p>
                )}
            </div>

            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center 
                                bg-white bg-opacity-90">
                    <div className="flex flex-col items-center" 
                         style={{ marginTop: '30vh' }}>
                        <div className="animate-spin rounded-full h-16 w-16 
                                        border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-600">검색 중입니다...</p>
                    </div>
                </div>
            )}

            {searchPerformed && !isLoading && results.length === 0 ? (
                <div className="text-center text-gray-600">
                    검색 결과가 없습니다.
                </div>
            ) : (
                !isLoading && results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((result) => (
                            <div key={result.id} className="bg-white rounded-lg 
                                                            shadow-md overflow-hidden">
                                <div className="p-4 flex flex-col h-full">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-2">
                                            {result.product_name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <span className="font-bold">채널:</span> 
                                            {result.channel_title}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <span className="font-bold">영상 제목:</span>{' '}
                                            <a 
                                                href={`https://youtube.com/watch?v=${result.video_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:bg-gray-100 bg-white rounded"
                                            >
                                                {result.title}
                                            </a>
                                        </p>
                                        <p className="text-sm text-gray-600 mb-4">
                                            <span className="font-bold">카테고리:</span> 
                                            {result.category}
                                        </p>
                                        
                                        <div className="mb-3">
                                            <div className="flex border-b">
                                                {(['장점', '단점', '추천 이유'] as const).map((tab) => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => handleTabChange(result.id, tab)}
                                                        className={`flex-1 py-2 text-sm font-medium ${
                                                            activeTabs[result.id] === tab || 
                                                            (!activeTabs[result.id] && tab === '장점')
                                                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                                                : 'text-gray-500 hover:text-gray-700'
                                                        }`}
                                                    >
                                                        {tab}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="mt-3 h-[200px]">
                                                {renderTabContent(result)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-1 flex justify-center items-center 
                                                    gap-4 pt-1">
                                        <a
                                            href={`https://youtube.com/watch?v=${result.video_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center 
                                                       px-4 py-2 bg-white rounded 
                                                       hover:bg-gray-100"
                                        >
                                            <img src="/assets/logo_youtube.png" 
                                                 alt="YouTube에서 보기" 
                                                 className="h-8" />
                                        </a>

                                        <img src="/assets/logo_coupang.png" 
                                             alt="쿠팡에서 보기" 
                                             className="h-6" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default KeywordSearch;
