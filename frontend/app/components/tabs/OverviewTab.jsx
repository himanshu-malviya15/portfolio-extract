import { Mail, Instagram, Twitter, Linkedin } from "lucide-react";

export const OverviewTab = ({
  portfolioData,
  processedClients,
  totalClients,
  totalVideos,
  portfolio,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Portfolio Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Total Projects:</span>
              <span className="font-medium text-blue-900">{totalClients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Total Videos:</span>
              <span className="font-medium text-blue-900">{totalVideos}</span>
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
                    +{portfolioData.portfolio_info.skills.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

        {portfolioData.portfolio_info?.contact_info &&
          Object.keys(portfolioData.portfolio_info.contact_info).length > 0 && (
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
                {portfolioData.portfolio_info.contact_info.instagram && (
                  <a
                    href={portfolioData.portfolio_info.contact_info.instagram}
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
                    href={portfolioData.portfolio_info.contact_info.linkedin}
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
                    href={portfolioData.portfolio_info.contact_info.twitter}
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
  );
};
