import { ChevronDown, ChevronUp } from "lucide-react";
import { VideoCard } from "./VideoCard";
import { Video } from "lucide-react";

export const ClientAccordion = ({ client, isExpanded, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div
        className="bg-gray-50 p-4 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold">
              {client.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{client.name}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                {client.videos?.length || 0} video
                {(client.videos?.length || 0) !== 1 ? "s" : ""}
              </span>
              {client.id && <span>ID: {client.id}</span>}
              {client.description && (
                <span className="truncate max-w-xs">{client.description}</span>
              )}
            </div>
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {isExpanded && client.videos && client.videos.length > 0 && (
        <div className="p-4 bg-white">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {client.videos.map((video, videoIndex) => (
              <VideoCard key={video.id || videoIndex} video={video} />
            ))}
          </div>
        </div>
      )}

      {isExpanded && (!client.videos || client.videos.length === 0) && (
        <div className="p-4 bg-white text-center">
          <div className="py-8">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              No videos found for this client
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
