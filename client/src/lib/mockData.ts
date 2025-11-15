// Mock data generator for K125 Trading System
// Generates realistic TWSE stock data with technical indicators

export type EggPhase = 'Y' | 'A1' | 'A2' | 'A3' | 'X' | 'B1' | 'B2' | 'B3';

export interface StockData {
  id: string;
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  volumeValue: number;
  ma2: number;
  ma10: number;
  ma50: number;
  ma132: number;
  ma2Weekly: number;
  ma10Weekly: number;
  ma26Weekly: number;
  sarHigh: number;
  sarLow: number;
  ma2Slope: number;
  ma10Slope: number;
  ma50Slope: number;
  crossSignal: 'XO' | 'XU' | null;
  crossCount: number;
  eggPhase: EggPhase;
  ascentDescent: 'Ascent' | 'Descent' | null;
}

const realTWSEStocks = [
  { code: '2330', name: 'TSMC' },
  { code: '2317', name: 'Hon Hai' },
  { code: '2454', name: 'MediaTek' },
  { code: '2882', name: 'Cathay Financial' },
  { code: '2881', name: 'Fubon Financial' },
  { code: '2412', name: 'Chunghwa Telecom' },
  { code: '2303', name: 'United Microelectronics' },
  { code: '3711', name: 'ASE Technology' },
  { code: '2886', name: 'Mega Financial' },
  { code: '2891', name: 'CTBC Financial' },
  { code: '1301', name: 'Formosa Plastics' },
  { code: '1303', name: 'Nan Ya Plastics' },
  { code: '2002', name: 'China Steel' },
  { code: '2308', name: 'Delta Electronics' },
  { code: '2357', name: 'Asustek Computer' },
  { code: '2382', name: 'Quanta Computer' },
  { code: '2395', name: 'Advantech' },
  { code: '3008', name: 'LARGAN Precision' },
  { code: '2408', name: 'Nanya Technology' },
  { code: '2474', name: 'Catcher Technology' },
  { code: '6505', name: 'Formosa Petrochemical' },
  { code: '2884', name: 'E.Sun Financial' },
  { code: '2892', name: 'First Financial' },
  { code: '2912', name: 'President Chain Store' },
  { code: '5880', name: 'Taiwan Cooperative Financial' },
  { code: '2885', name: 'Yuanta Financial' },
  { code: '2345', name: 'Accton Technology' },
  { code: '2327', name: 'Yageo' },
  { code: '3045', name: 'Taiwan Mobile' },
  { code: '2603', name: 'Evergreen Marine' },
  { code: '2609', name: 'Yang Ming Marine' },
  { code: '2207', name: 'Hotai Motor' },
  { code: '2105', name: 'Cheng Shin Rubber' },
  { code: '2801', name: 'Chang Hwa Bank' },
  { code: '2880', name: 'Hua Nan Financial' },
  { code: '2883', name: 'China Development Financial' },
  { code: '1326', name: 'Formosa Chemicals' },
  { code: '1216', name: 'Uni-President' },
  { code: '2301', name: 'Lite-On Technology' },
  { code: '2337', name: 'Macronix' },
  { code: '2379', name: 'Realtek' },
  { code: '2324', name: 'Compal Electronics' },
  { code: '2409', name: 'AU Optronics' },
  { code: '2449', name: 'King Yuan Electronics' },
  { code: '3034', name: 'Novatek' },
  { code: '2615', name: 'Wan Hai Lines' },
  { code: '2204', name: 'China Motor' },
  { code: '2801', name: 'Chang Hwa Commercial Bank' },
  { code: '2504', name: 'Goldsun' },
  { code: '1402', name: 'Far Eastern New Century' },
  { code: '3017', name: 'Asia Optical' },
  { code: '2201', name: 'Yulon Motor' },
  { code: '2227', name: 'Chung Hwa Pulp' },
  { code: '3231', name: 'Wistron' },
  { code: '6271', name: 'Tongfang' },
  { code: '2834', name: '臺企銀' },
  { code: '2353', name: 'Acer' },
  { code: '2344', name: 'Winbond Electronics' },
  { code: '2356', name: 'Inventec' },
  { code: '2377', name: 'Micro-Star International' },
  { code: '5871', name: 'F-TPK Holding' },
  { code: '3702', name: 'WPG Holdings' },
  { code: '2347', name: 'Synnex Technology' },
  { code: '3481', name: 'Innolux' },
  { code: '2542', name: 'Chung Shing Textile' },
  { code: '2352', name: 'Clevo' },
  { code: '2313', name: '華通' },
  { code: '2354', name: 'Foxconn Technology' },
  { code: '2360', name: 'Chicony Electronics' },
  { code: '2371', name: 'Tatung' },
  { code: '2376', name: 'Gigabyte Technology' },
  { code: '2231', name: 'Wei Chuan Foods' },
  { code: '1904', name: 'China Petrochemical' },
  { code: '1605', name: 'Walsin Lihwa' },
  { code: '3533', name: 'Jiasheng' },
  { code: '2328', name: 'Evermight' },
  { code: '2002', name: 'China Steel Corp' },
  { code: '6269', name: 'Taiwan Paiho' },
  { code: '5434', name: 'Coremax' },
  { code: '2448', name: 'Chipbond Technology' },
  { code: '3406', name: 'Yulon Nissan' },
  { code: '2059', name: 'Chuan Lian' },
  { code: '1477', name: 'Formosa Taffeta' },
  { code: '2606', name: 'Wan Hai Lines' },
  { code: '1101', name: 'Taiwan Cement' },
  { code: '1102', name: 'Asia Cement' },
  { code: '2610', name: 'China Merchants' },
  { code: '2027', name: 'Ta Chen' },
  { code: '9910', name: 'Feng TAY Enterprise' },
  { code: '3149', name: 'Chipmore' },
  { code: '1590', name: 'Uni-President Development' },
  { code: '2633', name: 'Taiwan High Speed Rail' },
  { code: '2342', name: 'Compeq' },
  { code: '2458', name: 'Realtek Semiconductor' },
  { code: '2441', name: 'Powertech Technology' },
  { code: '2376', name: 'Gigabyte' },
  { code: '3005', name: 'Epistar' },
  { code: '2393', name: 'Yageo' },
  { code: '2371', name: 'Tatung' },
];

