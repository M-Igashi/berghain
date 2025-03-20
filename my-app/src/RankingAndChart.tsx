import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://klubnacht.tyna.ninja/api'; // 固定URLに変更

interface RankingItem {
  artist_name: string;
  appearances: number;
}

const RankingAndChart = () => {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/ranking`, {
          params: {
            stage: 'Berghain',
            start: '2024-01-01',
            end: '2024-12-31',
          },
        });
        setRanking(response.data);
      } catch (err) {
        console.error('Error fetching ranking:', err);
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
            {item.artist_name} - {item.appearances} 回
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingAndChart;
