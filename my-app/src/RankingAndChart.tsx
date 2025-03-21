import React, { useEffect, useState } from 'react';
import axios from 'axios';

// APIエンドポイント
const API_BASE_URL = 'https://berghain.tyna.ninja/api';

interface RankingItem {
  artist_name: string;
  appearances: number;
}

// クエリパラメータを取得するユーティリティ
const getQueryParam = (param: string, defaultValue: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || defaultValue;
};

const RankingAndChart = () => {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stage = getQueryParam('stage', 'Berghain');
    const start = getQueryParam('start', '2024-01-01');
    const end = getQueryParam('end', '2024-12-31');

    console.log('API_BASE_URL:', API_BASE_URL, 'Params:', { stage, start, end });

    const fetchRanking = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/ranking`, {
          params: { stage, start, end },
          responseType: 'json',
        });

        const data =
          typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        setRanking(data);
        console.log('取得したデータ:', data);
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
