import { Monitor, Video, Youtube } from "lucide-react";

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const normalizeVideoUrl = (url) => {
  if (!url) return null;

  if (url.includes("/embed/")) {
    const videoIdMatch = url.match(/\/embed\/([^?]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
    }
  }

  return url;
};

export const extractVideoId = (url) => {
  if (!url) return null;

  if (url.includes("/embed/")) {
    const match = url.match(/\/embed\/([^?]+)/);
    return match ? match[1] : null;
  }

  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

export const getThumbnail = (videoUrl) => {
  const videoId = extractVideoId(videoUrl);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;
};

export const getPlatformIcon = (platform) => {
  switch (platform) {
    case "youtube":
      return <Youtube className="h-4 w-4 text-red-500" />;
    case "vimeo":
      return <Video className="h-4 w-4 text-blue-500" />;
    default:
      return <Monitor className="h-4 w-4 text-gray-500" />;
  }
};

export const getVideoData = (video) => {
  return {
    id: video.id,
    title: video.title,
    url: video.video_url || video.url,
    description: video.description,
    thumbnail: video.thumbnail_url || video.thumbnail,
    platform: video.platform || "youtube",
    project_title: video.project_title,
    created_at: video.created_at,
    updated_at: video.updated_at,
  };
};

export const getClientData = (client) => {
  return {
    id: client.id,
    name: client.name,
    description: client.description,
    videos: client.videos ? client.videos.map(getVideoData) : [],
    created_at: client.created_at,
    updated_at: client.updated_at,
  };
};
