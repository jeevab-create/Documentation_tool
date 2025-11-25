import React, { useState } from 'react';
import { TemplateSelector } from './components/TemplateSelector';
import { ProjectSetup } from './components/ProjectSetup';
import { ContentBuilder } from './components/ContentBuilder';
import { LivePreview } from './components/LivePreview';
import { GoogleSlidesIntegration } from './utils/GoogleSlidesIntegration';
import { downloadPPT } from './utils/pptGenerator';
import type { ProjectSettings, ProductData, SlideEntry, TemplateStyle } from './types';

const TEMPLATES: TemplateStyle[] = [
  {
    id: 'corporate',
    name: 'Corporate Pro',
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#60a5fa',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    bgPattern: 'corporate'
  },
  {
    id: 'creative',
    name: 'Creative Flow',
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    accent: '#a78bfa',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
    bgPattern: 'creative'
  },
  {
    id: 'modern',
    name: 'Modern Tech',
    primary: '#059669',
    secondary: '#10b981',
    accent: '#34d399',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    bgPattern: 'modern'
  },
  {
    id: 'vibrant',
    name: 'Vibrant Energy',
    primary: '#dc2626',
    secondary: '#ef4444',
    accent: '#f87171',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    bgPattern: 'vibrant'
  }
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [project, setProject] = useState<ProjectSettings>({
    month: 'May',
    year: '2025',
    title: 'Monthly Progress Report',
    templateId: 'corporate'
  });
  const [products, setProducts] = useState<ProductData[]>([]);
  const [showPipeline, setShowPipeline] = useState(false);
  const [pipelineItems, setPipelineItems] = useState<SlideEntry[]>([]);

  const selectedTemplate = TEMPLATES.find(t => t.id === project.templateId) || TEMPLATES[0];

  const handleDownloadPPT = async () => {
    try {
      await downloadPPT(project, products, pipelineItems, selectedTemplate);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to generate presentation. Please try again.');
    }
  };

  const steps = [
    {
      title: 'Template',
      component: <TemplateSelector project={project} setProject={setProject} templates={TEMPLATES} />
    },
    {
      title: 'Setup', 
      component: <ProjectSetup project={project} setProject={setProject} />
    },
    {
      title: 'Content',
      component: (
        <ContentBuilder
          products={products}
          setProducts={setProducts}
          showPipeline={showPipeline}
          setShowPipeline={setShowPipeline}
          pipelineItems={pipelineItems}
          setPipelineItems={setPipelineItems}
        />
      )
    },
    {
      title: 'Preview',
      component: (
        <LivePreview
          project={project}
          products={products}
          pipelineItems={pipelineItems}
          template={selectedTemplate}
        />
      )
    },
    {
      title: 'Export',
      component: (
        <GoogleSlidesIntegration
          project={project}
          products={products}
          pipelineItems={pipelineItems}
          template={selectedTemplate}
          onDownloadPPT={handleDownloadPPT}
        />
      )
    }
  ];

  return (
    <div className="min-h-screen animated-gradient">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl float-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl float-animation" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Progress Header */}
      <header className="relative z-10 glass-effect border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-white font-black text-xl">✨</span>
              </div>
              <h1 className="text-2xl font-black text-white">SlideCraft Pro</h1>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-4">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    index === currentStep
                      ? 'text-white font-bold scale-110'
                      : index < currentStep
                      ? 'text-green-300'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 backdrop-blur-sm ${
                    index === currentStep
                      ? 'bg-white text-purple-600 border-white shadow-lg'
                      : index < currentStep
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white/10 border-white/30'
                  }`}>
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className="font-semibold hidden md:block">{step.title}</span>
                </button>
              ))}
            </div>

            {/* Current Step Info */}
            <div className="text-white/80 font-medium">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          {steps[currentStep].component}
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 glass-effect border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="px-8 py-3 bg-white/20 text-white rounded-2xl font-semibold hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-white/30"
            >
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                className="px-8 py-3 bg-white text-purple-600 rounded-2xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-white"
              >
                Continue
              </button>
            ) : (
              <div className="text-center">
                <p className="text-white/80 mb-2 text-sm">Ready to create amazing presentations?</p>
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setProducts([]);
                    setPipelineItems([]);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Create New Presentation
                </button>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;