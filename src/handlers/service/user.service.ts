import { Body ,Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../database/entities/UserTable.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  
  async registerUser(@Body() userData: any) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      const maxUserId = await this.userRepository
      .createQueryBuilder('user')
      .select('MAX(user.user_id)', 'max')
      .getRawOne();

      const user = this.userRepository.create({
         user_id:maxUserId ? 1:maxUserId,
         user_name:userData.userName,
         password:hashedPassword
      });

      //データベースに保存
      const savedUser = await this.userRepository.save(user);
  
      console.log('ユーザー登録成功',savedUser);
      return {
        success: true,
        message: 'ユーザーが登録されました',
      };
    } catch (error) {
      console.error('ユーザーの登録エラー:', error);
      return {
        success: false,
        message: 'ユーザーの登録に失敗しました',
      };
    }
  }

  async loginUser(userData: any) {
    const { userName, password } = userData;

    const user = await this.userRepository.findOne({ where: { user_name: userName } });

    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('パスワードが違います');
    }

    const payload = { userId: user.user_id, userName: user.user_name };
    const token = this.jwtService.sign(payload);

    return { 
      success: true,
      message: 'ログインできました',
      token 
    };
  }

}
