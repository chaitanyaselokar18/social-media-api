import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [AuthModule, PostsModule, UsersModule, BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
