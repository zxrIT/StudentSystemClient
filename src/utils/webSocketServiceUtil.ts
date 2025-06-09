import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    private stompClient: Client | null = null;
    private subscriptions: Map<string, (data: any) => void> = new Map();

    connect() {
        const socket = new SockJS('http://localhost:8040/ws');
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                this.subscriptions.forEach((callback, topic) => {
                    this.subscribe(topic, callback);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        this.stompClient.activate();
    }

    subscribe(topic: string, callback: (data: any) => void) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.subscribe(topic, (message) => {
                callback(JSON.parse(message.body));
            });
        }
        this.subscriptions.set(topic, callback);
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
        }
        this.subscriptions.clear();
    }
}

export const webSocketService = new WebSocketService();