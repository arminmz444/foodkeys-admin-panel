import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from 'react-toastify';

class WebSocketClient {
  constructor() {
    this.client = null;
    this.connected = false;
    this.connectionPromise = null;
    this.subscriptions = {};
    this.listeners = {};
    this.notificationHandlers = {};
    this.reconnectTimeout = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds
  }


  connect(serverUrl, token) {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        this.client = new Client({
          webSocketFactory: () => new SockJS(`${serverUrl}/ws`),
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          debug: process.env.NODE_ENV === 'development' ? console.log : () => {},
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            console.log('WebSocket connected');
            this.connected = true;
            this.reconnectAttempts = 0;
            this._subscribeToChannels();
            resolve();
          },
          onStompError: (frame) => {
            console.error('WebSocket STOMP error:', frame);
            this._handleError('STOMP protocol error');
            reject(new Error('STOMP error: ' + frame.headers.message));
          },
          onWebSocketClose: () => {
            console.log('WebSocket connection closed');
            this.connected = false;
            this._attemptReconnect();
          },
          onWebSocketError: (event) => {
            console.error('WebSocket error:', event);
            this.connected = false;
            this._handleError('Connection error');
            reject(new Error('WebSocket connection error'));
          },
        });

        this.client.activate();
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }


  subscribeToUserChannel(channelName, callback) {
    const channel = `/user/queue/${channelName}`;
    return this._subscribe(channel, callback);
  }


  subscribeToRoleChannel(role, callback) {
    const channel = `/topic/role.${role}`;
    return this._subscribe(channel, callback);
  }


  subscribeToGeneralChannel(callback) {
    const channel = '/topic/all';
    return this._subscribe(channel, callback);
  }


  registerNotificationHandler(type, handler) {
    this.notificationHandlers[type] = handler;
  }


  unregisterNotificationHandler(type) {
    delete this.notificationHandlers[type];
  }


  addEventListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }


  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  disconnect() {
    if (this.client && this.connected) {
      this.client.deactivate();
      this.connected = false;
      this.connectionPromise = null;
      this.subscriptions = {};
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      
      console.log('WebSocket disconnected');
    }
  }


  send(destination, body) {
    if (!this.connected) {
      console.warn('Cannot send message: WebSocket not connected');
      return;
    }
    
    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

 
  _subscribe(channel, callback) {
    if (!this.connected) {
      console.warn(`Cannot subscribe to ${channel}: WebSocket not connected`);
      
      if (!this.subscriptions[channel]) {
        this.subscriptions[channel] = [];
      }
      
      const subscriptionId = `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.subscriptions[channel].push({ id: subscriptionId, callback });
      return subscriptionId;
    }
    
    const subscription = this.client.subscribe(channel, (message) => {
      try {
        const data = JSON.parse(message.body);
        
        if (callback) {
          callback(data);
        }
        
        this._handleNotification(data);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    if (!this.subscriptions[channel]) {
      this.subscriptions[channel] = [];
    }
    
    this.subscriptions[channel].push({ id: subscription.id, callback });
    return subscription.id;
  }

  _handleNotification(notification) {
    if (notification.type && this.notificationHandlers[notification.type]) {
      this.notificationHandlers[notification.type](notification);
    }
    
    if (notification.title && notification.message) {
      toast.info(
        <div>
          <div className="font-bold text-lg">{notification.title}</div>
          <div>{notification.message}</div>
        </div>
      );
    }
    
    this._dispatchEvent('notification', notification);
  }

  _dispatchEvent(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event listener:`, error);
        }
      });
    }
  }

  _handleError(message) {
    console.error(`WebSocket error: ${message}`);
    this._dispatchEvent('error', { message });
  }

  _attemptReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached');
      this._dispatchEvent('reconnectFailed', {});
      return;
    }
    
    this.reconnectAttempts += 1;
    
    this.reconnectTimeout = setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this._dispatchEvent('reconnecting', { attempt: this.reconnectAttempts });
      
      this.connectionPromise = null;
      
      if (this.client) {
        this.client.activate();
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }


  _subscribeToChannels() {
    for (const [channel, subscriptions] of Object.entries(this.subscriptions)) {
      subscriptions.forEach(({ callback }) => {
        this.client.subscribe(channel, (message) => {
          try {
            const data = JSON.parse(message.body);
            if (callback) {
              callback(data);
            }
            this._handleNotification(data);
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        });
      });
    }
    
    this._dispatchEvent('reconnected', {});
  }
}

export default new WebSocketClient();