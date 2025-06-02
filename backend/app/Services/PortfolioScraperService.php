<?php

namespace App\Services;

use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use Illuminate\Support\Facades\Log;

class PortfolioScraperService
{
    protected Client $httpClient;

    public function __construct()
{
    $this->httpClient = new Client([
        'timeout' => 30,
        'verify' => false, // Disable SSL verification (for development only)
       'headers' => [
    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language' => 'en-US,en;q=0.5',
    'Referer' => 'https://www.google.com/',
    'DNT' => '1',
    'Connection' => 'keep-alive',
    'Upgrade-Insecure-Requests' => '1'
]
    ]);
}

    public function scrapePortfolio(string $url): array
{
    try {
        Log::info("Starting to scrape portfolio: {$url}");
        
        $response = $this->httpClient->get($url);
        $html = $response->getBody()->getContents();
        
        // Log the first 500 characters of HTML for debugging
        Log::debug('HTML response sample: '.substr($html, 0, 500));
        
        $crawler = new Crawler($html);
        
        if (str_contains($url, 'canva.site')) {
            Log::info('Using Canva-specific scraper');
            return $this->scrapeCanvaPortfolio($crawler, $url);
        }
        
        Log::info('Using generic scraper');
        return $this->scrapeGenericPortfolio($crawler, $url);
        
    } catch (\Exception $e) {
        Log::error("Error scraping portfolio {$url}: " . $e->getMessage());
        Log::error("Stack trace: " . $e->getTraceAsString());
        throw new \Exception("Failed to scrape portfolio: " . $e->getMessage());
    }
}

    protected function scrapeCanvaPortfolio(Crawler $crawler, string $url): array
    {
        $clients = [];
        
        try {
            $sections = $crawler->filter('h1, h2, h3, h4, h5, h6, .section-title, [class*="title"], [class*="heading"]');
            
            $currentClient = null;
            $videos = [];
            
            $sections->each(function (Crawler $node) use (&$clients, &$currentClient, &$videos) {
                $text = trim($node->text());
                
                if (strlen($text) < 3) return;
                
                if ($this->looksLikeClientName($text)) {
                    if ($currentClient && !empty($videos)) {
                        $clients[] = [
                            'name' => $currentClient,
                            'videos' => $videos
                        ];
                    }
                    
                    $currentClient = $text;
                    $videos = [];
                    return;
                }
            });
            
            $videoElements = $crawler->filter('iframe[src*="youtube"], iframe[src*="vimeo"], a[href*="youtube"], a[href*="vimeo"], video');
            
            $allVideos = [];
            $videoElements->each(function (Crawler $node) use (&$allVideos) {
                $videoData = $this->extractVideoData($node);
                if ($videoData) {
                    $allVideos[] = $videoData;
                }
            });
            
            if ($currentClient) {
                $clients[] = [
                    'name' => $currentClient,
                    'videos' => $allVideos
                ];
            } else if (!empty($allVideos)) {
                $clients[] = [
                    'name' => 'Portfolio Work',
                    'videos' => $allVideos
                ];
            }
            
            if (empty($clients)) {
                $clients = $this->extractClientsFromText($crawler);
            }
            
        } catch (\Exception $e) {
            Log::error("Error in Canva scraper: " . $e->getMessage());
        }
        
        return [
            'type' => 'canva',
            'clients' => $clients,
            'scraped_at' => now()->toISOString()
        ];
    }

    protected function scrapeGenericPortfolio(Crawler $crawler, string $url): array
    {
        $clients = [];
        
        try {
            $videoElements = $crawler->filter('iframe[src*="youtube"], iframe[src*="vimeo"], a[href*="youtube"], a[href*="vimeo"], video');
            $videos = [];
            
            $videoElements->each(function (Crawler $node) use (&$videos) {
                $videoData = $this->extractVideoData($node);
                if ($videoData) {
                    $videos[] = $videoData;
                }
            });
            
            if (!empty($videos)) {
                $clients[] = [
                    'name' => 'Portfolio Work',
                    'videos' => $videos
                ];
            }
            
        } catch (\Exception $e) {
            Log::error("Error in generic scraper: " . $e->getMessage());
        }
        
        return [
            'type' => 'generic',
            'clients' => $clients,
            'scraped_at' => now()->toISOString()
        ];
    }

    protected function extractVideoData(Crawler $node): ?array
    {
        $videoUrl = null;
        $title = null;
        
        if ($node->nodeName() === 'iframe') {
            $videoUrl = $node->attr('src');
            $title = $node->attr('title') ?: 'Video';
        } elseif ($node->nodeName() === 'a') {
            $videoUrl = $node->attr('href');
            $title = trim($node->text()) ?: 'Video';
        } elseif ($node->nodeName() === 'video') {
            $videoUrl = $node->attr('src');
            $title = $node->attr('title') ?: 'Video';
        }
        
        if (!$videoUrl) return null;
        
        if (str_contains($videoUrl, 'youtube') || str_contains($videoUrl, 'youtu.be')) {
            $videoUrl = $this->normalizeYouTubeUrl($videoUrl);
        }
        
        return [
            'title' => $title,
            'url' => $videoUrl,
            'thumbnail' => $this->generateThumbnail($videoUrl)
        ];
    }

    protected function looksLikeClientName(string $text): bool
    {
        $text = strtolower($text);
        
        $skipWords = ['video', 'work', 'portfolio', 'projects', 'about', 'contact', 'home', 'services'];
        foreach ($skipWords as $word) {
            if (str_contains($text, $word)) return false;
        }
        
        if (preg_match('/\b(inc|ltd|llc|corp|company|agency|studio|productions?)\b/i', $text)) {
            return true;
        }
        
        return strlen($text) >= 3 && strlen($text) <= 50 && !str_contains($text, 'click');
    }

    protected function extractClientsFromText(Crawler $crawler): array
    {
        $clients = [];
        $textContent = $crawler->text();
        
        preg_match_all('/\b([A-Z][a-z]+ ?(?:[A-Z][a-z]*)* ?(?:Inc|Ltd|LLC|Corp|Company|Agency|Studio|Productions?))\b/', $textContent, $matches);
        
        if (!empty($matches[1])) {
            foreach (array_slice(array_unique($matches[1]), 0, 5) as $clientName) {
                $clients[] = [
                    'name' => $clientName,
                    'videos' => []
                ];
            }
        }
        
        return $clients;
    }

    protected function normalizeYouTubeUrl(string $url): string
    {
        if (str_contains($url, 'youtu.be/')) {
            $videoId = basename(parse_url($url, PHP_URL_PATH));
            return "https://www.youtube.com/watch?v={$videoId}";
        }
        
        return $url;
    }

    protected function generateThumbnail(string $videoUrl): ?string
    {
        if (str_contains($videoUrl, 'youtube') || str_contains($videoUrl, 'youtu.be')) {
            preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/', $videoUrl, $matches);
            if (isset($matches[1])) {
                return "https://img.youtube.com/vi/{$matches[1]}/maxresdefault.jpg";
            }
        }
        
        return null;
    }
}