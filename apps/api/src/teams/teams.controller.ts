import { Controller, Get, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teams: TeamsService) {}

  /** GET /api/teams — listado de selecciones. */
  @Get()
  list() {
    return this.teams.list();
  }

  /** GET /api/teams/:id — perfil completo de una selección. */
  @Get(':id')
  profile(@Param('id') id: string) {
    return this.teams.profile(id);
  }
}
