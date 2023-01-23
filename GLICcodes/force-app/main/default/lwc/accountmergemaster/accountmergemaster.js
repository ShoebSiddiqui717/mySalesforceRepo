import { LightningElement, track, wire } from 'lwc';
import guardianlogo from '@salesforce/resourceUrl/GuardianLogo';
import { NavigationMixin } from 'lightning/navigation';
import accountmergetool from '@salesforce/label/c.AM_MasterHeading';
import closeButton from '@salesforce/label/c.AM_CloseButton';
import cancelButton from '@salesforce/label/c.AM_Cancel';
import profileIds from '@salesforce/label/c.AM_Profile_Access';
import profileAccessError from '@salesforce/label/c.AM_Profile_Error';
import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import ProfileID_FIELD from '@salesforce/schema/User.ProfileId';
import hasAccountToolPermission from '@salesforce/customPermission/Account_merge_tool_access';

export default class Accountmergemaster extends NavigationMixin(LightningElement) {
    @track ismodalopen=false;
    guardianlogo = guardianlogo;
    @track showscreen1 = true;
    @track showscreen2 = false;
    @track selectedaccountids;
    @track searchkey;
    @track error ;
    @track profileId;

    label={
        accountmergetool,closeButton,cancelButton,profileIds,profileAccessError
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

//event triggered from accounrmergescreen1 to show accountmergescreen2
    showScreen2(event){

        this.selectedaccountids = event.detail.accountids;
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

//event triggered from accounrmergescreen2 to show accountmergescreen1
    showScreen1WithData(event){

        this.showscreen1 = true;
        this.showscreen2 = false;           
    }

//validate user profile.    
    validateUSerProfile(){
        
        this.profileId = this.profileId.substring(0,15);
        let hasToolAccess = hasAccountToolPermission;
        //if(!(this.label.profileIds.includes(this.profileId))){
        if(!(this.label.profileIds.includes(this.profileId)) && !(hasToolAccess)){
        
            this.error = this.label.profileAccessError;
            this.showscreen1 = false;
            this.showscreen2 = false;
        
        }
        
    }
}