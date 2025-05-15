
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

export interface NewsChannel {
  id: string;
  name: string;
  channelId: string;
  thumbnail: string;
  subscriberCount?: string;
}

export const youtubeNewsChannels: NewsChannel[] = [
  {
    id: "1",
    name: "CRUX News",
    channelId: "UCypvGLCDuJbUPHpDm2Kd0JQ", // CRUX News channel ID
    thumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZRatfLRZ7qWpFPgnWghrCN5z6-1_cGZoc8Mr_wh=s176-c-k-c0x00ffffff-no-rj"
  },
  {
    id: "2",
    name: "NDTV",
    channelId: "UCz8QaiQxApLq8sLNcszYyJw", // NDTV channel ID
    thumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZQoP-lw8VvfJM0v-xBxz3yd3DQMEfgXvIWGIE0t=s176-c-k-c0x00ffffff-no-rj"
  },
  {
    id: "3",
    name: "Live Mint",
    channelId: "UCsRTLkBCRCgBoRqEHTTUDuQ", // Live Mint channel ID
    thumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZTwDIzWgJ9ZbDOzKDCTcnHUn4CdzTV68TfhQJ-m9A=s176-c-k-c0x00ffffff-no-rj"
  },
  {
    id: "4",
    name: "The Lallantop",
    channelId: "UCx8Z14PpntdaxCt2hakbQLQ", // The Lallantop channel ID
    thumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZQZrKyj4g5hGJHiggbvRCn0HnRbKjDZSQDlQi_zIQ=s176-c-k-c0x00ffffff-no-rj"
  }
];

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
    channelThumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZQZrKyj4g5hGJHiggbvRCn0HnRbKjDZSQDlQi_zIQ=s176-c-k-c0x00ffffff-no-rj",
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
  },
  // New videos from the requested channels
  {
    id: "7",
    videoId: "anmnaiEkKLY",
    title: "QUAD Summit: PM Modi Joins Biden, Kishida & Albanese For QUAD Plenary At Wilmington",
    channelName: "CRUX News",
    channelThumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZRatfLRZ7qWpFPgnWghrCN5z6-1_cGZoc8Mr_wh=s176-c-k-c0x00ffffff-no-rj",
    publishedAt: "10 hours ago",
    views: "94K",
    category: "World",
    thumbnailUrl: "https://i.ytimg.com/vi/anmnaiEkKLY/hqdefault.jpg"
  },
  {
    id: "8",
    videoId: "w8mWQmhLxwg",
    title: "Indian Elections: NDTV Exit Polls Show BJP 3rd Consecutive Victory",
    channelName: "NDTV",
    channelThumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZQoP-lw8VvfJM0v-xBxz3yd3DQMEfgXvIWGIE0t=s176-c-k-c0x00ffffff-no-rj",
    publishedAt: "3 days ago",
    views: "121K",
    category: "Politics",
    thumbnailUrl: "https://i.ytimg.com/vi/w8mWQmhLxwg/hqdefault.jpg"
  },
  {
    id: "9",
    videoId: "Lz731gO0kQY",
    title: "Tech Mahindra inks $300-mn deal with LivePerson: What you need to know",
    channelName: "Live Mint",
    channelThumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZTwDIzWgJ9ZbDOzKDCTcnHUn4CdzTV68TfhQJ-m9A=s176-c-k-c0x00ffffff-no-rj",
    publishedAt: "1 day ago",
    views: "14K",
    category: "Business",
    thumbnailUrl: "https://i.ytimg.com/vi/Lz731gO0kQY/hqdefault.jpg"
  },
  {
    id: "10",
    videoId: "ofQwEs8ywpk",
    title: "Exit Poll में कौन जीता, कौन हारा? | Jharkhand | Jammu Kashmir | Maharashtra | Haryana",
    channelName: "The Lallantop",
    channelThumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZQZrKyj4g5hGJHiggbvRCn0HnRbKjDZSQDlQi_zIQ=s176-c-k-c0x00ffffff-no-rj",
    publishedAt: "6 hours ago",
    views: "352K",
    category: "Politics",
    thumbnailUrl: "https://i.ytimg.com/vi/ofQwEs8ywpk/hqdefault.jpg"
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
