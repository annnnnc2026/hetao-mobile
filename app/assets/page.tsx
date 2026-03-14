'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Upload,
  FolderOpen,
  Image as ImageIcon,
  ChevronDown,
  Copy,
  Check,
  ZoomIn,
  Tag,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface AssetFile {
  id: string;
  name: string;
  /** e.g. "Christmas/icons" */
  folder: string;
  /** top-level folder = holiday category */
  category: string;
  url: string;
  file: File;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function buildCategory(relativePath: string): { folder: string; category: string } {
  const parts = relativePath.split('/');
  // parts[0] is filename when flat, otherwise parts[0..n-2] are folders
  if (parts.length === 1) return { folder: '未分類', category: '未分類' };
  const folderParts = parts.slice(0, -1);
  return {
    category: folderParts[0],
    folder: folderParts.join(' / '),
  };
}

const HOLIDAY_COLORS: Record<string, string> = {
  Christmas: 'bg-red-100 text-red-700',
  Halloween: 'bg-orange-100 text-orange-700',
  CNY: 'bg-yellow-100 text-yellow-700',
  Valentine: 'bg-pink-100 text-pink-700',
  Easter: 'bg-green-100 text-green-700',
  Thanksgiving: 'bg-amber-100 text-amber-700',
  Diwali: 'bg-purple-100 text-purple-700',
};

function getCategoryColor(category: string): string {
  for (const [key, cls] of Object.entries(HOLIDAY_COLORS)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return cls;
  }
  return 'bg-gray-100 text-gray-600';
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function EmptyState({ onPickFolder }: { onPickFolder: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center">
        <FolderOpen className="w-10 h-10 text-gray-400" />
      </div>
      <div>
        <p className="text-xl font-semibold text-gray-800">匯入素材資料夾</p>
        <p className="text-sm text-gray-400 mt-1.5 max-w-xs">
          支援整個資料夾，內部子資料夾名稱會自動作為節日分類
        </p>
      </div>
      <button
        onClick={onPickFolder}
        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        <Upload className="w-4 h-4" />
        選擇資料夾
      </button>
    </div>
  );
}

function AssetCard({ asset, onClick }: { asset: AssetFile; onClick: () => void }) {
  const [copied, setCopied] = useState(false);

  function copyName(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(asset.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-150"
    >
      {/* Thumbnail */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.url}
          alt={asset.name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>

      {/* Overlay zoom icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
        <ZoomIn className="w-8 h-8 text-white drop-shadow-md" />
      </div>

      {/* Info bar */}
      <div className="px-2.5 py-2 flex items-center gap-1.5">
        <p className="flex-1 text-xs text-gray-600 truncate">{asset.name}</p>
        <button
          onClick={copyName}
          className="shrink-0 p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          title="複製檔名"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

function PreviewModal({ asset, onClose }: { asset: AssetFile; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{asset.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{asset.folder}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 shrink-0 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image */}
        <div className="bg-gray-50 flex items-center justify-center p-6 max-h-[60vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset.url}
            alt={asset.name}
            className="max-w-full max-h-[50vh] object-contain"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex items-center gap-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getCategoryColor(asset.category)}`}>
            <Tag className="w-3 h-3 inline mr-1" />
            {asset.category}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(asset.name)}
            className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-3 h-3" /> 複製檔名
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function AssetsPage() {
  const [assets, setAssets] = useState<AssetFile[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [preview, setPreview] = useState<AssetFile | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Load files ──────────────────────────────
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newAssets: AssetFile[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const relativePath =
        (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
      const { folder, category } = buildCategory(relativePath);
      newAssets.push({
        id: relativePath + file.size,
        name: file.name,
        folder,
        category,
        url: URL.createObjectURL(file),
        file,
      });
    });
    setAssets((prev) => [...prev, ...newAssets]);
    setActiveCategory('全部');
    setActiveFolder(null);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  // ── Derived data ─────────────────────────────
  const categories = useMemo(() => {
    const map = new Map<string, Set<string>>();
    assets.forEach(({ category, folder }) => {
      if (!map.has(category)) map.set(category, new Set());
      map.get(category)!.add(folder);
    });
    return map;
  }, [assets]);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchCat = activeCategory === '全部' || a.category === activeCategory;
      const matchFolder = !activeFolder || a.folder === activeFolder;
      const q = search.trim().toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.folder.toLowerCase().includes(q);
      return matchCat && matchFolder && matchSearch;
    });
  }, [assets, activeCategory, activeFolder, search]);

  function toggleExpand(cat: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  const hasAssets = assets.length > 0;

  return (
    <div
      className="min-h-screen bg-gray-50 flex"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* ── Hidden folder input ─────────────── */}
      <input
        ref={inputRef}
        type="file"
        // @ts-expect-error non-standard but widely supported
        webkitdirectory="true"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* ── Sidebar ─────────────────────────── */}
      {hasAssets && (
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-gray-200 bg-white h-screen sticky top-0 overflow-y-auto">
          <div className="px-4 pt-8 pb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">分類</p>
          </div>

          {/* All */}
          <button
            onClick={() => { setActiveCategory('全部'); setActiveFolder(null); }}
            className={`flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === '全部' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>全部素材</span>
            <span className="text-xs text-gray-400">{assets.length}</span>
          </button>

          <div className="mt-1 pb-8">
            {Array.from(categories.entries()).map(([cat, folders]) => {
              const isExpanded = expandedCategories.has(cat);
              const catCount = assets.filter((a) => a.category === cat).length;
              return (
                <div key={cat}>
                  <button
                    onClick={() => {
                      setActiveCategory(cat);
                      setActiveFolder(null);
                      toggleExpand(cat);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                      activeCategory === cat && !activeFolder
                        ? 'bg-gray-100 text-gray-900 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 font-medium'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    <span className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-gray-400">{catCount}</span>
                      <ChevronDown
                        className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>

                  {isExpanded && folders.size > 1 &&
                    Array.from(folders).map((folder) => (
                      <button
                        key={folder}
                        onClick={() => { setActiveCategory(cat); setActiveFolder(folder); }}
                        className={`w-full text-left pl-8 pr-4 py-1.5 text-xs transition-colors truncate ${
                          activeFolder === folder
                            ? 'text-gray-900 font-medium bg-gray-50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {folder.split(' / ').slice(1).join(' / ') || folder}
                      </button>
                    ))}
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* ── Main content ────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="px-6 pt-6 pb-3">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">素材庫</h1>
                {hasAssets && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {filtered.length} / {assets.length} 個素材
                  </p>
                )}
              </div>
              <div className="ml-auto flex items-center gap-2">
                {hasAssets && (
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    新增資料夾
                  </button>
                )}
              </div>
            </div>

            {/* Search */}
            {hasAssets && (
              <div className="mt-3 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="搜尋檔名或資料夾..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                />
                {search && (
                  <button onClick={() => setSearch('')}>
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            )}

            {/* Mobile category pills */}
            {hasAssets && (
              <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1 md:hidden">
                {['全部', ...Array.from(categories.keys())].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setActiveFolder(null); }}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 px-6 py-6">
          {!hasAssets ? (
            <EmptyState onPickFolder={() => inputRef.current?.click()} />
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm">
              <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              沒有符合搜尋條件的素材
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {filtered.map((asset) => (
                <AssetCard key={asset.id} asset={asset} onClick={() => setPreview(asset)} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Preview modal ────────────────────── */}
      {preview && <PreviewModal asset={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
