import { describe, it, expect, beforeEach } from 'vitest';
import { renderLogs, trackRender, resetRenderLogs } from './profiler';

describe('Profiler Utility', () => {
  beforeEach(() => {
    resetRenderLogs();
  });

  it('should initialize empty render logs', () => {
    expect(renderLogs).toEqual({});
  });

  it('should track render increments correctly', () => {
    trackRender('TestComponent');
    expect(renderLogs['TestComponent']).toBe(1);

    trackRender('TestComponent');
    expect(renderLogs['TestComponent']).toBe(2);
  });

  it('should track multiple components independently', () => {
    trackRender('ComponentA');
    trackRender('ComponentB');
    trackRender('ComponentA');

    expect(renderLogs['ComponentA']).toBe(2);
    expect(renderLogs['ComponentB']).toBe(1);
  });

  it('should reset logs correctly', () => {
    trackRender('ComponentA');
    resetRenderLogs();
    expect(renderLogs).toEqual({});
  });
});
