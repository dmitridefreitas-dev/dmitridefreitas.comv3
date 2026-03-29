'use client';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import MagneticButton from '@/components/effects/MagneticButton';
import { ExternalLink, Code, FileText } from 'lucide-react';

export default function ProjectDetailModal({ project, isOpen, onClose }) {
  if (!project) return null;

  const description = project.longDescription || project.technicalDescription || project.simpleDescription || project.shortDescription;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3 mb-1">
            {project.isPaper && (
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-white bg-accent px-2 py-1 rounded flex-shrink-0 mt-0.5">
                Published
              </span>
            )}
            <DialogTitle className="text-xl font-serif leading-tight">{project.title}</DialogTitle>
          </div>
          {project.journal && (
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mt-1">
              {project.journal}
            </p>
          )}
          <DialogDescription className="text-sm mt-3 leading-relaxed text-foreground/80">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-2">
              Methods &amp; Tools
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(project.tech || project.techStack || []).map((tech, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Metrics */}
          {project.metrics && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-2">
                Key Findings
              </h4>
              <ul className="space-y-2">
                {project.metrics.map((metric, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                    <span className="text-sm text-muted">
                      {typeof metric === 'string' ? metric : `${metric.label}: ${metric.value}`}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Data Sources / Context */}
          {project.dataSources && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-2">
                Context &amp; Data
              </h4>
              <ul className="space-y-1.5">
                {project.dataSources.map((source, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted/40 mt-2 shrink-0" />
                    <span className="text-xs text-muted">{source}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.reportLink && project.reportLink !== '#' && (
              <MagneticButton
                variant="default"
                size="sm"
                href={project.reportLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="h-3.5 w-3.5" />
                View Report
              </MagneticButton>
            )}
            {project.pdfLink && (
              <MagneticButton
                variant="outline"
                size="sm"
                href={project.pdfLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View PDF
              </MagneticButton>
            )}
            {project.codeLink && project.codeLink !== '#' && (
              <MagneticButton
                variant="ghost"
                size="sm"
                href={project.codeLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code className="h-3.5 w-3.5" />
                GitHub
              </MagneticButton>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
