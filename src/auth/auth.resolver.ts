import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
// import * as bcrypt from 'bcrypt';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  //   @Mutation(() => String)
  //   async signup(
  //     @Args('name') name: string,
  //     @Args('email') email: string,
  //     @Args('password') password: string,
  //   ) {
  //     console.log(password, 'cek password');
  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     const user = await this.usersService.create({
  //       name,
  //       email,
  //       password: hashedPassword,
  //     });
  //     return this.authService.login(user);
  //   }
}
