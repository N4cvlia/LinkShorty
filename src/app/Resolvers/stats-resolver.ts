import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { StatsResolveData } from '../Interfaces/stats-resolve-data';
import { inject } from '@angular/core';
import { SupabaseService } from '../Services/supabase';

export const statsResolver: ResolveFn<StatsResolveData> = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<StatsResolveData> => {
  const supabaseService = inject(SupabaseService);
  const token = route.paramMap.get('token');

  if(!token) {
    return { stats: null, error: 'Invalid stats link'};
  }

  try {
    const { data, error} = await supabaseService.getStatsByToken(token);

    return {
      stats: data,
      error: error
    }
  } catch (err) {
    console.error("Resolver errors:", err);
    return {
      stats: null,
      error: "Failed to load statistics"
    }
  }
};
