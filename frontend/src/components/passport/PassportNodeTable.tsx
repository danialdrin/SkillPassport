import React from 'react';
import { PassportNodeItem } from '../../types/passport';
import { ConceptCompetencyGrid } from './ConceptCompetencyGrid';

export interface PassportNodeTableProps {
  nodes: PassportNodeItem[];
  isLoading?: boolean;
}

export const PassportNodeTable: React.FC<PassportNodeTableProps> = ({ nodes, isLoading = false }) => {
  return <ConceptCompetencyGrid nodes={nodes} isLoading={isLoading} />;
};

