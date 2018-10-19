import { Pipe, PipeTransform } from '@angular/core';
import {RzhtoolsService} from "../../core/services/rzhtools.service";

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {
  constructor(private tools: RzhtoolsService){}

  transform(value: any, args?: any): any {
    let arr=value.split('~'),result:string='';

    /**
     * 转化为当地时间并截取所需要的
     */
    for(let i=0;i<arr.length;i++){
      arr[i]=this.tools.UTCToDate(arr[i]);
      if(i==0){
        result+=arr[i]+"~"
      }else{
        result+=arr[i].substr(11,18)
      }
    }
    return result;
  }

}
