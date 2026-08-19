import React from 'react';
import { toolsData } from '../data/toolsData';
import { 
  Calculator, 
  Home, 
  IndianRupee, 
  TrendingUp, 
  ShieldCheck, 
  FileText,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  Calculator: Calculator,
  Home: Home,
  IndianRupee: IndianRupee,
  TrendingUp: TrendingUp,
  ShieldCheck: ShieldCheck,
  FileText: FileText
};

export default function PopularTools({ onSelectTool }) {
  return (
    <section className="section-card" id="popular-tools">
      <div className="section-header">
        <h2 className="section-title">Popular Tools</h2>
        <a href="#popular-tools" className="view-all-link">
          View All Tools <ArrowRight size={16} />
        </a>
      </div>

      <div className="tools-grid">
        {toolsData.map((tool) => {
          const IconComp = iconMap[tool.icon] || Calculator;
          return (
            <div 
              key={tool.id} 
              className="tool-card" 
              onClick={() => onSelectTool(tool)}
              role="button"
              tabIndex={0}
            >
              <div 
                className="tool-icon-wrapper" 
                style={{ backgroundColor: tool.bg, color: tool.color }}
              >
                <IconComp size={22} />
              </div>

              <h3 className="tool-title">{tool.title}</h3>
              <p className="tool-desc">{tool.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
