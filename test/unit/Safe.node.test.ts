/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Safe } from '../../nodes/Safe/Safe.node';

describe('Safe Node', () => {
  let safeNode: Safe;

  beforeEach(() => {
    safeNode = new Safe();
  });

  describe('Node Definition', () => {
    it('should have correct display name', () => {
      expect(safeNode.description.displayName).toBe('Safe');
    });

    it('should have correct node name', () => {
      expect(safeNode.description.name).toBe('safe');
    });

    it('should have correct version', () => {
      expect(safeNode.description.version).toBe(1);
    });

    it('should have correct group', () => {
      expect(safeNode.description.group).toContain('transform');
    });

    it('should have icon defined', () => {
      expect(safeNode.description.icon).toBe('file:safe.svg');
    });

    it('should have credentials configured', () => {
      expect(safeNode.description.credentials).toBeDefined();
      expect(safeNode.description.credentials).toHaveLength(1);
      expect(safeNode.description.credentials![0].name).toBe('safeApi');
    });

    it('should have inputs configured', () => {
      expect(safeNode.description.inputs).toEqual(['main']);
    });

    it('should have outputs configured', () => {
      expect(safeNode.description.outputs).toEqual(['main']);
    });
  });

  describe('Resources', () => {
    it('should have resource property', () => {
      const resourceProperty = safeNode.description.properties.find(
        (p) => p.name === 'resource',
      );
      expect(resourceProperty).toBeDefined();
    });

    it('should have all required resources', () => {
      const resourceProperty = safeNode.description.properties.find(
        (p) => p.name === 'resource',
      );
      const resources = (resourceProperty?.options as Array<{ value: string }>)?.map(
        (o) => o.value,
      );
      expect(resources).toContain('safeAccount');
      expect(resources).toContain('transaction');
      expect(resources).toContain('signature');
      expect(resources).toContain('message');
      expect(resources).toContain('contract');
      expect(resources).toContain('module');
      expect(resources).toContain('owner');
      expect(resources).toContain('safeOperation');
      expect(resources).toContain('token');
      expect(resources).toContain('chain');
    });

    it('should have 10 resources', () => {
      const resourceProperty = safeNode.description.properties.find(
        (p) => p.name === 'resource',
      );
      const resources = (resourceProperty?.options as Array<{ value: string }>);
      expect(resources).toHaveLength(10);
    });
  });

  describe('Properties', () => {
    it('should have properties defined', () => {
      expect(safeNode.description.properties).toBeDefined();
      expect(safeNode.description.properties.length).toBeGreaterThan(0);
    });

    it('should have resource as first property', () => {
      expect(safeNode.description.properties[0].name).toBe('resource');
    });
  });
});
