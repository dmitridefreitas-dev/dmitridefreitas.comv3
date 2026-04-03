import fs from 'fs';

const INPUT_NODES = [
  { id: 'priceData',    },
  { id: 'fundamentals', },
  { id: 'mlFeatures',   },
  { id: 'altData',      },
];

const skillsData = [
  { id: 'python', category: 'Programming' },
  { id: 'r', category: 'Programming' },
  { id: 'sql', category: 'Programming' },
  { id: 'matlab', category: 'Programming' },
  { id: 'vba', category: 'Programming' },
  { id: 'git', category: 'Programming' },
  { id: 'matplotlib', category: 'Data Visualization' },
  { id: 'powerbi', category: 'Data Visualization' },
  { id: 'tableau', category: 'Data Visualization' },
  { id: 'quantlib', category: 'Financial Tools' },
  { id: 'bloomberg', category: 'Financial Tools' },
  { id: 'fred', category: 'Financial Tools' },
];

const OUTPUT_NODES = [
  { id: 'alphaSignals', },
  { id: 'riskMetrics',  },
  { id: 'execLogic',    },
  { id: 'dashboards',   },
];

const PROJECT_NODES_DATA = {
  marketMaking: {},
  statArb: {},
  orderBook: {},
  yieldAggr: {},
};

const map = {};

function layoutGroup(ids, yStart, maxPerRow, titleY) {
  const rowHeight = 70;
  const colWidth = 350 / maxPerRow;
  
  ids.forEach((id, index) => {
    const row = Math.floor(index / maxPerRow);
    const col = index % maxPerRow;
    const countInRow = Math.min(maxPerRow, ids.length - row * maxPerRow);
    
    // Center the row
    const totalRowWidth = countInRow * colWidth;
    const startX = (350 - totalRowWidth) / 2;
    const x = startX + col * colWidth + colWidth / 2;
    const y = yStart + row * rowHeight;
    map[id] = { x: Math.round(x), y: Math.round(y) };
  });
  
  return yStart + Math.ceil(ids.length / maxPerRow) * rowHeight;
}

let curY = 120;
curY = layoutGroup(INPUT_NODES.map(x=>x.id), curY, 2) + 60;
curY = layoutGroup(skillsData.filter(x=>x.category==='Programming').map(x=>x.id), curY, 3) + 60;
curY = layoutGroup(skillsData.filter(x=>x.category!=='Programming').map(x=>x.id), curY, 3) + 60;
curY = layoutGroup(OUTPUT_NODES.map(x=>x.id), curY, 2) + 60;
curY = layoutGroup(Object.keys(PROJECT_NODES_DATA), curY, 1) + 20;

console.log("const MOBILE_POS_MAP = " + JSON.stringify(map, null, 2) + ";");
