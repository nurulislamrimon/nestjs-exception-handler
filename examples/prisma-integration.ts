/**
 * Example showing Prisma error handling
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, name: string) {
    try {
      return await this.prisma.user.create({
        data: { email, name },
      });
    } catch (error) {
      // Prisma errors are automatically formatted by the exception handler
      // P2002 (Unique constraint) will produce:
      // { path: 'email', message: 'A record with this email already exists.' }
      throw error;
    }
  }

  async findUser(id: number) {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      // P2025 (Record not found) will produce:
      // { path: 'record', message: 'Record not found.' }
      throw error;
    }
  }
}

// Example error response for P2002:
// {
//   "success": false,
//   "message": "A record with this email already exists.",
//   "errorMessages": [
//     {
//       "path": "email",
//       "message": "A record with this email already exists."
//     }
//   ]
// }
