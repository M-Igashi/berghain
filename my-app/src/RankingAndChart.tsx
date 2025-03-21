import React, { useEffect, useState } from 'react';
import axios from 'axios';

// APIをCloudflare Worker経由URLに変更
const API_BASE_URL = 'https://berghain.pages.dev/api';

interface RankingItem {
  artist_name: string;
  appearances: number;
}

const RankingAndChart = () => {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('API_BASE_URL:', API_BASE_URL); // デバッグ確認用

    const fetchRanking = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/ranking`, {
          params: {
            stage: 'Berghain',
            start: '2024-01-01',  // TODO: 将来的に動的に変更可能にする
            end: '2024-12-31',
          },
        });
        console.log('取得したデータ:', response.data);
        setRanking(response.data);
      } catch (err: any) {
        console.error('ランキング取得時エラー:', err?.message || err);
        setError('ランキングデータの取得に失敗しました。時間を置いて再度お試しください。');
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Berghain 出演ランキングチャート</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul>
        {ranking.map((item, index) => (
          <li key={index} className="mb-2">
            {item.artist_name} - {item.appearances} 回出演
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingAndChart;
