// Mock Vapi SDK for development
class MockVapi {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  async start(assistant: any, options?: any) {
    console.log('Mock Vapi start called with:', { assistant, options });
    
    // Simulate connection
    setTimeout(() => {
      this.emit('call-start');
    }, 1000);

    // Simulate some conversation
    setTimeout(() => {
      this.emit('message', {
        type: 'transcript',
        transcriptType: 'final',
        role: 'assistant',
        transcript: 'Hello! Welcome to your mock interview. Let\'s begin with you telling me about yourself.'
      });
    }, 2000);

    setTimeout(() => {
      this.emit('speech-start');
    }, 2500);

    setTimeout(() => {
      this.emit('speech-end');
    }, 4000);
  }

  stop() {
    console.log('Mock Vapi stop called');
    setTimeout(() => {
      this.emit('call-end');
    }, 500);
  }

  private emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

export const vapi = new MockVapi();