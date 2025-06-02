import { Palette, Users, Video } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Roster Portfolio
                </h1>
                <p className="text-sm text-gray-600">
                  Showcase Your Creative Work
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Connect with Talent</span>
            </div>
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Video Editing</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
