export type OrderStatus = '已指派' | '進行中' | '已完成' | '延期';
export type ServiceType = '維修' | '保養' | '裝機' | '安裝' | '回收' | '送水' | '延卡' | '退卡' | '其他';
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
  cardNo: string;
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
    erpNo: '260304001',
    status: '已指派',
    priority: '急件',
    date: '2026-03-04',
    timeStart: '09:00',
    timeEnd: '10:00',
    serviceType: '維修',
    customerName: '宏威科技股份有限公司',
    customerType: '商用',
    cardNo: '31205',
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
            machineNo: '260304001', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: null,
            machines: [
              { id: 'A1-M1', machineNo: '260304001', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: null, needsService: false },
              { id: 'A1-M2', machineNo: '260304002', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: '靠牆第二台', needsService: false },
              { id: 'A1-M3', machineNo: '260304003', modelNumber: 'UR7301CW-2', workDescription: null, specialNote: '接待台右側', needsService: false },
            ],
          },
          {
            id: 'A-2F', label: '2F 辦公區', needsService: false,
            machineNo: '260304004', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: null,
            machines: [
              { id: 'A2-M1', machineNo: '260304004', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: null, needsService: false },
              { id: 'A2-M2', machineNo: '260304005', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: '茶水間角落', needsService: false },
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
            machineNo: '260304006', modelNumber: 'UR5912BPW-1', workDescription: '飲水機底部持續漏水，已放置水桶接水，影響辦公區域使用', specialNote: '大樓門禁需換證，請至1樓櫃台登記',
            machines: [
              { id: 'B3-M1', machineNo: '260304006', modelNumber: 'UR5912BPW-1', workDescription: '飲水機底部持續漏水，已放置水桶接水，影響辦公區域使用', specialNote: '大樓門禁需換證，請至1樓櫃台登記', needsService: true },
              { id: 'B3-M2', machineNo: '260304007', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: '茶水間左側備用機', needsService: false },
            ],
          },
          {
            id: 'B-5F', label: '5F 主管室', needsService: false,
            machineNo: '260304008', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: null,
            machines: [
              { id: 'B5-M1', machineNo: '260304008', modelNumber: 'UR5912BPW-1', workDescription: null, specialNote: null, needsService: false },
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
    deviceCount: 1,
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
    erpNo: '260304002',
    status: '已指派',
    priority: null,
    date: '2026-03-04',
    timeStart: '10:30',
    timeEnd: '11:00',
    serviceType: '保養',
    customerName: '竹北市戶政事務所',
    customerType: '公家機關',
    cardNo: '24551',
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
    erpNo: '260304003',
    status: '進行中',
    priority: '緊急',
    date: '2026-03-04',
    timeStart: '11:30',
    timeEnd: '12:30',
    serviceType: '維修',
    customerName: '新竹國泰綜合醫院',
    customerType: '醫療',
    cardNo: '18823',
    address: '新竹市東區中華路二段678號',
    contactName: '總務室',
    phone: '03-527-8999',
    assignedBy: '林伯典',
    technician: TECHNICIAN_NAME,
    durationHours: 1,
    failureCategory: '設備故障',
    failureType: '出水異常',
    modelNumber: 'UR8303AD-3',
    deviceCount: 2,
    workDescription: '冷水出水量明顯減少，懷疑濾芯阻塞或進水閥故障',
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
    erpNo: '260304004',
    status: '已指派',
    priority: null,
    date: '2026-03-04',
    timeStart: '15:00',
    timeEnd: '16:00',
    serviceType: '裝機',
    customerName: '美研形象美容坊',
    customerType: '商用',
    cardNo: '45678',
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
    erpNo: '260304005',
    status: '已指派',
    priority: null,
    date: '2026-03-04',
    timeStart: '13:00',
    timeEnd: '13:30',
    serviceType: '保養',
    customerName: '張志明',
    customerType: '家用',
    cardNo: '88201',
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
    erpNo: '260304006',
    status: '已指派',
    priority: null,
    date: '2026-03-04',
    timeStart: '14:00',
    timeEnd: '15:00',
    serviceType: '維修',
    customerName: '新竹物流倉儲股份有限公司',
    customerType: '商用',
    cardNo: '33471',
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
    erpNo: '260304007',
    status: '已指派',
    priority: null,
    date: '2026-03-04',
    timeStart: '15:30',
    timeEnd: '16:00',
    serviceType: '保養',
    customerName: '竹北長安診所',
    customerType: '醫療',
    cardNo: '21098',
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
    erpNo: '260304008',
    status: '已指派',
    priority: null,
    date: '2026-03-04',
    timeStart: '16:30',
    timeEnd: '17:00',
    serviceType: '延卡',
    customerName: '陳美玲',
    customerType: '家用',
    cardNo: '76512',
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
    erpNo: '260302001',
    status: '已完成',
    priority: null,
    date: '2026-03-02',
    timeStart: '09:00',
    timeEnd: '10:00',
    serviceType: '保養',
    customerName: '新竹市政府',
    customerType: '公家機關',
    cardNo: '10021',
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
    erpNo: '260302002',
    status: '已完成',
    priority: null,
    date: '2026-03-02',
    timeStart: '14:00',
    timeEnd: '15:00',
    serviceType: '維修',
    customerName: '工業技術研究院',
    customerType: '公家機關',
    cardNo: '20033',
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
    erpNo: '260303001',
    status: '已完成',
    priority: null,
    date: '2026-03-03',
    timeStart: '09:30',
    timeEnd: '10:30',
    serviceType: '保養',
    customerName: '台積電研發中心',
    customerType: '商用',
    cardNo: '55201',
    address: '新竹市科學園區力行六路8號',
    contactName: '廠務部',
    phone: '03-563-6688',
    machineBuildings: [
      {
        id: 'H',
        name: 'H棟',
        floors: [
          { id: 'H-2F', label: '2F 工程師休息室', needsService: true, machineNo: 'H2-0051', modelNumber: 'UR9005BW-1', workDescription: '定期濾芯更換保養', specialNote: '需事先申請廠區通行證，請提前30分鐘抵達' },
          { id: 'H-4F', label: '4F 會議室', needsService: false, machineNo: 'H4-0063', modelNumber: 'UR9005BW-1', workDescription: null, specialNote: null },
        ],
      },
      {
        id: 'J',
        name: 'J棟',
        floors: [
          { id: 'J-1F', label: '1F 休息區', needsService: true, machineNo: 'J1-0078', modelNumber: 'UR9005BW-1', workDescription: '定期濾芯更換保養', specialNote: null },
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
    erpNo: '260305001',
    status: '已指派',
    priority: null,
    date: '2026-03-05',
    timeStart: '10:00',
    timeEnd: '11:00',
    serviceType: '保養',
    customerName: '聯發科技股份有限公司',
    customerType: '商用',
    cardNo: '67890',
    address: '新竹市科學園區創新一路1號',
    contactName: '設備管理部',
    phone: '03-567-0767',
    machineBuildings: [
      {
        id: 'M',
        name: 'M棟',
        floors: [
          { id: 'M-4F', label: '4F 會議室', needsService: true, machineNo: 'M4-0011', modelNumber: 'UR9615AG-2', workDescription: '兩台設備保養', specialNote: null },
          { id: 'M-4F-VIP', label: '4F 貴賓室', needsService: false, machineNo: 'M4-0012', modelNumber: 'UR9615AG-2', workDescription: null, specialNote: null },
        ],
      },
      {
        id: 'N',
        name: 'N棟',
        floors: [
          { id: 'N-6F', label: '6F 研發中心', needsService: false, machineNo: 'N6-0033', modelNumber: 'UR9615AG-2', workDescription: null, specialNote: null },
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

export type MaterialType = '領料' | '退料' | '消料';

export interface MaterialTransaction {
  id: string;
  materialNo: string;  // 料號
  name: string;        // 品名規格
  machineNo: string;   // 機號（消料時填寫）
  unit: string;        // 單位
  qty: number;         // +正數 = 領料/退料, -負數 = 消料
  type: MaterialType;  // 領料 | 退料 | 消料
  timeLabel: string;   // 顯示用時間（如 "09:15 AM" / "昨天"）
  date: string;        // YYYY-MM-DD
}

export const MATERIAL_TRANSACTIONS: MaterialTransaction[] = [
  // 今日
  { id: 'mt01', materialNo: 'F-PP5',   name: 'PP 棉濾芯 5吋',     machineNo: '',        unit: '支', qty: +5, type: '領料', timeLabel: '08:30 AM', date: TODAY },
  { id: 'mt02', materialNo: 'F-CTO',   name: '活性碳濾芯 (CTO)',  machineNo: '',        unit: '支', qty: +3, type: '領料', timeLabel: '08:30 AM', date: TODAY },
  { id: 'mt03', materialNo: 'F-PP5',   name: 'PP 棉濾芯 5吋',     machineNo: 'B3-0017', unit: '支', qty: -2, type: '消料', timeLabel: '10:00 AM', date: TODAY },
  { id: 'mt04', materialNo: 'F-CTO',   name: '活性碳濾芯 (CTO)',  machineNo: 'B3-0017', unit: '支', qty: -5, type: '消料', timeLabel: '11:30 AM', date: TODAY },
  { id: 'mt05', materialNo: 'F-RO75',  name: 'RO 逆滲透膜 75G',  machineNo: 'B3-0017', unit: '片', qty: -1, type: '消料', timeLabel: '12:15 PM', date: TODAY },
  // 昨天
  { id: 'mt06', materialNo: 'P-EMV12', name: '進水電磁閥 DC12V', machineNo: '',        unit: '組', qty: +1, type: '領料', timeLabel: '昨天',      date: '2026-03-03' },
  { id: 'mt07', materialNo: 'P-OR-L',  name: 'O 型環 (大)',       machineNo: '',        unit: '個', qty: +6, type: '領料', timeLabel: '昨天',      date: '2026-03-03' },
  { id: 'mt08', materialNo: 'P-OR-L',  name: 'O 型環 (大)',       machineNo: 'H2-0051', unit: '個', qty: -4, type: '消料', timeLabel: '昨天',      date: '2026-03-03' },
  { id: 'mt09', materialNo: 'P-EMV12', name: '進水電磁閥 DC12V', machineNo: 'H2-0051', unit: '組', qty: -1, type: '退料', timeLabel: '昨天',      date: '2026-03-03' },
];
