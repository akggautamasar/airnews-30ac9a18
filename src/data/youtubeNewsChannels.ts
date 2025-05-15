
export interface NewsVideo {
  id: string;
  videoId: string;  // YouTube video ID
  title: string;
  channelName: string;
  channelThumbnail: string;
  publishedAt: string;
  views?: string;
  category: string;
  thumbnailUrl: string;
}

export const youtubeNewsVideos: NewsVideo[] = [
  {
    id: "1",
    videoId: "PXiOPvCjLPM",
    title: "Russia Strikes 7 Ukrainian Regions Overnight; US Condemns Attack",
    channelName: "CRUX News",
    channelThumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZRatfLRZ7qWpFPgnWghrCN5z6-1_cGZoc8Mr_wh=s176-c-k-c0x00ffffff-no-rj",
    publishedAt: "5 hours ago",
    views: "145K",
    category: "World",
    thumbnailUrl: "https://i.ytimg.com/vi/PXiOPvCjLPM/hqdefault.jpg"
  },
  {
    id: "2",
    videoId: "i6-EUj7BbcE",
    title: "Congress Leaders Meet After Assembly Election Win, Discuss Government Formation",
    channelName: "NDTV",
    channelThumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZQoP-lw8VvfJM0v-xBxz3yd3DQMEfgXvIWGIE0t=s176-c-k-c0x00ffffff-no-rj",
    publishedAt: "2 hours ago",
    views: "67K",
    category: "Politics",
    thumbnailUrl: "https://i.ytimg.com/vi/i6-EUj7BbcE/hqdefault.jpg"
  },
  {
    id: "3",
    videoId: "HHbdmgwuoCA",
    title: "Real Madrid celebrates Champions League win with fans",
    channelName: "Sky Sports",
    channelThumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZQR2hQciCl0YJJ0Ui5I7YJDnAGgqw4j58bSc2ee=s176-c-k-c0x00ffffff-no-rj",
    publishedAt: "5 hours ago",
    views: "203K",
    category: "Sports",
    thumbnailUrl: "https://i.ytimg.com/vi/HHbdmgwuoCA/hqdefault.jpg"
  },
  {
    id: "4",
    videoId: "vdnCkcZLK3I",
    title: "Google I/O 2024: All Announcements in 12 Minutes!",
    channelName: "Tech Today",
    channelThumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZQmDCXxiT2nlNGvbcazyElKf2pJfKk92MgZiqhB=s176-c-k-c0x00ffffff-no-rj",
    publishedAt: "2 days ago",
    views: "1.2M",
    category: "Technology",
    thumbnailUrl: "https://i.ytimg.com/vi/vdnCkcZLK3I/hqdefault.jpg"
  },
  {
    id: "5",
    videoId: "PHe0bXAIuk0",
    title: "How The Economic Machine Works by Ray Dalio",
    channelName: "Bloomberg",
    channelThumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZQ-UgZlIRRGTwyIQOs0ItNP6zs_kUH4tNmgc6ff=s176-c-k-c0x00ffffff-no-rj",
    publishedAt: "4 days ago",
    views: "458K",
    category: "Business",
    thumbnailUrl: "https://i.ytimg.com/vi/PHe0bXAIuk0/hqdefault.jpg"
  },
  {
    id: "6",
    videoId: "vPwaXytZcgI",
    title: "Ukraine War: Russia launches major missile strikes",
    channelName: "BBC News",
    channelThumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZSJUQajbOherEqtULQZ-8TOoKbTm-DJYt4u1iKe=s176-c-k-c0x00ffffff-no-rj",
    publishedAt: "1 day ago",
    views: "950K",
    category: "World",
    thumbnailUrl: "https://i.ytimg.com/vi/vPwaXytZcgI/hqdefault.jpg"
  }
];

export const videoCategories = [
  "All",
  "World",
  "Politics",
  "Sports",
  "Technology",
  "Entertainment",
  "Business"
];
