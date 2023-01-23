import { api, LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import  getSelectedContactData from '@salesforce/apex/ContactMergeController.getContactDataWrapper';
import  sendSobjectToController from '@salesforce/apex/ContactMergeController.sendSobjectToController';

import previous from '@salesforce/label/c.CM_Previous';
import merge from '@salesforce/label/c.CM_Merge';
import mergeSuccess from '@salesforce/label/c.CM_merge_success';
import confirmMessage from '@salesforce/label/c.CM_confirmation_message';
import errorMessage1 from '@salesforce/label/c.CM_customError1';
import traverseToMaster from '@salesforce/label/c.CM_Traverse_To_Master_Record';

const DELAY = 1000;

export default class Contactmergescreen2 extends NavigationMixin(LightningElement) {

    @api selectedcontactids;
    @api searchkey;
    @track error;
    @track contactData;
    @track tableHeaderData;
    @track resultFromMerge;
    @track sobjectrecord = { 'sobjectType': 'Contact' };
    @track nonSurvivorIds=[];
    @track disableButtons= false;
    @track customErrorMessage;

    label={
        previous,merge,mergeSuccess,confirmMessage,errorMessage1,traverseToMaster
    }

    connectedCallback(){
        this.getContactData();
    }

    renderedCallback(){

        this.disableCheckboxes();
        this.hideFirstCheckbox();
    }

//get contact data for the selected contactIds coming from contactscreen1    
    getContactData(){

        getSelectedContactData({contactIds:this.selectedcontactids})
        .then(result=>{
            
            this.contactData = result;
            this.error = undefined;
            this.createTableHeaderData();
            
             this.delayTimeout = setTimeout(() => {
                 this.activateFirstCheckboxes();   
             }, DELAY);

        })
        .catch(error=>{
            this.error = error;
            this.contactData = undefined;
            console.log('Error Retrieving Contact Data'+JSON.stringify(this.error));
        })
    }

//controls the checkbox click of entire screen    
    handleCheckboxClick(event){

        let fieldName = event.target.name;
        let isChecked = event.target.checked;
        let recordValue = event.target.value;
        let checkboxindex = event.target.dataset.index;
        let fieldApi = event.target.dataset.recordapi;
        this.removeCheckboxFromOtherRecord(fieldName,isChecked,recordValue,checkboxindex,fieldApi); 
        this.changeIdIfMasterChanged(fieldName,isChecked,recordValue,checkboxindex);     
          
    }

//For the same fieldlabel, ensure that only 1 value is checked.
    removeCheckboxFromOtherRecord(fieldName,isChecked,recordValue,checkboxindex,fieldApi){

        var inp=this.template.querySelectorAll("input");
        inp.forEach(function(element){
               
            if(element.dataset.recordapi===fieldApi && element.type==="checkbox" && element.dataset.index !== checkboxindex){
                element.checked = false;
            }
        },this);
    }

//if master checkbox is checked. Change the "Id" checkbox . This is because we send Sobject to Apex with "Id". Only the "Id" of "Master" label should be sent
    changeIdIfMasterChanged(fieldName,isChecked,recordValue,checkboxindex){

        if(fieldName==="Master" && isChecked){
            var inp=this.template.querySelectorAll("input");
                inp.forEach(function(element){
                if(element.type==="checkbox" && (element.dataset.recordapi === "Id" || element.dataset.recordapi == "AccountId") ){ // added later(mark the account which is tied to master record)

                    if(element.dataset.index === checkboxindex){
                        element.checked = true;
                    }else{
                        element.checked = false;
                    }
                    
                }
            },this);
        }
    }

//logic for table header which includes "Field Name" with "contact Name 1", "contact Name 2"...    
    createTableHeaderData(){

        this.tableHeaderData =[];
        this.tableHeaderData.push("Field Name");
        for(let i = 0 ; i < this.contactData.length ; i++){
            
            if(this.contactData[i].fieldApi === 'Name'){
                
                for(let k = 0 ; k < this.contactData[i].fieldData.length; k++){
                    this.tableHeaderData.push(this.contactData[i].fieldData[k]);
                }
            }
        }
    }

//Default : activate the checkboxes for first column of the table    
    activateFirstCheckboxes(){
        
        for(let i = 0 ; i < this.contactData.length ; i++){
            for(let k = 0 ; k < 1 ; k++){
                this.contactData[i].fieldData[k];
                
                var inp=this.template.querySelectorAll("input");
                
                inp.forEach(function(element){
                   
                    if(element.type==="checkbox" && element.value===this.contactData[i].fieldData[k] && element.dataset.index == "0"){
                
                        element.checked = true;
                    }
                },this);
            }
        }


    }

//handles the "Select All" option for a particular contact selected.
    handleSelectAllCheckBox(event){

        let contactIndex = event.target.value;
        contactIndex = contactIndex - 1;
        var inp=this.template.querySelectorAll("input");
        inp.forEach(function(element){
                  
            if(element.type==="checkbox" && element.dataset.index == contactIndex){ 
                element.checked = true;
            }else{
                element.checked = false;
            }
        },this);
    }

//takes the user back to contactmergescreen1    
    handlePrevious(event){
        const selectedEvent = new CustomEvent('previous',{detail : this.searchkey});
        this.dispatchEvent(selectedEvent);
    }

//merges the contacts by passing the data to apex.    
    handleMerge(event){

        let result = this.popup();
        if(result==="yes"){
            let masterChecked = this.validateMasterCheckbox();
            if(masterChecked ==="yes"){
                this.createSobject();
                this.findDuplicateIds();
                this.sendSobjectToApex();
            }else{
                this.customErrorMessage = this.label.errorMessage1;
            }
        }
    }

//confirming if the user accidentally clicked or wants to merge    
    popup(){
        if (confirm(this.label.confirmMessage)) {
            return "yes";
          } else {
            return "no";
          }
    }

//create the sObject based on the user selected inputs on the screen    
    createSobject(){

        var inp=this.template.querySelectorAll("input");
        inp.forEach(function(element){
                 
           if(element.type==="checkbox" && element.checked){ 
              
               let fieldapi = element.dataset.recordapi;
               let recordvalue = element.value;
               
               if(!recordvalue){
                   recordvalue = '';
               }
//Not sending the "Full Name" field to apex because it is a compound field              
               if(element.type==="checkbox" && fieldapi !=='Name'){
                   
                this.sobjectrecord[fieldapi] = recordvalue;
               }
               
               
           }
        },this);
    }

    sendSobjectToApex(){
    
        this.disableButtons = true;
    
        sendSobjectToController({SobjectRecord:this.sobjectrecord,nonsurvivorids:this.nonSurvivorIds})
        .then(result=>{
            if(result==="success"){
                this.resultFromMerge = result;
                this.error = undefined;
    
            }else{
                this.resultFromMerge = undefined;
                this.error = error;
                console.log('Merge Result'+JSON.stringify(this.resultFromMerge));
            }
            
            
        })
        .catch(error=>{
            this.resultFromMerge = undefined;
            this.error = error;
            console.log('Merge Error'+JSON.stringify(this.error));
        })
    }

//find non-survior Ids which will cease to exist post merge
    findDuplicateIds(){
        
        var inp=this.template.querySelectorAll("input");
        inp.forEach(function(element){
                 
           if(element.type==="checkbox" && !element.checked && element.dataset.recordapi==="Id"){ 
    
               this.nonSurvivorIds.push(element.value);
           }
        },this);
    
    }    

//called on page load to disable some checkboxes. Eg "Id" because "Id" is controlled by "Master"
    disableCheckboxes(){

        this.delayTimeout = setTimeout(() => {
            var inp=this.template.querySelectorAll("input");
            inp.forEach(function(element){
                     //
               if(element.type==="checkbox" && (element.dataset.recordapi==="Id" || element.dataset.recordapi==="Name" || element.dataset.recordapi=="AccountId")){ 
                  element.disabled = true;
               }
            },this);
        }, DELAY);

       
    }

//hide the checkbox with "Field Name"    
    hideFirstCheckbox(){
        var inp=this.template.querySelectorAll("input");
        inp.forEach(function(element){
                
           if(element.type==="checkbox" && element.value === "0" && element.name==="Field Name" ){ 
              element.style.visibility = "hidden";
           }
        },this);
    }

//atleast 1 master checkbox needs to be checked    
    validateMasterCheckbox(){
        let anyMasterChecked = "no" ;
        var inp=this.template.querySelectorAll("input");
        inp.forEach(function(element){
                
           if(element.type==="checkbox" && element.name==="Master" && element.checked){ 
            anyMasterChecked = "yes";
           }
        },this);
        return anyMasterChecked;
    }  

//traverse to survivor record      
    goToMaster() {

        let selectedId ;
        var inp=this.template.querySelectorAll("input");
        inp.forEach(function(element){
                 
           if(element.type==="checkbox" && element.dataset.recordapi==="Id" && element.checked){ 
            selectedId = element.value;
           }
        },this);

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: selectedId,
                actionName: 'view'
            }
        });
}
}