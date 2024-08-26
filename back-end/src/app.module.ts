import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { LikesModule } from './modules/likes/likes.module';
import { MenuItemOptionsModule } from './modules/menu.item.options/menu.item.options.module';
import { MenuItemsModule } from './modules/menu.items/menu.items.module';
import { MenusModule } from './modules/menus/menus.module';
import { OrderDetailModule } from './modules/order.detail/order.detail.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { TransformInterceptor } from './core/transform.interceptor';

@Module({
  imports: [
    UsersModule,
    // LikesModule,
    // MenuItemOptionsModule,
    // MenuItemsModule,
    // MenusModule,
    // OrderDetailModule,
    // OrdersModule,
    // RestaurantsModule,
    // ReviewsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAILER_HOST'),
          port: Number(configService.get<string>('MAILER_PORT')), // Ensure this is a number
          ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>('MAILER_USER'),
            pass: configService.get<string>('MAILER_PASS'),
          }
        },
        defaults: {
          from: configService.get<string>('MAILER_FROM'),
        },
        template: {
          dir: join(__dirname, 'mail/templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard
  }, {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    }],
})
export class AppModule { }
