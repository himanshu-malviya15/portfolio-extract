import { Briefcase } from "lucide-react";
import { ClientAccordion } from "../ClientAccordion";

export const ClientsTab = ({
  processedClients,
  expandedClients,
  onToggleClient,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          <span>Clients & Projects</span>
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
            {processedClients.length}
          </span>
        </h3>
      </div>

      {processedClients && processedClients.length > 0 ? (
        <div className="space-y-4">
          {processedClients.map((client, index) => (
            <ClientAccordion
              key={client.id || index}
              client={client}
              isExpanded={expandedClients[client.id || index]}
              onToggle={() => onToggleClient(client.id || index)}
            />
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
  );
};
