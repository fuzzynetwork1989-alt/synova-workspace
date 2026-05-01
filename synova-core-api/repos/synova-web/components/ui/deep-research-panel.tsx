import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassInput } from '@/components/ui/glass-input';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { 
  Search, 
  BookOpen, 
  Globe, 
  Database, 
  Filter, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Clock, 
  Users, 
  Calendar, 
  BarChart3, 
  PieChart, 
  Target, 
  Zap, 
  Award, 
  Shield, 
  Eye, 
  Download, 
  Upload, 
  RefreshCw, 
  Settings, 
  MoreVertical, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Minus, 
  X, 
  Copy, 
  ExternalLink, 
  FileText, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  BookmarkPlus, 
  BookmarkMinus, 
  Tag, 
  Hash, 
  AtSign, 
  DollarSign, 
  Euro, 
  PoundSterling, 
  Yen, 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  LineChart, 
  PieChart, 
  AreaChart, 
  ScatterChart, 
  Calendar, 
  CalendarDays, 
  Clock, 
  Timer, 
  Stopwatch, 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Umbrella, 
  Wind, 
  Thermometer, 
  Gauge, 
  Tachometer, 
  Speedometer, 
  Compass, 
  Navigation, 
  Map, 
  Globe, 
  Earth, 
  Planet, 
  Star, 
  Sun, 
  Moon, 
  Rocket, 
  Plane, 
  Car, 
  Train, 
  Ship, 
  Bike, 
  Walk, 
  Run, 
  Heart, 
  HeartHandshake, 
  Users, 
  UserPlus, 
  UserMinus, 
  UserCheck, 
  UserX, 
  UserCircle, 
  UserSquare, 
  Building, 
  Building2, 
  Home, 
  HomeIcon, 
  Office, 
  Factory, 
  Store, 
  Shop, 
  ShoppingCart, 
  ShoppingBag, 
  Package, 
  Box, 
  Archive, 
  File, 
  FileText, 
  FilePlus, 
  FileMinus, 
  FileX, 
  FileCheck, 
  FileSearch, 
  FileQuestion, 
  FileWarning, 
  FileHeart, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileCode, 
  FileSpreadsheet, 
  FilePresentation, 
  FileArchive, 
  FileSignature, 
  FileLock, 
  FileUnlock, 
  FileKey, 
  FileDatabase, 
  FileCloud, 
  FileDownload, 
  FileUpload, 
  FileSymlink, 
  FileCopy, 
  FilePaste, 
  FileCut, 
  FileEdit, 
  FilePlus2, 
  FileMinus2, 
  FileX2, 
  FileCheck2, 
  FileSearch2, 
  FileQuestion2, 
  FileWarning2, 
  FileHeart2, 
  FileImage2, 
  FileVideo2, 
  FileAudio2, 
  FileCode2, 
  FileSpreadsheet2, 
  FilePresentation2, 
  FileArchive2, 
  FileSignature2, 
  FileLock2, 
  FileUnlock2, 
  FileKey2, 
  FileDatabase2, 
  FileCloud2, 
  FileDownload2, 
  FileUpload2, 
  FileSymlink2, 
  FileCopy2, 
  FilePaste2, 
  FileCut2, 
  FileEdit2, 
  FilePlus3, 
  FileMinus3, 
  FileX3, 
  FileCheck3, 
  FileSearch3, 
  FileQuestion3, 
  FileWarning3, 
  FileHeart3, 
  FileImage3, 
  FileVideo3, 
  FileAudio3, 
  FileCode3, 
  FileSpreadsheet3, 
  FilePresentation3, 
  FileArchive3, 
  FileSignature3, 
  FileLock3, 
  FileUnlock3, 
  FileKey3, 
  FileDatabase3, 
  FileCloud3, 
  FileDownload3, 
  FileUpload3, 
  FileSymlink3, 
  FileCopy3, 
  FilePaste3, 
  FileCut3, 
  FileEdit3
} from 'lucide-react';

interface ResearchSource {
  id: string;
  title: string;
  content: string;
  url: string;
  source_type: string;
  credibility_score: number;
  relevance_score: number;
  publication_date?: string;
  authors?: string[];
  journal?: string;
  doi?: string;
  abstract?: string;
  keywords?: string[];
  citations?: number;
  peer_reviewed?: boolean;
  open_access?: boolean;
  language?: string;
}