function getRandomEggPhase(): EggPhase {
  const phases: EggPhase[] = ['Y', 'A1', 'A2', 'A3', 'X', 'B1', 'B2', 'B3'];
  const weights = [10, 15, 20, 15, 10, 12, 10, 8];
  
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < phases.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return phases[i];
    }
  }
  return 'Y';
}

function generateStockData(stock: { code: string; name: string }, index: number): StockData {
  const basePrice = 50 + Math.random() * 450;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;
  const volume = Math.floor(Math.random() * 50000) * 1000;
  const volumeValue = (basePrice * volume) / 1000;
  
  const ma2 = basePrice + (Math.random() - 0.5) * 5;
  const ma10 = basePrice + (Math.random() - 0.5) * 10;
  const ma50 = basePrice + (Math.random() - 0.5) * 20;
  const ma132 = basePrice + (Math.random() - 0.5) * 30;
  
  const ma2Weekly = basePrice + (Math.random() - 0.5) * 8;
  const ma10Weekly = basePrice + (Math.random() - 0.5) * 15;
  const ma26Weekly = basePrice + (Math.random() - 0.5) * 25;
  
  const sarHigh = basePrice * (1 + Math.random() * 0.05);
  const sarLow = basePrice * (1 - Math.random() * 0.05);
  
  const ma2Slope = (Math.random() - 0.5) * 2;
  const ma10Slope = (Math.random() - 0.5) * 1.5;
  const ma50Slope = (Math.random() - 0.5) * 1;
  
  const crossRandom = Math.random();
  const crossSignal = crossRandom < 0.15 ? 'XO' : crossRandom < 0.3 ? 'XU' : null;
  const crossCount = crossSignal ? Math.floor(Math.random() * 20) + 1 : 0;
  
  const eggPhase = getRandomEggPhase();
  
  const ascentDescentRandom = Math.random();
  const ascentDescent = ascentDescentRandom < 0.3 ? 'Ascent' : ascentDescentRandom < 0.6 ? 'Descent' : null;
  
  return {
    id: `${stock.code}-${Date.now()}-${index}`,
    code: stock.code,
    name: stock.name,
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume,
    volumeValue: parseFloat(volumeValue.toFixed(0)),
    ma2: parseFloat(ma2.toFixed(2)),
    ma10: parseFloat(ma10.toFixed(2)),
    ma50: parseFloat(ma50.toFixed(2)),
    ma132: parseFloat(ma132.toFixed(2)),
    ma2Weekly: parseFloat(ma2Weekly.toFixed(2)),
    ma10Weekly: parseFloat(ma10Weekly.toFixed(2)),
    ma26Weekly: parseFloat(ma26Weekly.toFixed(2)),
    sarHigh: parseFloat(sarHigh.toFixed(2)),
    sarLow: parseFloat(sarLow.toFixed(2)),
    ma2Slope: parseFloat(ma2Slope.toFixed(3)),
    ma10Slope: parseFloat(ma10Slope.toFixed(3)),
    ma50Slope: parseFloat(ma50Slope.toFixed(3)),
    crossSignal,
    crossCount,
    eggPhase,
    ascentDescent,
  };
}

export function generateMainMatrix(): StockData[] {
  return realTWSEStocks.slice(0, 100).map((stock, index) => generateStockData(stock, index));
}

export function generatePreviousMatrix(): StockData[] {
  return realTWSEStocks.slice(10, 110).map((stock, index) => generateStockData(stock, index));
}

export function generateTargetList(count: number = 10): StockData[] {
  const shuffled = [...realTWSEStocks].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((stock, index) => generateStockData(stock, index));
}

export const mockTargetLists = [
  { id: '1', name: 'Tech Leaders', stocks: generateTargetList(8) },
  { id: '2', name: 'Financial', stocks: generateTargetList(12) },
  { id: '3', name: 'Phase A Watch', stocks: generateTargetList(15) },
  { id: '4', name: 'Breakout Candidates', stocks: generateTargetList(6) },
  { id: '5', name: 'High Volume', stocks: generateTargetList(10) },
  { id: '6', name: 'Custom List', stocks: generateTargetList(5) },
];
