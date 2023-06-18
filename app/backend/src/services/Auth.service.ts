import * as bcrypt from 'bcryptjs';
import UsersModel from '../database/models/SequelizeUser';

class UserService {
  private usersModel = UsersModel;

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (!user) return false;
    if (bcrypt.compareSync(password, user?.password)) return true;

    return false;
  }

  async findByEmail(email: string) {
    return this.usersModel.findOne({ where: { email } });
  }
}

const userService = new UserService();

export default userService;
