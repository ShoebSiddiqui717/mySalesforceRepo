import { LightningElement, wire } from 'lwc';
import getGLICURLsForCategory from '@salesforce/apex/GLIC_GetCustomSettingsClass.getGLICURLsForCategory';

export default class HomePageLinks extends LightningElement {
    @wire(getGLICURLsForCategory, {category : 'HomePage'})
    urls;
}