import {inject, TestBed} from "@angular/core/testing";
import {GoodsService} from "./goods.service";

describe('GoodscatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodsService]
    });
  });

  it('should ...', inject([GoodsService], (service: GoodsService) => {
    expect(service).toBeTruthy();
  }));
});
