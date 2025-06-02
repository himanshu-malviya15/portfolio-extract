import { useState } from "react";
import { Link, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { portfolioService } from "../services/portfolioService";

export default function PortfolioSubmission({ onPortfolioSubmitted }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setMessage("Please enter a portfolio URL");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await portfolioService.submit(url.trim());

      setMessage("Portfolio submitted successfully! Processing your data...");
      setMessageType("success");
      setUrl("");

      if (onPortfolioSubmitted) {
        setTimeout(() => {
          onPortfolioSubmitted();
        }, 2000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to submit portfolio. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Upload className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Submit Your Portfolio
        </h2>
        <p className="text-gray-600">
          Share your portfolio URL and we'll extract and showcase your work
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="portfolio-url"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Portfolio URL
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="portfolio-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://sonuchoudhary.my.canva.site/portfolio"
              className="input-field pl-10"
              disabled={loading}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Example: https://sonuchoudhary.my.canva.site/portfolio
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg flex items-center space-x-3 animate-slide-up ${
              messageType === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <p className="text-sm">{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="loading-spinner h-5 w-5"></div>
              <span>Processing...</span>
            </div>
          ) : (
            "Submit Portfolio"
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          What happens next?
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• We'll analyze your portfolio structure</li>
          <li>• Extract your professional information</li>
          <li>• Display your work in an organized format</li>
          <li>• Make it discoverable to potential clients</li>
        </ul>
      </div>
    </div>
  );
}
