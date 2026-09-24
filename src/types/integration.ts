/**
 * INTEGRATION CONFIG - Free-form configuration for an integration.
 * Holds provider-specific settings such as apiUrl, jwtToken or channelNumber
 * as an arbitrary key-value map.
 */
export interface IntegrationConfig {
  [key: string]: unknown; // Can hold any key-value pairs
}
