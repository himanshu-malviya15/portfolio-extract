import { useState, useMemo } from "react";
import { Eye, Briefcase, FileText } from "lucide-react";
import { getClientData } from "../utils/portfolioHelpers";
import { PortfolioHeader } from "./PortfolioHeader";
import { PortfolioStats } from "./PortfolioStats";
import { TabSystem } from "./TabSystem";
import { OverviewTab } from "./tabs/OverviewTab";
import { ClientsTab } from "./tabs/ClientsTab";
import { DetailsTab } from "./tabs/DetailsTab";

export default function EnhancedPortfolioDisplay({ portfolio }) {
  const [expandedClients, setExpandedClients] = useState({});
  const [activeTab, setActiveTab] = useState("overview");

  const toggleClient = (clientId) => {
    setExpandedClients((prev) => ({
      ...prev,
      [clientId]: !prev[clientId],
    }));
  };

  const processedClients = useMemo(
    () => (portfolio.clients ? portfolio.clients.map(getClientData) : []),
    [portfolio.clients]
  );

  const portfolioData = portfolio.scraped_data || portfolio;

  const { totalVideos, totalClients } = useMemo(
    () => ({
      totalVideos:
        portfolioData.total_videos ||
        processedClients.reduce(
          (sum, client) => sum + (client.videos?.length || 0),
          0
        ) ||
        0,
      totalClients: portfolioData.total_clients || processedClients.length || 0,
    }),
    [portfolioData, processedClients]
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "clients", label: "Clients & Projects", icon: Briefcase },
    { id: "details", label: "Portfolio Details", icon: FileText },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <PortfolioHeader
        portfolio={portfolio}
        portfolioData={portfolioData}
        totalClients={totalClients}
        totalVideos={totalVideos}
      />

      <PortfolioStats
        totalClients={totalClients}
        totalVideos={totalVideos}
        skillsCount={portfolioData.portfolio_info?.skills?.length || 0}
        type={portfolioData.type}
      />

      <TabSystem tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "overview" && (
          <OverviewTab
            portfolioData={portfolioData}
            processedClients={processedClients}
            totalClients={totalClients}
            totalVideos={totalVideos}
            portfolio={portfolio}
          />
        )}
        {activeTab === "clients" && (
          <ClientsTab
            processedClients={processedClients}
            expandedClients={expandedClients}
            onToggleClient={toggleClient}
          />
        )}
        {activeTab === "details" && (
          <DetailsTab portfolio={portfolio} portfolioData={portfolioData} />
        )}
      </TabSystem>
    </div>
  );
}
