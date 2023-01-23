import { LightningElement,track } from 'lwc';

export default class PostalCode extends LightningElement {
    @track pincode;
    @track postOffices;

  
    handlePinCodeChange(event) {
      this.pincode = event.target.value;
    }
  
    handleSearchClick() {
      const url = `https://api.postalpincode.in/pincode/${this.pincode}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log('Post Office data > '+JSON.stringify(data.postOffice));
          const postOffices1 = data[0].PostOffice;
        console.log(JSON.stringify(postOffices1));
        console.log(JSON.stringify(postOffices1.state));
            this.postOffices = postOffices1;
        })
        .catch(error => {
          console.error(error);
        });
    }
  }