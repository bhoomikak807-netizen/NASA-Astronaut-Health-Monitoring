import React, { useState, useEffect } from 'react';
import {
  Database,
  ExternalLink,
  Search,
  Shield,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Radio,
} from 'lucide-react';
import { VERIFIED_DATASETS, searchNasaImages, NasaImageItem } from '../services/nasaService';

export const Research: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<string>(VERIFIED_DATASETS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('astronaut spacewalk');
  const [images, setImages] = useState<NasaImageItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<NasaImageItem | null>(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const results = await searchNasaImages(searchQuery);
      setImages(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const current = VERIFIED_DATASETS.find((d) => d.id === selectedDataset) || VERIFIED_DATASETS[0];

  return (
    <div className="min-h-screen pt-28 pb-20 text-[#F8FAFC]">
      {/* Page Header */}
      <section className="relative py-16 tech-grid border-b border-[#1E2D44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#58C7FF]/10 text-[#58C7FF] border border-[#58C7FF]/30 inline-block">
            Scientific Provenance & APIs
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
            Open Space Science. Intelligent Research.
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-3xl mx-auto leading-relaxed">
            ASTRA-SENTINEL AI explores publicly available space science datasets and APIs to support research,
            visualization, and prototype development.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* External Data Source Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display text-[#F8FAFC]">Integrated Open Space Science Datasets</h2>
            <span className="text-xs font-mono text-[#58C7FF]">4 SCIENTIFIC SOURCES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VERIFIED_DATASETS.map((ds) => (
              <div
                key={ds.id}
                onClick={() => setSelectedDataset(ds.id)}
                className={`space-card rounded-2xl p-6 border cursor-pointer transition-all ${
                  selectedDataset === ds.id
                    ? 'border-[#58C7FF] shadow-[0_0_20px_rgba(88,199,255,0.2)]'
                    : 'border-[#1E2D44] hover:border-[#58C7FF]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[#58C7FF]">{ds.source}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                      ds.integrationStatus === 'Connected'
                        ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                        : ds.integrationStatus === 'Available for integration'
                        ? 'bg-[#58C7FF]/20 text-[#58C7FF] border-[#58C7FF]/40'
                        : 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40'
                    }`}
                  >
                    STATUS: {ds.integrationStatus}
                  </span>
                </div>

                <h3 className="text-base font-bold font-display text-[#F8FAFC]">{ds.title}</h3>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{ds.description}</p>

                <div className="mt-4 pt-3 border-t border-[#1E2D44] text-xs font-mono space-y-1">
                  <div className="text-[#58C7FF]">Use: {ds.useCase}</div>
                  <div className="text-[#64748B]">Data Format: {ds.dataType}</div>
                </div>

                <div className="mt-4 pt-2 flex items-center justify-between text-xs font-mono">
                  <a
                    href={ds.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#94A3B8] hover:text-[#58C7FF] flex items-center gap-1 transition-colors"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={ds.apiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#94A3B8] hover:text-[#58C7FF] flex items-center gap-1 transition-colors"
                  >
                    <span>API Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Provenance & Verification Architecture */}
        <div className="space-card rounded-2xl p-8 border border-[#1E2D44]">
          <h2 className="text-2xl font-bold font-display text-[#F8FAFC] mb-4">Data Provenance Framework</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs text-[#94A3B8]">
            <div className="p-4 rounded-xl bg-[#05070D] border border-[#1E2D44]">
              <span className="text-[#58C7FF] block font-bold mb-2">ORIGIN</span>
              <p>NASA Open Science Data Repository (OSDR), NASA GSFC DONKI, NASA FIRMS, and NASA Images API.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#05070D] border border-[#1E2D44]">
              <span className="text-[#8B5CF6] block font-bold mb-2">RETRIEVAL</span>
              <p>Direct REST HTTPS requests with backend JSON normalization and local offline caching fallbacks.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#05070D] border border-[#1E2D44]">
              <span className="text-[#F59E0B] block font-bold mb-2">DATA CLASSIFICATION</span>
              <p>Explicitly tagged as Live API, Historical Scientific Reference, or Synthetic Telemetry.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#05070D] border border-[#1E2D44]">
              <span className="text-[#10B981] block font-bold mb-2">PLATFORM UTILIZATION</span>
              <p>Validates anomaly thresholds against documented human spaceflight physiological studies.</p>
            </div>
          </div>

          {/* Mandatory Disclaimer Callout */}
          <div className="mt-8 p-4 rounded-xl bg-[#0A101B] border border-[#58C7FF]/30 flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#58C7FF] shrink-0 mt-0.5" />
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              <strong className="text-[#F8FAFC]">Research Disclaimer:</strong> External scientific datasets support research and visualization.
              They are not substitutes for operational spacecraft telemetry or validated astronaut medical monitoring.
            </p>
          </div>
        </div>

        {/* Live Interactive NASA Image and Video Library Explorer */}
        <div className="space-card rounded-2xl p-8 border border-[#58C7FF]/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <h2 className="text-2xl font-bold font-display text-[#F8FAFC]">Live NASA Image Library Integration</h2>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                Query the official public NASA Image & Video Library (images-api.nasa.gov) in real time.
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g. astronaut, cupola, ISS..."
                  className="px-3 py-2 pl-8 rounded-lg bg-[#05070D] border border-[#1E2D44] text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#58C7FF]"
                />
                <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-[#58C7FF] text-[#05070D] hover:bg-[#38BDF8] disabled:opacity-50 transition-colors"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className="cursor-pointer rounded-xl bg-[#05070D] border border-[#1E2D44] overflow-hidden group hover:border-[#58C7FF]/50 transition-all"
              >
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-[#F8FAFC]">
                    {img.center}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#58C7FF] transition-colors">
                    {img.title}
                  </h4>
                  <p className="text-[10px] text-[#64748B] font-mono mt-1">{img.dateCreated}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Image Detail Modal */}
          {selectedImage && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="space-card rounded-2xl max-w-2xl w-full p-6 border border-[#58C7FF]/40 relative animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-mono"
                >
                  [CLOSE ✕]
                </button>
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-64 object-cover rounded-xl mb-4"
                />
                <h3 className="text-lg font-bold font-display text-[#F8FAFC]">{selectedImage.title}</h3>
                <div className="flex items-center gap-3 text-xs font-mono text-[#58C7FF] my-2">
                  <span>CENTER: {selectedImage.center}</span>
                  <span>DATE: {selectedImage.dateCreated}</span>
                  <span>ID: {selectedImage.id}</span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed max-h-36 overflow-y-auto">
                  {selectedImage.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
