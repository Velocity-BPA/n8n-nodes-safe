/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { SafeTrigger } from '../../nodes/Safe/SafeTrigger.node';

describe('SafeTrigger Node', () => {
  let safeTriggerNode: SafeTrigger;

  beforeEach(() => {
    safeTriggerNode = new SafeTrigger();
  });

  describe('Node Definition', () => {
    it('should have correct display name', () => {
      expect(safeTriggerNode.description.displayName).toBe('Safe Trigger');
    });

    it('should have correct node name', () => {
      expect(safeTriggerNode.description.name).toBe('safeTrigger');
    });

    it('should have correct version', () => {
      expect(safeTriggerNode.description.version).toBe(1);
    });

    it('should have correct group', () => {
      expect(safeTriggerNode.description.group).toContain('trigger');
    });

    it('should have icon defined', () => {
      expect(safeTriggerNode.description.icon).toBe('file:safe.svg');
    });

    it('should have no inputs', () => {
      expect(safeTriggerNode.description.inputs).toEqual([]);
    });

    it('should have outputs configured', () => {
      expect(safeTriggerNode.description.outputs).toEqual(['main']);
    });
  });

  describe('Webhooks', () => {
    it('should have webhook defined', () => {
      expect(safeTriggerNode.description.webhooks).toBeDefined();
      expect(safeTriggerNode.description.webhooks).toHaveLength(1);
    });

    it('should have webhook with POST method', () => {
      const webhook = safeTriggerNode.description.webhooks![0];
      expect(webhook.httpMethod).toBe('POST');
    });

    it('should have webhook with correct path', () => {
      const webhook = safeTriggerNode.description.webhooks![0];
      expect(webhook.path).toBe('webhook');
    });
  });

  describe('Events', () => {
    it('should have event property', () => {
      const eventProperty = safeTriggerNode.description.properties.find(
        (p) => p.name === 'event',
      );
      expect(eventProperty).toBeDefined();
    });

    it('should have all required event types', () => {
      const eventProperty = safeTriggerNode.description.properties.find(
        (p) => p.name === 'event',
      );
      const events = (eventProperty?.options as Array<{ value: string }>)?.map(
        (o) => o.value,
      );
      expect(events).toContain('all');
      expect(events).toContain('EXECUTED_MULTISIG_TRANSACTION');
      expect(events).toContain('PENDING_MULTISIG_TRANSACTION');
      expect(events).toContain('NEW_CONFIRMATION');
      expect(events).toContain('INCOMING_ETHER');
      expect(events).toContain('OUTGOING_ETHER');
      expect(events).toContain('INCOMING_TOKEN');
      expect(events).toContain('OUTGOING_TOKEN');
      expect(events).toContain('MODULE_TRANSACTION');
      expect(events).toContain('MESSAGE_CONFIRMATION');
      expect(events).toContain('SAFE_CREATED');
    });
  });

  describe('Properties', () => {
    it('should have properties defined', () => {
      expect(safeTriggerNode.description.properties).toBeDefined();
      expect(safeTriggerNode.description.properties.length).toBeGreaterThan(0);
    });

    it('should have safeAddress filter property', () => {
      const safeAddressProperty = safeTriggerNode.description.properties.find(
        (p) => p.name === 'safeAddress',
      );
      expect(safeAddressProperty).toBeDefined();
    });
  });

  describe('Webhook Methods', () => {
    it('should have webhookMethods defined', () => {
      expect(safeTriggerNode.webhookMethods).toBeDefined();
    });

    it('should have default webhook methods', () => {
      expect(safeTriggerNode.webhookMethods.default).toBeDefined();
      expect(safeTriggerNode.webhookMethods.default.checkExists).toBeDefined();
      expect(safeTriggerNode.webhookMethods.default.create).toBeDefined();
      expect(safeTriggerNode.webhookMethods.default.delete).toBeDefined();
    });
  });
});
