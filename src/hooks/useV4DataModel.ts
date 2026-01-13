import { useMemo } from 'react';
import { useV3DataModel } from './useV3DataModel';
import { getMissionsV4 } from '@/data/mockDataV4';
import { computeSpecificationImpact, findOrphanedChanges } from '@/utils/costAttribution';
import type { Mission, SpecificationImpact } from '@/types';

/**
 * V4 Data Model Hook
 *
 * Extends useV3DataModel with V4 specification traceability features:
 * - Computes specification impact for all missions
 * - Tracks orphaned changes across missions
 * - Provides V4-enhanced mission data
 *
 * @returns V3 data + V4 enhancements
 */
export function useV4DataModel() {
  const v3Data = useV3DataModel();

  // Get V4-enhanced missions (with pre-computed impacts for demo missions)
  const v4Missions = useMemo(() => getMissionsV4(), []);

  // Compute specification impact for all missions (memoized)
  const missionsWithImpact = useMemo(() => {
    return v4Missions.map(mission => {
      // If mission already has specificationImpact (from mockDataV4), use it
      if (mission.specificationImpact) {
        return mission;
      }

      // Otherwise, compute it on-the-fly
      return {
        ...mission,
        specificationImpact: computeSpecificationImpact(mission)
      };
    });
  }, [v4Missions]);

  // Helper: Get mission with guaranteed impact data
  const getMissionWithImpact = (missionId: string): Mission | undefined => {
    return missionsWithImpact.find(m => m.id === missionId);
  };

  // Helper: Get all orphaned changes across all missions
  const getAllOrphanedChanges = useMemo(() => {
    return missionsWithImpact.flatMap(m =>
      m.specificationImpact?.orphanedChanges || []
    );
  }, [missionsWithImpact]);

  // Count unresolved orphans (no resolution strategy set)
  const unresolvedOrphansCount = useMemo(() => {
    return getAllOrphanedChanges.filter(c => !c.orphanResolution).length;
  }, [getAllOrphanedChanges]);

  // V4-specific stats
  const v4Stats = useMemo(() => {
    const stats = {
      totalCriteria: 0,
      completedCriteria: 0,
      verifiedCriteria: 0,
      totalCost: 0,
      totalOrphanedChanges: getAllOrphanedChanges.length,
      unresolvedOrphans: unresolvedOrphansCount,
      missionsWithSpecs: missionsWithImpact.filter(m => m.specificationImpact).length
    };

    missionsWithImpact.forEach(mission => {
      if (mission.specificationImpact) {
        stats.totalCriteria += mission.specificationImpact.totalCriteria;
        stats.completedCriteria += mission.specificationImpact.completedCriteria;
        stats.verifiedCriteria += mission.specificationImpact.verifiedCriteria;
        stats.totalCost += mission.specificationImpact.totalCost;
      }
    });

    return stats;
  }, [missionsWithImpact, getAllOrphanedChanges, unresolvedOrphansCount]);

  return {
    // Inherit all V3 data
    ...v3Data,

    // Override missions with V4-enhanced versions
    missions: missionsWithImpact,

    // V4-specific helpers
    getMissionWithImpact,
    getAllOrphanedChanges: () => getAllOrphanedChanges,

    // V4-specific stats
    totalOrphanedChanges: v4Stats.totalOrphanedChanges,
    unresolvedOrphans: v4Stats.unresolvedOrphans,

    // Computed V4 stats
    v4Stats
  };
}

/**
 * Type for V4 data model return value
 */
export type V4DataModel = ReturnType<typeof useV4DataModel>;
