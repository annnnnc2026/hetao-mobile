export type OrderStatus = '已指派' | '進行中' | '已完成' | '延期';
export type ServiceType =
  | '設備故障'
  | '定期保養'
  | '設備安裝'
  | '設備回收搬運'
  | '耗材配送'
  | '合約行政'
  | '送水服務'
  | '諮詢評估'
  | '銷售報價'
  | '水處理工程'
  | '驗水服務'
  | '客訴處理'
  | '其他行政'
  // 舊有（向下相容）
  | '維修' | '保養' | '裝機' | '安裝' | '回收' | '送水' | '延卡' | '退卡' | '其他';
export type Priority = '急件' | '緊急' | null;
export type CustomerType = '商用' | '家用' | '公家機關' | '醫療' | '共約';
export type PaymentMethod = '月結' | '現金' | '信用卡' | '匯款';

export interface FloorMachine {
  id: string;
  machineNo: string;
  modelNumber: string;
  workDescription: string | null;
  specialNote: string | null;
  needsService: boolean;
}

export interface MachineFloor {
  id: string;
  label: string;           // e.g. "4F 會議室"
  needsService: boolean;
  machineNo: string;       // 設備機號 (specific machine ID)
  modelNumber: string;
  workDescription: string | null;
  specialNote: string | null;
  machines?: FloorMachine[];
}

export interface MachineBuilding {
  id: string;
  name: string;            // e.g. "B棟"
  floors: MachineFloor[];
}

export interface WorkOrder {
  id: string;             // display ID, e.g. WO-20260304-0001
  erpNo: string;          // ERP system number / 機號
  status: OrderStatus;
  priority: Priority;
  date: string;           // YYYY-MM-DD
  timeStart: string;      // HH:MM
  timeEnd: string;        // HH:MM
  serviceType: ServiceType;
  // customer
  customerName: string;
  customerType: CustomerType;
  address: string;
  contactName: string;
  phone: string;
  // location detail (commercial clients)
  locationBuilding?: string | null;  // e.g. 長榮飯店H棟
  locationFloor?: string | null;     // e.g. 3F 洗手間右側
  machineBuildings?: MachineBuilding[] | null;  // multi-building/floor structure
  // dispatch
  assignedBy: string;
  technician: string;
  durationHours: number;
  // service content
  failureCategory: string | null;
  failureType: string | null;
  modelNumber: string;
  deviceCount: number;
  workDescription: string | null;
  specialNote: string | null;
  // completion report (filled after arriving)
  arrivedAt: string | null;  // e.g. "3/13 02:40"
  // finance
  serviceAmount: number | null;
  paymentMethod: PaymentMethod;
  // system
  sourceChannel: string;
  station: string;
  lat: number;
  lng: number;
}

export const TECHNICIAN_NAME = '張志偉';
export const STATION_NAME = '賀奕';
export const ZONE_NAME = '竹北區';
export const TODAY = '2026-03-04';

