import HeroSection from '@/components/home/hero-section';
import QuickAccessCards from '@/components/home/quick-access-cards';
import NewsTicker from '@/components/home/news-ticker';
import Bookshelf from '@/components/home/bookshelf';
import VlogsSection from '@/components/home/vlogs-section';
import StatsSection from '@/components/home/stats-section';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <div className="w-full max-w-7xl px-4 md:px-8 space-y-24 md:space-y-32 py-24 md:py-32">
        <QuickAccessCards />
        <NewsTicker />
        <div className="relative">
          <Separator className="absolute -top-16" />
          <Bookshelf />
        </div>
        <div className="relative">
          <Separator className="absolute -top-16" />
          <VlogsSection />
        </div>
        <div className="relative">
          <Separator className="absolute -top-16" />
          <StatsSection />
        </div>
      </div>
    </div>
  );
}
