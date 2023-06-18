import * as bcrypt from 'bcryptjs';
import UsersModel from '../database/models/SequelizeUser';

class UserService {
  private usersModel = UsersModel;

  async login(email: string, password: string) {
    const user = await this.usersModel.findOne({ where: { email } });

    if (!user) return false;
    if (bcrypt.compareSync(password, user?.password)) return true;

    return false;
  }
}

const userService = new UserService();

export default userService;
