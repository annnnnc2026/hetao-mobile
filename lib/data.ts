export type OrderStatus = '已指派' | '進行中' | '已完成' | '延期';
export type ServiceType = '維修' | '保養' | '安裝' | '回收';
export type Priority = '急件' | '緊急' | null;

export interface WorkOrder {
  id: string;
  status: OrderStatus;
  priority: Priority;
  timeStart: string;
  timeEnd: string;
  serviceType: ServiceType;
  customerName: string;
  address: string;
  modelNumber: string;
  durationHours: number;
  phone: string;
  lat: number;
  lng: number;
  note?: string;
}

export interface TravelInfo {
  minutes: number;
  km: number;
}

export const TECHNICIAN_NAME = '張志偉';

export const TODAY_ORDERS: WorkOrder[] = [
  {
    id: 'WO-001',
    status: '已指派',
    priority: '急件',
    timeStart: '09:00',
    timeEnd: '10:00',
    serviceType: '維修',
    customerName: '宏威科技股份有限公司',
    address: '新竹縣竹北市台元街32號3樓',
    modelNumber: 'UR5912BPW-1',
    durationHours: 1,
    phone: '03-5678901',
    lat: 24.8390,
    lng: 121.0050,
  },
  {
    id: 'WO-002',
    status: '已指派',
    priority: null,
    timeStart: '10:30',
    timeEnd: '11:00',
    serviceType: '保養',
    customerName: '竹北市戶政事務所',
    address: '新竹縣竹北市光明六路10號',
    modelNumber: 'UR8303AW-2',
    durationHours: 0.5,
    phone: '03-5518171',
    lat: 24.8360,
    lng: 121.0080,
  },
  {
    id: 'WO-003',
    status: '進行中',
    priority: '緊急',
    timeStart: '11:30',
    timeEnd: '12:30',
    serviceType: '維修',
    customerName: '新竹國泰綜合醫院',
    address: '新竹市東區中華路二段678號',
    modelNumber: 'UR8303AD-3',
    durationHours: 1,
    phone: '03-5278999',
    lat: 24.8010,
    lng: 120.9780,
  },
  {
    id: 'WO-004',
    status: '已指派',
    priority: null,
    timeStart: '14:00',
    timeEnd: '15:00',
    serviceType: '保養',
    customerName: '新竹市立圖書館',
    address: '新竹市東區中央路60號',
    modelNumber: 'UR5502CW-1',
    durationHours: 1,
    phone: '03-5220597',
    lat: 24.8070,
    lng: 120.9710,
  },
];

export const TRAVEL_INFO: TravelInfo[] = [
  { minutes: 6, km: 4.3 },
  { minutes: 12, km: 8.1 },
  { minutes: 8, km: 5.6 },
];

export const RECENT_ORDERS: (WorkOrder & { date: string })[] = [
  {
    id: 'WO-2026-0310-01',
    date: '2026-03-10',
    status: '已完成',
    priority: null,
    timeStart: '09:00',
    timeEnd: '10:00',
    serviceType: '保養',
    customerName: '新竹市政府',
    address: '新竹市中正路120號',
    modelNumber: 'UR5502CW-3',
    durationHours: 1,
    phone: '03-5216121',
    lat: 24.8047,
    lng: 120.9718,
  },
  {
    id: 'WO-2026-0310-02',
    date: '2026-03-10',
    status: '已完成',
    priority: null,
    timeStart: '11:00',
    timeEnd: '12:00',
    serviceType: '維修',
    customerName: '工業技術研究院',
    address: '新竹縣竹東鎮中興路四段195號',
    modelNumber: 'UR8303AW-1',
    durationHours: 1,
    phone: '03-5916000',
    lat: 24.7957,
    lng: 121.0626,
  },
  {
    id: 'WO-2026-0309-01',
    date: '2026-03-09',
    status: '延期',
    priority: '急件',
    timeStart: '14:00',
    timeEnd: '15:30',
    serviceType: '安裝',
    customerName: '聯發科技股份有限公司',
    address: '新竹市科學園區創新一路1號',
    modelNumber: 'UR9005BW-2',
    durationHours: 1.5,
    phone: '03-5670767',
    lat: 24.7847,
    lng: 121.0136,
  },
  {
    id: 'WO-2026-0309-02',
    date: '2026-03-09',
    status: '已完成',
    priority: null,
    timeStart: '09:00',
    timeEnd: '09:30',
    serviceType: '保養',
    customerName: '新竹火車站',
    address: '新竹市東區中山路2號',
    modelNumber: 'UR5502CW-2',
    durationHours: 0.5,
    phone: '03-5226790',
    lat: 24.8023,
    lng: 120.9716,
  },
  {
    id: 'WO-2026-0308-01',
    date: '2026-03-08',
    status: '已完成',
    priority: null,
    timeStart: '10:00',
    timeEnd: '11:00',
    serviceType: '維修',
    customerName: '台積電研發中心',
    address: '新竹市科學園區力行六路8號',
    modelNumber: 'UR9005BW-1',
    durationHours: 1,
    phone: '03-5636688',
    lat: 24.7816,
    lng: 121.0175,
  },
];