export const ALL_ORDERS: WorkOrder[] = [
  {
    id: 'WO-20260304-0001',
    erpNo: '109750',
    status: '已指派',
    priority: '急件',
    date: '2026-03-04',
    timeStart: '09:00',
    timeEnd: '10:00',
    serviceType: '設備故障',
    customerName: '宏威科技股份有限公司',
    customerType: '商用',
    address: '新竹縣竹北市台元街32號3樓',
    contactName: '陳小姐',
    phone: '03-550-1234',
    locationBuilding: '台元科技園區B棟',
    locationFloor: '3F 茶水間右側',
    machineBuildings: [
      {
        id: 'A',
        name: 'A棟',
        floors: [
          {
            id: 'A-1F', label: '1F 接待大廳', needsService: false,
            machineNo: '109750', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: null,
            machines: [
              { id: 'A1-M1', machineNo: '109750', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: null, needsService: false },
              { id: 'A1-M2', machineNo: '109751', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: '靠牆第二台', needsService: false },
              { id: 'A1-M3', machineNo: '109752', modelNumber: 'UR7301CW-2', workDescription: null, specialNote: '接待台右側', needsService: false },
            ],
          },
          {
            id: 'A-2F', label: '2F 辦公區', needsService: false,
            machineNo: '109753', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: null,
            machines: [
              { id: 'A2-M1', machineNo: '109753', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: null, needsService: false },
              { id: 'A2-M2', machineNo: '109754', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: '茶水間角落', needsService: false },
            ],
          },
        ],
      },
      {
        id: 'B',
        name: 'B棟',
        floors: [
          {
            id: 'B-3F', label: '3F 茶水間右側', needsService: true,
            machineNo: '109755', modelNumber: 'UR5912BPW-1', workDescription: '飲水機底部持續漏水，已放置水桶接水，影響辦公區域使用', specialNote: '大樓門禁需換證，請至1樓櫃台登記',
            machines: [
              { id: 'B3-M1', machineNo: '109755', modelNumber: 'UR5912BPW-1', workDescription: '飲水機底部持續漏水，已放置水桶接水，影響辦公區域使用', specialNote: '大樓門禁需換證，請至1樓櫃台登記', needsService: true },
              { id: 'B3-M2', machineNo: '109756', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: '茶水間左側備用機', needsService: false },
            ],
          },
          {
            id: 'B-5F', label: '5F 主管室', needsService: false,
            machineNo: '109757', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: null,
            machines: [
              { id: 'B5-M1', machineNo: '109757', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: null, needsService: false },
            ],
          },
        ],
      },
    ],
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 1,
    failureCategory: '設備故障',
    failureType: '漏水/滴水',
    modelNumber: 'UR5912BPW-1',
    deviceCount: 8,
    workDescription: '飲水機底部持續漏水，已放置水桶接水，影響辦公區域使用',
    specialNote: '大樓門禁需換證，請至1樓櫃台登記',
    arrivedAt: null,
    serviceAmount: 2400,
    paymentMethod: '月結',
    sourceChannel: 'ERP同步',
    station: STATION_NAME,
    lat: 24.8390,
    lng: 121.0050,
  },
  {
    id: 'WO-20260304-0002',
    erpNo: '109751',
    status: '已指派',
    priority: null,
    date: '2026-03-04',
    timeStart: '10:30',
    timeEnd: '11:00',
    serviceType: '定期保養',
    customerName: '竹北市戶政事務所',
    customerType: '公家機關',
    address: '新竹縣竹北市光明六路10號',
    contactName: '李先生',
    phone: '03-551-8171',
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 0.5,
    failureCategory: '定期保養',
    failureType: null,
    modelNumber: 'UR8303AW-2',
    deviceCount: 1,
    workDescription: '定期濾芯更換保養',
    specialNote: null,
    arrivedAt: null,
    serviceAmount: 1500,
    paymentMethod: '現金',
    sourceChannel: 'ERP同步',
    station: STATION_NAME,
    lat: 24.8360,
    lng: 121.0080,
  },
  {
    id: 'WO-20260304-0003',
    erpNo: '109752',
    status: '進行中',
    priority: '緊急',
    date: '2026-03-04',
    timeStart: '11:30',
    timeEnd: '12:30',
    serviceType: '設備安裝',
    customerName: '新竹國泰綜合醫院',
    customerType: '醫療',
    address: '新竹市東區中華路二段678號',
    contactName: '總務室',
    phone: '03-527-8999',
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 1,
    failureCategory: null,
    failureType: null,
    modelNumber: 'UR8303AD-3',
    deviceCount: 12,
    workDescription: '新裝機12台，含管線配置',
    specialNote: '請至護理站換訪客證，不得進入病房區',
    arrivedAt: '3/13 02:40',
    serviceAmount: 3200,
    paymentMethod: '月結',
    sourceChannel: 'ERP同步',
    station: STATION_NAME,
    lat: 24.8010,
    lng: 120.9780,
  },
  {
    id: 'WO-20260304-0004',
    erpNo: '109753',
    status: '已指派',
    priority: null,
    date: '2026-03-04',
    timeStart: '15:00',
    timeEnd: '16:00',
    serviceType: '設備安裝',
    customerName: '美研形象美容坊',
    customerType: '商用',
    address: '新竹縣竹北市縣政二路168號',
    contactName: '王老闆',
    phone: '03-558-8899',
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 1,
    failureCategory: null,
    failureType: null,
    modelNumber: 'UR5912BPW-1',
    deviceCount: 1,
    workDescription: '新客戶裝機，含管線配置',
    specialNote: null,
    arrivedAt: null,
    serviceAmount: 28500,
    paymentMethod: '信用卡',
    sourceChannel: 'ERP同步',
    station: STATION_NAME,
    lat: 24.8330,
    lng: 121.0020,
  },
  {
    id: 'WO-20260304-0005',
    erpNo: '109754',
    status: '已指派',
    priority: null,
    date: '2026-03-04',
    timeStart: '13:00',
    timeEnd: '13:30',
    serviceType: '定期保養',
    customerName: '張志明',
    customerType: '家用',
    address: '新竹縣竹北市文興路一段88號',
    contactName: '張先生',
    phone: '0912-345-678',
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 0.5,
    failureCategory: '定期保養',
    failureType: null,
    modelNumber: 'UR5912BPW-1',
    deviceCount: 1,
    workDescription: '季度濾芯更換',
    specialNote: null,
    arrivedAt: null,
    serviceAmount: 800,
    paymentMethod: '現金',
    sourceChannel: 'ERP同步',
    station: STATION_NAME,
    lat: 24.8410,
    lng: 121.0030,
  },
  {
    id: 'WO-20260304-0006',
    erpNo: '109755',
    status: '已指派',
    priority: null,
    date: '2026-03-04',
    timeStart: '14:00',
    timeEnd: '15:00',
    serviceType: '設備故障',
    customerName: '新竹物流倉儲股份有限公司',
    customerType: '商用',
    address: '新竹縣湖口鄉中山路二段150號',
    contactName: '王組長',
    phone: '03-599-0011',
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 1,
    failureCategory: '設備故障',
    failureType: '不出水',
    modelNumber: 'UR8303AW-2',
    deviceCount: 1,
    workDescription: '飲水機完全不出水，檢查進水管路',
    specialNote: null,
    arrivedAt: null,
    serviceAmount: 1800,
    paymentMethod: '現金',
    sourceChannel: 'ERP同步',
    station: STATION_NAME,
    lat: 24.8890,
    lng: 121.0580,
  },
  {
    id: 'WO-20260304-0007',
    erpNo: '109756',
    status: '已指派',
    priority: null,
    date: '2026-03-04',
    timeStart: '15:30',
    timeEnd: '16:00',
    serviceType: '定期保養',
    customerName: '竹北長安診所',
    customerType: '醫療',
    address: '新竹縣竹北市長安街55號',
    contactName: '診所護理師',
    phone: '03-552-7788',
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 0.5,
    failureCategory: '定期保養',
    failureType: null,
    modelNumber: 'UR9005BW-1',
    deviceCount: 2,
    workDescription: '兩台設備定期保養',
    specialNote: null,
    arrivedAt: null,
    serviceAmount: 2400,
    paymentMethod: '月結',
    sourceChannel: 'ERP同步',
    station: STATION_NAME,
    lat: 24.8300,
    lng: 121.0060,
  },
  {
    id: 'WO-20260304-0008',
    erpNo: '109757',
    status: '已指派',
    priority: null,
    date: '2026-03-04',
    timeStart: '16:30',
    timeEnd: '17:00',
    serviceType: '延卡',
    customerName: '陳美玲',
    customerType: '家用',
    address: '新竹市東區經國路一段228號',
    contactName: '陳小姐',
    phone: '0928-111-222',
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 0.5,
    failureCategory: null,
    failureType: null,
    modelNumber: 'UR5912BPW-1',
    deviceCount: 1,
    workDescription: '到期延卡處理',
    specialNote: null,
    arrivedAt: null,
    serviceAmount: 0,
    paymentMethod: '現金',
    sourceChannel: 'ERP同步',
    station: STATION_NAME,
    lat: 24.8050,
    lng: 120.9830,
  },
  // Recent orders
  {
    id: 'WO-20260302-0001',
    erpNo: '109740',
    status: '已完成',
    priority: null,
    date: '2026-03-02',
    timeStart: '09:00',
    timeEnd: '10:00',
    serviceType: '定期保養',
    customerName: '新竹市政府',
    customerType: '公家機關',
    address: '新竹市中正路120號',
    contactName: '總務科',
    phone: '03-521-6121',
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 1,
    failureCategory: '定期保養',
    failureType: null,
    modelNumber: 'UR5502CW-3',
    deviceCount: 1,
    workDescription: '季度定期保養',
    specialNote: null,
    arrivedAt: '3/2 09:05',
    serviceAmount: 1200,
    paymentMethod: '月結',
    sourceChannel: 'ERP同步',
    station: STATION_NAME,
    lat: 24.8047,
    lng: 120.9718,
  },
  {
    id: 'WO-20260302-0002',
    erpNo: '109741',
    status: '已完成',
    priority: null,
    date: '2026-03-02',
    timeStart: '14:00',
    timeEnd: '15:00',
    serviceType: '設備故障',
    customerName: '工業技術研究院',
    customerType: '公家機關',
    address: '新竹縣竹東鎮中興路四段195號',
    contactName: '設備組',
    phone: '03-591-6000',
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 1,
    failureCategory: '設備故障',
    failureType: '溫控異常',
    modelNumber: 'UR8303AW-1',
    deviceCount: 1,
    workDescription: '熱水溫度不足，檢查加熱器',
    specialNote: null,
    arrivedAt: '3/2 14:10',
    serviceAmount: 1800,
    paymentMethod: '月結',
    sourceChannel: 'ERP同步',
    station: STATION_NAME,
    lat: 24.7957,
    lng: 121.0626,
  },
  {
    id: 'WO-20260303-0001',
    erpNo: '109745',
    status: '已完成',
    priority: null,
    date: '2026-03-03',
    timeStart: '09:30',
    timeEnd: '10:30',
    serviceType: '定期保養',
    customerName: '台積電研發中心',
    customerType: '商用',
    address: '新竹市科學園區力行六路8號',
    contactName: '廠務部',
    phone: '03-563-6688',
    machineBuildings: [
      {
        id: 'H',
        name: 'H棟',
        floors: [
          { id: 'H-2F', label: '2F 工程師休息室', needsService: true, machineNo: '102051', modelNumber: 'UR9005BW-1', workDescription: '定期濾芯更換保養', specialNote: '需事先申請廠區通行證，請提前30分鐘抵達' },
          { id: 'H-4F', label: '4F 會議室', needsService: false, machineNo: '102063', modelNumber: 'UR9005BW-1', workDescription: null, specialNote: null },
        ],
      },
      {
        id: 'J',
        name: 'J棟',
        floors: [
          { id: 'J-1F', label: '1F 休息區', needsService: true, machineNo: '102078', modelNumber: 'UR9005BW-1', workDescription: '定期濾芯更換保養', specialNote: null },
        ],
      },
    ],
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 1,
    failureCategory: '定期保養',
    failureType: null,
    modelNumber: 'UR9005BW-1',
    deviceCount: 3,
    workDescription: '三台設備定期濾芯更換',
    specialNote: '需事先申請廠區通行證，請提前30分鐘抵達',
    arrivedAt: '3/3 09:28',
    serviceAmount: 3600,
    paymentMethod: '月結',
    sourceChannel: 'ERP同步',
    station: STATION_NAME,
    lat: 24.7816,
    lng: 121.0175,
  },
  {
    id: 'WO-20260305-0001',
    erpNo: '109760',
    status: '已指派',
    priority: null,
    date: '2026-03-05',
    timeStart: '10:00',
    timeEnd: '11:00',
    serviceType: '定期保養',
    customerName: '聯發科技股份有限公司',
    customerType: '商用',
    address: '新竹市科學園區創新一路1號',
    contactName: '設備管理部',
    phone: '03-567-0767',
    machineBuildings: [
      {
        id: 'M',
        name: 'M棟',
        floors: [
          { id: 'M-4F', label: '4F 會議室', needsService: true, machineNo: '104011', modelNumber: 'UR9615AG-2', workDescription: '兩台設備保養', specialNote: null },
          { id: 'M-4F-VIP', label: '4F 貴賓室', needsService: false, machineNo: '104012', modelNumber: 'UR9615AG-2', workDescription: null, specialNote: null },
        ],
      },
      {
        id: 'N',
        name: 'N棟',
        floors: [
          { id: 'N-6F', label: '6F 研發中心', needsService: false, machineNo: '106033', modelNumber: 'UR9615AG-2', workDescription: null, specialNote: null },
        ],
      },
    ],
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 1,
    failureCategory: '定期保養',
    failureType: null,
    modelNumber: 'UR9615AG-2',
    deviceCount: 2,
    workDescription: '兩台設備保養',
    specialNote: null,
    arrivedAt: null,
    serviceAmount: 2400,
    paymentMethod: '月結',
    sourceChannel: 'ERP同步',
    station: STATION_NAME,
    lat: 24.7847,
    lng: 121.0136,
  },
];

