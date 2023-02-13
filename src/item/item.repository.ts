import { item, location } from "@prisma/client";
import { SearchItemsRequestDTO } from "src/dashboard/dto/request/search-items-request.dto";
import { DatabaseService } from "src/database/database.service";
import { CreateItemRequestDTO } from "./dto/request/create-item-request.dto";
import { UpdateItemRequestDTO } from "./dto/request/update-item-request.dto";
import { ItemEntity } from "./entity/item.entity";

export class ItemRepository {

  private connection: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.connection = databaseService;
  }

  public async findItems(): Promise<(item & { location: location })[]> {
    return await this.connection.item.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
      include: {
        location: true,
      },
    });
  }

  public async searchItems(searchItemsRequestDTO: SearchItemsRequestDTO): Promise<(item & { location: location })[]> {
    return await this.connection.item.findMany({
      skip: searchItemsRequestDTO.skip,
      take: searchItemsRequestDTO.maxPerPage,
      where: {
        id: searchItemsRequestDTO.itemId,
        name: {
          contains: searchItemsRequestDTO.itemName,
          mode: 'insensitive',
        },
        description: {
          contains: searchItemsRequestDTO.itemDescription,
          mode: 'insensitive',
        },
        location_id: searchItemsRequestDTO.locationId,
      },
      orderBy: [
        {
          id: 'desc',
        },
      ],
      include: {
        location: true,
      },
    });
  }

  public async findItemsByLocationID(locationId: number): Promise<(item & { location: location })[]> {
    return await this.connection.item.findMany({
      where: {
        location_id: locationId,
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
      include: {
        location: true,
      },
    });
  }

  public async findItemByID(id: number): Promise<item & { location: location } | null> {
    return await this.connection.item.findUnique({ 
      where: { id: id },
      include: {
        location: true,
      },
    });
  }

  public async createItem(createItemRequestDTO: CreateItemRequestDTO): Promise<item & { location: location } | null> {
    return await this.connection.item.create({ 
      data: {
        name: createItemRequestDTO.name,
        description: createItemRequestDTO.description,
        location_id: createItemRequestDTO.locationId,
      },
      include: {
        location: true,
      },
    });
  }

  public async updateItem(updateItemRequestDTO: UpdateItemRequestDTO): Promise<item & { location: location } | null> {
    return await this.connection.item.update({ 
      where: { id: updateItemRequestDTO.id },
      data: {
        name: updateItemRequestDTO.name,
        description: updateItemRequestDTO.description,
        location_id: updateItemRequestDTO.locationId,
      },
      include: {
        location: true,
      },
    });
  }

  public async deleteItem(item: ItemEntity): Promise<void> {
    await this.connection.item.delete({where: { id: item.id }});
  }

  public async findTotalItems(): Promise<number> {
    return await this.connection.item.count();
  }
  
}