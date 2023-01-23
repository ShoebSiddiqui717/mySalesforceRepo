import { LightningElement, track, wire, api } from 'lwc';
import submitScoreAction from '@salesforce/apex/CreateWIApex.saveOpportunityWorkItem';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
import GetStateValue from '@salesforce/apex/CreateWIApex.getStateValue';
import procesrecord from '@salesforce/apex/CreateWIApex.isThousandProcessChecked';

export default class uWiteam3 extends NavigationMixin(LightningElement) {
    @api recordId;  
    @api isLoading = false;
    btrReview=false;
    grandFathering=false;
    planAndBenefit=false;
    uwEdits=false;
    supplementalHealth=false;
    paidLeaveOrSmd=false;
    experienceRating=false;
    highOrLowLoad=false;
    splitOffOrRewrite=false;
    uwReferrals=false;
    renewalOptions=false;
    uwOther=false;
    customValidationError=false;
    state;
    information;
    paidOrSmdLives;
    oppWorkItemId;
    errorMsg='';
    
    isModelOpen = false;
    @track l_All_Types;
    @track TypeOptions;

    doReset = false;
    redirect = true;
    connectedCallback() {
        console.log('entered connected');
        console.log('record Id-->'+ this.recordId);
        procesrecord({oppId:this.recordId})
        .then(result =>{
            console.log('santhosh'+result);
            /*if(result===false){
                const toastEvent = new ShowToastEvent({
                    title:'1000 Process field is not checked!',
                    message:'You cannot create a workitem when 1000 Process is not checked',
                    variant:'error'
                });
                this.dispatchEvent(toastEvent);
            }*/
        })
        .catch(error =>{
            console.log('error'+error);
        })        
    }
 
    @wire(GetStateValue, {})
    WiredGetStateValue({ error, data }) {
        console.log(data);
        if (data) {
            try {
                this.l_All_Types = data; 
                let options = [];
                 
                for (var key in data) {
                    // Here key will have index of list of records starting from 0,1,2,....
                    options.push({ label: data[key].State__c, value: data[key].State__c  });
 
                    // Here Name and Id are fields from sObject list.
                }
                this.TypeOptions = options;
                 
            } catch (error) {
                console.error('check error here', error);
            }
        } else if (error) {
            console.error('check error here', error);
        }
 
    }

    workIteamCreation(event){
        if(event.target.name === 'btrReview'){
            //console.log('btr review--> '+event.target.checked);
            this.btrReview = event.target.checked;
            //console.log('btr review 1--> '+this.btrReview); 
		}
		if(event.target.name === 'grandFathering'){
			//console.log('grandFathering--> '+event.target.checked);
            this.grandFathering = event.target.checked;  
		}
		if(event.target.name === 'planAndBenefit'){
            //console.log('planAndBenefit--> '+event.target.checked);
			this.planAndBenefit = event.target.checked;  
		}
		if(event.target.name === 'uwEdits'){
            //console.log('uwEdits--> '+event.target.checked);
			this.uwEdits = event.target.checked;  
		}
		if(event.target.name === 'supplementalHealth'){
            //console.log('supplementalHealth--> '+event.target.checked);
			this.supplementalHealth = event.target.checked;  
		}
        if(event.target.name === 'paidLeaveOrSmd'){
            //console.log('paidLeaveOrSmd--> '+event.target.checked);
            this.paidLeaveOrSmd = event.target.checked;  
        }
		if(event.target.name === 'experienceRating'){
            console.log('experienceRating--> '+event.target.checked);
			this.experienceRating = event.target.checked;  
		}
		if(event.target.name === 'highOrLowLoad'){
            //console.log('highOrLowLoad--> '+event.target.checked);
			this.highOrLowLoad = event.target.checked;  
		}
		if(event.target.name === 'splitOffOrRewrite'){
            //console.log('splitOffOrRewrite--> '+event.target.checked);
			this.splitOffOrRewrite = event.target.checked;  
		}
		if(event.target.name === 'uwReferrals'){
            //console.log('uwReferrals--> '+event.target.checked);
			this.uwReferrals = event.target.checked;  
		}		
		if(event.target.name === 'renewalOptions'){
            //console.log('renewalOptions--> '+event.target.checked);
			this.renewalOptions = event.target.checked;  
		}
		if(event.target.name === 'uwOther'){
            //console.log('uwOthers--> '+event.target.checked);
			this.uwOther = event.target.checked;  
		}
        if(event.target.name === 'state'){
                console.log('state--> '+event.target.value);
                this.state = event.target.value;  
        }
		if(event.target.name === 'information'){
            //console.log('information--> '+event.target.value);
			this.information = event.target.value;  
		}		
		if(event.target.name === 'paidOrSmdLives'){
            //console.log('paidOrSmdLives--> '+event.target.value);
			this.paidOrSmdLives = event.target.value;            
		}
    
    }


