import { ApiProperty } from "@nestjs/swagger";
import { location } from "@prisma/client";

export class LocationEntity {

  @ApiProperty({example: 1})
  readonly id: number;
  @ApiProperty({example: 'SEPT'})
  readonly name: string;
  @ApiProperty({example: 'Setor de educação professional e tecnologica da UFPR'})
  readonly description: string;

  constructor(
    id: number,
    name: string,
    description: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  public static fromRepository(location: location): LocationEntity {
    return new LocationEntity(
      location.id,
      location.name,
      location.description,
    );
  }

}