export function getOrdersByDate(date: string): WorkOrder[] {
  return ALL_ORDERS.filter((o) => o.date === date).sort((a, b) =>
    a.timeStart.localeCompare(b.timeStart)
  );
}

export function getOrderById(id: string): WorkOrder | undefined {
  return ALL_ORDERS.find((o) => o.id === id);
}

export function getAvailableDates(): string[] {
  return [...new Set(ALL_ORDERS.map((o) => o.date))].sort();
}

export interface TravelInfo {
  minutes: number;
  km: number;
}

export const TRAVEL_INFO: TravelInfo[] = [
  { minutes: 6, km: 4.3 },
  { minutes: 12, km: 8.1 },
  { minutes: 18, km: 12.4 },
];

// ─── 料件主檔 ────────────────────────────────────────────────────────────────
export interface Material {
  materialNo: string;   // 料號,   e.g. 'UF-515'
  name: string;         // 濾材名稱, e.g. '顆粒活性碳濾芯'
  unit: string;         // 單位
}

export const MATERIALS: Material[] = [
  { materialNo: 'UF-515',   name: '顆粒活性碳濾芯',          unit: '支' },
  { materialNo: 'UF-1',     name: '顆粒活性碳濾芯',          unit: '支' },
  { materialNo: 'UF-10P5C', name: '無鈉樹脂混合活性碳濾芯', unit: '支' },
  { materialNo: 'UF-504',   name: '銀添濾芯組合',            unit: '組' },
  { materialNo: 'UF-557',   name: '濾心',                    unit: '支' },
  { materialNo: 'UF-583',   name: '5μPP濾芯',               unit: '支' },
  { materialNo: 'UF-591',   name: '1μPP濾芯',               unit: '支' },
  { materialNo: 'UF-592',   name: '1UPP濾芯',                unit: '支' },
  { materialNo: 'UF-593',   name: 'RO過濾器 UN-9505 UF65',  unit: '組' },
  { materialNo: 'UF-62',    name: '1302電熱管',              unit: '支' },
  { materialNo: 'UF-63',    name: '5U.P.P.濾芯組合',         unit: '組' },
  { materialNo: 'U-35',     name: '濾芯組合(熱縮)',          unit: '組' },
  { materialNo: 'U-549',    name: '無鈉樹脂混合活性碳濾芯', unit: '支' },
  { materialNo: 'U-2035-2', name: '612.1302PC板',            unit: '片' },
  { materialNo: 'U-2069-13',name: '全戶式不銹鋼淨水器',     unit: '台' },
  { materialNo: 'U-2547',   name: '商用除菌淨水器',          unit: '台' },
  { materialNo: 'U-9200SS', name: '零下冰溫瞬熱旗艦飲水機', unit: '台' },
  { materialNo: 'E-256-2',  name: '膜管',                    unit: '支' },
  // 舊測試用料（保留）
  { materialNo: 'F-PP5',    name: 'PP 棉濾芯 5吋',           unit: '支' },
  { materialNo: 'F-CTO',    name: '活性碳濾芯 (CTO)',        unit: '支' },
  { materialNo: 'F-RO75',   name: 'RO 逆滲透膜 75G',         unit: '片' },
  { materialNo: 'P-EMV12',  name: '進水電磁閥 DC12V',        unit: '組' },
  { materialNo: 'P-OR-L',   name: 'O 型環 (大)',              unit: '個' },
];

