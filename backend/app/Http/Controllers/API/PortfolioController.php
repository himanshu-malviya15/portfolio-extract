<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Services\PortfolioScraperService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PortfolioController extends Controller
{
    protected PortfolioScraperService $scraperService;

    public function __construct(PortfolioScraperService $scraperService)
    {
        $this->scraperService = $scraperService;
    }

    public function index(): JsonResponse
    {
        try {
            $portfolios = Portfolio::with(['clients.videos'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $portfolios
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching portfolios: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch portfolios'
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
{
    $validator = Validator::make($request->all(), [
        'portfolio_url' => 'required|url|max:500'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid portfolio URL',
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        $portfolioUrl = $request->input('portfolio_url');
        
        $existingPortfolio = Portfolio::where('portfolio_url', $portfolioUrl)->first();
        if ($existingPortfolio) {
            return response()->json([
                'success' => false,
                'message' => 'Portfolio already exists'
            ], 409);
        }

        $portfolio = Portfolio::create([
            'portfolio_url' => $portfolioUrl,
            'status' => 'processing'
        ]);

        $scrapedData = $this->scraperService->scrapePortfolio($portfolioUrl);
        
        $portfolio->update([
            'status' => 'completed',
            'scraped_data' => $scrapedData
        ]);

        if (isset($scrapedData['clients']) && is_array($scrapedData['clients'])) {
            foreach ($scrapedData['clients'] as $clientData) {
                $client = $portfolio->clients()->create([
                    'name' => $clientData['name'] ?? 'Unknown Client'
                ]);

                if (isset($clientData['videos']) && is_array($clientData['videos'])) {
                    foreach ($clientData['videos'] as $videoData) {
                        $client->videos()->create([
                            'title' => $videoData['title'] ?? 'Untitled',
                            'video_url' => $videoData['url'] ?? null,
                            'thumbnail_url' => $videoData['thumbnail'] ?? null
                        ]);
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Portfolio submitted and processed successfully',
            'data' => $portfolio->load(['clients.videos'])
        ], 201);

    } catch (\Exception $e) {
        Log::error('Error processing portfolio: ' . $e->getMessage());
        
        if (isset($portfolio)) {
            $portfolio->update(['status' => 'failed']);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to process portfolio: ' . $e->getMessage(),
            'error' => env('APP_DEBUG') ? $e->getTraceAsString() : null
        ], 500);
    }
}

    public function show(Portfolio $portfolio): JsonResponse
    {
        try {
            $portfolio->load(['clients.videos']);
            
            return response()->json([
                'success' => true,
                'data' => $portfolio
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching portfolio: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Portfolio not found'
            ], 404);
        }
    }

    public function destroy(Portfolio $portfolio): JsonResponse
    {
        try {
            $portfolio->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Portfolio deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting portfolio: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete portfolio'
            ], 500);
        }
    }
}