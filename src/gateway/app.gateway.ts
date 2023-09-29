import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit, SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import {Server} from "typeorm";
import {Injectable, Logger} from "@nestjs/common";
import {Socket} from "socket.io";

@Injectable()
@WebSocketGateway(3006, { cors: {
    origin: '*',
  } })
export class AppGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');
  constructor(
    // private userService: UsersService,
    // private jwtService: JwtService,

  ) {
    console.log("Start App Gateway !!!")
  }

  //function get user from token
  // async getDataUserFromToken(client: Socket): Promise<UserEntity> {
  //   const authToken: any = client.handshake?.query?.token;
  //   try {
  //     const decoded = this.jwtService.verify(authToken);
  //
  //     return await this.userService.getUserByEmail(decoded.email); // response to function
  //   } catch (ex) {
  //     throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  //   }
  // }

  async handleConnection(client: Socket) {
    this.logger.log(`${client.id} - ${client.handshake.address}`, 'Connected..............................');
    // const user: UserEntity = await this.getDataUserFromToken(client);
    //
    // const device = {
    //   user_id: user.id,
    //   type: TypeInformation.socket_id,
    //   status: false,
    //   value: client.id,
    // };
    //
    // await this.deviceService.create(information);
  }

  async handleDisconnect(client: Socket) {
    // const user = await this.getDataUserFromToken(client);
    // await this.deviceService.deleteByValue(user.id, client.id);

    // need handle remove socketId to table
    this.logger.log(`${client.id} - ${client.handshake.address}`, 'Disconnect..............................');
  }

  @SubscribeMessage('send-message-from-client')
  async messages(client: Socket, payload: any) {
    console.log('receive-message-from-client', payload);
    console.log('==========================================')
    // get all user trong conversation bằng conversation_id
    // const conversation = await this.conversationService.findById(
    //   payload.conversation_id,
    //   ['users'],
    // );

    // get all socket id đã lưu trước đó của các user thuộc conversation
    // const dataSocketId = await this.deviceService.findSocketId(userId);

    // Lưu dữ liệu vào bảng message
    // const message = await this.messageService.create({
    //   user_id: payload.user_id,
    //   status: false,
    //   message: payload.message,
    //   conversation_id: payload.conversation_id,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // });

    //emit message đến socket_id
    // dataSocketId.map((value) => {
    //   emit.to(value.value).emit('message-received', {
    //     id: message.id,
    //     message: message.message,
    //     conversation_id: message.conversation_id,
    //     user_id: message.user_id,
    //     status: message.status,
    //     createdAt: message.createdAt,
    //     updatedAt: message.updatedAt,
    //   });
    // });
  }

  async sendingMessage(eventName: string, payload: object) {
    this.server.emit(eventName, payload);
  }
  afterInit(server: any): any {
    this.logger.log(server, 'Init');
  }
}
