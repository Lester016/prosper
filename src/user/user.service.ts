import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll() {
    const users = this.getOrSetCache(
      'users',
      async () =>
        await this.userRepository.find({
          select: ['id', 'firstName', 'lastName', 'email', 'isActive', 'age'],
        }),
      120, // cached for 120 seconds
    );
    return users;
  }

  // Promise mockup
  async RetrievePromiseMockup() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const greetings = 'Hello Worldddd';
        resolve(greetings);
      }, 1000);
    });
  }

  // Generic caching method, could have its own module/service.
  async getOrSetCache<T>(
    key: string,
    fetchFunction: () => Promise<T>, // function to fetch data if cache miss
    ttl: number = 60, // optional TTL (in seconds)
  ): Promise<T> {
    // Check if data is already cached
    const cachedData = await this.cacheManager.get<T>(key);
    if (cachedData) {
      return cachedData;
    }

    // If data is not in cache, fetch it
    const data = await fetchFunction();

    // Store fetched data in cache
    await this.cacheManager.set(key, data, ttl);

    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
