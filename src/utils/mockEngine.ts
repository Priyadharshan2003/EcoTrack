import { Activity, useStore } from '../store';

/**
 * Base type for mock input (before system fields are added)
 */
type MockInput = Omit<Activity, 'id' | 'timestamp' | 'status'>;

/**
 * Static mock dataset
 */
const MOCK_DATA: ReadonlyArray<MockInput> = [
  {
    type: 'cab_travel',
    title: 'Uber Ride',
    description: '20 min ride detected',
    confidence: 0.85,
    inferred_from: ['usage_uber', 'location_speed'],
    emissions_kg: 2.4,
  },
  {
    type: 'food_order',
    title: 'Swiggy Delivery',
    description: 'Food delivery detected',
    confidence: 0.92,
    inferred_from: ['usage_swiggy'],
    emissions_kg: 3.0,
  },
  {
    type: 'walk',
    title: 'Walking',
    description: 'Walked 3km',
    confidence: 0.98,
    inferred_from: ['healthkit_pedometer'],
    emissions_kg: 0,
  }
];

/**
 * Constants
 */
const STORAGE_KEY = 'mock_data_initialized';
const ID_PREFIX = 'mock_act';

/**
 * Generate a unique ID (collision-resistant)
 */
function generateId(): string {
  return `${ID_PREFIX}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/**
 * Generate realistic timestamps spaced in the past
 */
function generateTimestamp(offsetMinutes: number): string {
  const date = new Date(Date.now() - offsetMinutes * 60 * 1000);
  return date.toISOString();
}

/**
 * Generate activities dynamically (scalable for testing)
 */
export function generateMockActivities(count: number): Activity[] {
  return Array.from({ length: count }).map((_, index) => ({
    ...MOCK_DATA[index % MOCK_DATA.length],
    id: generateId(),
    status: 'pending',
    timestamp: generateTimestamp(index * 10),
  }));
}

/**
 * Initialize mock data into Zustand store
 */
export function initializeMockData(options?: {
  force?: boolean;
  debug?: boolean;
  count?: number; // override number of activities
}) {
  const { force = false, debug = false, count } = options || {};

  // Restrict to development environments (optional safety)
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    if (debug) console.log('[MockEngine] Skipped in production');
    return;
  }

  const store = useStore.getState();
  const { pendingActivities, verifiedActivities, addPendingActivities } = store;

  const alreadyInitialized =
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined' &&
    window.localStorage.getItem(STORAGE_KEY) === 'true';

  const hasMockData =
    pendingActivities.some(a => a.id.startsWith(ID_PREFIX)) ||
    verifiedActivities.some(a => a.id.startsWith(ID_PREFIX));

  // Skip injection if already done
  if (!force) {
    if (alreadyInitialized) {
      if (debug) console.log('[MockEngine] Skipped (localStorage flag)');
      return;
    }

    if (hasMockData) {
      if (debug) console.log('[MockEngine] Skipped (mock data exists)');
      return;
    }

    if (
      pendingActivities.length > 0 ||
      verifiedActivities.length > 0
    ) {
      if (debug) console.log('[MockEngine] Skipped (store not empty)');
      return;
    }
  }

  // Generate activities
  const freshActivities: Activity[] =
    typeof count === 'number'
      ? generateMockActivities(count)
      : MOCK_DATA.map((data, index) => ({
          ...data,
          id: generateId(),
          status: 'pending',
          timestamp: generateTimestamp(index * 15),
        }));

  // Add to store
  addPendingActivities(freshActivities);

  // Persist initialization flag
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, 'true');
  }

  if (debug) {
    console.log('[MockEngine] Injected mock activities:', freshActivities);
  }
}

/**
 * Reset mock data (useful for testing)
 */
export function resetMockData(debug = false) {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  if (debug) {
    console.log('[MockEngine] Reset completed');
  }
}