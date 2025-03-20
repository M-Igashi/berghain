import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://klubnacht.tyna.ninja/api';

interface RankingItem {
  name: string;
  count: number;
  date: string;
}

interface YearlyStat {
  year: string;
  total: number;
}

const RankingAndChart = () => {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [yearlyStats, setYearlyStats] = useState<YearlyStat[]>([]);
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

        if (response.data && Array.isArray(response.data)) {
          setRanking(response.data);
          calculateYearlyStats(response.data);
        } else {
          throw new Error('API から無効な形式のレスポンスが返されました。');
        }
      } catch (err) {
        console.error('ランキングデータ取得エラー:', err);
        setError(
          'Berghain 出演ランキングチャート\nランキングデータの取得に失敗しました。時間を置いて再度お試しください。'
        );
      }
    };

    const calculateYearlyStats = (rankingData: RankingItem[]) => {
      const statsMap: { [year: string]: number } = {};
      rankingData.forEach((item) => {
        const year = new Date(item.date).getFullYear().toString();
        statsMap[year] = (statsMap[year] || 0) + item.count;
      });

      const statsArray = Object.entries(statsMap).map(([year, total]) => ({
        year,
        total,
      }));

      setYearlyStats(statsArray);
    };

    fetchRanking();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Berghain 出演ランキングチャート</h1>
      <h2 className="text-lg font-bold mb-4">ランキング</h2>
      {error && <p className="text-red-500 mb-4 whitespace-pre-line">{error}</p>}
      <ul>
        {ranking.map((item, index) => (
          <li key={index} className="mb-2">
            {item.name} - {item.count}
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-bold mt-8 mb-4">年間統計 (計算結果)</h2>
      <ul>
        {yearlyStats.map((stat, index) => (
          <li key={index} className="mb-2">
            {stat.year}: {stat.total}
          </li>
        ))}
      </ul>

      <footer className="mt-8 text-gray-500 text-sm">
        © 2025 Berghain Stats Viewer
      </footer>
    </div>
  );
};

export default RankingAndChart;
