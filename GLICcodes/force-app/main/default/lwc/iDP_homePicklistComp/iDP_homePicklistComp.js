import { LightningElement, track } from 'lwc';
export default class IDP_homePicklistComp extends LightningElement {
    @track selectedLocation;
    @track selectedMall;
    @track selectedHotel;
    @track showMalls = false;
    @track showHotels = false;
  
    locationOptions = [
      { label: 'Malls', value: 'malls' },
      { label: 'Hotels', value: 'hotels' },
    ];
  
    mallOptions = [
      { label: 'Westend Mall', value: 'westend' },
      { label: 'Phoenix Mall', value: 'phoenix' },
    ];
  
    hotelOptions = [
      { label: 'Hayat', value: 'hayat' },
      { label: 'Sayatji', value: 'sayatji' },
    ];
  
    handleLocationChange(event) {
      this.selectedLocation = event.detail.value;
      this.showMalls = this.selectedLocation === 'malls';
      this.showHotels = this.selectedLocation === 'hotels';
    }
  
    handleMallChange(event) {
      this.selectedMall = event.detail.value;
    }
  
    handleHotelChange(event) {
      this.selectedHotel = event.detail.value;
    }
}