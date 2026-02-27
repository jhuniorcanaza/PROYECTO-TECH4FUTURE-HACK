/**
 * ===================================================================
 * Chat Eco-Asistente — Controller (PERSONA B)
 * ===================================================================
 */
import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(
    @Body() body: { pregunta: string; historial?: { role: string; content: string }[] },
  ) {
    const respuesta = await this.chatService.preguntar(
      body.pregunta,
      body.historial || [],
    );
    return { respuesta };
  }
}
