/**
 * Analytics wrapper to track page views and events.
 * In Phase 12, this simulates tracking by logging to the console.
 * In the future, this can be connected to Google Analytics, Mixpanel, Firebase, etc.
 */
class AnalyticsService {
  constructor() {
    this.isInitialized = false;
    this.sessionStartTime = Date.now();
  }

  init() {
    if (this.isInitialized) return;
    
    // Simulate initialization
    console.log('[AnalyticsService] Initialized for environment:', import.meta.env.MODE);
    this.isInitialized = true;
  }

  /**
   * Track a page view.
   * @param {string} path - The path of the page
   * @param {string} title - The title of the page
   */
  trackPageView(path, title = '') {
    if (!this.isInitialized) this.init();
    
    const payload = {
      path,
      title,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionStartTime
    };
    
    console.log(`[AnalyticsService] PAGE_VIEW: ${path}`, payload);
    // Integration point for GA: ReactGA.send({ hitType: "pageview", page: path, title });
  }

  /**
   * Track a specific event or user interaction.
   * @param {string} eventName - The name of the event (e.g., 'AI_QUERY_RESOLVED', 'CROP_ADDED')
   * @param {Object} properties - Additional metadata about the event
   */
  trackEvent(eventName, properties = {}) {
    if (!this.isInitialized) this.init();
    
    const payload = {
      ...properties,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionStartTime
    };
    
    console.log(`[AnalyticsService] EVENT: ${eventName}`, payload);
    // Integration point for GA: ReactGA.event({ category: properties.category || 'General', action: eventName, ...properties });
  }

  /**
   * Identify a user to associate events with them.
   * @param {string} userId - The unique user ID
   * @param {Object} traits - Additional user traits
   */
  identify(userId, traits = {}) {
    if (!this.isInitialized) this.init();
    
    console.log(`[AnalyticsService] IDENTIFY: User ${userId}`, traits);
    // Integration point for Mixpanel/Firebase: mixpanel.identify(userId); mixpanel.people.set(traits);
  }
}

export const analyticsService = new AnalyticsService();
