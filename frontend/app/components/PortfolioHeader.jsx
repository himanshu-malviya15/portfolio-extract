import { ExternalLink, User } from "lucide-react";
import { Calendar, Users, Video, Globe, Tag } from "lucide-react";
import { formatDate } from "../utils/portfolioHelpers";

export const PortfolioHeader = ({
  portfolio,
  portfolioData,
  totalClients,
  totalVideos,
}) => {
  return (
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
        </div>
      </div>
    </div>
  );
};
