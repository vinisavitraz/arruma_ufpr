import { item } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { CreateItemRequestDTO } from "./dto/request/create-item-request.dto";
import { ItemEntity } from "./entity/item.entity";

export class ItemRepository {

  private connection: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.connection = databaseService;
  }

  public async findItems(): Promise<item[]> {
    return await this.connection.item.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  public async findItemByID(id: number): Promise<item | null> {
    return await this.connection.item.findUnique({ where: { id: id } });
  }

  public async createItem(createItemRequestDTO: CreateItemRequestDTO): Promise<item | null> {
    return await this.connection.item.upsert({ 
      where: { id: createItemRequestDTO.id },
      update: {
        name: createItemRequestDTO.name,
        description: createItemRequestDTO.description,
        status: createItemRequestDTO.status,
        location_id: createItemRequestDTO.locationId,
      },
      create: {
        name: createItemRequestDTO.name,
        description: createItemRequestDTO.description,
        status: createItemRequestDTO.status,
        location_id: createItemRequestDTO.locationId,
      },
    });
  }

  public async deleteItem(item: ItemEntity): Promise<void> {
    await this.connection.item.delete({where: { id: item.id }});
  }
  
}