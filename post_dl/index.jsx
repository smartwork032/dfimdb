import React, { useState, useEffect } from 'react';
import { Copy, Check, Film, Download, Link as LinkIcon, Server, Cloud, Video, FileArchive, Globe, Edit2 } from 'lucide-react';

// Configuration for the link fields
const LINK_FIELDS = [
  { key: 'gworkers', label: 'G-Workers', icon: Server, buttonId: '1', buttonText: 'G-Workers' },
  { key: 'gdrive', label: 'G-Drive (Login)', icon: Cloud, buttonId: '2', buttonText: '' }, 
  { key: 'hubcloud', label: 'HubCloud', icon: Cloud, buttonId: '3', buttonText: 'HubCloud(Fast-Server)' },
  { key: 'dood', label: 'DoodStream', icon: Video, buttonId: '4', buttonText: '' }, 
  { key: 'filebee', label: 'FileBee', icon: FileArchive, buttonId: '3', buttonText: 'FileBee(Fast-Server)' },
  { key: 'ocd', label: 'One Click Download', icon: Download, buttonId: '7', buttonText: '' }, 
  { key: 'drop', label: 'Drop.Download', icon: Download, buttonId: '3', buttonText: 'Drop.Download' },
  { key: 'other', label: 'Other Download', icon: LinkIcon, buttonId: '5', buttonText: 'Other Download Links' },
];

const RESOLUTIONS = ['480p', '720p', '1080p'];

// Helper to generate the WordPress shortcode string
const generateShortcode = (resolution, title, links) => {
  const currentLinks = links[resolution];
  
  return LINK_FIELDS.map(field => {
    // Access url from the object state
    const linkData = currentLinks[field.key];
    let url = linkData.url || '';
    const labelText = linkData.label || '';
    
    // Apply the specific domain replacement logic from the original script
    if (field.key === 'filebee' && url) {
      url = url.replace("filepress.sbs", "gdpress.lol");
    }

    if (!url) return ''; // Don't generate button if link is empty

    // Construct the shortcode using the editable label text
    const textPart = labelText ? ` text="${labelText}"` : '';
    return `<p style="text-align: center;">[maxbutton id="${field.buttonId}" url="${url}"${textPart} ]</p>`;
  }).filter(line => line !== '').join('');
};

const ResolutionCard = ({ resolution, links, onLinkChange, postTitle }) => {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  const generatedContent = generateShortcode(resolution, postTitle, links);
  const generatedTitle = postTitle ? `${postTitle} ${resolution}` : '';

  const handleCopy = (text, setCopied) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Count active links (where url is not empty)
  const activeLinkCount = Object.values(links[resolution]).filter(l => l.url).length;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <Film className="w-5 h-5" />
          {resolution} Links
        </h2>
        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
          {activeLinkCount} Links
        </span>
      </div>

      {/* Inputs Scrollable Area */}
      <div className="p-4 space-y-4 flex-grow overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {LINK_FIELDS.map((field) => (
          <div key={field.key} className="group">
            {/* Editable Label Header */}
            <div className="flex items-center gap-2 mb-1.5">
              <field.icon className="w-3 h-3 text-slate-400" />
              <input 
                type="text"
                value={links[resolution][field.key].label}
                onChange={(e) => onLinkChange(resolution, field.key, 'label', e.target.value)}
                className="bg-transparent border-none p-0 text-xs font-medium text-slate-300 focus:text-blue-400 focus:ring-0 w-full placeholder-slate-600 hover:text-white transition-colors"
                placeholder="Button Label"
                title="Edit this text to change the button label in the generated code"
              />
              <Edit2 className="w-2.5 h-2.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* URL Input */}
            <div className="relative">
              <input
                type="text"
                value={links[resolution][field.key].url}
                onChange={(e) => onLinkChange(resolution, field.key, 'url', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                placeholder={`Paste ${field.label} URL...`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Outputs Section */}
      <div className="bg-slate-900 p-4 border-t border-slate-700 space-y-4">
        
        {/* Generated Title Output */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Title</span>
            <button
              onClick={() => handleCopy(generatedTitle, setCopiedTitle)}
              className="text-slate-400 hover:text-white transition-colors p-1"
              title="Copy Title"
            >
              {copiedTitle ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="bg-slate-800 rounded p-2 text-sm text-slate-300 font-mono truncate border border-slate-700">
            {generatedTitle || <span className="text-slate-600 italic">Enter Post Title...</span>}
          </div>
        </div>

        {/* Generated Content Output */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Code</span>
            <button
              onClick={() => handleCopy(generatedContent, setCopiedContent)}
              className="text-slate-400 hover:text-white transition-colors p-1"
              title="Copy Code"
            >
              {copiedContent ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <textarea
            readOnly
            value={generatedContent}
            className="w-full h-32 bg-slate-800 border border-slate-700 rounded p-2 text-xs font-mono text-blue-300 focus:outline-none resize-none scrollbar-thin scrollbar-thumb-slate-600"
            placeholder="Shortcodes will appear here..."
          />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [postTitle, setPostTitle] = useState('');
  
  // Initialize state helper
  const getInitialState = () => {
    const initialLinks = {};
    RESOLUTIONS.forEach(res => {
      initialLinks[res] = {};
      LINK_FIELDS.forEach(field => {
        // Initialize with both URL and Label (defaulting label to buttonText or field label)
        initialLinks[res][field.key] = {
          url: '',
          label: field.buttonText || field.label
        };
      });
    });
    return initialLinks;
  };

  // State structure: { '480p': { gworkers: { url: '', label: '...' }, ... }, ... }
  const [links, setLinks] = useState(getInitialState);

  const handleLinkChange = (resolution, key, field, value) => {
    setLinks(prev => {
      // If updating a label, apply changes to ALL resolutions to keep them in sync
      if (field === 'label') {
        const updatedLinks = { ...prev };
        RESOLUTIONS.forEach(res => {
          updatedLinks[res] = {
            ...updatedLinks[res],
            [key]: {
              ...updatedLinks[res][key],
              label: value
            }
          };
        });
        return updatedLinks;
      }

      // If updating a URL, only apply to the specific resolution
      return {
        ...prev,
        [resolution]: {
          ...prev[resolution],
          [key]: {
            ...prev[resolution][key],
            [field]: value
          }
        }
      };
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all fields?")) {
      setPostTitle('');
      setLinks(getInitialState());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent inline-flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-500" />
            DudeFilms Link Generator
          </h1>
          <p className="text-slate-500">Streamline your WordPress post creation workflow</p>
        </div>

        {/* Global Controls */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow w-full">
              <label htmlFor="post-title" className="block text-sm font-medium text-slate-400 mb-2 ml-1">
                Movie / Post Title
              </label>
              <input
                id="post-title"
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder-slate-600"
                placeholder="e.g. Spider-Man: No Way Home (2021)"
              />
            </div>
            <button 
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 border border-slate-700 transition-all font-medium whitespace-nowrap"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Grid Layout for Resolutions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESOLUTIONS.map(res => (
            <ResolutionCard 
              key={res} 
              resolution={res} 
              links={links} 
              onLinkChange={handleLinkChange}
              postTitle={postTitle}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 pb-4 text-slate-600 text-sm border-t border-slate-900 mt-12">
          <p>
            Script Redesigned for <a href="https://dudefilms.in" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">DudeFilms</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
