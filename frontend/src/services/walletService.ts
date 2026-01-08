// Phantom Wallet Service for Solana Integration
// Based on Phantom documentation: https://docs.phantom.app/

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: any;
  isConnected: boolean;
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: any }>;
  disconnect(): Promise<void>;
  signAndSendTransaction(transaction: any, options?: any): Promise<{ signature: string }>;
  signTransaction(transaction: any): Promise<any>;
  signAllTransactions(transactions: any[]): Promise<any[]>;
  signAndSendAllTransactions(transactions: any[], options?: any): Promise<{ signatures: string[], publicKey: any }>;
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  request(method: string, params?: any): Promise<any>;
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider;
    };
    solana?: PhantomProvider;
  }
}

class WalletService {
  private provider: PhantomProvider | null = null;
  private listeners: { [key: string]: Function[] } = {};

  constructor() {
    this.provider = this.getProvider();
    this.setupEventListeners();
  }

  // Detect if Phantom wallet is installed
  private getProvider(): PhantomProvider | null {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
      
      if (provider?.isPhantom) {
        return provider;
      }
    }

    // Also check legacy window.solana
    if (window.solana?.isPhantom) {
      return window.solana;
    }

    return null;
  }

  // Check if Phantom wallet is installed
  isPhantomInstalled(): boolean {
    return this.provider !== null;
  }

  // Redirect to Phantom installation if not installed
  redirectToPhantom(): void {
    window.open('https://phantom.app/', '_blank');
  }

  // Connect to Phantom wallet
  async connect(onlyIfTrusted: boolean = false): Promise<{ success: boolean; publicKey?: string; message?: string }> {
    if (!this.provider) {
      return {
        success: false,
        message: 'Phantom wallet is not installed. Please install Phantom wallet extension.'
      };
    }

    try {
      const response = await this.provider.connect({ onlyIfTrusted });
      return {
        success: true,
        publicKey: response.publicKey.toString(),
        message: 'Successfully connected to Phantom wallet'
      };
    } catch (error: any) {
      if (error.code === 4001) {
        return {
          success: false,
          message: 'Connection request was rejected by user'
        };
      }
      
      return {
        success: false,
        message: error.message || 'Failed to connect to Phantom wallet'
      };
    }
  }

  // Eagerly connect (for trusted apps)
  async eagerlyConnect(): Promise<{ success: boolean; publicKey?: string; message?: string }> {
    return this.connect(true);
  }

  // Disconnect from Phantom wallet
  async disconnect(): Promise<{ success: boolean; message?: string }> {
    if (!this.provider) {
      return {
        success: false,
        message: 'Phantom wallet is not available'
      };
    }

    try {
      await this.provider.disconnect();
      return {
        success: true,
        message: 'Successfully disconnected from Phantom wallet'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to disconnect from Phantom wallet'
      };
    }
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return this.provider?.isConnected || false;
  }

  // Get connected public key
  getPublicKey(): string | null {
    return this.provider?.publicKey?.toString() || null;
  }

  // Setup event listeners for wallet events
  private setupEventListeners(): void {
    if (!this.provider) return;

    // Connection event
    this.provider.on('connect', (publicKey: any) => {
      this.emit('connect', publicKey?.toString());
    });

    // Disconnection event
    this.provider.on('disconnect', () => {
      this.emit('disconnect');
    });

    // Account changed event
    this.provider.on('accountChanged', (publicKey: any) => {
      if (publicKey) {
        this.emit('accountChanged', publicKey.toString());
      } else {
        this.emit('accountChanged', null);
      }
    });
  }

  // Event emitter methods
  on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  private emit(event: string, ...args: any[]): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(...args));
    }
  }

  // Sign and send transaction
  async signAndSendTransaction(transaction: any, options?: any): Promise<{ success: boolean; signature?: string; message?: string }> {
    if (!this.provider) {
      return {
        success: false,
        message: 'Phantom wallet is not connected'
      };
    }

    try {
      const { signature } = await this.provider.signAndSendTransaction(transaction, options);
      return {
        success: true,
        signature,
        message: 'Transaction signed and sent successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to sign and send transaction'
      };
    }
  }

  // Sign transaction without sending
  async signTransaction(transaction: any): Promise<{ success: boolean; signedTransaction?: any; message?: string }> {
    if (!this.provider) {
      return {
        success: false,
        message: 'Phantom wallet is not connected'
      };
    }

    try {
      const signedTransaction = await this.provider.signTransaction(transaction);
      return {
        success: true,
        signedTransaction,
        message: 'Transaction signed successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to sign transaction'
      };
    }
  }

  // Sign multiple transactions
  async signAllTransactions(transactions: any[]): Promise<{ success: boolean; signedTransactions?: any[]; message?: string }> {
    if (!this.provider) {
      return {
        success: false,
        message: 'Phantom wallet is not connected'
      };
    }

    try {
      const signedTransactions = await this.provider.signAllTransactions(transactions);
      return {
        success: true,
        signedTransactions,
        message: 'All transactions signed successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to sign transactions'
      };
    }
  }

  // Sign and send multiple transactions
  async signAndSendAllTransactions(transactions: any[], options?: any): Promise<{ success: boolean; signatures?: string[]; publicKey?: string; message?: string }> {
    if (!this.provider) {
      return {
        success: false,
        message: 'Phantom wallet is not connected'
      };
    }

    try {
      const { signatures, publicKey } = await this.provider.signAndSendAllTransactions(transactions, options);
      return {
        success: true,
        signatures,
        publicKey: publicKey.toString(),
        message: 'All transactions signed and sent successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to sign and send transactions'
      };
    }
  }
}

// Export singleton instance
const walletService = new WalletService();
export default walletService;
