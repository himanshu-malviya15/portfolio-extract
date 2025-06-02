import { useState } from "react";
import {
  User,
  Calendar,
  ExternalLink,
  Play,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function PortfolioDisplay({ portfolio }) {
  const [expandedClients, setExpandedClients] = useState({});

  const toggleClient = (clientId) => {
    setExpandedClients((prev) => ({
      ...prev,
      [clientId]: !prev[clientId],
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  const getThumbnail = (videoUrl) => {
    const videoId = extractVideoId(videoUrl);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : null;
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <User className="h-12 w-12 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Creative Portfolio
              </h2>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted {formatDate(portfolio.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{portfolio.clients?.length || 0} Clients</span>
                </div>
              </div>
            </div>

            <a
              href={portfolio.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center space-x-2 self-start"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Original</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
          <span>Basic Information</span>
        </h3>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Portfolio URL</h4>
              <a
                href={portfolio.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 break-all text-sm"
              >
                {portfolio.portfolio_url}
              </a>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Last Updated</h4>
              <p className="text-gray-600 text-sm">
                {formatDate(portfolio.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
          <span>Clients & Projects</span>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {portfolio.clients?.length || 0}
          </span>
        </h3>

        {portfolio.clients && portfolio.clients.length > 0 ? (
          <div className="space-y-6">
            {portfolio.clients.map((client) => (
              <div
                key={client.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div
                  className="bg-gray-50 p-4 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => toggleClient(client.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {client.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {client.videos?.length || 0} video
                        {(client.videos?.length || 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {expandedClients[client.id] ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {expandedClients[client.id] &&
                  client.videos &&
                  client.videos.length > 0 && (
                    <div className="p-4 bg-white">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {client.videos.map((video) => (
                          <div key={video.id} className="group">
                            <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-video mb-3">
                              {getThumbnail(video.video_url) ? (
                                <img
                                  src={getThumbnail(video.video_url)}
                                  alt={video.title || "Video thumbnail"}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Play className="h-12 w-12 text-gray-400" />
                                </div>
                              )}

                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-gray-900 mb-1 line-clamp-2">
                                {video.title || "Untitled Video"}
                              </h5>

                              {video.video_url && (
                                <a
                                  href={video.video_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>Watch Video</span>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {expandedClients[client.id] &&
                  (!client.videos || client.videos.length === 0) && (
                    <div className="p-4 bg-white text-center">
                      <p className="text-gray-500 text-sm">
                        No videos found for this client
                      </p>
                    </div>
                  )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="max-w-sm mx-auto">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Clients Found
              </h4>
              <p className="text-gray-600 text-sm">
                This portfolio doesn't contain any client information yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