export function getMaterial(materialNo: string): Material | undefined {
  return MATERIALS.find((m) => m.materialNo === materialNo);
}

// ─── 領退料交易紀錄 ──────────────────────────────────────────────────────────
export type MaterialType = '領料' | '退料' | '消料';

export interface MaterialTransaction {
  id: string;
  materialNo: string;  // 料號（對應 MATERIALS 主檔）
  machineNo: string;   // 設備機號（消料時填寫）
  qty: number;         // +正數 = 領料, -負數 = 消料/退料
  type: MaterialType;
  timeLabel: string;   // 顯示用時間（如 "09:15 AM" / "昨天"）
  date: string;        // YYYY-MM-DD
}

export const MATERIAL_TRANSACTIONS: MaterialTransaction[] = [
  // F-CTO 活性碳濾芯：領3用5 → 欠2
  { id: 'mt01', materialNo: 'F-CTO',   machineNo: '',        qty: +3, type: '領料', timeLabel: '08:30 AM', date: TODAY },
  { id: 'mt02', materialNo: 'F-CTO',   machineNo: '109755', qty: -5, type: '消料', timeLabel: '11:30 AM', date: TODAY },
  // F-RO75 RO逆滲透膜：只消料 → 欠1
  { id: 'mt03', materialNo: 'F-RO75',  machineNo: '109755', qty: -1, type: '消料', timeLabel: '12:15 PM', date: TODAY },
  // UF-583 5μPP濾芯：領1用2 → 欠1
  { id: 'mt04', materialNo: 'UF-583',  machineNo: '',        qty: +1, type: '領料', timeLabel: '昨天', date: '2026-03-03' },
  { id: 'mt05', materialNo: 'UF-583',  machineNo: '102051', qty: -2, type: '消料', timeLabel: '昨天', date: '2026-03-03' },
  // UF-591 1μPP濾芯：領2用4 → 欠2
  { id: 'mt06', materialNo: 'UF-591',  machineNo: '',        qty: +2, type: '領料', timeLabel: '昨天', date: '2026-03-03' },
  { id: 'mt07', materialNo: 'UF-591',  machineNo: '102063', qty: -4, type: '消料', timeLabel: '昨天', date: '2026-03-03' },
  // P-OR-L O型環：領3用4 → 欠1
  { id: 'mt08', materialNo: 'P-OR-L',  machineNo: '',        qty: +3, type: '領料', timeLabel: '昨天', date: '2026-03-03' },
  { id: 'mt09', materialNo: 'P-OR-L',  machineNo: '102051', qty: -4, type: '消料', timeLabel: '昨天', date: '2026-03-03' },
];
