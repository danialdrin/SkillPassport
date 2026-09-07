import React from 'react';
import { ResourceStatus } from '../../types/resources';
import { Badge } from '../ui/badge';
import { Loader2, CheckCircle2, Eye, Clock } from 'lucide-react';

export interface StatusBadgeProps {
  status: ResourceStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="secondary" className={className}>
          <Clock className="w-3 h-3 mr-1" />
          Not started
        </Badge>
      );
    case 'medium_analyzed':
      return (
        <Badge variant="default" className={className}>
          <Eye className="w-3 h-3 mr-1 text-ink-muted" />
          Reviewed
        </Badge>
      );
    case 'selected':
      return (
        <Badge variant="developing" className={`animate-pulse ${className}`}>
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Analyzing…
        </Badge>
      );
    case 'strong_analyzed':
      return (
        <Badge variant="mastered" className={className}>
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Ready to study
        </Badge>
      );
    default:
      return <Badge variant="outline" className={className}>{status}</Badge>;
  }
};
