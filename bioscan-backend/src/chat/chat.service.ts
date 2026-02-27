/**
 * ===================================================================
 * Chat Eco-Asistente — Service (PERSONA B)
 * ===================================================================
 * Conecta con Groq (Llama 3) para el chatbot.
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  private readonly groqKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.groqKey = this.configService.get<string>('GROQ_KEY', '');
  }

  async preguntar(
    pregunta: string,
    historial: { role: string; content: string }[],
  ): Promise<string> {
    try {
      if (!this.groqKey) {
        return this.respuestaDemo(pregunta);
      }

      const { data } = await firstValueFrom(
        this.httpService.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: `Eres BioBot, el eco-asistente de BioScan Cochabamba.
Eres experto en la biodiversidad del Cerro San Pedro y los corredores biológicos urbanos de Cochabamba, Bolivia.
Datos que conoces:
- El Cerro San Pedro tiene 700+ especies registradas
- 104 aves, 527 plantas, 41 mariposas, 10 murciélagos
- La Monterita de Cochabamba (Poospiza garleppi) está en peligro de extinción
- Los bosques de Polylepis (quewiña) están amenazados
- Hay un proyecto de túnel que amenaza los corredores biológicos
- El Proyecto ATUQ de WWF trabaja en conservación del cerro
Responde en español, de forma amigable y educativa. Máximo 3 frases. Usa emojis ocasionalmente.`,
              },
              ...historial,
              { role: 'user', content: pregunta },
            ],
            max_tokens: 300,
          },
          {
            headers: {
              Authorization: `Bearer ${this.groqKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error en Groq:', error?.message);
      return this.respuestaDemo(pregunta);
    }
  }

  private respuestaDemo(pregunta: string): string {
    const p = pregunta.toLowerCase();
    if (p.includes('monterita'))
      return '🐦 La Monterita de Cochabamba (Poospiza garleppi) es un ave endémica EN PELIGRO. Vive solo en bosques de Polylepis entre 2800-3500m.';
    if (p.includes('túnel') || p.includes('tunnel'))
      return '🚧 El proyecto del túnel amenaza los corredores biológicos del Cerro San Pedro. Más de 700 especies dependen de este ecosistema.';
    return '🌿 El Cerro San Pedro alberga 700+ especies: 104 aves, 527 plantas, 41 mariposas y 10 murciélagos. ¿Qué quieres saber?';
  }
}
