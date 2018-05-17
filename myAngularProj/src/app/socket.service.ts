// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class SocketService {

//   constructor() { }
// }


////////////////////////////////
// import { Injectable } from '@angular/core';
// // import * as Rx from 'rxjs/Rx';
// import * as Rx from 'rxjs';

// @Injectable()
// export class SocketService {
//   constructor() { 
//     console.log("socket constructor")
//   }

//   private subject: Rx.Subject<MessageEvent>;

//   public connect(url): Rx.Subject<MessageEvent> {
//     if (!this.subject) {
//       this.subject = this.create(url);
//       console.log("Successfully connected: " + url);
//     } 
//     return this.subject;
//   }

//   private create(url): Rx.Subject<MessageEvent> {
//     let ws = new WebSocket(url);

//     let observable = Rx.Observable.create(
// 	(obs: Rx.Observer<MessageEvent>) => {
// 		ws.onmessage = obs.next.bind(obs);
// 		ws.onerror = obs.error.bind(obs);
// 		ws.onclose = obs.complete.bind(obs);
// 		return ws.close.bind(ws);
// 	})
// let observer = {
// 		next: (data: Object) => {
// 			if (ws.readyState === WebSocket.OPEN) {
// 				ws.send(JSON.stringify(data));
// 			}
// 		}
// 	}
// 	return Rx.Subject.create(observer, observable);
//   }

// }

////////////////////////////////
// https://medium.com/dailyjs/real-time-apps-with-typescript-integrating-web-sockets-node-angular-e2b57cbd1ec1
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from './message';
// import { Event } from '../model/event';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:1337';

@Injectable()
export class SocketService {
    private socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    //send from client to server
    public sendBeta(message: Message): void {
        console.log(message)
        console.log("socket service _ sendBeta message:", message)
        this.socket.emit('beta', message);
    }
    public sendGamma(message: Message): void {
        console.log(message)
        console.log("socket service _ sendGamma message:", message)
        this.socket.emit('gamma', message);
    }

    //receive message from server
    public onUpdate(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('update', (data: Message) => observer.next(data));
        });
    }

    // public onUpdateAllClients(): Observable<Message> {
    //     return new Observable<Message>(observer => {
    //         this.socket.on('updateAllClients', (data: Message) => observer.next(data));
    //     });
    // }

    // public onUpdateAllExceptOne(): Observable<Message> {
    //     return new Observable<Message>(observer => {
    //         this.socket.on('updateAllExceptOne', (data: Message) => observer.next(data));
    //     });
    // }

    // public onEvent(event: Event): Observable<any> {
    //     return new Observable<Event>(observer => {
    //         this.socket.on(event, () => observer.next());
    //     });
    // }
}