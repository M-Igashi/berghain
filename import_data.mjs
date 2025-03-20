// ✅ JSONデータ投入用スクリプト（SQLファイルバッチ作成 & 自動入力対応版）
// ファイル名例: import_data_batch.mjs

import fs from 'fs';
import { execSync } from 'child_process';

const data = JSON.parse(fs.readFileSync('./processed_klubnacht_events.json', 'utf-8'));

const escapeValue = (value) => {
  if (!value) return "NULL";
  return `'${value.replace(/'/g, "''").replace(/\n/g, ' ').trim()}'`;
};

const generateSqlForBatch = (batch, batchIndex) => {
  let sql = '';
  for (const event of batch) {
    sql += `INSERT OR IGNORE INTO events (id, title, date, content_url, image_url) VALUES ('${event.id}', ${escapeValue(event.title)}, '${event.date}', ${escapeValue(event.content_url)}, ${escapeValue(event.image_url)});
`;

    for (const artist of event.berghain_lineup) {
      sql += `INSERT INTO performances (event_id, stage, artist_name) VALUES ('${event.id}', 'Berghain', ${escapeValue(artist)});
`;
    }

    for (const artist of event.panorama_bar_lineup) {
      sql += `INSERT INTO performances (event_id, stage, artist_name) VALUES ('${event.id}', 'Panorama Bar', ${escapeValue(artist)});
`;
    }
  }

  fs.writeFileSync(`batch_${batchIndex}.sql`, sql);
};

const insertDataByBatchFile = async () => {
  const batchSize = 10;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    generateSqlForBatch(batch, i / batchSize);

    try {
      console.log(`▶️ batch_${i / batchSize}.sql 実行中...`);
      execSync(`echo yes | npx wrangler d1 execute lineup --remote --file=./batch_${i / batchSize}.sql`, { stdio: 'inherit' });
    } catch (error) {
      console.error(`バッチ ${i / batchSize} 実行時にエラー:`, error.message);
    }

    await new Promise(resolve => setTimeout(resolve, 10000)); // 10秒休憩
  }

  console.log('✅ すべてのバッチファイル投入完了');
};

insertDataByBatchFile();
