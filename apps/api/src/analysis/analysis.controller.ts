import { Controller, Get, Query } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CompareQueryDto } from './dto/compare.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysis: AnalysisService) {}

  /** GET /api/analysis/compare?home=arg&away=bra */
  @Get('compare')
  compare(@Query() q: CompareQueryDto) {
    return this.analysis.compare(q.home, q.away);
  }

  /** GET /api/analysis/predict?home=arg&away=bra */
  @Get('predict')
  predict(@Query() q: CompareQueryDto) {
    return this.analysis.predict(q.home, q.away);
  }
}
