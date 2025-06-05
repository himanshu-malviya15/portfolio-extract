import { Users, Video, Tag, Globe } from "lucide-react";

export const PortfolioStats = ({
  totalClients,
  totalVideos,
  skillsCount,
  type,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-2xl font-bold text-blue-900">{totalClients}</p>
            <p className="text-sm text-blue-600">Clients</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Video className="h-5 w-5 text-purple-600" />
          <div>
            <p className="text-2xl font-bold text-purple-900">{totalVideos}</p>
            <p className="text-sm text-purple-600">Videos</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Tag className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-2xl font-bold text-green-900">{skillsCount}</p>
            <p className="text-sm text-green-600">Skills</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-orange-600" />
          <div>
            <p className="text-2xl font-bold text-orange-900 capitalize">
              {type}
            </p>
            <p className="text-sm text-orange-600">Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};
