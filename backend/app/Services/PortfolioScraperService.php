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
            'verify' => false, 
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
        $portfolioData = [];
        
        try {
            $portfolioData = $this->extractPortfolioInfo($crawler, $url);
            
            $sections = $crawler->filter('section, div[class*="section"], div[class*="container"]');
            
            $currentSection = null;
            $allVideos = [];
            
            $videoElements = $crawler->filter('iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="youtu.be"], a[href*="youtube"], a[href*="vimeo"], a[href*="youtu.be"], video');
            
            $videoElements->each(function (Crawler $node) use (&$allVideos, $crawler) {
                $videoData = $this->extractVideoData($node);
                if ($videoData) {
                    $parentSection = $this->findParentSection($node, $crawler);
                    $videoData['section_title'] = $parentSection;
                    $allVideos[] = $videoData;
                }
            });
            
            $headings = $crawler->filter('h1, h2, h3, h4, h5, h6, [class*="heading"], [class*="title"]');
            $clientNames = [];
            
            $headings->each(function (Crawler $node) use (&$clientNames) {
                $text = trim($node->text());
                if ($this->looksLikeClientName($text)) {
                    $clientNames[] = $text;
                }
            });
            
            if (!empty($clientNames) && !empty($allVideos)) {
                $clients = $this->groupVideosByProximity($crawler, $clientNames, $allVideos);
            } else if (!empty($allVideos)) {
                $clients[] = [
                    'name' => 'Portfolio Work',
                    'videos' => $allVideos,
                    'description' => 'Creative video portfolio showcasing various projects'
                ];
            }
            
            if (empty($clients)) {
                $clients = $this->extractClientsFromText($crawler);
            }
            
            $portfolioData['skills'] = $this->extractSkills($crawler);
            $portfolioData['description'] = $this->extractDescription($crawler);
            $portfolioData['contact_info'] = $this->extractContactInfo($crawler);
            
        } catch (\Exception $e) {
            Log::error("Error in Canva scraper: " . $e->getMessage());
        }
        
        return [
            'type' => 'canva',
            'clients' => $clients,
            'portfolio_info' => $portfolioData,
            'scraped_at' => now()->toISOString(),
            'total_videos' => count($allVideos ?? []),
            'total_clients' => count($clients)
        ];
    }

    protected function scrapeGenericPortfolio(Crawler $crawler, string $url): array
    {
        $clients = [];
        $portfolioData = [];
        
        try {
            $portfolioData = $this->extractPortfolioInfo($crawler, $url);
            
            $videoElements = $crawler->filter('iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="youtu.be"], a[href*="youtube"], a[href*="vimeo"], a[href*="youtu.be"], video, [class*="video"], [class*="portfolio-item"]');
            $videos = [];
            
            $videoElements->each(function (Crawler $node) use (&$videos, $crawler) {
                $videoData = $this->extractVideoData($node);
                if ($videoData) {
                    $projectInfo = $this->extractProjectInfo($node, $crawler);
                    $videoData = array_merge($videoData, $projectInfo);
                    $videos[] = $videoData;
                }
            });
            
            $projectSections = $crawler->filter('[class*="project"], [class*="work"], [class*="portfolio-item"], [class*="gallery-item"]');
            
            if ($projectSections->count() > 0) {
                $projectSections->each(function (Crawler $node) use (&$clients, &$videos) {
                    $projectData = $this->extractProjectSection($node);
                    if ($projectData) {
                        $clients[] = $projectData;
                    }
                });
            }
            
            if (empty($clients) && !empty($videos)) {
                $clients[] = [
                    'name' => 'Portfolio Work',
                    'videos' => $videos,
                    'description' => 'Video portfolio and creative work'
                ];
            }
            
            $portfolioData['skills'] = $this->extractSkills($crawler);
            $portfolioData['description'] = $this->extractDescription($crawler);
            $portfolioData['contact_info'] = $this->extractContactInfo($crawler);
            
        } catch (\Exception $e) {
            Log::error("Error in generic scraper: " . $e->getMessage());
        }
        
        return [
            'type' => 'generic',
            'clients' => $clients,
            'portfolio_info' => $portfolioData,
            'scraped_at' => now()->toISOString(),
            'total_videos' => array_sum(array_column($clients, 'videos')) ?: 0,
            'total_clients' => count($clients)
        ];
    }

    protected function extractPortfolioInfo(Crawler $crawler, string $url): array
    {
        $info = ['url' => $url];
        
        $titleSelectors = ['title', 'h1', '[class*="name"]', '[class*="title"]'];
        foreach ($titleSelectors as $selector) {
            try {
                $title = $crawler->filter($selector)->first();
                if ($title->count() > 0) {
                    $info['title'] = trim($title->text());
                    break;
                }
            } catch (\Exception $e) {
                continue;
            }
        }
        
        try {
            $metaDesc = $crawler->filter('meta[name="description"]')->first();
            if ($metaDesc->count() > 0) {
                $info['meta_description'] = $metaDesc->attr('content');
            }
        } catch (\Exception $e) {
        }
        
        return $info;
    }

    protected function extractVideoData(Crawler $node): ?array
    {
        $videoUrl = null;
        $title = null;
        $description = null;
        
        if ($node->nodeName() === 'iframe') {
            $videoUrl = $node->attr('src');
            $title = $node->attr('title') ?: $node->attr('alt') ?: 'Video';
        } elseif ($node->nodeName() === 'a') {
            $videoUrl = $node->attr('href');
            $title = trim($node->text()) ?: $node->attr('title') ?: 'Video';
        } elseif ($node->nodeName() === 'video') {
            $videoUrl = $node->attr('src') ?: $node->filter('source')->first()->attr('src');
            $title = $node->attr('title') ?: 'Video';
        } else {
            $link = $node->filter('a, iframe')->first();
            if ($link->count() > 0) {
                $videoUrl = $link->attr('href') ?: $link->attr('src');
                $title = trim($node->text()) ?: 'Video';
            }
        }
        
        if (!$videoUrl || !$this->isValidVideoUrl($videoUrl)) {
            return null;
        }
        
        if (str_contains($videoUrl, 'youtube') || str_contains($videoUrl, 'youtu.be')) {
            $videoUrl = $this->normalizeYouTubeUrl($videoUrl);
        }
        
        try {
            $parent = $node->getNode(0)->parentNode;
            if ($parent) {
                $parentCrawler = new Crawler($parent);
                $description = $this->extractNearbyText($parentCrawler);
            }
        } catch (\Exception $e) {
        }
        
        return [
            'title' => $title,
            'url' => $videoUrl,
            'description' => $description,
            'thumbnail' => $this->generateThumbnail($videoUrl),
            'platform' => $this->detectPlatform($videoUrl)
        ];
    }

    protected function isValidVideoUrl(string $url): bool
    {
        $videoPatterns = [
            'youtube.com',
            'youtu.be',
            'vimeo.com',
            'wistia.com',
            'loom.com'
        ];
        
        foreach ($videoPatterns as $pattern) {
            if (str_contains($url, $pattern)) {
                return true;
            }
        }
        
        return false;
    }

    protected function detectPlatform(string $url): string
    {
        if (str_contains($url, 'youtube') || str_contains($url, 'youtu.be')) {
            return 'youtube';
        } elseif (str_contains($url, 'vimeo')) {
            return 'vimeo';
        } elseif (str_contains($url, 'wistia')) {
            return 'wistia';
        }
        
        return 'other';
    }

    protected function findParentSection(Crawler $node, Crawler $crawler): ?string
    {
        try {
            $current = $node->getNode(0);
            
            while ($current && $current->parentNode) {
                $current = $current->parentNode;
                $currentCrawler = new Crawler($current);
                
                $headings = $currentCrawler->filter('h1, h2, h3, h4, h5, h6');
                if ($headings->count() > 0) {
                    $heading = trim($headings->first()->text());
                    if (!empty($heading) && strlen($heading) < 100) {
                        return $heading;
                    }
                }
            }
        } catch (\Exception $e) {
        }
        
        return null;
    }

    protected function extractNearbyText(Crawler $parentCrawler): ?string
    {
        try {
            $textElements = $parentCrawler->filter('p, div, span');
            foreach ($textElements as $element) {
                $text = trim($element->textContent);
                if (!empty($text) && strlen($text) > 10 && strlen($text) < 200) {
                    return $text;
                }
            }
        } catch (\Exception $e) {
        }
        
        return null;
    }

    protected function extractProjectInfo(Crawler $node, Crawler $crawler): array
    {
        $info = [];
        
        try {
            $current = $node->getNode(0);
            while ($current && $current->parentNode) {
                $current = $current->parentNode;
                $currentCrawler = new Crawler($current);
                
                $title = $currentCrawler->filter('h1, h2, h3, h4, h5, h6, [class*="title"]')->first();
                if ($title->count() > 0) {
                    $titleText = trim($title->text());
                    if (!empty($titleText)) {
                        $info['project_title'] = $titleText;
                        break;
                    }
                }
            }
        } catch (\Exception $e) {
        }
        
        return $info;
    }

    protected function extractProjectSection(Crawler $node): ?array
    {
        try {
            $title = $node->filter('h1, h2, h3, h4, h5, h6, [class*="title"]')->first();
            $videos = [];
            
            $videoElements = $node->filter('iframe[src*="youtube"], iframe[src*="vimeo"], a[href*="youtube"], a[href*="vimeo"], video');
            $videoElements->each(function (Crawler $videoNode) use (&$videos) {
                $videoData = $this->extractVideoData($videoNode);
                if ($videoData) {
                    $videos[] = $videoData;
                }
            });
            
            if (!empty($videos) || $title->count() > 0) {
                return [
                    'name' => $title->count() > 0 ? trim($title->text()) : 'Project',
                    'videos' => $videos,
                    'description' => $this->extractNearbyText($node)
                ];
            }
        } catch (\Exception $e) {
        }
        
        return null;
    }

    protected function groupVideosByProximity(Crawler $crawler, array $clientNames, array $videos): array
    {
        $clients = [];
        
        foreach ($clientNames as $clientName) {
            $clientVideos = [];
            
            foreach ($videos as $video) {
                if (isset($video['section_title']) && 
                    str_contains(strtolower($video['section_title']), strtolower($clientName))) {
                    $clientVideos[] = $video;
                }
            }
            
            $clients[] = [
                'name' => $clientName,
                'videos' => $clientVideos,
                'description' => "Video projects for {$clientName}"
            ];
        }
        
        return $clients;
    }

    protected function extractSkills(Crawler $crawler): array
    {
        $skills = [];
        
        $skillSelectors = [
            '[class*="skill"]',
            '[class*="tag"]',
            '[class*="expertise"]',
            '[class*="service"]'
        ];
        
        foreach ($skillSelectors as $selector) {
            try {
                $elements = $crawler->filter($selector);
                $elements->each(function (Crawler $node) use (&$skills) {
                    $text = trim($node->text());
                    if (!empty($text) && strlen($text) < 50) {
                        $skills[] = $text;
                    }
                });
                
                if (!empty($skills)) break;
            } catch (\Exception $e) {
                continue;
            }
        }
        
        return array_unique($skills);
    }

    protected function extractDescription(Crawler $crawler): ?string
    {
        $descriptionSelectors = [
            '[class*="about"]',
            '[class*="description"]',
            '[class*="bio"]',
            'p'
        ];
        
        foreach ($descriptionSelectors as $selector) {
            try {
                $element = $crawler->filter($selector)->first();
                if ($element->count() > 0) {
                    $text = trim($element->text());
                    if (!empty($text) && strlen($text) > 20) {
                        return $text;
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }
        
        return null;
    }

    protected function extractContactInfo(Crawler $crawler): array
    {
        $contact = [];
        
        $emailPattern = '/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/';
        preg_match($emailPattern, $crawler->text(), $emailMatches);
        if (!empty($emailMatches)) {
            $contact['email'] = $emailMatches[1];
        }
        
        $socialLinks = $crawler->filter('a[href*="instagram"], a[href*="twitter"], a[href*="linkedin"], a[href*="facebook"]');
        $socialLinks->each(function (Crawler $node) use (&$contact) {
            $href = $node->attr('href');
            if (str_contains($href, 'instagram')) {
                $contact['instagram'] = $href;
            } elseif (str_contains($href, 'twitter')) {
                $contact['twitter'] = $href;
            } elseif (str_contains($href, 'linkedin')) {
                $contact['linkedin'] = $href;
            }
        });
        
        return $contact;
    }

    protected function looksLikeClientName(string $text): bool
    {
        $text = strtolower(trim($text));
        
        $skipWords = ['video', 'work', 'portfolio', 'projects', 'about', 'contact', 'home', 'services', 'gallery', 'showcase'];
        foreach ($skipWords as $word) {
            if (str_contains($text, $word)) return false;
        }
        
        if (preg_match('/\b(inc|ltd|llc|corp|company|agency|studio|productions?|films?|media|creative|design)\b/i', $text)) {
            return true;
        }
        
        return strlen($text) >= 2 && strlen($text) <= 50 && 
               !str_contains($text, 'click') && 
               !str_contains($text, 'watch') &&
               !is_numeric($text);
    }

    protected function extractClientsFromText(Crawler $crawler): array
    {
        $clients = [];
        $textContent = $crawler->text();
        
        preg_match_all('/\b([A-Z][a-z]+ ?(?:[A-Z][a-z]*)* ?(?:Inc|Ltd|LLC|Corp|Company|Agency|Studio|Productions?|Films?|Media|Creative|Design))\b/', $textContent, $matches);
        
        if (!empty($matches[1])) {
            foreach (array_slice(array_unique($matches[1]), 0, 5) as $clientName) {
                $clients[] = [
                    'name' => $clientName,
                    'videos' => [],
                    'description' => "Client work for {$clientName}"
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
        } elseif (str_contains($videoUrl, 'vimeo.com')) {
            preg_match('/vimeo\.com\/(\d+)/', $videoUrl, $matches);
            if (isset($matches[1])) {
                return "https://vumbnail.com/{$matches[1]}.jpg";
            }
        }
        
        return null;
    }
}