import { item } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { CreateItemRequestDTO } from "./dto/request/create-item-request.dto";
import { UpdateItemRequestDTO } from "./dto/request/update-item-request.dto";
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

  public async findItemsByLocationID(locationId: number): Promise<item[]> {
    return await this.connection.item.findMany({
      where: {
        location_id: locationId,
      },
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
    return await this.connection.item.create({ 
      data: {
        name: createItemRequestDTO.name,
        description: createItemRequestDTO.description,
        location_id: createItemRequestDTO.locationId,
      },
    });
  }

  public async updateItem(updateItemRequestDTO: UpdateItemRequestDTO): Promise<item | null> {
    return await this.connection.item.update({ 
      where: { id: updateItemRequestDTO.id },
      data: {
        name: updateItemRequestDTO.name,
        description: updateItemRequestDTO.description,
        location_id: updateItemRequestDTO.locationId,
      },
    });
  }

  public async deleteItem(item: ItemEntity): Promise<void> {
    await this.connection.item.delete({where: { id: item.id }});
  }
  
}