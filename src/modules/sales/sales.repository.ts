import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sale } from "src/entities/Sale.entity";
import { Sale_Detail } from "src/entities/Sale_Detail.entity";
import { Repository } from "typeorm";

@Injectable()
export class SalesRepository {
  constructor(
    @InjectRepository(Sale) private salesRepository: Repository<Sale>,
    @InjectRepository(Sale_Detail) private sale_detailsRepository: Repository<Sale_Detail>
  ) {}

}  