import { useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { CategoryNav } from "@/components/CategoryNav";

// Temporary mock data
const mockNews = [
  {
    id: 1,
    title: "SpaceX Successfully Launches New Satellite Constellation",
    summary: "SpaceX has successfully launched another batch of Starlink satellites, expanding its global internet coverage. The launch took place from Kennedy Space Center.",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    category: "Technology",
    source: "Space News",
    publishedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: 2,
    title: "Global Markets Rally as Tech Stocks Surge",
    summary: "Major stock indices reached new highs as technology companies reported better-than-expected earnings. Investors show renewed confidence in AI-driven growth.",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    category: "Business",
    source: "Financial Times",
    publishedAt: "2024-01-20T09:15:00Z",
  },
  {
    id: 3,
    title: "Revolutionary AI Model Breaks Language Understanding Records",
    summary: "A new artificial intelligence model has achieved unprecedented scores in language comprehension tests, marking a significant breakthrough in AI development.",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    category: "Technology",
    source: "Tech Insider",
    publishedAt: "2024-01-20T08:45:00Z",
  },
];

const categories = [
  "Top Stories",
  "Technology",
  "Business",
  "Sports",
  "Entertainment",
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Top Stories");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container">
          <h1 className="text-3xl font-bold text-center">Airnews</h1>
          <p className="text-center mt-2 text-primary-foreground/80">
            Your daily dose of news in short
          </p>
        </div>
      </header>

      <main className="container py-6">
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="space-y-6">
          {mockNews.map((news) => (
            <NewsCard key={news.id} {...news} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;