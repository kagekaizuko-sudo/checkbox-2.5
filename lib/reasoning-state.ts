
export interface ReasoningState {
  isActive: boolean;
  originalModel: string | null;
  startTime: number | null;
}

export class ReasoningStateManager {
  private static readonly STORAGE_KEY = 'deepthink-state';
  
  static getState(): ReasoningState {
    if (typeof window === 'undefined') {
      return { isActive: false, originalModel: null, startTime: null };
    }
    
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : { isActive: false, originalModel: null, startTime: null };
    } catch {
      return { isActive: false, originalModel: null, startTime: null };
    }
  }
  
  static setState(state: ReasoningState): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save reasoning state:', error);
    }
  }
  
  static activateReasoning(currentModel: string): void {
    this.setState({
      isActive: true,
      originalModel: currentModel,
      startTime: Date.now()
    });
  }
  
  static deactivateReasoning(): ReasoningState {
    const state = this.getState();
    this.setState({
      isActive: false,
      originalModel: null,
      startTime: null
    });
    return state;
  }
  
  static isReasoningActive(): boolean {
    return this.getState().isActive;
  }
  
  static getOriginalModel(): string | null {
    return this.getState().originalModel;
  }
}
