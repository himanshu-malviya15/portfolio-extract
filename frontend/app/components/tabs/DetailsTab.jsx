import { Globe, Award, Users, Tag, FileText } from "lucide-react";
import { formatDate } from "../../utils/portfolioHelpers";

export const DetailsTab = ({ portfolio, portfolioData }) => {
  return (
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
                <p className="text-gray-600 text-sm mt-1">{portfolio.id}</p>
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
                  href={portfolioData.portfolio_info.contact_info.instagram}
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
                  href={portfolioData.portfolio_info.contact_info.linkedin}
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
              {portfolioData.portfolio_info.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};
