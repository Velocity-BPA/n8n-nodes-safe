/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { SafeApi } from '../../credentials/SafeApi.credentials';

describe('SafeApi Credentials', () => {
  let credentials: SafeApi;

  beforeEach(() => {
    credentials = new SafeApi();
  });

  describe('Credential Definition', () => {
    it('should have correct display name', () => {
      expect(credentials.displayName).toBe('Safe API');
    });

    it('should have correct name', () => {
      expect(credentials.name).toBe('safeApi');
    });

    it('should have properties defined', () => {
      expect(credentials.properties).toBeDefined();
      expect(credentials.properties.length).toBeGreaterThan(0);
    });
  });

  describe('Properties', () => {
    it('should have apiKey property', () => {
      const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
      expect(apiKeyProp).toBeDefined();
      expect(apiKeyProp?.type).toBe('string');
    });

    it('should have network property', () => {
      const networkProp = credentials.properties.find((p) => p.name === 'network');
      expect(networkProp).toBeDefined();
      expect(networkProp?.type).toBe('options');
    });

    it('should have customApiUrl property', () => {
      const customApiUrlProp = credentials.properties.find(
        (p) => p.name === 'customApiUrl',
      );
      expect(customApiUrlProp).toBeDefined();
      expect(customApiUrlProp?.type).toBe('string');
    });

    it('should have all network options', () => {
      const networkProp = credentials.properties.find((p) => p.name === 'network');
      const options = (networkProp?.options as Array<{ value: string }>)?.map(
        (o) => o.value,
      );
      expect(options).toContain('ethereum');
      expect(options).toContain('polygon');
      expect(options).toContain('arbitrum');
      expect(options).toContain('optimism');
      expect(options).toContain('base');
      expect(options).toContain('gnosis');
      expect(options).toContain('avalanche');
      expect(options).toContain('bsc');
      expect(options).toContain('sepolia');
      expect(options).toContain('custom');
    });
  });

  describe('Test Method', () => {
    it('should have test method defined', () => {
      expect(credentials.test).toBeDefined();
    });

    it('should have request configuration for testing', () => {
      expect(credentials.test?.request).toBeDefined();
    });
  });
});
