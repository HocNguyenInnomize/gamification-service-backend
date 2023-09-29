import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilsService {
  private saltOrRounds = 10;

  hashPassword(password): Promise<string> {
    return bcrypt.hash(password, this.saltOrRounds);
  }

  isMatch(password, hash): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  setCurrentUser(currentUser) {
    global['CURRENT-USER'] = currentUser;
  }

  getCurrentUser() {
    return global['CURRENT-USER'] || {};
  }
}