    checkCondition(){
        console.log('entered the condition');
        if(this.paidLeaveOrSmd == true  ){
           if(this.paidOrSmdLives == null || this.paidOrSmdLives == '' || this.state == null || this.state == '' ){
              this.customValidationError = true;
                this.errorMsg='Please ensure Paid Leave/SMD state and lives are indicated before saving';
                this.isLoading = false;
                this.handleResetAll();
                this.resetOnlyInputValues();
                
                 return false;
            }
            }
        if((this.btrReview == false  && this.grandFathering == false && this.planAndBenefit == false && this.uwEdits == false && 
        this.supplementalHealth == false && this.paidLeaveOrSmd == false && this.experienceRating == false && this.highOrLowLoad == false &&
        this.splitOffOrRewrite == false && this.uwReferrals == false && this.renewalOptions == false && this.uwOther == false )) {
            this.customValidationError = true;
            this.errorMsg='Please select at least one check box and add notes in Information to UW field';
            this.isLoading = false;
            this.handleResetAll();
                this.resetOnlyInputValues();
            return false;
        }
        if((this.information == null || this.information== '') ){
            this.customValidationError = true; 
            console.log('customValidationError'+this.customValidationError);
            console.log('entered the state if condition');
            this.errorMsg='Please select at least one check box and add notes in Information to UW field';
            this.isLoading = false;
            this.handleResetAll();
                this.resetOnlyInputValues();
           return false;
        }
        else{
            this.customValidationError = false; 
            return true;
        }
        
    }

    save(){
        this.redirect=true;
        this.submitAction();                
    }
    
    submitAction(){
      //  this.checkState();
        //this.checkCondition();
        this.isLoading = true;
        console.log('redirect'+this.redirect);
        if(this.checkCondition()){
            submitScoreAction({owiBtr:this.btrReview, owiGrandFathering:this.grandFathering, owiPlanAndBenefit:this.planAndBenefit,
            owiUwEdits:this.uwEdits, owiSupplementalHealth:this.supplementalHealth, owiPaidLeaveOrSmd:this.paidLeaveOrSmd,
            owiExperienceRating:this.experienceRating, owiHighOrLowLoad:this.highOrLowLoad, owiSplitOffOrRewrite:this.splitOffOrRewrite, 
            owiUwReferrals:this.uwReferrals, owiRenewalOptions:this.renewalOptions, owiUwOther:this.uwOther,
            owiState:this.state, owiInfo:this.information, owiPaidOrSmdLives:this.paidOrSmdLives, oppId:this.recordId})
            .then(result=>{
                var resultObj = result;
                console.log('##resultObj:: ' + JSON.stringify(resultObj));
                if(resultObj.isError == 'true'){
                    this.customValidationError = true;
                    this.errorMsg = resultObj.errorMessage;
                    this.isLoading = false;
                    this.handleResetAll();
                this.resetOnlyInputValues();
                } else {
                    this.customValidationError = false;
                    this.oppWorkItemId = resultObj.oppWorkItemId;            
                    console.log('oppWorkItemId ' + this.oppWorkItemId);       
                    const toastEvent = new ShowToastEvent({
                        title:'Success!',
                        message:'Record created successfully',
                        variant:'success'
                    });
                    this.dispatchEvent(toastEvent);
                    if(this.redirect===true){                
                        //Start Navigation                
                        this.isModelOpen = false;
                        this[NavigationMixin.Navigate]({
                            type: 'standard__recordPage',
                            attributes: {
                                recordId: this.oppWorkItemId,
                                objectApiName: 'OpportunityWorkItem__c',
                                actionName: 'view'
                            },
                        });
                        //End Navigation
                    }   
                    if(this.doReset==true){
                        this.handleResetAll();
                        this.resetInputValues();
                    } 
                }                  
            })
            .catch(error =>{
                this.customValidationError = true;
                this.errorMsg=error.message;
                this.isLoading = false;
                window.console.log(this.error);
            });
        }                
    }

    customShowModalPopup(){
        this.isModelOpen = true;
    }
    customHideModalPopup(){
        this.isModelOpen = false;        
        this.resetInputValues();
    }

    resetInputValues(){
        this.information = '';
        this.paidOrSmdLives = '';
        this.btrReview=false;
        this.btrReview=false;
        this.grandFathering=false;
        this.planAndBenefit=false;
        this.uwEdits=false;
        this.supplementalHealth=false;
        this.paidLeaveOrSmd=false;
        this.experienceRating=false;
        this.highOrLowLoad=false;
        this.splitOffOrRewrite=false;
        this.uwReferrals=false;
        this.renewalOptions=false;
        this.uwOther=false;
        this.customValidationError=false;
        this.state='';
    }

    resetOnlyInputValues(){
        this.information = '';
        this.paidOrSmdLives = '';
        this.btrReview=false;
        this.btrReview=false;
        this.grandFathering=false;
        this.planAndBenefit=false;
        this.uwEdits=false;
        this.supplementalHealth=false;
        this.paidLeaveOrSmd=false;
        this.experienceRating=false;
        this.highOrLowLoad=false;
        this.splitOffOrRewrite=false;
        this.uwReferrals=false;
        this.renewalOptions=false;
        this.uwOther=false;
        this.state='';
        }

    saveandNew() {
        console.log('save and new');        
        this.redirect = false; 
        this.doReset = true;       
        this.submitAction();                
        //this.resetInputValues();
        /*if(this.doReset){
            this.handleResetAll();
        }*/        
    }


    handleResetAll(){
        this.redirect = true;
        this.isLoading = false;
        this.template.querySelectorAll('lightning-input, lightning-textarea, lightning-combobox').forEach(element => {
        if(element.type === 'checkbox' || element.type === 'checkbox-button'){
            element.checked = false;
        }else{
            element.value = '';
        } 
        //element.reset();     
        });
    }
}