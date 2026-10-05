import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AiAgentModule } from '../ai-agent/ai-agent.module';
import { RAGModule } from '../rag/rag.module';

@Module({
  imports: [AiAgentModule, RAGModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {}