interface ResearchResult {
  query: string;
  synthesis: {
    key_findings: string[];
    themes: string[];
    consensus_points: string[];
    controversies: string[];
    knowledge_gaps: string[];
    confidence_level: number;
  };
  insights: string[];
  sources: ResearchSource[];
  statistics: {
    total_sources: number;
    credible_sources: number;
    highly_relevant: number;
    peer_reviewed: number;
    processing_time: number;
    search_strategy: string;
  };
  quality_metrics: {
    average_credibility: number;
    average_relevance: number;
    coverage_score: number;
    fact_check_score: number;
  };
  recommendations: string[];
  limitations: string[];
  engine_version: string;
  timestamp: string;
}

export function DeepResearchPanel() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'comprehensive' | 'academic' | 'news'>('comprehensive');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResearchResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minCredibility, setMinCredibility] = useState(0.5);
  const [maxResults, setMaxResults] = useState(50);
  const [includePeerReviewed, setIncludePeerReviewed] = useState(true);
  const [includeOpenAccess, setIncludeOpenAccess] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [showSources, setShowSources] = useState(false);
  const [showSynthesis, setShowSynthesis] = useState(true);
  const [showInsights, setShowInsights] = useState(true);
  const [showQualityMetrics, setShowQualityMetrics] = useState(false);

  const searchTypes = [
    { id: 'comprehensive', name: 'Comprehensive', icon: <Database className="w-4 h-4" />, description: 'All sources' },
    { id: 'academic', name: 'Academic', icon: <BookOpen className="w-4 h-4" />, description: 'Peer-reviewed sources' },
    { id: 'news', name: 'News', icon: <Globe className="w-4 h-4" />, description: 'Current events' },
  ];

  const sortOptions = [
    { id: 'relevance', name: 'Relevance' },
    { id: 'date', name: 'Publication Date' },
    { id: 'credibility', name: 'Credibility' },
    { id: 'citations', name: 'Citations' },
  ];

  const performResearch = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setResults(null);

    try {
      const endpoint = searchType === 'academic' 
        ? '/api/v1/deep_research/academic'
        : searchType === 'news'
        ? '/api/v1/deep_research/news'
        : '/api/v1/deep_research/search';

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          min_credibility: minCredibility,
          max_results: maxResults,
          include_peer_reviewed: includePeerReviewed,
          include_open_access: includeOpenAccess,
          sort_by: sortBy,
          research_depth: 'comprehensive',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform research');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Research error:', error);
      alert('Failed to perform research. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-blue-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return <BookOpen className="w-4 h-4" />;
      case 'news': return <Globe className="w-4 h-4" />;
      case 'web': return <Search className="w-4 h-4" />;
      case 'specialized': return <Database className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatProcessingTime = (time: number) => {
    return `${(time * 1000).toFixed(0)}ms`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold synova-gradient-text mb-2">
              🔬 Deep Research Engine
            </h2>
            <p className="text-muted-foreground">
              Advanced research capabilities that exceed Perplexity and other research tools
            </p>
          </div>
          <div className="flex items-center gap-2">
            <GlassButton
              variant={showAdvanced ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </GlassButton>
          </div>
        </div>

        {/* Search Type Selection */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium">Search Type:</span>
          <div className="flex gap-2">
            {searchTypes.map((type) => (
              <GlassButton
                key={type.id}
                variant={searchType === type.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchType(type.id as any)}
              >
                {type.icon}
                <span className="ml-1">{type.name}</span>
              </GlassButton>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-4">
          <GlassInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your research query..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && performResearch()}
          />
          <GlassButton
            onClick={performResearch}
            disabled={!query.trim() || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </GlassButton>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Credibility</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={minCredibility}
                onChange={(e) => setMinCredibility(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-muted-foreground">{(minCredibility * 100).toFixed(0)}%</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Results</label>
              <input
                type="number"
                min="10"
                max="100"
                step="10"
                value={maxResults}
                onChange={(e) => setMaxResults(parseInt(e.target.value))}
                className="w-full px-2 py-1 rounded border border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-2 py-1 rounded border border-border bg-background"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includePeerReviewed}
                  onChange={(e) => setIncludePeerReviewed(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Peer Reviewed Only</span>
              </label>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeOpenAccess}
                  onChange={(e) => setIncludeOpenAccess(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Open Access Only</span>
              </label>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Statistics */}
          <GlassCard variant="compact" className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {results.statistics.total_sources}
                </div>
                <div className="text-sm text-muted-foreground">Total Sources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {results.statistics.credible_sources}
                </div>
                <div className="text-sm text-muted-foreground">Credible Sources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {results.statistics.peer_reviewed}
                </div>
                <div className="text-sm text-muted-foreground">Peer Reviewed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatProcessingTime(results.statistics.processing_time)}
                </div>
                <div className="text-sm text-muted-foreground">Processing Time</div>
              </div>
            </div>
          </GlassCard>

          {/* View Toggles */}
          <GlassCard variant="compact" className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Show:</span>
              <GlassButton
                variant={showSynthesis ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowSynthesis(!showSynthesis)}
              >
                <Target className="w-3 h-3 mr-1" />
                Synthesis
              </GlassButton>
              <GlassButton
                variant={showInsights ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowInsights(!showInsights)}
              >
                <Zap className="w-3 h-3 mr-1" />
                Insights
              </GlassButton>
              <GlassButton
                variant={showSources ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowSources(!showSources)}
              >
                <Database className="w-3 h-3 mr-1" />
                Sources ({results.statistics.total_sources})
              </GlassButton>
              <GlassButton
                variant={showQualityMetrics ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowQualityMetrics(!showQualityMetrics)}
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Quality Metrics
              </GlassButton>
            </div>
          </GlassCard>

          {/* Synthesis */}
          {showSynthesis && (
            <GlassCard variant="elevated" className="p-6">
              <h3 className="text-lg font-bold mb-4">Research Synthesis</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Findings</h4>
                  <ul className="space-y-1">
                    {results.synthesis.key_findings.map((finding, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.synthesis.themes.map((theme, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {theme}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Consensus Points</h4>
                  <ul className="space-y-1">
                    {results.synthesis.consensus_points.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ThumbsUp className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {results.synthesis.controversies.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Controversies</h4>
                    <ul className="space-y-1">
                      {results.synthesis.controversies.map((controversy, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                          <span className="text-sm">{controversy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.synthesis.knowledge_gaps.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Knowledge Gaps</h4>
                    <ul className="space-y-1">
                      {results.synthesis.knowledge_gaps.map((gap, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-gray-500 mt-0.5" />
                          <span className="text-sm">{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Confidence Level:</span>
                    <span className="text-sm font-bold text-green-600">
                      {(results.synthesis.confidence_level * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Insights */}
          {showInsights && (
            <GlassCard variant="elevated" className="p-6">
              <h3 className="text-lg font-bold mb-4">Research Insights</h3>
              <div className="space-y-3">
                {results.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm">{insight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Sources */}
          {showSources && (
            <GlassCard variant="elevated" className="p-6">
              <h3 className="text-lg font-bold mb-4">Research Sources</h3>
              <div className="space-y-4">
                {results.sources.map((source, index) => (
                  <div key={source.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSourceTypeIcon(source.source_type)}
                        <h4 className="font-semibold">{source.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`font-medium ${getCredibilityColor(source.credibility_score)}`}>
                          {(source.credibility_score * 100).toFixed(0)}%
                        </span>
                        {source.peer_reviewed && (
                          <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            Peer Reviewed
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {source.abstract || source.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {source.authors && source.authors.length > 0 && (
                          <span>{source.authors.slice(0, 2).join(', ')}{source.authors.length > 2 ? ' et al.' : ''}</span>
                        )}
                        {source.journal && (
                          <span>{source.journal}</span>
                        )}
                        {source.publication_date && (
                          <span>{new Date(source.publication_date).getFullYear()}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Quality Metrics */}
          {showQualityMetrics && (
            <GlassCard variant="elevated" className="p-6">
              <h3 className="text-lg font-bold mb-4">Quality Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Average Credibility:</span>
                    <span className="text-sm font-bold text-green-600">
                      {(results.quality_metrics.average_credibility * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Average Relevance:</span>
                    <span className="text-sm font-bold text-blue-600">
                      {(results.quality_metrics.average_relevance * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Coverage Score:</span>
                    <span className="text-sm font-bold text-purple-600">
                      {(results.quality_metrics.coverage_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Fact Check Score:</span>
                    <span className="text-sm font-bold text-orange-600">
                      {(results.quality_metrics.fact_check_score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Recommendations */}
          <GlassCard variant="elevated" className="p-6">
            <h3 className="text-lg font-bold mb-4">Recommendations</h3>
            <div className="space-y-2">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Limitations */}
          {results.limitations.length > 0 && (
            <GlassCard variant="elevated" className="p-6">
              <h3 className="text-lg font-bold mb-4">Limitations</h3>
              <div className="space-y-2">
                {results.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <span className="text-sm">{limitation}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <GlassCard variant="elevated" className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Search className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold">Research in Progress</h3>
            <p className="text-muted-foreground">
              Analyzing sources and synthesizing findings...
            </p>
            <div className="space-y-2">
              <LoadingSkeleton className="h-2 w-full" />
              <LoadingSkeleton className="h-2 w-3/4" />
              <LoadingSkeleton className="h-2 w-1/2" />
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
