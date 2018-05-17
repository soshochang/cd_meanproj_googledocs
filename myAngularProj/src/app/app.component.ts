import { Component } from '@angular/core';
import { SocketService } from './socket.service';
import { Message } from './message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
  providers: [ SocketService]
})
export class AppComponent {
  title = 'app';
  ioConnection: any;
  // messages: Message[] = [];
  content =  `client default text`;
  user_id_counter = 0;
  isReceivedChange = true;

  created(editorInstance) {
    console.log("editorInstance created:", editorInstance )
  }
  
  changed(editorInstance) {
    console.log("editorInstance changed:", editorInstance )

    //if check flag is needed to prevent an infinite loop where receiving a change from the server, causes changed(editorInstance) to trigger a socket send  back to the server, which causes another socket emit a second client, which will then update, send back to the server, and because another socket emit of the same message back to the first client again
    if (!this.isReceivedChange)  {
      console.log("inside editor changed")
      let m = {
        code: 'text_updated', 
        user_id_counter: this.user_id_counter, 
        content: editorInstance.text
      }
      //Gamma bc  all other clients need to know about the text
      this.socketService.sendGamma(m)
    }
    this.isReceivedChange = false;
  }//end of changed(editorInstance)

  constructor(private socketService: SocketService) {
  }

  ngOnInit(): void {
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    //One general update method for updating the ui, the server can take care of whether it was a message that was sent to everyone or just this user, it does not particularly matter to the client when receiving the payload
    this.ioConnection = this.socketService.onUpdate()
      .subscribe((message: Message) => {
        console.log("client app_component onUpdate: message", message);
        this.isReceivedChange = true;
        this.content = message.content
        // this.messages.push(message);
      }
    );

    // this.socketService.onEvent(Event.CONNECT)
    //   .subscribe(() =oh> {
    //     console.log('connected');
    //   });
      
    // this.socketService.onEvent(Event.DISCONNECT)
    //   .subscribe(() => {
    //     console.log('disconnected');
    //   });
  }//end of initIoConnection
}
