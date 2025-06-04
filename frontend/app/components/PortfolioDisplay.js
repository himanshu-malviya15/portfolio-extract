import { useState } from "react";
import {
  User,
  Calendar,
  ExternalLink,
  Play,
  Eye,
  ChevronDown,
  ChevronUp,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
  Globe,
  Video,
  Users,
  Tag,
  FileText,
  Clock,
  Youtube,
  Monitor,
  Award,
  Briefcase,
} from "lucide-react";

export default function EnhancedPortfolioDisplay({ portfolio }) {
  const [expandedClients, setExpandedClients] = useState({});
  const [activeTab, setActiveTab] = useState("overview");

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const normalizeVideoUrl = (url) => {
    if (!url) return null;

    if (url.includes("/embed/")) {
      const videoIdMatch = url.match(/\/embed\/([^?]+)/);
      if (videoIdMatch) {
        return `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
      }
    }

    return url;
  };

  const extractVideoId = (url) => {
    if (!url) return null;

    if (url.includes("/embed/")) {
      const match = url.match(/\/embed\/([^?]+)/);
      return match ? match[1] : null;
    }

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

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      case "vimeo":
        return <Video className="h-4 w-4 text-blue-500" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-500" />;
    }
  };

  const getVideoData = (video) => {
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

  const getClientData = (client) => {
    return {
      id: client.id,
      name: client.name,
      description: client.description,
      videos: client.videos ? client.videos.map(getVideoData) : [],
      created_at: client.created_at,
      updated_at: client.updated_at,
    };
  };

  const processedClients = portfolio.clients
    ? portfolio.clients.map(getClientData)
    : [];
  const portfolioData = portfolio.scraped_data || portfolio;

  const totalVideos =
    portfolioData.total_videos ||
    processedClients.reduce(
      (sum, client) => sum + (client.videos?.length || 0),
      0
    ) ||
    0;
  const totalClients =
    portfolioData.total_clients || processedClients.length || 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "clients", label: "Clients & Projects", icon: Briefcase },
    { id: "details", label: "Portfolio Details", icon: FileText },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-12 w-12 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {portfolioData.portfolio_info?.title || "Creative Portfolio"}
                </h1>
                <p className="text-gray-600 mb-4">
                  {portfolioData.portfolio_info?.meta_description ||
                    portfolioData.portfolio_info?.description ||
                    "Professional video portfolio showcasing creative work"}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Scraped{" "}
                      {formatDate(
                        portfolioData.scraped_at || portfolio.created_at
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {totalClients} Client{totalClients !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Video className="h-4 w-4" />
                    <span>
                      {totalVideos} Video{totalVideos !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span className="capitalize">
                      {portfolioData.type} Portfolio
                    </span>
                  </div>
                  {portfolio.id && (
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4" />
                      <span>ID: {portfolio.id}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={portfolio.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Original</span>
                </a>

                {portfolioData.portfolio_info?.contact_info?.email && (
                  <a
                    href={`mailto:${portfolioData.portfolio_info.contact_info.email}`}
                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact</span>
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">
                      {totalClients}
                    </p>
                    <p className="text-sm text-blue-600">Clients</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">
                      {totalVideos}
                    </p>
                    <p className="text-sm text-purple-600">Videos</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">
                      {portfolioData.portfolio_info?.skills?.length || 0}
                    </p>
                    <p className="text-sm text-green-600">Skills</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-900 capitalize">
                      {portfolioData.type}
                    </p>
                    <p className="text-sm text-orange-600">Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Portfolio Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Projects:</span>
                      <span className="font-medium text-blue-900">
                        {totalClients}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Videos:</span>
                      <span className="font-medium text-blue-900">
                        {totalVideos}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Platform Type:</span>
                      <span className="font-medium text-blue-900 capitalize">
                        {portfolioData.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Status:</span>
                      <span className="font-medium text-blue-900 capitalize">
                        {portfolio.status || "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                {portfolioData.portfolio_info?.skills &&
                  portfolioData.portfolio_info.skills.length > 0 && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-3">
                        Skills & Expertise
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {portfolioData.portfolio_info.skills
                          .slice(0, 6)
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        {portfolioData.portfolio_info.skills.length > 6 && (
                          <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium">
                            +{portfolioData.portfolio_info.skills.length - 6}{" "}
                            more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                {portfolioData.portfolio_info?.contact_info &&
                  Object.keys(portfolioData.portfolio_info.contact_info)
                    .length > 0 && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-3">
                        Contact & Social
                      </h3>
                      <div className="space-y-2">
                        {portfolioData.portfolio_info.contact_info.email && (
                          <a
                            href={`mailto:${portfolioData.portfolio_info.contact_info.email}`}
                            className="flex items-center space-x-2 text-sm text-green-700 hover:text-green-800"
                          >
                            <Mail className="h-4 w-4" />
                            <span className="truncate">
                              {portfolioData.portfolio_info.contact_info.email}
                            </span>
                          </a>
                        )}
                        {portfolioData.portfolio_info.contact_info
                          .instagram && (
                          <a
                            href={
                              portfolioData.portfolio_info.contact_info
                                .instagram
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-sm text-green-700 hover:text-green-800"
                          >
                            <Instagram className="h-4 w-4" />
                            <span>Instagram</span>
                          </a>
                        )}
                        {portfolioData.portfolio_info.contact_info.linkedin && (
                          <a
                            href={
                              portfolioData.portfolio_info.contact_info.linkedin
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-sm text-green-700 hover:text-green-800"
                          >
                            <Linkedin className="h-4 w-4" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                        {portfolioData.portfolio_info.contact_info.twitter && (
                          <a
                            href={
                              portfolioData.portfolio_info.contact_info.twitter
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-sm text-green-700 hover:text-green-800"
                          >
                            <Twitter className="h-4 w-4" />
                            <span>Twitter</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {processedClients && processedClients.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Recent Projects
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {processedClients.slice(0, 3).map((client, index) => (
                      <div
                        key={client.id || index}
                        className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {client.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {client.videos?.length || 0} video
                              {(client.videos?.length || 0) !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        {client.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {client.description}
                          </p>
                        )}
                        {client.id && (
                          <p className="text-xs text-gray-400 mt-2">
                            Client ID: {client.id}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "clients" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <span>Clients & Projects</span>
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                    {totalClients}
                  </span>
                </h3>
              </div>

              {processedClients && processedClients.length > 0 ? (
                <div className="space-y-4">
                  {processedClients.map((client, index) => (
                    <div
                      key={client.id || index}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      <div
                        className="bg-gray-50 p-4 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => toggleClient(client.id || index)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {client.name}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>
                                {client.videos?.length || 0} video
                                {(client.videos?.length || 0) !== 1 ? "s" : ""}
                              </span>
                              {client.id && <span>ID: {client.id}</span>}
                              {client.description && (
                                <span className="truncate max-w-xs">
                                  {client.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {expandedClients[client.id || index] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>

                      {expandedClients[client.id || index] &&
                        client.videos &&
                        client.videos.length > 0 && (
                          <div className="p-4 bg-white">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {client.videos.map((video, videoIndex) => {
                                const normalizedUrl = normalizeVideoUrl(
                                  video.url
                                );
                                const thumbnailUrl =
                                  getThumbnail(video.url) || video.thumbnail;

                                return (
                                  <div
                                    key={video.id || videoIndex}
                                    className="group"
                                  >
                                    <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-video mb-3">
                                      {thumbnailUrl ? (
                                        <img
                                          src={thumbnailUrl}
                                          alt={video.title || "Video thumbnail"}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                          onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display =
                                              "flex";
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
                                          <span className="text-white text-xs">
                                            ID: {video.id}
                                          </span>
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
                                          <span>
                                            Created:{" "}
                                            {formatDate(video.created_at)}
                                          </span>
                                        )}
                                        {video.updated_at &&
                                          video.updated_at !==
                                            video.created_at && (
                                            <span>
                                              Updated:{" "}
                                              {formatDate(video.updated_at)}
                                            </span>
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
                              })}
                            </div>
                          </div>
                        )}

                      {expandedClients[client.id || index] &&
                        (!client.videos || client.videos.length === 0) && (
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No Clients Found
                  </h4>
                  <p className="text-gray-600">
                    This portfolio doesn't contain any client information yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Portfolio Details</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span>Basic Information</span>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Portfolio URL
                      </label>
                      <a
                        href={portfolio.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:text-blue-700 break-all text-sm mt-1"
                      >
                        {portfolio.portfolio_url}
                      </a>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Platform Type
                      </label>
                      <p className="text-gray-600 text-sm mt-1 capitalize">
                        {portfolioData.type}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <p className="text-gray-600 text-sm mt-1 capitalize">
                        {portfolio.status}
                      </p>
                    </div>
                    {portfolio.id && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Portfolio ID
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          {portfolio.id}
                        </p>
                      </div>
                    )}
                    {portfolioData.portfolio_info?.title && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          {portfolioData.portfolio_info.title}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span>Portfolio Metadata</span>
                  </h4>
                  <div className="space-y-3">
                    {portfolioData.portfolio_info?.meta_description && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Meta Description
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          {portfolioData.portfolio_info.meta_description}
                        </p>
                      </div>
                    )}
                    {portfolioData.portfolio_info?.description && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          {portfolioData.portfolio_info.description}
                        </p>
                      </div>
                    )}
                    {portfolioData.scraped_at && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Last Scraped
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          {formatDate(portfolioData.scraped_at)}
                        </p>
                      </div>
                    )}
                    {portfolio.created_at && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Created At
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          {formatDate(portfolio.created_at)}
                        </p>
                      </div>
                    )}
                    {portfolio.updated_at && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Updated At
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          {formatDate(portfolio.updated_at)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {portfolioData.portfolio_info?.contact_info && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>Contact Information</span>
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {portfolioData.portfolio_info.contact_info.instagram && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Instagram
                        </label>
                        <a
                          href={
                            portfolioData.portfolio_info.contact_info.instagram
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-700 break-all text-sm mt-1"
                        >
                          {portfolioData.portfolio_info.contact_info.instagram}
                        </a>
                      </div>
                    )}
                    {portfolioData.portfolio_info.contact_info.linkedin && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          LinkedIn
                        </label>
                        <a
                          href={
                            portfolioData.portfolio_info.contact_info.linkedin
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-700 break-all text-sm mt-1"
                        >
                          {portfolioData.portfolio_info.contact_info.linkedin}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {portfolioData.portfolio_info?.skills &&
                portfolioData.portfolio_info.skills.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-blue-600" />
                      <span>Skills</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {portfolioData.portfolio_info.skills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
