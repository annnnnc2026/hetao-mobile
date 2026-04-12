import BottomNav from '@/components/BottomNav';

export default function MaterialsPage() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen text-gray-400 pb-20">
        <p className="text-base font-medium text-gray-500">我的餘料</p>
        <p className="text-sm mt-1">待開發</p>
      </main>
      <BottomNav />
    </>
  );
}
