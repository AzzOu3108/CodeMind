import { Injectable } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapiter } from './entities/chapiter.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapiter)
    private readonly chapiterRepo: Repository<Chapiter>
  ){}

  async create(dto: CreateChapterDto) {
    const chapiter = this.chapiterRepo.create({
     title: dto.title.trim(),
    

    })
  }

  async findAll() {
    return `This action returns all chapter`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} chapter`;
  }

  async update(id: number, updateChapterDto: UpdateChapterDto) {
    return `This action updates a #${id} chapter`;
  }

  async remove(id: number) {
    return `This action removes a #${id} chapter`;
  }
}
