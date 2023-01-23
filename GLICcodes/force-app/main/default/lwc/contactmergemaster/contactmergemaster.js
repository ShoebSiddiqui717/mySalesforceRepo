import { LightningElement, track, wire } from 'lwc';
import guardianlogo from '@salesforce/resourceUrl/GuardianLogo';
import { NavigationMixin } from 'lightning/navigation';
import closeButton from '@salesforce/label/c.AM_CloseButton';
import cancelButton from '@salesforce/label/c.AM_Cancel';
import profileIds from '@salesforce/label/c.AM_Profile_Access';
import profileAccessError from '@salesforce/label/c.AM_Profile_Error';
import contactMerge from '@salesforce/label/c.CM_Heading';
import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import ProfileID_FIELD from '@salesforce/schema/User.ProfileId';

export default class Contactmergemaster extends NavigationMixin(LightningElement) {

    @track ismodalopen=false;
    guardianlogo = guardianlogo;
    @track showscreen1 = true;
    @track showscreen2 = false;
    @track selectedcontactids;
    @track searchkey;
    @track error ;
    @track profileId;

    label={
        closeButton,cancelButton,profileIds,profileAccessError,contactMerge
    }

    //get current user profile
    @wire(getRecord, {
        recordId: USER_ID,
        fields: [ProfileID_FIELD]
    }) wireuser({
        error,
        data
    }) {
        if (error) {

           this.error = error ; 
           console.log('Error Fetching Profile'+JSON.stringify(this.error));

        } else if (data) {

            this.profileId = data.fields.ProfileId.value;
            this.validateUSerProfile();

        }
    }

    connectedCallback(){
        this.ismodalopen = true;
    }

    //event triggered from contactmergescreen1 to show contactmergescreen2
    showScreen2(event){

        this.selectedcontactids = event.detail.contactids;
        this.searchkey = event.detail.searchtext;
        this.showscreen1 = false;
        this.showscreen2 = true;
        
    }

//send user to homepage post click on "X" or "Cancel"
    closeWindow(){
    
        this.ismodalopen = false;
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home'
            },
        });
    }

//event triggered from contactmergescreen2 to show contactmergescreen1
    showScreen1WithData(event){

        this.showscreen1 = true;
        this.showscreen2 = false;           
    }

//validate user profile.    
    validateUSerProfile(){
        
        this.profileId = this.profileId.substring(0,15);
       
        if(!(this.label.profileIds.includes(this.profileId))){
       
            this.error = this.label.profileAccessError;
            this.showscreen1 = false;
            this.showscreen2 = false;
        
        }
        
    }
}