"use client";
import { useState, useEffect } from "react";
import PortfolioSubmission from "./components/PortfolioSubmission";
import PortfolioDisplay from "./components/PortfolioDisplay";
import Header from "./components/Header";
import { portfolioService } from "./services/portfolioService";

export default function Home() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getAll();
      setPortfolios(data);
    } catch (err) {
      setError("Failed to load portfolios");
      console.error("Error fetching portfolios:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioSubmitted = () => {
    fetchPortfolios();
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-12">
          <PortfolioSubmission
            onPortfolioSubmitted={handlePortfolioSubmitted}
          />
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Portfolio Showcase
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover amazing work from talented creators across various
              industries
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="loading-spinner"></div>
              <span className="ml-3 text-gray-600">Loading portfolios...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchPortfolios}
                  className="mt-4 btn-secondary"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : portfolios.length > 0 ? (
            <div className="grid gap-8 md:gap-12">
              {portfolios.map((portfolio) => (
                <PortfolioDisplay key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Portfolios Yet
                </h3>
                <p className="text-gray-600">
                  Be the first to submit a portfolio and showcase your work!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
