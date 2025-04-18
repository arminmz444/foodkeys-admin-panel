// src/utils/federationLoader.js
/**
 * Utility to dynamically load federated modules at runtime
 */

// Initialize sharing
const initSharing = async () => {
    if (!window.__webpack_share_scopes__?.default) {
      await __webpack_init_sharing__('default');
    }
  };
  
  /**
   * Loads a remote module from a URL
   * @param {string} scope - The name/scope of the remote application
   * @param {string} url - The URL to the remoteEntry.js file
   * @param {string} module - The module path to load (e.g., './App' or './Widget')
   */
  export const loadRemote = async (scope, url, module) => {
    // Initialize the shared scope
    await initSharing();
  
    // Load the remote container if not already loaded
    if (!window[scope]) {
      // Create a script tag to load the remote entry
      const script = document.createElement('script');
      script.src = url;
      script.id = `federated-remote-${scope}`;
      script.async = true;
      script.onload = () => {
        console.log(`Remote ${scope} loaded successfully`);
      };
      script.onerror = (error) => {
        console.error(`Error loading remote ${scope} from ${url}:`, error);
        throw new Error(`Failed to load remote module ${scope}`);
      };
  
      // Add the script to the document
      document.head.appendChild(script);
  
      // Wait for the script to load
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
      });
    }
  
    // Ensure container is initialized
    if (!window[scope].__initialized) {
      await window[scope].init(__webpack_share_scopes__.default);
      window[scope].__initialized = true;
    }
  
    // Get the factory function for the module
    const factory = await window[scope].get(module);
    
    // Execute the factory to get the module
    return factory();
  };
  
  /**
   * React lazy-compatible function to dynamically load a federated module
   * @param {string} scope - The name/scope of the remote application
   * @param {string} url - The URL to the remoteEntry.js file
   * @param {string} module - The module path to load
   */
  export const loadComponent = (scope, url, module) => {
    return async () => {
      try {
        const Component = await loadRemote(scope, url, module);
        return { default: Component };
      } catch (error) {
        console.error(`Failed to load component ${module} from ${scope}:`, error);
        throw error;
      }
    };
  };
  
  /**
   * Creates a React lazy component for a federated module
   * @param {object} miniappMetadata - The metadata for the miniapp
   */
  export const createFederatedComponent = (miniappMetadata) => {
    const React = require('react');
    
    return React.lazy(() => 
      loadComponent(
        miniappMetadata.scope,
        miniappMetadata.remoteEntryUrl,
        miniappMetadata.module || './App'
      )()
    );
  };