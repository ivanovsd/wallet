import { GlobalData } from '../global-data';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class TitleService {

  constructor(private titleService: Title) {
  }
  setTitle(newTitle) {
    GlobalData.title = newTitle;
    console.log('setTitle', newTitle);
    this.titleService.setTitle(GlobalData.title);
  }
  getTitle() {
    console.log('getTitle', GlobalData.title);
    return GlobalData.title;
  }
}