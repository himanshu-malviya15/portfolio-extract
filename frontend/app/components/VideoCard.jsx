import { Play, ExternalLink } from "lucide-react";
import {
  getPlatformIcon,
  normalizeVideoUrl,
  formatDate,
  getThumbnail,
} from "../utils/portfolioHelpers";

export const VideoCard = ({ video }) => {
  const normalizedUrl = normalizeVideoUrl(video.url);
  const thumbnailUrl = getThumbnail(video.url) || video.thumbnail;

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-video mb-3">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={video.title || "Video thumbnail"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}

        <div
          className={`w-full h-full ${
            thumbnailUrl ? "hidden" : "flex"
          } items-center justify-center bg-gray-200`}
        >
          <Play className="h-12 w-12 text-gray-400" />
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {video.platform && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-1">
            {getPlatformIcon(video.platform)}
          </div>
        )}

        {video.id && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 rounded px-2 py-1">
            <span className="text-white text-xs">ID: {video.id}</span>
          </div>
        )}
      </div>

      <div>
        <h5 className="font-medium text-gray-900 mb-1 line-clamp-2">
          {video.title || "Untitled Video"}
        </h5>

        {video.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {video.description}
          </p>
        )}

        {video.project_title && (
          <p className="text-xs text-blue-600 mb-2 font-medium">
            {video.project_title}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
          {video.created_at && (
            <span>Created: {formatDate(video.created_at)}</span>
          )}
          {video.updated_at && video.updated_at !== video.created_at && (
            <span>Updated: {formatDate(video.updated_at)}</span>
          )}
        </div>

        {normalizedUrl && (
          <a
            href={normalizedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Watch Video</span>
          </a>
        )}
      </div>
    </div>
  );
};
